import React, { useState, useEffect } from 'react'
import Backdrop from '../compenents/details/Backdrop'
import filmList from '../data/lists-data'
import { Tooltip, usePopper } from '@chakra-ui/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PiPencilSimpleLineDuotone } from 'react-icons/pi'
import axios from 'axios'
import Loading from '../compenents/LoadingSpinner'
import moment from 'moment'
import usePopupHook from '../hooks/popupHook'

export default function ListPage() {
  const { id } = useParams()

  const [list, setList] = useState(null)
  const [backdrop, setBackDrop] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setPopup } = usePopupHook()

  const fetchListDetails = async (id) => {
    setLoading(true)
    try {
      const list = await axios.get(
        `chttps://cinefindapi.vercel.app//lists/${id}`
      )
      const backdrop = await axios.get(
        `https://api.themoviedb.org/3/movie/${list.data.films[0].tmdbID}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
      )
      setBackDrop(
        `https://image.tmdb.org/t/p/original/${backdrop.data.backdrop_path}`
      )
      setList(list.data)
    } catch (e) {
      navigate('/lists')
      setPopup(e.response.data.error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // handle film w/ no backdrop
    fetchListDetails(id)
  }, [])

  const renderedFilms =
    list &&
    list.films.map((film, i) => {
      return (
        <Tooltip
          key={film.tmdbID}
          hasArrow
          placement="top"
          className="tooltip"
          bg="var(--secondary-dark)"
          label={`${film.title} (${film.year})`}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          >
            <Link
              to={`/film/${film.tmdbID}`}
              className="link-text"
            >
              {!film.poster.includes('null') ? (
                <img
                  src={film.poster}
                  className="poster"
                />
              ) : (
                <div className="no-poster">{film.title}</div>
              )}
            </Link>
            {list.ranked && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span className="list-view-poster-rank">{i + 1}</span>
              </div>
            )}
          </div>
        </Tooltip>
      )
    })

  const content = list && (
    <>
      <Backdrop src={backdrop} />

      <div
        className="list-view-container"
        style={{ position: 'relative' }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="list-view-name">
            {list.name}{' '}
            <Link
              className="link-no-text"
              to={`/list/edit/${list._id}`}
              style={{ fontSize: '1rem', marginLeft: '0.5rem' }}
            >
              {' '}
              <PiPencilSimpleLineDuotone />
            </Link>
          </h1>
          <Link
            className="list-view-subheader link-text alt"
            to={`/user/${list.user.name}`}
          >
            <img
              className="list-view-avatar generic-avatar"
              src={list.user.avatar}
            />
            {list.user.name}
          </Link>
          <span className="bullet-point">&#8226;</span>
          <span className="list-preview-subheader">
            updated {moment(list.updated).fromNow()}
          </span>
        </div>

        <p className="list-view-description">{list.description}</p>

        <div className="list-view-films-container">{renderedFilms}</div>
      </div>
    </>
  )

  return loading ? <Loading /> : content
}

// ADD LIKE A LIST
