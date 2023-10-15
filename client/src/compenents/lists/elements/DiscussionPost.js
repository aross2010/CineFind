import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import moment from 'moment'
import { useState } from 'react'
import { FaHeart, FaCommentAlt, FaChevronRight } from 'react-icons/fa'
import { PiPencilSimpleLineDuotone } from 'react-icons/pi'
import DiscussionForm from '../../forms/DiscussionForm'
import { UserContext } from '../../../context/userContext'
import axios from 'axios'
import usePopupHook from '../../../hooks/popupHook'
import { Link } from 'react-router-dom'
import { Tooltip } from '@chakra-ui/react'
import { discussionSortFunction } from '../../../functions/sorting-functions'

export default function DiscussionPost({
  discussion,
  isUserPage,
  isHomePage,
  sortMethod,
  sortedDiscussions,
  setDiscussions,
  setIsCommentFormOpen,
  setDiscussionToComment,
  setComment,
}) {
  const [showComments, setShowComments] = useState(false)
  const [isLong, setIsLong] = useState(false)
  const [isClamped, setIsClamped] = useState(false)
  const [isDiscussionFormOpen, setIsDiscussionFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setPopup } = usePopupHook()
  const { user } = useContext(UserContext)
  const body = useRef()

  const isOwner = user && user.name === discussion.user.name

  useEffect(() => {
    const discussionBody = body.current
    if (discussionBody) {
      if (discussionBody.scrollHeight > discussionBody.clientHeight) {
        setIsLong(true)
        setIsClamped(true)
      }
    }
  }, [sortedDiscussions])

  const handleLike = async (e) => {
    if (!user) {
      setPopup('You must be signed in to like a post.')
      return
    }
    e.preventDefault()
    setLoading(true)
    try {
      const like = await axios.put(
        `chttps://cinefind.vercel.app//like/discussion/${discussion._id}`,
        {
          userId: user._id,
        }
      )
      const route = isHomePage
        ? `/`
        : isUserPage
        ? `/user/${user.name}`
        : `/film/${discussion.film.tmdbID}`
      const newDiscussions = await axios.get(
        `chttps://cinefind.vercel.app//discussions${route}`
      )
      setDiscussions(() => {
        return [...newDiscussions.data].sort(discussionSortFunction(sortMethod))
      })
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  function createComments(comments) {
    const renderedComments = comments.map((comment, i) => {
      return (
        <div
          key={i}
          className="comment"
        >
          <div className="comment-header">
            <img
              src={comment.user.avatar}
              className="profile-pic comment-avatar"
              style={{ marginRight: '0.5rem' }}
            />
            <Link
              className="link-text"
              to={`/user/${comment.user.name}`}
            >
              {' '}
              <span className="comment-username">@{comment.user.name}</span>
            </Link>
            <span className="bullet-point">•</span>
            <span className="comment-time-stamp">
              {moment(comment.created).fromNow()}
            </span>
            {isOwner && (
              <button
                className="edit-btn-pencil"
                onClick={(e) => displayCommentForm(e, comment)}
              >
                <PiPencilSimpleLineDuotone />
              </button>
            )}
          </div>

          <p className="comment-body">{comment.body}</p>
        </div>
      )
    })

    return (
      <>
        {renderedComments}
        {discussion.comments.length > 0 && (
          <span
            className="add-comment"
            onClick={(e) => displayCommentForm(e, false)}
          >
            Leave a comment
          </span>
        )}
      </>
    )
  }

  const displayCommentForm = (e, comment) => {
    e.preventDefault()
    setIsCommentFormOpen(true)
    setDiscussionToComment(discussion)
    if (!comment) {
      setComment(null)
    } else {
      setComment(comment)
    }
  }

  const handleShowComments = (e) => {
    e.preventDefault()
    if (!discussion.comments.length > 0) {
      displayCommentForm(e)
      return
    }

    setShowComments(!showComments)
  }

  const handleReadMore = () => {
    const discBody = body.current
    if (discBody.classList.contains('clamp')) {
      discBody.classList.remove('clamp')
      setIsClamped(false)
    } else {
      discBody.classList.add('clamp')
      setIsClamped(true)
    }
  }

  const handleEdit = (e) => {
    e.preventDefault()
    setIsDiscussionFormOpen(true)
  }

  const detailsPageView = (
    <div className="discussion-container details">
      <div className="discussion-header">
        <Link
          className="link-text"
          to={`/user/${discussion.user.name}`}
        >
          <img
            src={discussion.user.avatar}
            className="profile-pic"
          />
          <span className="username">@{discussion.user.name}</span>
        </Link>
        <span className="bullet-point">•</span>
        <span className="time-stamp">
          {moment(discussion.created).fromNow()}
        </span>
        {isOwner && (
          <button
            className="edit-btn-pencil"
            onClick={(e) => handleEdit(e, discussion)}
          >
            <PiPencilSimpleLineDuotone />
          </button>
        )}
        <h5 className="discussion-title">{discussion.title}</h5>
      </div>
      <div className="review-disc-body">
        <p
          ref={body}
          className="clamp"
        >
          {discussion.body}
        </p>
        {isLong && (
          <span
            className={`read-more  ${!isClamped ? 'less' : ''}`}
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
              user && discussion.likes.includes(user._id) && 'liked'
            }`}
          />
        </button>

        <span className="likes-comments-count">
          {discussion.likes.length}{' '}
          {discussion.likes.length === 1 ? 'like' : 'likes'}
        </span>
        <div style={{ cursor: 'pointer' }}>
          <button
            className="likes-comments-count"
            onClick={handleShowComments}
          >
            <FaCommentAlt className="comments-icon" />
            {discussion.comments.length > 0
              ? `${discussion.comments.length} comments`
              : 'Comment'}
          </button>
        </div>
      </div>

      {showComments && (
        <div className="comments-container details">
          {createComments(discussion.comments)}
        </div>
      )}
    </div>
  )

  const userPageView = (
    <div className="discussion-container user">
      <Link
        className="discussion-poster-wrapper"
        to={`/film/${discussion.film.tmdbID}`}
      >
        <img
          src={discussion.film.poster}
          className="discussion-poster"
        />
      </Link>
      <div className="discussion-content">
        <div className="discussion-header">
          <h5 className="discussion-film-title">
            {discussion.film.title}{' '}
            <span className="discussion-film-year">{discussion.film.year}</span>
          </h5>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.9rem',
            }}
          >
            {isHomePage && (
              <Tooltip
                hasArrow
                placement="top"
                className="tooltip"
                bg="var(--secondary-dark)"
                label={`@${discussion.user.name}`}
              >
                <Link
                  className="link-no-text alt"
                  to={`/user/${discussion.user.name}`}
                >
                  <img
                    src={discussion.user.avatar}
                    className="profile-pic"
                    style={{ width: '1.5rem' }}
                  />
                </Link>
              </Tooltip>
            )}
            <span className="time-stamp">
              {moment(discussion.created).fromNow()}
            </span>
            {isOwner && (
              <button
                className="edit-btn-pencil"
                onClick={(e) => handleEdit(e, discussion)}
              >
                <PiPencilSimpleLineDuotone />
              </button>
            )}
          </div>

          <h5 className="discussion-title">{discussion.title}</h5>
        </div>
        <div className="review-disc-body">
          <p
            ref={body}
            className="clamp"
          >
            {discussion.body}
          </p>
          {isLong && (
            <span
              className={`read-more  ${!isClamped ? 'less' : ''}`}
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
                user && discussion.likes.includes(user._id) && 'liked'
              }`}
            />
          </button>
          <span className="likes-comments-count">
            {discussion.likes.length}{' '}
            {discussion.likes.length === 1 ? 'like' : 'likes'}
          </span>
          <div style={{ cursor: 'pointer' }}>
            <button
              className="likes-comments-count"
              onClick={handleShowComments}
            >
              <FaCommentAlt className="comments-icon" />
              {discussion.comments.length > 0
                ? `${discussion.comments.length} comments`
                : 'Comment'}
            </button>
          </div>
        </div>

        {showComments && (
          <div className="comments-container">
            {createComments(discussion.comments)}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {isUserPage ? userPageView : detailsPageView}
      {isOwner && (
        <DiscussionForm
          open={isDiscussionFormOpen}
          setOpen={setIsDiscussionFormOpen}
          discussion={discussion}
          setDiscussions={setDiscussions}
          film={discussion.film}
          isUserPage={isUserPage}
        />
      )}
    </>
  )
}

// change popup state location
