const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token is missing.' })
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Not Authorized.' })
  }
}

module.exports = verifyToken
