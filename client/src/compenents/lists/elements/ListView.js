import React, { useContext } from 'react'
import { useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Tooltip } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import { PiPencilSimpleLineDuotone } from 'react-icons/pi'
import { UserContext } from '../../../context/userContext'
import usePopupHook from '../../../hooks/popupHook'
import useWindowSizeHook from '../../../hooks/widowSizeHook'
import { listSortFunction } from '../../../functions/sorting-functions'

export default function ListView({
  film,
  list,
  sortMethod,
  isUserPage,
  isHomePage,
  setLists,
}) {
  const { user } = useContext(UserContext)
  const { width } = useWindowSizeHook()
  const { setPopup } = usePopupHook()
  const [loading, setLoading] = useState(false)

  const isOwner = user && user.name === list.user.name

  const handleLike = async (e) => {
    if (!user) {
      setPopup('You must be signed in to like a post.')
      return
    }
    e.preventDefault()
    setLoading(true)
    try {
      const like = await axios.put(
        `http://localhost:2000/like/list/${list._id}`,
        {
          userId: user._id,
        }
      )
      const route = isHomePage
        ? '/'
        : isUserPage && list.user.name !== user.name
        ? `/user/${list.user.name}`
        : isUserPage && list.user.name === user.name
        ? `/user/${list.user.name}/own`
        : film
        ? `/film/${film.id}`
        : '/'

      const newLists = await axios.get(`http://localhost:2000/lists${route}`)
      setLists(() => {
        return [...newLists.data].sort(listSortFunction(sortMethod))
      })
    } catch (e) {
      setPopup('Something went wrong liking post.')
    } finally {
      setLoading(false)
    }
  }

  const films = width > 850 ? 8 : width > 500 ? 6 : width > 350 ? 4 : 3

  const renderedFilms = Array(films)
    .fill(0)
    .map((_, i) => {
      return (
        <div
          key={i}
          className=" no-border list-preview-poster"
          style={
            list.films[i]
              ? {
                  background: `center / cover url(${list.films[i].poster})`,
                }
              : {
                  backgroundColor: 'var(--alt-dark)',
                  borderRight: '1px solid var(--primary-dark)',
                }
          }
        >
          {i === films - 1 && (
            <div className="list-preview-length-banner uppercase">{`${
              list.films.length
            } Film${list.films.length > 1 ? 's' : ''}`}</div>
          )}
        </div>
      )
    })

  return (
    <div className={`list-preview-container ${isUserPage ? 'user' : ''}`}>
      <h5 className="list-preview-name">{list.name}</h5>

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
            label={`@${list.user.name}`}
          >
            <Link
              className="link-no-text alt"
              to={`/user/${list.user.name}`}
            >
              <img
                src={list.user.avatar}
                className="profile-pic"
                style={{ width: '1.5rem' }}
              />
            </Link>
          </Tooltip>
        )}
        {!isUserPage && (
          <>
            <Link
              className="link-text"
              to={`/user/${list.user.name}`}
            >
              <img
                src={list.user.avatar}
                className="profile-pic"
                style={{ width: '1.5rem' }}
              />
              <span className="username">@{list.user.name}</span>
            </Link>
            <span className="bullet-point">•</span>
          </>
        )}
        <span className="time-stamp">{moment(list.updated).fromNow()}</span>
        {isOwner && (
          <Link
            className="link-no-text"
            to={`/list/edit/${list._id}`}
            style={{ fontSize: '0.9rem', marginLeft: '0.5rem' }}
          >
            {' '}
            <PiPencilSimpleLineDuotone />
          </Link>
        )}
      </div>

      <Link
        to={`/list/${list._id}`}
        className="list-preview-films-container link-no-text"
      >
        {renderedFilms}
      </Link>
      <div
        className="review-disc-footer"
        style={{ marginTop: '1rem' }}
      >
        <button
          className="icon-btn"
          onClick={(e) => handleLike(e)}
          disabled={loading}
        >
          <FaHeart
            className={`heart-icon ${
              user && list.likes.includes(user._id) && 'liked'
            }`}
          />
        </button>

        <span className="likes-comments-count">
          {list.likes.length} {list.likes.length === 1 ? 'like' : 'likes'}
        </span>
      </div>
    </div>
  )
}
