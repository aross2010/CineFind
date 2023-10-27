import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="not-found-container">
      Oops. Page not found.
      <Link
        className="link-no-text"
        to={'/'}
      >
        <img
          src="https://www.pngkit.com/png/full/43-435693_funny-face-png-spiderman-crying-meme.png"
          style={{ width: '10rem' }}
        />
      </Link>
    </div>
  )
}

export default NotFound
