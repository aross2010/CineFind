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

const reviewSchema = new mongoose.Schema({
  film: {
    type: filmSchema,
    required: true,
  },
  user: {
    type: userSchema,
    required: true,
    messge: 'Must be logged in to post a review.',
  },
  rating: {
    type: Number,
    required: true,
    min: 0.5,
    max: 5.0,
    validate: {
      validator: function (value) {
        return value % 0.5 === 0 && value >= 0.5 && value <= 5
      },
      message: 'Rating must be valid number.',
    },
  },
  body: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  ],
  updated: {
    type: Boolean,
    required: false,
  },
})

const ReviewModel = mongoose.model('Review', reviewSchema)

module.exports = { ReviewModel, reviewSchema }
