const express = require('express')
const router = express.Router()

const {
  createList,
  getList,
  getFilmLists,
  getUserLists,
  getOwnLists,
  updateList,
  deleteList,
  getAllLists,
} = require('../controllers/lists')

router.post('/', createList)

router.get('/', getAllLists)

router.get('/:id', getList)

router.get('/film/:filmid', getFilmLists)

router.get('/user/:username', getUserLists)

router.get('/user/:username/own', getOwnLists)

router.put('/:id', updateList)

router.delete('/:id', deleteList)

module.exports = router
