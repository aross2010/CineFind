const express = require('express')
const router = express.Router()

const {
  deleteComment,
  updateComment,
  createComment,
} = require('../controllers/comments')

router.post('/:discussionid', createComment)

router.put('/:discussionid/:id', updateComment)

router.delete('/:discussionid/:id', deleteComment)

module.exports = router
