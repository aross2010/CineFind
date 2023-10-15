import React, { useState, useLayoutEffect } from 'react'
import moment from 'moment'
import { FaHeart, FaChevronRight } from 'react-icons/fa'
import { PiPencilSimpleLineDuotone } from 'react-icons/pi'
import { useRef } from 'react'
import '../../../styles/review.css'
import ReviewForm from '../../forms/ReviewForm'
import { Tooltip } from '@chakra-ui/react'
import { useContext } from 'react'
import { UserContext } from '../../../context/userContext'
import axios from 'axios'
import usePopupHook from '../../../hooks/popupHook'
import { Link } from 'react-router-dom'
import { reviewSortFunction } from '../../../functions/sorting-functions'

export default function ReviewPost({
  review,
  sortMethod,
  isUserPage,
  isHomePage,
  setReviews,
}) {
  let stars = '★'.repeat(review.rating)
  const [isLong, setIsLong] = useState(false)
  const [isClamped, setIsClamped] = useState(false)
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useContext(UserContext)
  const { setPopup } = usePopupHook()

  const body = useRef()

  const isOwner = user && review.user.name === user.name

  useLayoutEffect(() => {
    if (!isLong)
      setTimeout(() => {
        const reviewBody = body.current
        if (reviewBody) {
          if (reviewBody.scrollHeight > reviewBody.clientHeight) {
            setIsLong(true)
            setIsClamped(true)
          }
        }
      }, 100)
  }, [])

  const handleEdit = (e, review) => {
    e.preventDefault()
    setIsReviewFormOpen(true)
  }

  const handleReadMore = () => {
    const reviewBody = body.current
    if (reviewBody.classList.contains('clamp')) {
      reviewBody.classList.remove('clamp')
      setIsClamped(false)
    } else {
      reviewBody.classList.add('clamp')
      setIsClamped(true)
    }
  }

  const handleLike = async (e) => {
    if (!user) {
      setPopup('You must be signed in to like a post.')
      return
    }
    e.preventDefault()
    setLoading(true)
    try {
      const like = await axios.put(
        `chttps://cinefindapi.vercel.app//like/review/${review._id}`,
        {
          userId: user._id,
        }
      )
      const route = isHomePage
        ? `/`
        : isUserPage
        ? `/user/${user.name}/`
        : `/film/${review.film.tmdbID}/`
      const newReviews = await axios.get(
        `chttps://cinefindapi.vercel.app//reviews${route}`,
        sortMethod
      )
      setReviews(() => {
        return [...newReviews.data].sort(reviewSortFunction(sortMethod))
      })
    } catch (e) {
      setPopup(e.response.data.error)
    } finally {
      setLoading(false)
    }
  }

  if (!Number.isInteger(review.rating)) stars += ' ½'

  const detailsPageReview = (
    <div className="review-container details">
      <div className="review-header">
        <Link
          className="link-no-text alt"
          to={`/user/${review.user.name}`}
        >
          <img
            src={review.user.avatar}
            className="profile-pic"
          />
        </Link>
        <span
          className={`stars ${
            review.rating >= 3 ? 'green' : review.rating <= 2 ? 'red' : 'yellow'
          }`}
        >
          {stars}
        </span>
        <Link
          className="link-text"
          to={`/user/${review.user.name}`}
        >
          <span>@{review.user.name}</span>
        </Link>
        <span className="bullet-point">•</span>
        <span className={`time-stamp ${review.updated && 'updated'}`}>
          {' '}
          <span>{review.updated && 'edited '}</span>
          {moment(review.created).fromNow()}
        </span>
        {isOwner && (
          <button
            className="edit-btn-pencil"
            onClick={(e) => handleEdit(e, review)}
          >
            <PiPencilSimpleLineDuotone />
          </button>
        )}
      </div>
      <div className="review-disc-body details">
        <p
          ref={body}
          className="clamp"
        >
          {review.body}
        </p>
        {isLong && (
          <span
            className={`read-more ${!isClamped && 'less'}`}
            onClick={handleReadMore}
          >
            {isClamped ? 'Read More' : 'Read Less'}
            <FaChevronRight />
          </span>
        )}
      </div>
      <div className="review-disc-footer">
        <button
          className="icon-btn"
          onClick={(e) => handleLike(e)}
          disabled={loading}
        >
          <FaHeart
            className={`heart-icon ${
              user && review.likes.includes(user._id) && 'liked'
            }`}
          />
        </button>

        <span className="likes-comments-count">
          {review.likes.length} {review.likes.length === 1 ? 'like' : 'likes'}
        </span>
      </div>
    </div>
  )

  const userPageView = isUserPage && (
    <div className={`review-container user`}>
      <Link
        to={`/film/${review.film.tmdbID}`}
        className="review-poster-wrapper"
      >
        <img
          src={review.film.poster}
          className="review-poster"
        />
      </Link>
      <div className="review-content">
        <h5 className="review-film-title">
          {review.film.title}{' '}
          <span className="review-film-year">{review.film.year}</span>
        </h5>
        <div className="review-header">
          {isHomePage && (
            <Tooltip
              hasArrow
              placement="top"
              className="tooltip"
              bg="var(--secondary-dark)"
              label={`@${review.user.name}`}
            >
              <Link
                className="link-no-text alt"
                to={`/user/${review.user.name}`}
              >
                <img
                  src={review.user.avatar}
                  className="profile-pic"
                  style={{ width: '1.5rem' }}
                />
              </Link>
            </Tooltip>
          )}

          <span
            className={`stars user ${
              review.rating >= 3
                ? 'green'
                : review.rating <= 2
                ? 'red'
                : 'yellow'
            }`}
          >
            {stars}
          </span>

          <span className="bullet-point">•</span>
          <span className={`time-stamp ${review.updated && 'updated'}`}>
            <span>{review.updated && 'edited '}</span>
            {moment(review.created).fromNow()}
          </span>
          {isOwner && (
            <button
              className="edit-btn-pencil"
              onClick={(e) => handleEdit(e, review)}
            >
              <PiPencilSimpleLineDuotone />
            </button>
          )}
        </div>
        <div className="review-disc-body">
          <p
            ref={body}
            className="clamp"
          >
            {review.body}
          </p>
          {isLong && (
            <span
              className={`read-more  ${!isClamped && 'less'}`}
              onClick={handleReadMore}
            >
              {isClamped ? 'Read More' : 'Read Less'}
              <FaChevronRight />
            </span>
          )}
        </div>
        <div className="review-disc-footer">
          <button
            className="icon-btn"
            onClick={(e) => handleLike(e)}
          >
            <FaHeart
              className={`heart-icon ${
                user && review.likes.includes(user._id) && 'liked'
              }`}
            />
          </button>

          <span className="likes-comments-count">
            {review.likes.length} {review.likes.length === 1 ? 'like' : 'likes'}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {isUserPage ? userPageView : detailsPageReview}
      {isOwner && (
        <ReviewForm
          open={isReviewFormOpen}
          setOpen={setIsReviewFormOpen}
          review={review}
          setReviews={setReviews}
          film={review.film}
          isUserPage={isUserPage}
        />
      )}
    </>
  )
}
