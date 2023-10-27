const express = require('express')
const { getFilmToPlay, saveGameResults } = require('../controllers/game')
const router = express.Router()

const verifyToken = require('../middleware/verifyToken')

router.get('/:mode/:userid', verifyToken, getFilmToPlay)

router.put('/:userid', saveGameResults)

module.exports = router
