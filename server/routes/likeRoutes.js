const express = require('express')
const { likeReview, likeDiscussion, likeList } = require('../controllers/likes')
const router = express.Router()

const verifyToken = require('../middleware/verifyToken')

router.put('/review/:id', verifyToken, likeReview)

router.put('/discussion/:id', verifyToken, likeDiscussion)

router.put('/list/:id', verifyToken, likeList)

module.exports = router
