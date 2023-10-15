import axios from 'axios'

import {
  getOMDBdata,
  getDirector,
  getCollection,
  getRecommended,
  getDirectorFilms,
  getCast,
  getCrew,
  getTrailer,
  getRenters,
  getStreamers,
  getLanguage,
} from '../functions/details-helper-functions.js'

export default async function getDetails(id) {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,watch/providers,keywords`
  )
  const data = res.data
  let {
    title,
    imdb_id,
    overview,
    tagline,
    genres,
    runtime,
    status,
    poster_path,
    backdrop_path,
    release_date,
    keywords,
    belongs_to_collection,
    videos,
    original_language,
  } = data

  const { cast, crew } = data.credits
  const providers = data['watch/providers'].results
  const { RTScore, IMDBScore, MPAARating } = await getOMDBdata(imdb_id)

  const poster = `https://image.tmdb.org/t/p/original/${poster_path}`
  const backdrop = `https://image.tmdb.org/t/p/original/${backdrop_path}`
  const director = getDirector(crew)

  if (keywords.keywords) keywords = keywords.keywords

  let collection
  if (belongs_to_collection)
    collection = await getCollection(belongs_to_collection.id)

  const recommended = await getRecommended(
    id,
    genres,
    keywords,
    director,
    collection
  )

  const directorFilms = await getDirectorFilms(director, id)

  const movie = {
    title,
    director,
    id,
    collection,
    imdb_id,
    poster,
    backdrop,
    overview,
    tagline,
    genres,
    runtime,
    year: release_date.slice(0, 4),
    cast: getCast(cast),
    crew: getCrew(crew),
    trailer: getTrailer(videos.results),
    renters: getRenters(providers),
    streamers: getStreamers(providers),
    language: getLanguage(original_language),
    RTScore,
    IMDBScore,
    MPAARating,
    status,
    keywords,
    recommended,
    directorFilms,
  }

  return movie
}
