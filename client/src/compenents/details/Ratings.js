import tomato from '../../images/tomato.png'
import fresh from '../../images/fresh.png'
import rotten from '../../images/rotten.png'
import imdb from '../../images/imdb.png'
import { Link } from 'react-router-dom'

export default function Ratings({ rtScore, imdbScore, imdbID, mobile }) {
  return (
    <div className={!mobile ? 'ratings-container' : 'mobile-ratings'}>
      {mobile && <span className="bullet-point">&#8226;</span>}
      {rtScore && (
        <div>
          <img
            className="logo-RT"
            src={rtScore >= 70 ? fresh : rtScore >= 50 ? tomato : rotten}
          />
          <span style={mobile ? { paddingLeft: '0.25rem' } : {}}>
            {rtScore}%
          </span>
        </div>
      )}
      {!mobile && imdbScore && imdbScore !== 'N/A' && (
        <div>
          <Link to={`https://www.imdb.com/title/${imdbID}`}>
            <img
              className="logo-imdb"
              src={imdb}
            />
          </Link>
          <span>{imdbScore}</span>
        </div>
      )}
    </div>
  )
}
