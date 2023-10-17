import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Backdrop from '../compenents/details/Backdrop'
import axios from 'axios'
import '../styles/user.css'
import {
  Tooltip,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react'

import FilmSocial from '../compenents/FilmSocial'
import Loading from '../compenents/LoadingSpinner'
import usePopupHook from '../hooks/popupHook'
import useWindowSizeHook from '../hooks/widowSizeHook'
import { UserContext } from '../context/userContext'
export default function UserPage() {
  const { username } = useParams()
  const [ratingsData, setRatingsData] = useState({
    ratings: [],
    average: 0,
  })
  const [reviews, setReviews] = useState([])
  const [discussions, setDiscussions] = useState([])
  const [lists, setLists] = useState([])
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useContext(UserContext)
  const { width } = useWindowSizeHook()
  const { setPopup } = usePopupHook()
  const navigate = useNavigate()

  const fetchUserData = async (name) => {
    setLoading(true)
    try {
      const userReviews = await axios.get(
        `https://cinefindapi.vercel.app/reviews/user/${name}`
      )
      setReviews(userReviews.data)

      const userDiscussions = await axios.get(
        `https://cinefindapi.vercel.app/discussions/user/${name}`
      )
      setDiscussions(userDiscussions.data)
      if (name === user.name) {
        const userLists = await axios.get(
          `https://cinefindapi.vercel.app/lists/user/${name}/own`
        )
        setLists(userLists.data)
      } else {
        const userLists = await axios.get(
          `https://cinefindapi.vercel.app/lists/user/${name}`
        )
        setLists(userLists.data)
      }

      const res = await axios.get(`https://cinefindapi.vercel.app/user/${name}`)
      setUserData(res.data)

      let ratings = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      const setRating = (rating) => {
        if (rating === 0.5) {
          ratings[0]++
        } else if (rating === 1) {
          ratings[1]++
        } else if (rating === 1.5) {
          ratings[2]++
        } else if (rating === 2) {
          ratings[3]++
        } else if (rating === 2.5) {
          ratings[4]++
        } else if (rating === 3) {
          ratings[5]++
        } else if (rating === 3.5) {
          ratings[6]++
        } else if (rating === 4) {
          ratings[7]++
        } else if (rating === 4.5) {
          ratings[8]++
        } else if (rating === 5) {
          ratings[9]++
        }
      }

      let total = 0

      userReviews.data.forEach((review) => {
        const { rating } = review
        total += rating
        setRating(rating)
      })

      let average = 0.0
      if (total !== 0) {
        average = total / userReviews.data.length
      }

      setRatingsData({
        ratings,
        average,
      })
    } catch (e) {
      navigate('/')
      setPopup(e.response.data.error)
    } finally {
      setLoading(false)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchUserData(username)
  }, [])

  const formattedNum = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const renderedGraphBars = (
    <div className="graph-bars-container">
      {ratingsData.ratings.map((rating, i) => {
        const highestRating = Math.max(...ratingsData.ratings)
        const barHeight = (rating / highestRating) * 100
        const num = i / 2 + 0.5
        let stars = '★'.repeat(num)
        if (!Number.isInteger(num)) stars += '½'
        return (
          <Tooltip
            hasArrow
            placement="top"
            className="tooltip"
            bg="var(--secondary-dark)"
            label={`${formattedNum(rating)} ${stars} reviews`}
            key={i}
          >
            <div className="graph-bar-wrapper">
              <div
                className={`graph-bar`}
                style={
                  barHeight !== 0
                    ? { height: `${barHeight}%` }
                    : { height: '0%' }
                }
              ></div>
            </div>
          </Tooltip>
        )
      })}
    </div>
  )

  const percentRight = (mode) => {
    if (mode.correct.length + mode.incorrect.length === 0) return 'N/A'
    return (
      (mode.correct.length / (mode.incorrect.length + mode.correct.length)) *
      100
    ).toFixed(1)
  }

  const renderedStats = userData && (
    <>
      <div className="progress-container">
        <CircularProgress
          color="var(--green-alt)"
          value={percentRight(userData.game.easy)}
          thickness="0.35rem"
          size="5.5rem"
          fontSize="0rem"
          trackColor="var(--alt-dark)"
        >
          <CircularProgressLabel fontSize="1.1rem">
            {`${
              percentRight(userData.game.easy) === 0
                ? 'O'
                : percentRight(userData.game.easy)
            }%`}
          </CircularProgressLabel>
        </CircularProgress>
        <span>Easy</span>
      </div>

      <div className="progress-container">
        <CircularProgress
          color="var(--yellow-alt)"
          value={percentRight(userData.game.medium)}
          thickness="0.35rem"
          size="5.5rem"
          fontSize="0rem"
          trackColor="var(--alt-dark)"
        >
          <CircularProgressLabel fontSize="1.1rem">
            {`${
              percentRight(userData.game.medium) === 0
                ? 'O'
                : percentRight(userData.game.medium)
            }%`}
          </CircularProgressLabel>
        </CircularProgress>
        <span>Medium</span>
      </div>

      <div className="progress-container">
        <CircularProgress
          color="var(--red-alt)"
          value={percentRight(userData.game.hard)}
          thickness="0.35rem"
          size="5.5rem"
          fontSize="0rem"
          trackColor="var(--alt-dark)"
        >
          <CircularProgressLabel fontSize="1.1rem">
            {`${
              percentRight(userData.game.hard) === 0
                ? 'O'
                : percentRight(userData.game.hard)
            }%`}
          </CircularProgressLabel>
        </CircularProgress>
        <span>Hard</span>
      </div>
    </>
  )

  const userReviewStats = (
    <div className="user-view-ratings-container data-type">
      <h5 className="section-header">Ratings</h5>
      <div className="ratings-graph-container">
        <span className="stars">{'★'.repeat(1)}</span>
        {renderedGraphBars}{' '}
        <span className="average-rating-display">
          <span className="average-rating">
            {ratingsData.average.toFixed(1)}
          </span>
          <span className="stars">{'★'.repeat(5)}</span>
        </span>
      </div>
    </div>
  )

  const userCineqStats = (
    <div className="user-view-cineq-container data-type">
      <h5 className="section-header ">
        <Link
          className="link-text alt"
          to="/game"
        >
          CineQ
        </Link>
      </h5>

      <div className="cineq-stats-container">{renderedStats}</div>
    </div>
  )

  const content = userData && (
    <>
      <Backdrop src={userData.film.backdrop} />

      <div className="user-view-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <img
            src={userData.avatar}
            className="user-view-avatar"
          />
          <div>
            <h1 className="user-view-username">{userData.name}</h1>
          </div>
        </div>
        <div className="user-data-container">
          {width > 500 ? (
            <section>
              {userReviewStats}
              {userCineqStats}
            </section>
          ) : (
            <>
              <section>{userReviewStats}</section>
              <section>{userCineqStats}</section>
            </>
          )}

          <section>
            <FilmSocial
              reviews={reviews}
              setReviews={setReviews}
              discussions={discussions}
              setDiscussions={setDiscussions}
              lists={lists}
              setLists={setLists}
              isUserPage
            />
          </section>
        </div>
      </div>
    </>
  )

  return loading ? <Loading /> : content
}
// try to make seperate component for triple header with sort option at the head. switchable header
