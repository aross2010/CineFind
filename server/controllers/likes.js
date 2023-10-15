const { DiscussionModel } = require('../models/Discussion')
const { UserModel } = require('../models/User')
const { ListModel } = require('../models/List')
const { ReviewModel } = require('../models/Review')

const likeReview = async (req, res) => {
  const { id } = req.params
  const { userId } = req.body

  try {
    const reviewToLike = await ReviewModel.findById(id)
    if (!reviewToLike)
      return res.status(404).json({ error: 'Could not find review.' })
    const user = await UserModel.findById(userId)
    if (!user)
      return res
        .status(401)
        .json({ error: 'Must be signed in to like a post.' })
    if (reviewToLike.likes.includes(user._id)) {
      const updatedLikes = reviewToLike.likes.filter((likeId) => {
        likeId.toString() !== user._id
      })
      reviewToLike.likes = updatedLikes
    } else {
      reviewToLike.likes.push(user._id)
    }
    const review = await reviewToLike.save()
    res.send(review)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const likeDiscussion = async (req, res) => {
  const { id } = req.params
  const { userId } = req.body

  try {
    const discussionToLike = await DiscussionModel.findById(id)
    if (!discussionToLike)
      return res.status(404).json({ error: 'Could not find discussion.' })
    const user = await UserModel.findById(userId)
    if (!user)
      return res
        .status(401)
        .json({ error: 'Must be signed in to like a post.' })
    if (discussionToLike.likes.includes(user._id)) {
      const updatedLikes = discussionToLike.likes.filter((likeId) => {
        likeId.toString() !== user._id
      })
      discussionToLike.likes = updatedLikes
    } else {
      discussionToLike.likes.push(user._id)
    }
    const discussion = await discussionToLike.save()
    res.send(discussion)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const likeList = async (req, res) => {
  const { id } = req.params
  const { userId } = req.body

  try {
    const listToLike = await ListModel.findById(id)
    if (!listToLike)
      return res.status(404).json({ error: 'Could not find list.' })
    const user = await UserModel.findById(userId)
    if (!user)
      return res
        .status(401)
        .json({ error: 'Must be signed in to like a list.' })
    if (listToLike.likes.includes(user._id)) {
      const updatedLikes = listToLike.likes.filter((likeId) => {
        likeId.toString() !== user._id
      })
      listToLike.likes = updatedLikes
    } else {
      listToLike.likes.push(user._id)
    }
    const list = await listToLike.save()
    res.send(list)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

module.exports = { likeReview, likeDiscussion, likeList }
