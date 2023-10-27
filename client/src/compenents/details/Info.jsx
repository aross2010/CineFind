import { Link } from 'react-router-dom'
import Ratings from './Ratings'

export default function Info({ film, mobile }) {
  const {
    title,
    year,
    director,
    tagline,
    overview,
    runtime,
    MPAARating,
    genres,
  } = film

  const renderedDirectors = director.map((dir, i) => {
    return (
      <span key={i}>
        <Link
          to={`/cast/${dir.id}`}
          className="link-text alt info-director bold-link"
        >
          {dir.name}
        </Link>
        {i === director.length - 1 ? '' : ', '}
      </span>
    )
  })

  const renderedGenres = genres.map((genre) => {
    return (
      <li key={genre.id}>
        <Link
          to={`/films?genres=${genre.id}`}
          className="info-genre link-text"
        >
          {genre.name}
        </Link>
      </li>
    )
  })

  return (
    <div className={`${!mobile && 'info-container-content'}`}>
      <h1 className={`info-title ${mobile && 'mobile'}`}>
        {title}
        <Link
          className={`link-text alt info-year bold-link ${mobile && 'mobile'}`}
          to={`/films?years=${film.year}%2B${film.year}`}
        >
          {year}
        </Link>
      </h1>
      <span className={`${mobile && 'mobile-director'}`}>
        {director.length > 0 && 'Directed by'} {renderedDirectors}
      </span>

      {!mobile && (
        <div>
          <h5
            className="info-tagline"
            style={{ marginTop: '1rem' }}
          >
            {tagline}
          </h5>
          <p className="info-overview">{overview}</p>
        </div>
      )}

      <div className={mobile && 'mobile-stats'}>
        {MPAARating && MPAARating != 'N/A' && (
          <span className="info-rating">{MPAARating}</span>
        )}

        {MPAARating && MPAARating != 'N/A' && runtime > 0 && (
          <span className="bullet-point">&#8226;</span>
        )}
        {runtime > 0 && <span className="info-runtime">{runtime} mins</span>}
        {mobile && (
          <Ratings
            mobile
            rtScore={film.RTScore}
            imdbScore={film.IMDBScore}
            imdbID={film.imdb_id}
          />
        )}
        {!mobile && (
          <ul
            className="info-genres-container"
            style={
              runtime <= 0 && (MPAARating === 'N/A' || !MPAARating)
                ? { marginLeft: '0rem' }
                : { marginLeft: '1rem' }
            }
          >
            {renderedGenres}
          </ul>
        )}
      </div>
    </div>
  )
}
