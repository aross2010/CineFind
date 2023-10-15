const mongoose = require('mongoose')

const userSchema = {
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
}

const commentSchema = new mongoose.Schema({
  user: {
    type: userSchema,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  created: {
    type: String,
    required: true,
  },
  updated: {
    type: Boolean,
    required: false,
  },
})

const CommentModel = mongoose.model('Comment', commentSchema)

module.exports = { CommentModel, commentSchema }
