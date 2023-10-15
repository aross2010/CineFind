const { UserModel } = require('../models/User')

const getUserDetails = async (req, res) => {
  const { name } = req.params

  try {
    const user = await UserModel.findOne({ name }).exec()
    if (!user)
      return res.status(404).json({ error: 'User could not be found.' })
    res.send(user)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

module.exports = { getUserDetails }
