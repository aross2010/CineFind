import axios from 'axios'
import getDetails from '../functions/getDetails'
import { useNavigate } from 'react-router-dom'
import usePopupHook from './popupHook'

export default function useFilmDetailsHook() {
  const { setPopup } = usePopupHook()
  const navigate = useNavigate()

  const fetchDetails = async (
    id,
    setFilm,
    setReviews,
    setDiscussions,
    setLists
  ) => {
    try {
      console.log(id)
      const details = await getDetails(id)
      const filmReviews = await axios.get(
        `https://cinefindapi.vercel.app/reviews/film/${id}`
      )
      const filmDiscussions = await axios.get(
        `https://cinefindapi.vercel.app/discussions/film/${id}`
      )
      const filmLists = await axios.get(
        `https://cinefindapi.vercel.app/lists/film/${id}`
      )
      setFilm(details)
      setReviews(filmReviews.data)
      setDiscussions(filmDiscussions.data)
      setLists(filmLists.data)
    } catch (e) {
      setPopup('The film you are looking for does not exist.')
      navigate('/films')
    }
  }

  return {
    fetchDetails,
  }
}
