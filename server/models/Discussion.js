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

const filmSchema = new mongoose.Schema({
  tmdbID: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
})

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
})

const discussionSchema = new mongoose.Schema({
  film: {
    type: filmSchema,
    required: true,
  },
  user: {
    type: userSchema,
    requiured: true,
  },
  title: {
    type: String,
    required: true,
    maxLength: 150,
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
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  ],
  comments: [
    {
      type: commentSchema,
      required: false,
    },
  ],
})

const DiscussionModel = mongoose.model('Discussion', discussionSchema)

module.exports = { DiscussionModel, discussionSchema }
