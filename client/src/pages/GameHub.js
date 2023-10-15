import React, { useContext, useEffect, useState } from 'react'
import '../styles/game.css'
import { PiFilmSlateDuotone, PiTicket } from 'react-icons/pi'
import { GiRedCarpet } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import usePopupHook from '../hooks/popupHook'
import axios from 'axios'

export default function GameHub() {
  const { user } = useContext(UserContext)
  const { setPopup } = usePopupHook()
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  const handleNavigation = async (mode) => {
    if (!user) {
      setPopup('You must be signed in to play.')
      return
    }
    try {
      if (mode === 'easy') {
        const film = await axios.get(
          `https://www.cinefindapi.vercel.app/game/easy/${user._id}`
        )
        navigate(`/game/${film.data.filmID}`)
      } else if (mode === 'medium') {
        const film = await axios.get(
          `https://www.cinefindapi.vercel.app/game/medium/${user._id}`
        )
        navigate(`/game/${film.data.filmID}`)
      } else if (mode === 'hard') {
        const film = await axios.get(
          `https://www.cinefindapi.vercel.app/game/hard/${user._id}`
        )
        navigate(`/game/${film.data.filmID}`)
      }
    } catch (e) {
      setPopup(e.response.data.error)
    }
  }

  useEffect(() => {
    if (!user) return
    const fetchGameData = async () => {
      try {
        const { data } = await axios.get(
          `https://www.cinefindapi.vercel.app/user/${user.name}`
        )
        setUserData(data)
      } catch (e) {
        setPopup(e.response.data.error)
      }
    }
    fetchGameData()
  }, [user])

  const content = (
    <div className="game-hub-page">
      <div className="game-hub-header">
        <h3>Test your cinephile status.</h3>
        <p>
          Work your way through the varying difficulties of the movie guessing
          gauntlet!
        </p>
      </div>
      <div className="game-cards-container">
        <div className="difficulty-card">
          <h5>Easy</h5>

          <PiTicket
            className="card-icon"
            style={{ color: 'var(--green-alt)' }}
          />
          <p>This is for the film beginner. Everyone knows these movies!</p>
          <button
            className="card-btn"
            onClick={() => handleNavigation('easy')}
          >
            Easy
          </button>

          <span className="user-scores">
            {userData ? userData.game.easy.correct.length : 0}/100
            <span className="bullet-point">&#8226;</span>{' '}
            {userData
              ? userData.game.easy.correct.length > 0
                ? Math.round(
                    (userData.game.easy.correct.length /
                      (userData.game.easy.correct.length +
                        userData.game.easy.incorrect.length)) *
                      1000
                  ) / 10
                : '0'
              : '0'}
            %
          </span>
        </div>
        <div className="difficulty-card">
          <h5>Medium</h5>
          <PiFilmSlateDuotone
            className="card-icon"
            style={{ color: 'var(--yellow-alt)' }}
          />
          <p>This could be a challenge for the average filmgoer.</p>
          <button
            className="card-btn"
            onClick={() => handleNavigation('medium')}
          >
            Medium
          </button>
          <span className="user-scores">
            {userData ? userData.game.medium.correct.length : 0}/100
            <span className="bullet-point">&#8226;</span>{' '}
            {userData
              ? userData.game.medium.correct.length > 0
                ? Math.round(
                    (userData.game.medium.correct.length /
                      (userData.game.medium.correct.length +
                        userData.game.medium.incorrect.length)) *
                      1000
                  ) / 10
                : '0'
              : '0'}
            %
          </span>
        </div>
        <div className="difficulty-card">
          <h5>Hard</h5>
          <GiRedCarpet
            className="card-icon"
            style={{ color: 'var(--red-alt)' }}
          />
          <p>This is for the ultimate Cinephile. Do not disappoint.</p>

          <button
            className="card-btn"
            onClick={() => handleNavigation('hard')}
          >
            Hard
          </button>

          <span className="user-scores">
            {userData ? userData.game.hard.correct.length : 0}/100
            <span className="bullet-point">&#8226;</span>{' '}
            {userData
              ? userData.game.hard.correct.length > 0
                ? Math.round(
                    (userData.game.hard.correct.length /
                      (userData.game.hard.correct.length +
                        userData.game.hard.incorrect.length)) *
                      1000
                  ) / 10
                : '0'
              : '0'}
            %
          </span>
        </div>
      </div>
    </div>
  )

  return content
}
