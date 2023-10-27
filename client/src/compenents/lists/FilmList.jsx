import FilmDisplayed from './elements/FilmDisplayed'

export default function FilmList({ films }) {
  const filmIds = new Set()
  const renderedFilms = films.map((film) => {
    if (filmIds.has(film.id)) return
    filmIds.add(film.id)
    return (
      <li key={film.id}>
        <FilmDisplayed film={film} />
      </li>
    )
  })

  return <ul>{renderedFilms}</ul>
}
