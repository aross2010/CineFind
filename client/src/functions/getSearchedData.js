import addFilms from './add-films'
import axios from 'axios'
import sortFilms from './sort-films'

async function getSearchedData(query, sort) {
  let arr = []
  const res = await axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${query}`
  )
  const pages = res.data.total_pages
  for (let i = 1; i <= pages && i <= 20; i++) {
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&page=${i}&query=${query}`
    )
    const data = res.data.results
    addFilms(data, arr)
  }

  return {
    data: sortFilms(arr, sort),
  }
}

export default getSearchedData
