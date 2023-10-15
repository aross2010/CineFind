const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} = require('../controllers/auth')

router.post('/register', upload.single('avatar'), registerUser)

router.post('/login', loginUser)

router.get('/profile', getProfile)

router.get('/logout', logoutUser)

module.exports = router
