import axios from 'axios'
import languages from '../data/languages'
import validStreamers from '../data/valid-streamers'

function getDirector(crew) {
  let arr = []
  crew.forEach((member) => {
    if (member.job !== 'Director') return
    arr.push({
      name: member.name,
      id: member.id,
    })
  })

  return arr
}

function getTrailer(vids) {
  for (let i = vids.length - 1; i >= 0; i--) {
    if (
      vids[i].type === 'Trailer' &&
      vids[i].site === 'YouTube' &&
      !vids[i].name.includes('UK')
    ) {
      return vids[i].key
    }
  }
  return null
}

function getRenters(providers) {
  let arr = []
  if (providers.US) {
    if (providers.US.rent) {
      providers.US.rent.forEach((service) => {
        if (arr.length === 3) return arr
        arr.push({
          logo: `https://image.tmdb.org/t/p/original/${service.logo_path}`,
          name: service.provider_name,
        })
      })
      return arr
    }
  }
  return arr
}

function getStreamers(providers) {
  let arr = []
  if (providers.US) {
    if (providers.US.flatrate) {
      providers.US.flatrate.forEach((streamer) => {
        if (!validStreamers.includes(streamer.provider_name)) return
        arr.push({
          logo: `https://image.tmdb.org/t/p/original/${streamer.logo_path}`,
          name: streamer.provider_name,
        })
      })
      return arr
    }
  }
  return arr
}

function getRating(rating) {
  for (let i = 0; i < rating.length; i++) {
    if (rating[i].iso_3166_1 === 'US') {
      for (let j = 0; j < rating[i].release_dates.length; j++) {
        if (rating[i].release_dates[j].certification != '') {
          return rating[i].release_dates[j].certification
          break
        }
      }
      break
    }
  }
  return null
}

function getCast(cast) {
  let arr = []

  if (cast) {
    cast.forEach((member) => {
      arr.push({
        name: member.name,
        character: member.character,
        photo: `https://image.tmdb.org/t/p/original/${member.profile_path}`,
        id: member.id,
        gender: member.gender,
      })
    })
  }
  return arr
}

function getCrew(crew) {
  let arr = []
  if (crew) {
    crew.forEach((member) => {
      arr.push({
        name: member.name,
        job: member.job,
        photo: `https://image.tmdb.org/t/p/original/${member.profile_path}`,
        id: member.id,
      })
    })

    const order = [
      'Director',
      'Producer',
      'Executive Producer',
      'Screenplay',
      'Writer',
      'Director of Photography',
      'Original Music Composer',
      'Editor',
      'Casting',
      'Costume Design',
    ]
    arr.sort((a, b) => {
      const i = order.indexOf(a.job)
      const j = order.indexOf(b.job)

      if (i !== -1 && j !== -1) return i - j
      else if (i !== -1) return -1
      else if (j !== -1) return 1
      else return 0
    })
  }
  return arr
}

function getLanguage(lang) {
  for (let i = 0; i < languages.length; i++) {
    if (lang === languages[i].code) {
      return languages[i].name
    }
  }
}

function parseScore(score) {
  let num = score.slice(0, 2)
  return Number.parseInt(num)
}

async function getOMDBdata(id) {
  const scores = await axios.get(
    `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}=${id}`
  )

  let RTScore, IMDBScore, MPAARating

  if (scores.data.Ratings !== undefined)
    if (scores.data.Ratings[1] !== undefined)
      RTScore = parseScore(scores.data.Ratings[1].Value)

  if (scores.data.imdbRating !== undefined) IMDBScore = scores.data.imdbRating

  MPAARating = scores.data.Rated

  return {
    RTScore,
    IMDBScore,
    MPAARating,
  }
}

async function getCollection(id) {
  const res = await axios.get(
    `https://api.themoviedb.org/3/collection/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
  )
  const data = res.data
  var { name, overview, parts, poster_path } = data
  const poster = `https://image.tmdb.org/t/p/original/${poster_path}`
  let films = []

  parts.forEach((film) => {
    if (!film.poster_path) return
    films.push({
      poster: `https://image.tmdb.org/t/p/original/${film.poster_path}`,
      id: film.id,
      title: film.title,
    })
  })

  const n = name.lastIndexOf(' ')
  name = name.substring(0, n)

  return {
    films,
    name,
    overview,
    poster,
  }
}

async function getRecommended(id, genres, keywords, director, collection) {
  let arr = []
  let genreStringOR = ''
  let genreStringAND = ''
  let keywordsString = ''

  genres.forEach((genre) => {
    genreStringAND += `${genre.id},`
    genreStringOR += `${genre.id}|`
  })

  keywords.forEach((word, index) => {
    if (index % 2 !== 0 || index === 6) return
    keywordsString += `${word.id},`
  })

  var res = await axios.get(`
    https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_runtime.gte=60&with_vote_average.gte=6.7&with_vote_count.gte=25&with_genres=${genreStringAND}&with_keywords=${keywordsString}`)
  addRecs(res.data.results, arr, id)

  var res = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
  )

  const data = res.data.results
    .filter(
      (film) =>
        film.vote_count > 15 &&
        genres.some((f) => film.genre_ids.includes(f.id))
    )
    .sort((a, b) => b.vote_average - a.vote_average)

  addRecs(data, arr, id)

  return arr
}

async function getDirectorFilms(director, id) {
  if (director.length === 0) return
  const res = await axios.get(
    `https://api.themoviedb.org/3/person/${director[0].id}/movie_credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
  )
  const data = res.data.crew
  let arr = []

  data.forEach((film) => {
    if (
      (film.job !== 'Director' &&
        film.job !== 'Writer' &&
        film.job !== 'Screenplay') ||
      arr.find((e) => e.id === film.id || film.poster_path === null)
    )
      return
    arr.push({
      poster: `https://image.tmdb.org/t/p/original/${film.poster_path}`,
      id: film.id,
      popularity: film.popularity,
      title: film.title,
      year: film.release_date.slice(0, 4),
    })
  })

  arr.sort((a, b) => b.popularity - a.popularity)

  return arr
}

function addRecs(data, arr, id) {
  data.forEach((film) => {
    if (
      film.poster_path === null ||
      film.id == id ||
      arr.find((e) => e.id === film.id)
    )
      return

    arr.push({
      poster: `https://image.tmdb.org/t/p/original/${film.poster_path}`,
      id: film.id,
      score: film.vote_average,
      title: film.title,
      year: film.release_date.slice(0, 4),
    })
  })
}

export {
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
}
