import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import FilmSocial from '../compenents/FilmSocial'
import Loading from '../compenents/LoadingSpinner'
import { UserContext } from '../context/userContext'
import homeImg from '../images/hero-image.png'
import {
  FaStar,
  FaCommentAlt,
  FaListOl,
  FaSearch,
  FaBrain,
  FaLightbulb,
} from 'react-icons/fa'
import usePopupHook from '../hooks/popupHook'

function Home() {
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [discussions, setDiscussions] = useState([])
  const [lists, setLists] = useState([])
  const { user } = useContext(UserContext)
  const { setPopup } = usePopupHook()

  const fetchData = async () => {
    try {
      const reviews = await axios.get('chttps://cinefind.vercel.app//reviews/')
      const discussions = await axios.get(
        'chttps://cinefind.vercel.app//discussions'
      )
      const lists = await axios.get('chttps://cinefind.vercel.app//lists')
      setReviews(reviews.data)
      setDiscussions(discussions.data)
      setLists(lists.data)
    } catch (e) {
      setPopup('Uh oh, something went wrong fetching data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user])

  const cardsData = [
    {
      icon: <FaStar />,
      header: 'Review',
      body: 'Review and rate your favorite films. See what others think about those films.',
    },
    {
      icon: <FaCommentAlt />,
      header: 'Discuss ',
      body: 'Engage in discussions on your favorite or most controversial films with the community. Let no voice go unheard. Respectfully.',
    },
    {
      icon: <FaListOl />,
      header: 'Track',
      body: "Create lists to track your favorite films or what's on your radar.",
    },
    {
      icon: <FaSearch />,
      header: 'Discover',
      body: 'Discover film to watch through our search engine that allows you to filter films by streamers, genres, popularity, and more!',
    },
    {
      icon: <FaBrain />,
      header: 'Quiz',
      body: 'Test your movie IQ with the fan-favorite CineQ movie guessing game.',
    },
    {
      icon: <FaLightbulb />,
      header: 'Learn',
      body: 'Learn about your favorite films, actors, directors, and more with our detailed information pages.',
    },
  ]

  const renderedCards = cardsData.map((card) => {
    return (
      <div
        key={card.header}
        className="card"
      >
        <h5 className="home-card-header uppercase light-shadow">
          <span style={{ fontSize: '1.75rem' }}>{card.icon}</span>
          {card.header}
        </h5>
        <p className="home-card-body">{card.body}</p>
      </div>
    )
  })

  const userPage = user && (
    <>
      <h1 className="home-user-header">
        Hello, {user.name}. Here's what's been happening lately.
      </h1>
      <section style={loading ? { opacity: 0 } : { opacity: 1 }}>
        <FilmSocial
          reviews={reviews}
          setReviews={setReviews}
          discussions={discussions}
          setDiscussions={setDiscussions}
          lists={lists}
          setLists={setLists}
          isUserPage
          isHomePage
        />
      </section>
    </>
  )

  const guestPage = (
    <>
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
            Sign up Today!
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
      <h1
        className="cards-header"
        style={{ marginTop: '2rem' }}
      >
        ...all for free!
      </h1>
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
    </>
  )

  const content = (
    <div className={`home-page ${user ? 'user' : 'guest'}`}>
      {user ? userPage : guestPage}
    </div>
  )

  return content
}

export default Home
