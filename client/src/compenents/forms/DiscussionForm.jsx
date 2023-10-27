import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../../App'
import Modal from '../multipurpose/Modal'
import axios from 'axios'
import { ThreeDots } from 'react-loader-spinner'
import DeleteWarning from '../multipurpose/DeleteWarning'
import { UserContext } from '../../context/userContext'
import usePopupHook from '../../hooks/popupHook'

export default function DiscussionForm({
  open,
  setOpen,
  discussion,
  film,
  isUserPage,
  isHomePage,
  setDiscussions,
}) {
  const [discussionBody, setDiscussionBody] = useState(
    discussion ? discussion.body : ''
  )
  const [discussionTitle, setDiscussionTitle] = useState(
    discussion ? discussion.title : ''
  )
  const [loading, setLoading] = useState(false)
  const [deleteWarning, setDeleteWarning] = useState(false)
  const { setPopup } = usePopupHook()
  const { user } = useContext(UserContext)

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (discussion) {
      setDiscussionBody(discussion.body)
      setDiscussionTitle(discussion.title)
    }
  }, [open])

  const handleCancel = (e) => {
    e.preventDefault()
    setOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { id, poster, title, year } = film
    const data = {
      film: {
        tmdbID: id,
        poster,
        title,
        year,
      },
      title: discussionTitle,
      body: discussionBody,
      created: new Date(),
    }

    try {
      const postedDiscussion = await axios.post(
        'https://cinefindapi.vercel.app/discussions',
        data,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      const route = isUserPage ? `/user/${user.name}` : `/film/${id}`
      const newDiscussions = await axios.get(
        `https://cinefindapi.vercel.app/discussions${route}`
      )
      setDiscussions(newDiscussions.data)
      setLoading(false)
      setOpen(false)
      setDiscussionTitle('')
      setDiscussionBody('')
      setPopup('Success, Discussion Created!', true)
    } catch (e) {
      setPopup(e.response.data.error)
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      id: discussion._id,
      title: discussionTitle,
      body: discussionBody,
      created: new Date(),
      updated: true,
    }

    try {
      const updatedDiscussion = await axios.put(
        `https://cinefindapi.vercel.app/discussions/${discussion._id}`,
        data,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )

      const route = isHomePage
        ? `/`
        : isUserPage
        ? `/user/${user.name}`
        : `/film/${film.tmdbID}`
      const newDiscussions = await axios.get(
        `https://cinefindapi.vercel.app/discussions${route}`
      )

      setDiscussions(newDiscussions.data)
      setOpen(false)
      setLoading(false)
      setDiscussionBody('')
      setDiscussionTitle('')
      setPopup('Success, Discussion Updated!', true)
    } catch (e) {
      setPopup(e.response.data.error)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    setDeleteWarning(false)
    try {
      const deletedDiscussion = await axios.delete(
        `https://cinefindapi.vercel.app/discussions/${discussion._id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )

      const route = isHomePage
        ? `/`
        : isUserPage
        ? '/user/${user.name}'
        : `/film/${film.tmdbID}`
      const newDiscussions = await axios.get(
        `https://cinefindapi.vercel.app/discussions${route}`
      )

      setDiscussions(newDiscussions.data)
      setOpen(false)
      setPopup('Success, Discussion deleted!', true)
    } catch (e) {
      setPopup(e.response.data.error)
    }
  }

  const handleDeleteWarning = (e) => {
    e.preventDefault()
    setDeleteWarning(true)
  }

  const form = (
    <Modal open={open}>
      <div className="comment-form-container">
        <form onSubmit={discussion ? handleUpdate : handleSubmit}>
          <div>
            <h5 className="comment-form-header uppercase">
              Discussion post for... {film.title} ({film.year})
            </h5>
          </div>
          <div>
            <label
              className="label"
              htmlFor="discussion-title"
            >
              Title
            </label>
            <input
              autoComplete="off"
              type="text"
              className="list-title-input"
              name="discussion-title"
              onChange={(e) => setDiscussionTitle(e.target.value)}
              value={discussionTitle}
              style={{ backgroundColor: 'var(--third-dark)' }}
            />
          </div>
          <div>
            <label
              className="label"
              htmlFor="discussion-body"
            >
              Body
            </label>
            <textarea
              className="textarea"
              name="discussion-body"
              onChange={(e) => setDiscussionBody(e.target.value)}
              style={{ backgroundColor: 'var(--third-dark)', height: '10rem' }}
              value={discussionBody}
            ></textarea>
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
            {/* <span
              className="create-post-film-title"
              style={{ marginLeft: 'auto' }}
            >
              {film.title} ({film.year})
            </span> */}
            {discussion && (
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
        discussion
        handleDelete={handleDelete}
        open={deleteWarning}
        setOpen={setDeleteWarning}
      />
    </>
  )
}
