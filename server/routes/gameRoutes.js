const express = require('express')
const { getFilmToPlay, saveGameResults } = require('../controllers/game')
const router = express.Router()

router.get('/:mode/:userid', getFilmToPlay)

router.put('/:userid', saveGameResults)

module.exports = router
