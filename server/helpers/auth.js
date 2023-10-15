const bcrypt = require('bcrypt')
const axios = require('axios')
const cloudinary = require('../util/cloudinary')

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err)
        return
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err)
          return
        }
        resolve(hash)
      })
    })
  })
}

const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed)
}

const validPassword = (password) => {
  const upper = /[A-Z]/
  const num = /[0-9]/

  const hasUppercase = upper.test(password)
  const hasNum = num.test(password)

  return hasUppercase && hasNum && password.length >= 8
}

const validEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  if (!emailRegex.test(email) || email.length === 0) return false
  return true
}

const validFilm = async (id) => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    )
  } catch (e) {
    return false
  }

  return true
}

const uploadAvatar = async (img) => {
  try {
    let url

    await cloudinary.uploader.upload(
      img.path,
      { folder: 'CineFind' },
      (err, result) => {
        if (!err) url = result.url
      }
    )

    return url
  } catch (e) {
    return res.json
      .status(500)
      .json({ error: 'Something went wrong uploading image' })
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  validEmail,
  validPassword,
  validFilm,
  uploadAvatar,
}
