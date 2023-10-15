import { useContext, useEffect } from 'react'
import { genres } from '../../../data/filters-data'
import { FiltersContext } from '../../../pages/Find'

export default function Genres() {
  const { filters, setFilters } = useContext(FiltersContext)

  const handleChange = (e) => {
    const genreID = parseInt(e.target.value)
    const isChecked = e.target.checked

    setFilters((previousFilters) => {
      if (isChecked) {
        if (previousFilters.genres) {
          return {
            ...previousFilters,
            genres: [...previousFilters.genres, genreID],
          }
        } else
          return {
            ...previousFilters,
            genres: [genreID],
          }
      } else if (previousFilters.genres) {
        return {
          ...previousFilters,
          genres: previousFilters.genres.filter(
            (id) => id !== parseInt(genreID)
          ),
        }
      } else {
        return {
          ...previousFilters,
          genres: [],
        }
      }
    })
  }

  const renderedGenres = genres.map((genre) => {
    return (
      <li
        key={genre.id}
        style={{ display: 'inline' }}
      >
        <input
          type="checkbox"
          name="genres[]"
          value={genre.id}
          id={genre.name}
          className="genre-input checkbox-input"
          onChange={handleChange}
          hidden
        />
        <label
          className="checkbox-label genre-label"
          htmlFor={genre.name}
        >
          {genre.name}
        </label>
      </li>
    )
  })

  return <>{renderedGenres}</>
}
