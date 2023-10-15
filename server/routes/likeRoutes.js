const express = require('express')
const { likeReview, likeDiscussion, likeList } = require('../controllers/likes')
const router = express.Router()

router.put('/review/:id', likeReview)

router.put('/discussion/:id', likeDiscussion)

router.put('/list/:id', likeList)

module.exports = router
