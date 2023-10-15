function addFilms(data, arr, lim) {
  data.forEach((film, i) => {
    if (i >= lim) return
    if (film.vote_count < 5 || !film.vote_average || !film.release_date) return
    const { title, overview, id, popularity } = film

    arr.push({
      title,
      poster: `https://image.tmdb.org/t/p/original/${film.poster_path}`,
      overview,
      year: film.release_date.slice(0, 4),
      popularity,
      rating: film.vote_average.toFixed(1),
      backdrop: `https://image.tmdb.org/t/p/original/${film.backdrop_path}`,
      id,
    })
  })
}

export default addFilms
