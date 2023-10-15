import addFilms from './add-films'
import axios from 'axios'
import sortFilms from './sort-films'

async function getFilteredData(genres, services, years, runtime, sort) {
  let arr = []
  let servicesString = ''
  let genreString = ''
  let yearString = ''

  if (years)
    yearString = `&primary_release_date.gte=${years[0]}-01-01&primary_release_date.lte=${years[1]}-12-31`

  if (genres) {
    genreString = '&with_genres='
    if (Array.isArray(genres))
      genres.forEach((genre) => {
        genreString += `${genre}|`
      })
    else genreString += `${genres}`
  }

  if (services) {
    servicesString = '&with_watch_providers='
    if (Array.isArray(services))
      services.forEach((service) => {
        servicesString += `${service}|`
      })
    else servicesString += `${services}`
  }

  const res = await axios.get(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1${yearString}${genreString}${servicesString}&watch_region=US`
  )

  const pages = res.data.total_pages
  for (let i = 1; i <= pages && i <= 50; i++) {
    const res = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=${i}${yearString}${genreString}${servicesString}&watch_region=US`
    )
    const data = res.data.results
    addFilms(data, arr)
  }

  return {
    data: sortFilms(arr, sort),
  }
}

export default getFilteredData
