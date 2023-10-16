const { ReviewModel } = require('../models/Review')
const { UserModel } = require('../models/User')

const createReview = async (req, res) => {
  const data = req.body
  const { film, rating, body, created, user, updated } = data

  const reviewUser = await UserModel.findById(user._id).exec()

  if (!reviewUser)
    return res
      .status(400)
      .json({ error: 'Must be a valid user to create a review.' })

  if (!body)
    return res.status(400).json({ error: 'You must provide a review.' })
  if (!rating)
    return res.status(400).json({ error: 'You must provide a rating.' })

  try {
    const review = new ReviewModel({
      rating,
      body,
      created,
      film,
      likes: [],
      user: {
        avatar: user.avatar,
        name: user.name,
      },
      updated,
    })
    const createdReview = await review.save()
    reviewUser.reviews.push(createdReview._id)
    await reviewUser.save()
    res.send(createdReview)
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getAllReviews = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({}).sort({ created: -1 }).exec()
    res.json(reviews)
    res.send(reviews)
  } catch (e) {
    res.json('error')
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getFilmReviews = async (req, res) => {
  const { filmid } = req.params
  try {
    const result = await ReviewModel.find({ 'film.tmdbID': filmid })
      .sort({ created: -1 })
      .exec()
    res.send(result)
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const updateReview = async (req, res) => {
  const { id } = req.params
  const data = req.body
  const { rating, body, created } = data

  if (!body) return res.status(400).json({ error: 'Must provide a review.' })
  if (!rating) return res.status(400).json({ error: 'Must provide a rating.' })

  try {
    const updatedReview = await ReviewModel.findById(id).exec()

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found.' })
    }

    updatedReview.body = body
    updatedReview.rating = rating
    updatedReview.created = created
    updatedReview.updated = true
    const review = await updatedReview.save()

    res.send(review)
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const deleteReview = async (req, res) => {
  const { id } = req.params
  try {
    const review = await ReviewModel.findByIdAndDelete(id).exec()
    if (!review) return res.status(404).json({ error: 'Review not found.' })
    const user = await UserModel.findOne({ name: review.user.name })
    if (!user)
      return res
        .status(404)
        .json({ error: 'Could not find user associated with this review.' })
    const i = user.reviews.indexOf(review._id)
    user.reviews.splice(i, 1)
    await user.save()

    res.send('Successfully deleted review.')
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getUserReviews = async (req, res) => {
  const { username } = req.params

  try {
    const result = await ReviewModel.find({ 'user.name': username })
      .sort({ created: -1 })
      .exec()

    res.send(result)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

module.exports = {
  createReview,
  getAllReviews,
  getFilmReviews,
  updateReview,
  deleteReview,
  getUserReviews,
}
