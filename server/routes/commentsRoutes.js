const express = require('express')
const router = express.Router()

const {
  deleteComment,
  updateComment,
  createComment,
} = require('../controllers/comments')

const verifyToken = require('../middleware/verifyToken')

router.post('/:discussionid', verifyToken, createComment)

router.put('/:discussionid/:id', verifyToken, updateComment)

router.delete('/:discussionid/:id', verifyToken, deleteComment)

module.exports = router
