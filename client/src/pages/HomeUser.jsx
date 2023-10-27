import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/userContext'
import usePopupHook from '../hooks/popupHook'
import axios from 'axios'
import FilmSocial from '../compenents/multipurpose/FilmSocial'
import HomeSkeleton from '../compenents/skeletons/HomeSkeleton'

export default function HomeUser() {
  const { user } = useContext(UserContext)
  const [reviews, setReviews] = useState([])
  const [discussions, setDiscussions] = useState([])
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const { setPopup } = usePopupHook()

  const fetchData = async () => {
    try {
      const reviews = await axios.get('https://cinefindapi.vercel.app/reviews/')
      const discussions = await axios.get(
        'https://cinefindapi.vercel.app/discussions'
      )
      const lists = await axios.get('https://cinefindapi.vercel.app/lists')
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

  return (
    user && (
      <div className="home-page user">
        <h1 className="home-user-header">
          Hello, {user.name}. Here's what's been happening lately.
        </h1>
        <section>
          <FilmSocial
            loading={loading}
            skeleton={<HomeSkeleton count={5} />}
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
      </div>
    )
  )
}
