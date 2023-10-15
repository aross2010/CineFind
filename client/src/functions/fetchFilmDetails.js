import axios from 'axios'
import getDetails from './getDetails'

const fetchDetails = async (id) => {
  const details = await getDetails(id)
  setFilm(details)
  const filmReviews = await axios.get(
    `chttps://cinefind.vercel.app//reviews/film/${id}`
  )
  setReviews(filmReviews.data)
  const filmDiscussions = await axios.get(
    `chttps://cinefind.vercel.app//discussions/film/${id}`
  )
  setDiscussions(filmDiscussions.data)
  const filmLists = await axios.get(
    `chttps://cinefind.vercel.app//lists/film/${id}`
  )
  setLists(filmLists.data)

  // fetch reviews, discussions, lists
  if (details.poster.includes('null')) setLoading(false)
}

export default fetchDetails
