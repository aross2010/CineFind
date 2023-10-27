import homeImg from '../images/hero-image.png'
import {
  FaStar,
  FaCommentAlt,
  FaListOl,
  FaSearch,
  FaBrain,
  FaLightbulb,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Home() {
  const cardsData = [
    {
      icon: <FaStar />,
      header: 'Review',
      body: ' and rate your favorite films. See what others think about those films!',
    },
    {
      icon: <FaCommentAlt />,
      header: 'Discuss ',
      body: ' your favorite or the most controversial films with members of the community!',
    },
    {
      icon: <FaListOl />,
      header: 'List',
      body: ' your favorite films to show the community your favorites or to remember what you need to watch!',
    },
    {
      icon: <FaSearch />,
      header: 'Discover',
      body: ' film to watch through our search engine that allows you to filter films by streamers, genres, popularity, and more!',
    },
    {
      icon: <FaBrain />,
      header: 'Quiz',
      body: ' your movie knowledge with the fan-favorite CineQ movie guessing game!',
    },
    {
      icon: <FaLightbulb />,
      header: 'Learn',
      body: ' about your favorite films, actors, directors, and more with our detailed information pages!',
    },
  ]

  const renderedCards = cardsData.map((card) => {
    return (
      <div
        key={card.header}
        className="card-home light-shadow"
      >
        <span
          style={{
            fontSize: '2rem',
          }}
        >
          {card.icon}
        </span>

        <p className="home-card-body">
          <span
            style={{
              color: 'var(--secondary-text)',
            }}
          >
            {card.header}
          </span>
          {card.body}
        </p>
      </div>
    )
  })

  return (
    <div className="home-page guest">
      <section className="">
        <div>
          <h1 className="guest-header">
            Film has never been easier to <span>Find</span>.
          </h1>
          <h5 className="guest-subheader">
            The all-in-one platform for cinephiles.
          </h5>

          <button
            className="square-btn submit-btn "
            style={{
              fontSize: '0.95rem',
              padding: '1.25rem 3rem',
            }}
          >
            <Link
              to="/register"
              className="link-text"
            >
              Sign up Today!
            </Link>
          </button>
        </div>
        <div className="guest-image">
          <img
            className="home-img"
            src={homeImg}
          />
        </div>
      </section>

      <div className="home-cards-container">
        <h1 className="cards-header">With CineFind, you can...</h1>
        <div className="cards-container">{renderedCards}</div>
      </div>
      <h1 className="cards-header">...all for free!</h1>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1.5rem',
        }}
      >
        <button
          style={{
            fontSize: '0.9rem',
            padding: '1.25rem 2.5rem',
          }}
          className="square-btn submit-btn"
        >
          Join the community today!
        </button>
      </div>
    </div>
  )
}

export default Home
