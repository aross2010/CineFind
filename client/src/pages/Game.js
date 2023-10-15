import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import getDetails from '../functions/getDetails'
import '../styles/game.css'
import tomato from '../images/tomato.png'
import fresh from '../images/fresh.png'
import rotten from '../images/rotten.png'
import imdb from '../images/imdb.png'
import TextInput from '../compenents/TextInput'
import gameFilms from '../data/game-films'
import { PiCaretRightBold, PiQuestionFill } from 'react-icons/pi'
import Modal from '../compenents/Modal'
import Loading from '../compenents/LoadingSpinner'

import { useNavigate, useParams } from 'react-router-dom'
import {
  deconstructID,
  renderRuntime,
  renderYears,
  renderDirectors,
  renderGenres,
  renderCast,
  renderGuessedFilms,
} from '../functions/game-helper-functions'
import { UserContext } from '../context/userContext'
import useWindowSizeHook from '../hooks/widowSizeHook'
import usePopupHook from '../hooks/popupHook'
import axios from 'axios'

export default function Game() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [film, setFilm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filmsGuessed, setFilmsGuessed] = useState([])
  const [isWin, setIsWin] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [mode, setMode] = useState('')
  const { width } = useWindowSizeHook()
  const { user } = useContext(UserContext)
  const { setPopup } = usePopupHook()

  let correctGuesses = [false, false, false, false, false]

  const newGame = async (id) => {
    const details = await getDetails(id)
    setFilm(details)
    setShowModal(false)
    correctGuesses = [false, false, false, false, false]
  }

  const fetchFilmToPlay = async () => {
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

  const handleRestart = async () => {
    setShowModal(false)
    setFilm(null)
    setIsWin(null)
    setFilmsGuessed([])
    fetchFilmToPlay()
  }

  const hasUserPlayed = (id, data) => {
    const played = [
      ...data.easy.correct,
      ...data.easy.incorrect,
      ...data.medium.correct,
      ...data.medium.incorrect,
      ...data.hard.correct,
      ...data.hard.incorrect,
    ]
    if (played.includes(id)) {
      setPopup('Uh oh. Looks like you have already played this film.')
      navigate('/game')
    }
    return false
  }

  const saveResults = async (isWin) => {
    try {
      const game = {
        mode,
        film: film.id,
        isWin,
      }
      const res = await axios.put(
        `https://www.cinefindapi.vercel.app/game/${user._id}`,
        game
      )
    } catch (e) {
      setPopup(e.response.data.error)
    }
  }

  useEffect(() => {
    if (isWin === null) return
    setShowModal(true)
    saveResults(isWin)
  }, [isWin])

  useEffect(() => {
    setLoading(true)
    const fetchUserGameDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://www.cinefindapi.vercel.app/user/${user.name}`
        )

        // check if user has played this film already
        const filmID = deconstructID(Number.parseInt(id))
        if (!hasUserPlayed(filmID, data.game)) newGame(filmID)
        if (gameFilms.easy.includes(filmID)) {
          setMode('easy')
        } else if (gameFilms.medium.includes(filmID)) {
          setMode('medium')
        } else if (gameFilms.hard.includes(filmID)) {
          setMode('hard')
        }
      } catch (e) {
        setPopup('You must be signed in to play.')
        navigate('/login')
      }
    }
    fetchUserGameDetails()
  }, [id])

  const handleFilmSelection = async (id) => {
    if (filmsGuessed.some((obj) => obj.id === id)) return
    setLoading(true)
    setShowModal(true)

    const newFilm = await getDetails(id)

    setFilmsGuessed((prev) => {
      return [...prev, newFilm]
    })
    setShowModal(false)
    setLoading(false)
    if (film.id === newFilm.id) {
      setIsWin(true)
      setShowModal(true)
    }
  }

  useEffect(() => {
    if (filmsGuessed.length === 6 && !isWin) {
      setIsWin(false)
      setShowModal(true)
    }
  }, [filmsGuessed])

  const renderedGenres =
    film && renderGenres(film.genres, filmsGuessed, correctGuesses, isWin)

  const renderedDirectors =
    film && renderDirectors(film.director, filmsGuessed, correctGuesses, isWin)

  const renderedYears =
    film && renderYears(film.year, filmsGuessed, correctGuesses, isWin)

  const renderedRuntime =
    film && renderRuntime(film.runtime, filmsGuessed, correctGuesses, isWin)

  const renderedCast =
    film && renderCast(film.cast, filmsGuessed, correctGuesses, isWin)

  const renderedList =
    film && renderGuessedFilms(filmsGuessed, correctGuesses, isWin)

  const content = film && (
    <>
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="game-left-col poster-details-col"
          style={{ alignItems: 'flex-start' }}
        >
          <div className="game-poster-wrapper light-shadow">
            <img
              src={film.poster}
              onLoad={() => setLoading(false)}
              style={{ border: 'none' }}
              className={`game-poster poster ${
                isWin
                  ? ''
                  : filmsGuessed.length === 0
                  ? 'zero'
                  : filmsGuessed.length === 1
                  ? 'one'
                  : filmsGuessed.length === 2
                  ? 'two'
                  : filmsGuessed.length === 3
                  ? 'three'
                  : filmsGuessed.length === 4
                  ? 'four'
                  : filmsGuessed.length === 5
                  ? 'five'
                  : ''
              }`}
            />
          </div>
        </div>
        <div className="game-right-col">
          <div
            className="game-info-container"
            style={{ width: '100%' }}
          >
            <div>
              <h5 className="info-header">Directed by</h5>
              <span className="info-text">{renderedDirectors}</span>
            </div>

            <div>
              <h5 className="info-header">Release Year</h5>
              <span className="info-text">{renderedYears}</span>
            </div>
            <div>
              <h5 className="info-header">Runtime</h5>
              <span className="info-text">{renderedRuntime}</span>
            </div>
            {width > 600 && (
              <div>
                <h5 className="info-header">Genres</h5>
                <span className="info-text game-genres-container">
                  {renderedGenres}
                </span>
              </div>
            )}

            <div>
              <div
                className="ratings-container info-text"
                style={{
                  marginTop: '0.5rem',
                  marginBottom: '0',
                  fontWeight: 400,
                }}
              >
                {film.RTScore !== 10 && (
                  <div>
                    <img
                      className="logo-RT"
                      src={
                        film.RTScore >= 70
                          ? fresh
                          : film.RTScore >= 50
                          ? tomato
                          : rotten
                      }
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>
                      {film.RTScore}%
                    </span>
                  </div>
                )}

                <div>
                  <img
                    className="logo-imdb"
                    src={imdb}
                  />

                  <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>
                    {film.IMDBScore}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {width <= 600 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            margin: '-0.75rem 0',
          }}
        >
          {width <= 600 && (
            <div style={{ marginBottom: '1rem' }}>
              <h5 className="info-header">Genres</h5>
              <span className="info-text game-genres-container">
                {renderedGenres}
              </span>
            </div>
          )}
        </div>
      )}
      <div
        style={{
          width: '100%',
          display: 'flex',
          gap: '0.25rem',
          height: '3.25rem',
          justifyContent: 'center',
        }}
      >
        {isWin !== false && isWin !== true ? (
          <>
            <div style={{ width: '100%' }}>
              <TextInput
                placeholder={
                  isWin === true || isWin === false
                    ? ''
                    : `Guess a Film...  ${filmsGuessed.length + 1} / 6`
                }
                handleFilmSelection={handleFilmSelection}
                disabled={filmsGuessed.length === 6 || isWin}
              />
            </div>
            <button
              className="how-to-play-container"
              onClick={() => setShowQuestionModal(true)}
            >
              <PiQuestionFill />
            </button>
          </>
        ) : (
          <button
            onClick={handleRestart}
            className="square-btn submit-btn"
            style={{ maxHeight: '100%', width: '100%', fontSize: '0.9rem' }}
          >
            Start new game
          </button>
        )}
      </div>

      <div
        hidden={filmsGuessed.length === 0}
        style={{
          display: 'flex',
          textAlign: 'left',
          width: '100%',
          borderTop: '1px solid var(--blue-dark)',
        }}
      >
        {renderedList}
      </div>

      <div style={{ width: '100%' }}>
        <div className="game-cast-list-container">
          <div className="game-cast-list-container-header">
            <h5>
              <span>Actor Name</span>
              <span>Gender</span>
            </h5>
          </div>

          {renderedCast}
        </div>
      </div>
    </>
  )

  const postGameModal = film && isWin !== null && (
    <Modal
      open={showModal}
      style={
        loading || !showModal
          ? {
              backgroundColor: 'transparent',
              transition: '300ms ease-in-out',
            }
          : {}
      }
    >
      <div className="post-game-message-container">
        <div style={{ width: '10rem' }}>
          <img
            src={film.poster}
            className="poster post-game-poster"
          />
        </div>

        <span className="post-game-title">
          {film.title} ({film.year})
        </span>
        <span className="post-game-message uppercase">
          {isWin ? 'Congrats!' : 'Loser!'}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="cancel-btn square-btn "
            onClick={() => setShowModal(false)}
          >
            View Results
          </button>
          <button
            className="submit-btn square-btn"
            onClick={handleRestart}
          >
            New Game
          </button>
        </div>
      </div>
    </Modal>
  )

  const questionModal = (
    <Modal open={showQuestionModal}>
      <div className="question-modal-container">
        <h5 className="uppercase how-to-play-title">CineQ - How to Play</h5>
        <ul>
          <li>
            <p>Use the given clues to guess a film.</p>
          </li>
          <li>
            <p>
              Unlock more clues as your guesses get closer to the hidden film.
            </p>
          </li>
          <li>
            <p>You have six (6) tries to guess the correct film. Good luck!</p>
          </li>
        </ul>
      </div>
      <button
        className="square-btn submit-btn"
        onClick={() => setShowQuestionModal(false)}
      >
        Got it
      </button>
    </Modal>
  )

  return (
    <div className="game-page">
      <div className="game-container">
        {content}
        {loading && <Loading />}
        {postGameModal}
        {questionModal}
      </div>
    </div>
  )
}
