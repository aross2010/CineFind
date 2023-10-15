import axios from 'axios'
import getDetails from './getDetails'

const fetchDetails = async (id) => {
  const details = await getDetails(id)
  setFilm(details)
  const filmReviews = await axios.get(
    `http://localhost:2000/reviews/film/${id}`
  )
  setReviews(filmReviews.data)
  const filmDiscussions = await axios.get(
    `http://localhost:2000/discussions/film/${id}`
  )
  setDiscussions(filmDiscussions.data)
  const filmLists = await axios.get(`http://localhost:2000/lists/film/${id}`)
  setLists(filmLists.data)

  // fetch reviews, discussions, lists
  if (details.poster.includes('null')) setLoading(false)
}

export default fetchDetails
