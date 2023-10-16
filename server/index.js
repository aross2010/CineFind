const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const cookieParser = require('cookie-parser')

const reviewsRoutes = require('./routes/reviewsRoutes')
const discussionsRoutes = require('./routes/discussionsRoutes')
const commentsRoutes = require('./routes/commentsRoutes')
const listsRoutes = require('./routes/listsRoutes')
const authRoutes = require('./routes/authRoutes')
const likeRoutes = require('./routes/likeRoutes')
const userRoutes = require('./routes/userRoutes')
const gameRoutes = require('./routes/gameRoutes')
// middleware

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

app.use(
  cors({
    origin: 'https://cinefind.vercel.app',
    credentials: true,
  })
)

mongoose.connect(process.env.MONGO_URL).then(() => console.log('Connected.'))

app.use('/reviews', reviewsRoutes)

app.use('/discussions', discussionsRoutes)

app.use('/comments', commentsRoutes)

app.use('/lists', listsRoutes)

app.use('/auth', authRoutes)

app.use('/like', likeRoutes)

app.use('/user', userRoutes)

app.use('/game', gameRoutes)

app.get('/', (req, res) => {
  res.json('yo')
})

app.listen(2000, () => console.log('Server Running...'))

module.exports = app
