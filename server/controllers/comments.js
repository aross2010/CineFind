const { DiscussionModel } = require('../models/Discussion')
const { CommentModel } = require('../models/Comment')
const { updateDiscussion } = require('./discussions')

const createComment = async (req, res) => {
  const { discussionid } = req.params

  const data = req.body
  const { user, body, created } = data

  if (!body) return res.status(400).json({ error: 'Must provide a comment.' })
  if (!user)
    return res.status(400).json({ error: 'Must signed in to leave a comment.' })

  try {
    const updatedDiscussion = await DiscussionModel.findById(
      discussionid
    ).exec()

    if (!updatedDiscussion) {
      return res.status(404).json({ error: 'Discussion not found.' })
    }
    const comment = new CommentModel({
      user: {
        avatar: user.avatar,
        name: user.name,
      },
      body,
      created,
    })
    updatedDiscussion.comments.push(comment)
    const discussion = await updatedDiscussion.save()
    res.send(discussion)
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const updateComment = async (req, res) => {
  const { discussionid, id } = req.params
  const data = req.body
  const { body, created } = data

  if (!body) return res.status(400).json({ error: 'Must provide a comment.' })

  try {
    const discussion = await DiscussionModel.findById(discussionid).exec()

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found.' })
    }

    const commentIndex = discussion.comments.findIndex(
      (comment) => comment._id.toString() === id
    )

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found.' })
    }

    discussion.comments[commentIndex].body = body
    discussion.comments[commentIndex].created = created

    const updatedDiscussion = await discussion.save()
    res.send(updatedDiscussion)
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const deleteComment = async (req, res) => {
  const { discussionid, id } = req.params

  try {
    const discussion = await DiscussionModel.findById(discussionid).exec()

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' })
    }

    const commentIndex = discussion.comments.findIndex(
      (comment) => comment._id.toString() === id
    )

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found.' })
    }

    discussion.comments.splice(commentIndex, 1)

    const updatedDiscussion = await discussion.save()
    res.send(updatedDiscussion)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

module.exports = { createComment, updateComment, deleteComment }
