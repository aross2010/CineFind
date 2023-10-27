import { FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function FilmDisplayed({ film }) {
  return (
    <div
      key={film.id}
      className="film-results"
    >
      <div>
        <Link
          to={`/film/${film.id}`}
          className="link-no-text results-poster"
        >
          {!film.poster.includes('null') ? (
            <img
              src={film.poster}
              className=" poster"
            />
          ) : (
            <div className="results-no-poster no-poster">{film.title}</div>
          )}
        </Link>
      </div>
      <div>
        <div className="results-header">
          <h5 className="results-title">
            <Link
              className="film-link link-text alt"
              to={`/film/${film.id}`}
            >
              {film.title}
            </Link>
          </h5>
          <span className="results-year">{film.year}</span>
          <span className="results-rating">
            <FaStar className="fa-star" />
            {film.rating}
          </span>
        </div>
        <p className="results-synopsis">{film.overview}</p>
      </div>
    </div>
  )
}
