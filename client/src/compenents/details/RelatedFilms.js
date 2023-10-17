import SwitchableHeader from '../SwitchableHeader'
import { Tooltip } from '@chakra-ui/react'
import useWindowSizeHook from '../../hooks/widowSizeHook'
import { Link } from 'react-router-dom'

export default function RelatedFilms({
  director,
  collection,
  recommended,
  directorFilms,
}) {
  const { width } = useWindowSizeHook()

  let headers = []
  let content = []

  if (director.length !== 0 && (width > 600 || !collection)) {
    headers.push(`${director[0].name}`)
    content.push(createFilmsContainer(directorFilms))
  }

  if (collection) {
    headers.push(`${collection.name}`)
    content.push(createFilmsContainer(collection.films))
  }

  if (recommended.length > 0) {
    headers.push('Recommended')
    content.push(createFilmsContainer(recommended))
  }

  function createFilmsContainer(films) {
    const renderedFilms = films.map((film) => {
      return (
        <Tooltip
          key={film.id}
          hasArrow
          placement="top"
          className="tooltip"
          bg="var(--secondary-dark)"
          label={`${film.title} ${film.year && `(${film.year})`}`}
        >
          <a
            className="link-no-text"
            href={`/film/${film.id}`}
          >
            {film.poster.includes('null') ? (
              <div className="similar no-poster">{film.title}</div>
            ) : (
              <img
                src={film.poster}
                alt={`${film.title} poster`}
                className="similar poster"
              />
            )}
          </a>
        </Tooltip>
      )
    })

    return (
      <div className="sliding-container similar-container">{renderedFilms}</div>
    )
  }

  return (
    <SwitchableHeader
      headers={headers}
      content={content}
    />
  )
}
