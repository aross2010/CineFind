const { UserModel } = require('../models/User')
const {
  hashPassword,
  comparePassword,
  validPassword,
  validEmail,
  validFilm,
  uploadAvatar,
} = require('../helpers/auth')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
  try {
    const { email, name, password, filmID, filmBackdrop } = req.body
    const avatar = req.file
    if (!email || !validEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email.' })
    }
    if (!name || name.length < 4) {
      return res
        .status(400)
        .json({ error: 'Username must be at least four characters.' })
    }
    if (!password || !validPassword(password)) {
      return res.status(400).json({
        error:
          'Password requires 8 characters, one uppercase letter, and one uppercase number.',
      })
    }
    if (filmID === 0 || !filmBackdrop) {
      return res
        .status(400)
        .json({ error: 'Please select a valid favorite film.' })
    }
    if (!validFilm(filmID)) {
      return res.status(400).json({ error: 'Favorite film must be a TMDB ID.' })
    }
    if (!avatar) {
      return res.status(400).json({ error: 'Profile Picture is required.' })
    }

    const emailExists = await UserModel.findOne({ email })

    if (emailExists) {
      return res.status(400).json({
        error: 'An account with this email already exists.',
      })
    }

    const usernameExists = await UserModel.findOne({ name })

    if (usernameExists) {
      return res.status(400).json({
        error: 'An account with this username already exists.',
      })
    }

    const avatarURL = await uploadAvatar(avatar)

    const hashedPassword = await hashPassword(password)

    const user = new UserModel({
      email,
      name,
      password: hashedPassword,
      film: {
        tmdbID: parseInt(filmID),
        backdrop: filmBackdrop,
      },
      avatar: avatarURL,
    })
    const registeredUser = await user.save()
    res.send(registeredUser)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await UserModel.findOne({ name: username })

    if (!user) {
      return res.json({ error: 'No user found with that username.' })
    }

    const match = await comparePassword(password, user.password)

    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password.' })
    }
    const { _id, name, avatar } = user
    // jwt token creation
    const token = jwt.sign({ _id, name, avatar }, process.env.JWT_SECRET)

    res.json({ token })
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getProfile = async (req, res) => {
  try {
    const token = req.header('Authorization')
    const user = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ message: 'Ummmm' })
  } catch (e) {
    res.json(null)
  }

  // retrieve cookie and user data for front end
}

const logoutUser = async (req, res) => {
  const { token } = req.cookies

  if (token) {
    res.clearCookie('token')
  }

  res.json(null)
}

module.exports = { registerUser, loginUser, getProfile, logoutUser }
