import { useParams, Link } from 'react-router-dom'
import '../styles/details.css'
import React, { useLayoutEffect } from 'react'
import { useEffect, useState, useRef } from 'react'
import Backdrop from '../compenents/multipurpose/Backdrop'
import Info from '../compenents/details/Info'
import Ratings from '../compenents/details/Ratings'
import Streamers from '../compenents/details/Streamers'
import CastCrew from '../compenents/details/CastCrew'
import Loading from '../compenents/multipurpose/LoadingSpinner'
import FilmSocial from '../compenents/multipurpose/FilmSocial'
import CreatePost from '../compenents/details/CreatePost'
import useWindowSizeHook from '../hooks/widowSizeHook'
import { PiCaretRightBold } from 'react-icons/pi'
import RelatedFilms from '../compenents/details/RelatedFilms'
import useFilmDetailsHook from '../hooks/filmDetailsHook'

export const DetailsContext = React.createContext()

function FilmPage() {
  const { id } = useParams()
  const [film, setFilm] = useState('')
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [discussions, setDiscussions] = useState([])
  const [isClamped, setIsClamped] = useState(null)
  const [isLong, setIsLong] = useState(false)
  const [lists, setLists] = useState([])
  const poster = useRef()
  const container = useRef()
  const contentRef = useRef()
  const overview = useRef()
  const { width } = useWindowSizeHook()
  const { fetchDetails } = useFilmDetailsHook()

  useEffect(() => {
    document.body.style.background = '#14181c'

    return () => {
      document.body.style.background =
        '#14181c url(https://s.ltrbxd.com/static/img/content-bg.0d9a0f0f.png) 0 -1px repeat-x'
    }
  })

  useEffect(() => {
    fetchDetails(id, setFilm, setReviews, setDiscussions, setLists)
  }, [id])

  useLayoutEffect(() => {
    if (width < 1150) return
    // adjust cast crew container height to line up with streamers
    if (poster.current && container.current) {
      const containerHeight = container.current.getBoundingClientRect().height
      const posterHeight = poster.current.getBoundingClientRect().height
      container.current.style.marginBottom = `${
        posterHeight - containerHeight
      }px`
    }
  }, [width, loading])

  useLayoutEffect(() => {
    if (isLong) return
    const overviewBody = overview.current
    if (overviewBody) {
      if (overviewBody.scrollHeight > overviewBody.clientHeight) {
        setIsLong(true)
        setIsClamped(true)
      }
    }
  }, [loading])

  const renderedGenres =
    film &&
    film.genres.map((genre) => {
      return (
        <Link
          key={genre.id}
          to={`/films?genres=${genre.id}`}
          className="info-genre link-text"
        >
          {genre.name}
        </Link>
      )
    })

  const lrg = (
    <section
      className="details-container"
      style={
        film && film.backdrop.includes('null')
          ? { marginTop: '100px' }
          : { marginTop: '-155px' }
      }
    >
      <section className="stick poster-details-col">
        {film && film.poster.includes('null') ? (
          <div
            ref={poster}
            className="details-no-poster no-poster"
          >
            {film.title}
          </div>
        ) : (
          <img
            className="poster"
            src={film.poster}
            ref={poster}
            onLoad={() => setLoading(false)}
          />
        )}

        <Ratings
          rtScore={film.RTScore}
          imdbScore={film.IMDBScore}
          imdbID={film.imdb_id}
        />
        <Streamers
          streamers={film.streamers}
          renters={film.renters}
          trailer={film.trailer}
        />
        <CreatePost
          film={film}
          setReviews={setReviews}
          setDiscussions={setDiscussions}
        />
      </section>
      <section
        className="info-col"
        style={{ zIndex: 2 }}
      >
        <div
          className="info-container"
          ref={container}
        >
          <Info film={film} />
        </div>

        <CastCrew
          cast={film.cast}
          crew={film.crew}
        />
        <div style={{ margin: '5rem 0' }}>
          <FilmSocial
            film={film}
            reviews={reviews}
            setReviews={setReviews}
            discussions={discussions}
            setDiscussions={setDiscussions}
            lists={lists}
            setLists={setLists}
          />
        </div>

        <RelatedFilms
          director={film.director}
          recommended={film.recommended}
          collection={film.collection}
          directorFilms={film.directorFilms}
        />
      </section>
    </section>
  )

  const sml = film && (
    <section className="mobile-details-container">
      <section
        className="mobile-info"
        style={film.backdrop.includes('null') ? { marginTop: '150px' } : {}}
      >
        <div className="mobile-details-info">
          <Info
            mobile
            film={film}
          />
        </div>
        {film.poster.includes('null') ? (
          <div
            ref={poster}
            className="details-no-poster no-poster"
            style={{ width: '55%' }}
          >
            {film.title}
          </div>
        ) : (
          <div className="mobile-details-poster">
            <img
              className=" poster"
              src={film.poster}
              ref={poster}
              onLoad={() => setLoading(false)}
            />
          </div>
        )}
      </section>
      <section>
        <h5 className="info-tagline">{film.tagline}</h5>
        <p
          className={`info-overview mobile ${
            isClamped === false && 'no-clamp'
          }`}
          ref={overview}
        >
          {film.overview}
        </p>
        {isLong && (
          <span
            className={`read-more  ${!isClamped && 'less'}`}
            onClick={() => setIsClamped(!isClamped)}
          >
            {isClamped ? 'Read More' : 'Read Less'}
            <PiCaretRightBold />
          </span>
        )}
        <div className="mobile-genres">{renderedGenres}</div>
        <CreatePost
          film={film}
          setReviews={setReviews}
          setDiscussions={setDiscussions}
        />
      </section>

      <section>
        <CastCrew
          cast={film.cast}
          crew={film.crew}
        />
      </section>
      <section>
        <FilmSocial
          film={film}
          reviews={reviews}
          setReviews={setReviews}
          discussions={discussions}
          setDiscussions={setDiscussions}
          lists={lists}
          setLists={setLists}
        />
      </section>
      <section>
        <RelatedFilms
          director={film.director}
          recommended={film.recommended}
          collection={film.collection}
          directorFilms={film.directorFilms}
        />
      </section>
    </section>
  )

  const content = (
    <>
      {film && !film.backdrop.includes('null') && (
        <Backdrop src={film.backdrop} />
      )}
      <section
        hidden={loading}
        ref={contentRef}
        className="details-page"
      >
        {width >= 1100 ? lrg : sml}
      </section>
    </>
  )

  return !film && loading ? <Loading /> : content
}

export default FilmPage
