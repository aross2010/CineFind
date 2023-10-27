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

const verifyToken = require('../middleware/verifyToken')

router.post('/', verifyToken, createDiscussion)

router.get('/', getAllDiscussions)

router.get('/film/:filmid', getFilmDiscussions)

router.get('/user/:username', getUserDiscussions)

router.put('/:id', verifyToken, updateDiscussion)

router.delete('/:id', verifyToken, deleteDiscussion)

module.exports = router
