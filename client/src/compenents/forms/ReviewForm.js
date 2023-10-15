import React, { useEffect, useState, useContext } from 'react'
import Modal from '../Modal'
import ReactStars from 'react-stars'
import axios from 'axios'
import { ThreeDots } from 'react-loader-spinner'
import DeleteWarning from '../DeleteWarning'
import { UserContext } from '../../context/userContext'
import usePopupHook from '../../hooks/popupHook'

export default function ReviewForm({
  open,
  setOpen,
  review,
  film,
  setReviews,
  isUserPage,
}) {
  const [reviewBody, setReviewBody] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [deleteWarning, setDeleteWarning] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setPopup } = usePopupHook()
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (review) {
      setReviewBody(review.body)
      setReviewRating(review.rating)
    }
  }, [open])

  const ratingChanged = (newRating) => {
    setReviewRating(newRating)
  }

  const handleCancel = (e) => {
    e.preventDefault()
    setOpen(false)
  }

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    const { id, poster, title, year } = film
    const data = {
      film: {
        tmdbID: id,
        poster,
        title,
        year,
      },
      rating: reviewRating,
      body: reviewBody,
      created: new Date(),
      user,
    }

    try {
      const postedReview = await axios.post(
        'https://cinefindapi.vercel.app/reviews',
        data
      )
      const route = isUserPage ? `/user/${user.name}` : `/film/${id}`
      const newReviews = await axios.get(
        `https://cinefindapi.vercel.app/reviews${route}`
      )
      setReviews(newReviews.data)
      setLoading(false)
      setOpen(false)
      setReviewBody('')
      setReviewRating(0)
      setPopup('Success, Review Created!', true)
    } catch (e) {
      setPopup(e.response.data.error, false)
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const data = {
      id: review._id,
      rating: reviewRating,
      body: reviewBody,
      created: new Date(),
      updated: true,
    }

    try {
      const updatedReview = await axios.put(
        `https://cinefindapi.vercel.app/reviews/${review._id}`,
        data
      )

      const route = isUserPage ? `/user/${user.name}` : `/film/${film.tmdbID}`
      const newReviews = await axios.get(
        `https://cinefindapi.vercel.app/reviews${route}`
      )
      setReviews(newReviews.data)
      setOpen(false)
      setReviewBody('')
      setReviewRating(0)
      setPopup('Success, Review Updated!', true)
    } catch (e) {
      setPopup(e.response.data.error)
      setLoading(false)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    try {
      const deletedReview = await axios.delete(
        `https://cinefindapi.vercel.app/reviews/${review._id}`
      )
      const route = isUserPage ? `/user/${user.name}` : `/film/${film.tmdbID}`
      const newReviews = await axios.get(
        `https://cinefindapi.vercel.app/reviews${route}`
      )
      setDeleteWarning(false)
      setReviews(newReviews.data)
      setOpen(false)
      setPopup('Success, Review deleted!', true)
    } catch (e) {
      setPopup(e.response.data.error)
    }
  }

  const handleDeleteWarning = (e) => {
    e.preventDefault()
    setDeleteWarning(true)
  }

  const form = (
    <Modal
      open={open}
      style={deleteWarning ? { pointerEvents: 'none' } : {}}
    >
      <div className="comment-form-container">
        <form onSubmit={review ? handleUpdate : handleSubmit}>
          <div>
            <h5 className="comment-form-header uppercase">
              Review for... {film.title} ({film.year})
            </h5>
          </div>
          <div>
            <label
              className="label"
              htmlFor="review-body"
            >
              Review
            </label>
            <textarea
              className="textarea"
              name="review-body"
              style={{ backgroundColor: 'var(--third-dark)', height: '10rem' }}
              onChange={(e) => setReviewBody(e.target.value)}
              value={reviewBody}
            ></textarea>
          </div>
          <div>
            <label className="label">Rating</label>
            <ReactStars
              count={5}
              value={reviewRating}
              onChange={ratingChanged}
              size={36}
              char="★"
              color2={'#76F88E'}
              half
              className="stars-selector"
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'end',
              marginTop: '1rem',
            }}
          >
            <button
              className="square-btn cancel-btn"
              onClick={(e) => handleCancel(e)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="square-btn submit-btn"
              type="submit"
              disabled={loading}
            >
              {!loading ? (
                'Submit'
              ) : (
                <ThreeDots
                  height={26}
                  width={26}
                  color="var(--primary-text)"
                />
              )}
            </button>

            {review && (
              <button
                onClick={(e) => handleDeleteWarning(e)}
                className="delete-review-btn underlined"
                disabled={loading}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  )

  return (
    <>
      {form}
      <DeleteWarning
        review
        handleDelete={handleDelete}
        open={deleteWarning}
        setOpen={setDeleteWarning}
      />
    </>
  )
}
