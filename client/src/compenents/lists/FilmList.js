import React from 'react'
import FilmDisplayed from './elements/FilmDisplayed'

export default function FilmList({ films }) {
  const filmIds = new Set()
  const renderedFilms = films.map((film) => {
    if (filmIds.has(film.id)) return
    filmIds.add(film.id)
    return (
      <FilmDisplayed
        key={film.id}
        film={film}
      />
    )
  })

  return <>{renderedFilms}</>
}
