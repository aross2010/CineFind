const { UserModel } = require('../models/User')
const { films, createID } = require('../helpers/game')

const getFilmToPlay = async (req, res) => {
  const { userid, mode } = req.params
  try {
    const user = await UserModel.findById(userid)
    const played = [
      ...user.game.easy.correct,
      ...user.game.easy.incorrect,
      ...user.game.medium.correct,
      ...user.game.medium.incorrect,
      ...user.game.hard.correct,
      ...user.game.hard.incorrect,
    ]
    if (mode === 'easy') {
      const options = films.easy.filter((film) => {
        return !played.includes(film)
      })
      if (options.length === 0)
        res.send({
          error:
            'You have completed all available games. Stay tuned for more soon.',
        })
      const film = options[Math.floor(Math.random() * options.length)]
      res.send({
        filmID: createID(film),
      })
    } else if (mode == 'medium') {
      const options = films.medium.filter((film) => {
        return !played.includes(film)
      })
      if (options.length === 0)
        res.send({
          error:
            'You have completed all available games. Stay tuned for more soon.',
        })
      const film = options[Math.floor(Math.random() * options.length)]
      res.send({
        filmID: createID(film),
      })
    } else if (mode === 'hard') {
      const options = films.hard.filter((film) => {
        return !played.includes(film)
      })
      if (options.length === 0)
        res.send({
          error:
            'You have completed all available games. Stay tuned for more soon.',
        })
      const film = options[Math.floor(Math.random() * options.length)]
      res.send({
        filmID: createID(film),
      })
    }
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const saveGameResults = async (req, res) => {
  const { userid } = req.params
  const game = req.body

  try {
    const user = await UserModel.findById(userid)
    if (!user) {
      return res.status(401).json({ error: 'You must be signed in to play.' })
    }
    if (game.mode == 'easy') {
      if (game.isWin) user.game.easy.correct.push(game.film)
      else user.game.easy.incorrect.push(game.film)
    } else if (game.mode === 'medium') {
      if (game.isWin) user.game.medium.correct.push(game.film)
      else user.game.medium.incorrect.push(game.film)
    } else if (game.mode === 'hard') {
      if (game.isWin) user.game.hard.correct.push(game.film)
      else user.game.hard.incorrect.push(game.film)
    } else {
      res.status(400).json({ error: 'Invalid game mode.' })
    }
    const updatedUser = await user.save()
    res.send(updatedUser)
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

module.exports = { getFilmToPlay, saveGameResults }
