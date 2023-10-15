import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { AppContext } from '../../App'
import Modal from '../Modal'
import axios from 'axios'
import DeleteWarning from '../DeleteWarning'
import { UserContext } from '../../context/userContext'
import usePopupHook from '../../hooks/popupHook'

export default function CommentForm({
  open,
  setOpen,
  body,
  setBody,
  setDiscussions,
  discussionToComment,
  comment,
  isUserPage,
  isHomePage,
}) {
  const [loading, setLoading] = useState(false)
  const [deleteWarning, setDeleteWarning] = useState(false)
  const { setPopup } = usePopupHook()
  const { user } = useContext(UserContext)

  const handleCancel = (e) => {
    e.preventDefault()
    setOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      body: body,
      created: new Date(),
      user,
    }

    try {
      const postedDiscussion = await axios.post(
        `https://www.cinefindapi.vercel.app/comments/${discussionToComment._id}`,
        data
      )
      const route = isHomePage
        ? '/'
        : isUserPage
        ? `/user/${user.name}`
        : `/film/${discussionToComment.film.tmdbID}`
      const newDiscussions = await axios.get(
        `https://www.cinefindapi.vercel.app/discussions${route}`
      )
      setDiscussions(newDiscussions.data)
      setLoading(false)
      setOpen(false)
      setBody('')
      setPopup('Success, Comment Posted!', true)
    } catch (e) {
      setPopup(e.response.data.message)
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      body: body,
      created: new Date(),
      updated: true,
    }

    try {
      const updatedComment = await axios.put(
        `https://www.cinefindapi.vercel.app/comments/${discussionToComment._id}/${comment._id}`,
        data
      )
      const route = isUserPage
        ? `/user/${user.name}`
        : `/film/${discussionToComment.film.tmdbID}`
      const newDiscussions = await axios.get(
        `https://www.cinefindapi.vercel.app/discussions${route}`
      )
      setDiscussions(newDiscussions.data)
      setLoading(false)
      setOpen(false)
      setBody('')
      setPopup('Success, Comment updated!', true)
    } catch (e) {
      setPopup(e.response.data.error)
      setLoading(false)
    }
  }

  const handleDeleteWarning = (e) => {
    e.preventDefault()
    setDeleteWarning(true)
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    setLoading(true)
    setDeleteWarning(false)
    try {
      const deletedComment = await axios.delete(
        `https://www.cinefindapi.vercel.app/comments/${discussionToComment._id}/${comment._id}`
      )
      const route = isUserPage
        ? `/user/${user.name}`
        : `/film/${discussionToComment.film.tmdbID}`
      const newDiscussions = await axios.get(
        `https://www.cinefindapi.vercel.app/discussions${route}`
      )
      setDiscussions(newDiscussions.data)
      setLoading(false)
      setOpen(false)
      setBody('')
      setPopup('Success, Comment deleted!', true)
    } catch (e) {
      setPopup(e.response.data.error)
      setLoading(false)
    }
  }

  const form = (
    <Modal open={open}>
      <div className="comment-form-container">
        <form onSubmit={comment ? handleUpdate : handleSubmit}>
          <section>
            <h5 className="comment-form-header uppercase">Reply To</h5>
            <p className="comment-form-text">{discussionToComment.body}</p>
          </section>
          <section>
            <textarea
              className="textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ backgroundColor: 'var(--third-dark)' }}
            />
          </section>
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
            {comment && (
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
        handleDelete={handleDelete}
        open={deleteWarning}
        setOpen={setDeleteWarning}
      />
    </>
  )
}
