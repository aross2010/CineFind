const { DiscussionModel } = require('../models/Discussion')
const { UserModel } = require('../models/User')

const createDiscussion = async (req, res) => {
  const data = req.body
  const { film, title, body, created } = data
  const user = req.user

  try {
    const discussionUser = await UserModel.findById(user._id).exec()

    if (!discussionUser)
      return res.status(401).json({
        error: 'Must be logged in to create a discussion post.',
      })

    if (!body)
      return res.status(400).json({ error: 'You must provide a body.' })
    if (!title)
      return res.status(400).json({ error: 'You must provide a title.' })

    const discussion = new DiscussionModel({
      title,
      body,
      created,
      film,
      user: {
        name: user.name,
        avatar: user.avatar,
      },
      likes: [],
      updated: false,
      comments: [],
    })
    const createdDiscussion = await discussion.save()
    discussionUser.discussions.push(createdDiscussion._id)
    await discussionUser.save()
    res.send(createdDiscussion)
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getAllDiscussions = async (req, res) => {
  try {
    const discussions = await DiscussionModel.find({})
      .sort({ created: -1 })
      .exec()
    res.send(discussions)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getFilmDiscussions = async (req, res) => {
  const { filmid } = req.params
  try {
    const result = await DiscussionModel.find({ 'film.tmdbID': filmid })
      .sort({ created: -1 })
      .exec()
    res.send(result)
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getUserDiscussions = async (req, res) => {
  const { username } = req.params
  try {
    const result = await DiscussionModel.find({ 'user.name': username })
      .sort({ created: -1 })
      .exec()
    res.send(result)
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const updateDiscussion = async (req, res) => {
  const { id } = req.params
  const data = req.body
  const { title, body, created } = data

  if (!body) return res.status(400).json({ error: 'Must provide a review.' })
  if (!title) return res.status(400).json({ error: 'Must provide a title.' })

  try {
    const updatedDiscussion = await DiscussionModel.findById(id).exec()

    if (!updatedDiscussion) {
      return res.status(404).json({ error: 'Discussion not found.' })
    }

    updatedDiscussion.body = body
    updatedDiscussion.title = title
    updatedDiscussion.created = created
    updatedDiscussion.updated = true
    const discussion = await updatedDiscussion.save()

    res.send(discussion)
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const deleteDiscussion = async (req, res) => {
  const { id } = req.params
  try {
    const discussion = await DiscussionModel.findByIdAndRemove(id).exec()
    if (!discussion)
      return res.status(404).json({ error: 'Discussion not found.' })

    const user = await UserModel.findOne({ name: discussion.user.name })
    if (!user)
      return res
        .status(404)
        .json({ error: 'Could not find user associated with this discussion.' })
    const i = user.discussions.indexOf(discussion._id)
    user.discussions.splice(i, 1)
    await user.save()
    res.send('Successfully deleted discussion.')
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

module.exports = {
  createDiscussion,
  getAllDiscussions,
  getFilmDiscussions,
  getUserDiscussions,
  updateDiscussion,
  deleteDiscussion,
}
