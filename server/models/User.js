const mongoose = require('mongoose')

const filmSchema = {
  tmdbID: {
    type: Number,
    required: true,
  },
  backdrop: {
    type: String,
    required: true,
  },
}

const gameSchema = {
  easy: {
    type: {
      correct: [
        {
          type: Number,
        },
      ],
      incorrect: [
        {
          type: Number,
        },
      ],
    },
    required: false,
  },
  medium: {
    type: {
      correct: [
        {
          type: Number,
        },
      ],
      incorrect: [
        {
          type: Number,
        },
      ],
    },
    required: false,
  },
  hard: {
    type: {
      correct: [
        {
          type: Number,
        },
      ],
      incorrect: [
        {
          type: Number,
        },
      ],
    },
    required: false,
  },
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true, // verify password when created on backend
  },
  film: {
    type: filmSchema,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      required: false,
    },
  ],
  discussions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discussion',
      required: false,
    },
  ],
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
      required: false,
    },
  ],
  game: {
    type: gameSchema,
    required: false,
    default: {
      easy: {
        correct: [],
        incorrect: [],
      },
      medium: {
        correct: [],
        incorrect: [],
      },
      hard: {
        correct: [],
        incorrect: [],
      },
    },
  },
})

const UserModel = mongoose.model('User', userSchema)

module.exports = { UserModel, userSchema }
