const express = require('express')
const router = express.Router()

const {
  createReview,
  getAllReviews,
  getFilmReviews,
  getUserReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviews')

const verifyToken = require('../middleware/verifyToken')

router.post('/', verifyToken, createReview)

router.get('/', getAllReviews)

router.get('/film/:filmid', getFilmReviews)

router.get('/user/:username', getUserReviews)

router.put('/:id', verifyToken, updateReview)

router.delete('/:id', verifyToken, deleteReview)

module.exports = router
