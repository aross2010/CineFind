const express = require('express')
const router = express.Router()

const {
  createDiscussion,
  getAllDiscussions,
  getFilmDiscussions,
  getUserDiscussions,
  updateDiscussion,
  deleteDiscussion,
} = require('../controllers/discussions')

router.post('/', createDiscussion)

router.get('/', getAllDiscussions)

router.get('/film/:filmid', getFilmDiscussions)

router.get('/user/:username', getUserDiscussions)

router.put('/:id', updateDiscussion)

router.delete('/:id', deleteDiscussion)

module.exports = router
