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

router.post('/', createReview)

router.get('/', getAllReviews)

router.get('/film/:filmid', getFilmReviews)

router.get('/user/:username', getUserReviews)

router.put('/:id', updateReview)

router.delete('/:id', deleteReview)

module.exports = router
