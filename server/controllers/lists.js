const { ListModel } = require('../models/List')
const { UserModel } = require('../models/User')

const createList = async (req, res) => {
  try {
    const data = req.body
    const { name, description, films, ranked, isPrivate, user, updated } = data

    const listUser = await UserModel.findById(user._id).exec()

    if (!listUser)
      return res
        .status(401)
        .json({ error: 'You must be signed in to create a list.' })

    if (!films || films.length === 0)
      return res.status(400).json({ error: 'At least one film is required.' })

    if (!name)
      return res.status(400).json({ error: 'You must provide a list name.' })

    const list = new ListModel({
      name,
      description,
      films,
      ranked,
      private: isPrivate,
      user: {
        name: listUser.name,
        avatar: listUser.avatar,
      },
      likes: [],
      updated,
    })

    const createdList = await list.save()
    listUser.lists.push(createdList._id)
    await listUser.save()

    res.send(createdList)
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getList = async (req, res) => {
  const { id } = req.params
  try {
    const list = await ListModel.findById(id).exec()
    if (!list) {
      return res.status(404).json({ error: 'List does not exist.' })
    }
    res.send(list)
  } catch (err) {
    res.status(500).json({ error: 'List does not exist.' })
  }
}

const getAllLists = async (req, res) => {
  try {
    const lists = await ListModel.find({ private: false })
      .sort({ updated: -1 })
      .exec()
    res.send(lists)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getFilmLists = async (req, res) => {
  const { filmid } = req.params
  try {
    const lists = await ListModel.find({
      'films.tmdbID': filmid,
      private: false,
    }).exec()
    res.send(lists)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getUserLists = async (req, res) => {
  const { username } = req.params

  try {
    const user = await UserModel.findOne({ name: username })
    if (!user)
      return res
        .status(404)
        .json({ error: `User: ${username} does not exist.` })

    const lists = await ListModel.find({
      'user.name': username,
      private: false,
    })
    res.send(lists)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const getOwnLists = async (req, res) => {
  const { username } = req.params

  try {
    const user = await UserModel.findOne({ name: username })
    if (!user)
      return res
        .status(404)
        .json({ error: `User: ${username} does not exist.` })

    const lists = await ListModel.find({
      'user.name': username,
    })
    res.send(lists)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const updateList = async (req, res) => {
  const { id } = req.params

  if (!id)
    return res.status(400).json({ error: 'You mist provide a list to update.' })

  const data = req.body
  const { name, description, films, ranked, private, updated } = data
  if (!films)
    return res.status(400).json({ error: 'At least one film is required.' })

  if (!name)
    return res.status(400).json({ error: 'You must provide a list name.' })

  try {
    const list = await ListModel.findById(id).exec()

    if (!list) {
      return res.status(404).json({ error: 'List does not exist.' })
    }

    list.name = name
    list.description = description
    list.films = films
    list.ranked = ranked
    list.private = private
    list.updated = updated
    const updatedList = await list.save()

    res.send(updatedList)
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const deleteList = async (req, res) => {
  const { id } = req.params

  if (!id) return res.status(404).json({ error: 'Could not find list.' })

  try {
    const list = await ListModel.findByIdAndDelete(id).exec()
    if (!list) return res.status(404).json({ error: 'Could not find list.' })

    const user = await UserModel.findOne({ name: list.user.name })
    if (!user)
      return res
        .status(404)
        .json({ error: 'Could not find user associated with this list.' })
    const i = user.lists.indexOf(list._id)
    user.lists.splice(i, 1)
    await user.save()

    res.send('Successfully deleted Review')
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

module.exports = {
  createList,
  getList,
  getAllLists,
  getFilmLists,
  getUserLists,
  getOwnLists,
  updateList,
  deleteList,
}
