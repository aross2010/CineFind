const mongoose = require('mongoose')

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

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  ranked: {
    type: Boolean,
    required: true,
  },
  private: {
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
  user: {
    type: userSchema,
    required: true,
  },
  updated: {
    type: Date,
    required: true,
  },

  films: [
    {
      type: filmSchema,
      required: true,
    },
  ],
})

const ListModel = mongoose.model('List', listSchema)

module.exports = { ListModel, listSchema }
