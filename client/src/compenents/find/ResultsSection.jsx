import { useEffect, useContext, useState } from 'react'
import { genres, services } from '../../data/filters-data'
import { FaCircleXmark } from 'react-icons/fa6'
import { FiltersContext } from '../../pages/FindPage'
import FilmsSkeleton from '../skeletons/FilmsSkeleton'
import Skeleton from 'react-loading-skeleton'
import useWindowSizeHook from '../../hooks/widowSizeHook'

export default function ResultsSection({
  results,
  handleSubmit,
  loading,
  active,
}) {
  const [capturedEvent, setCapturedEvent] = useState(null)
  const { width } = useWindowSizeHook()

  const displayLoading = (
    <>
      <Skeleton
        height={'1.25rem'}
        style={{ margin: '1rem 0 1rem 0', width: '50%' }}
      />
      <FilmsSkeleton count={6} />
    </>
  )
  const {
    activeFilterCount,
    setActiveFilterCount,
    activeFilters,
    filters,
    setFilters,
  } = useContext(FiltersContext)

  useEffect(() => {
    if (capturedEvent) {
      handleSubmit(capturedEvent)
    }
    setCapturedEvent(null)

    const num = Object.values(activeFilters).reduce((count, value) => {
      if (Array.isArray(value)) return count + value.length
      else return count + 1
    }, 0)
    setActiveFilterCount(num)
  }, [filters])

  const handleGenreClick = (e, genre) => {
    e.preventDefault()
    if (activeFilterCount === 1) return
    setCapturedEvent(e)
    setFilters((previousFilters) => {
      if (Array.isArray(previousFilters.genres)) {
        return {
          ...previousFilters,
          genres: previousFilters.genres.filter((id) => id !== genre),
        }
      } else {
        return {
          ...previousFilters,
          genres: null,
        }
      }
    })
  }

  const handleServiceClick = (e, service) => {
    e.preventDefault()
    if (activeFilterCount === 1) return
    setCapturedEvent(e)
    setFilters((previousFilters) => {
      if (Array.isArray(previousFilters.services)) {
        return {
          ...previousFilters,
          services: previousFilters.services.filter((id) => id !== service),
        }
      } else {
        return {
          ...previousFilters,
          services: null,
        }
      }
    })
  }

  const handleYearClick = (e, years) => {
    e.preventDefault()
    if (activeFilterCount === 1) return
    setCapturedEvent(e)
    setFilters((previousFilters) => {
      return {
        ...previousFilters,
        years: [],
      }
    })
  }

  let renderedGenres
  if (Array.isArray(activeFilters.genres)) {
    renderedGenres = activeFilters.genres.map((genre) => {
      const text = genres.find((obj) => obj.id === genre)
      if (text)
        return (
          <span
            className="displayed-filter displayed-genre"
            key={genre.id}
          >
            {text.name}
            <button
              className="icon-btn"
              onClick={(e) => handleGenreClick(e, genre)}
            >
              <FaCircleXmark />
            </button>
          </span>
        )
      else return
    })
  }

  let renderedServices
  if (Array.isArray(activeFilters.services)) {
    renderedServices = activeFilters.services.map((service) => {
      const text = services.find((obj) => obj.id === service)
      if (text)
        return (
          <span
            className="displayed-filter displayed-service"
            key={service}
          >
            {text.name}
            <button
              className="icon-btn"
              onClick={(e) => handleServiceClick(e, service)}
            >
              <FaCircleXmark />
            </button>
          </span>
        )
      else return
    })
  }

  let renderedYears
  if (activeFilters.years)
    renderedYears = (
      <span className="displayed-filter displayed-years">
        {`${activeFilters.years[0]} - ${activeFilters.years[1]}`}
        <button
          className="icon-btn"
          onClick={(e) => handleYearClick(e, activeFilters.years)}
        >
          <FaCircleXmark />
        </button>
      </span>
    )

  let renderedSearch
  if (activeFilters.searchQuery)
    renderedSearch = (
      <span className="displayed-filter displayed-search">
        {`'${activeFilters.searchQuery}'`}
      </span>
    )

  const displayResults = (
    <div
      className="results-container"
      hidden={!results && !active}
    >
      <div className="displayed-filters-container">
        <span className="results-text">
          {results ? `${results} results` : active && `Zero results found`}
        </span>
        {width > 600 && (
          <>
            {renderedSearch} {renderedGenres} {renderedServices}
            {renderedYears}
          </>
        )}
      </div>
    </div>
  )

  return loading ? <>{displayLoading} </> : <>{displayResults}</>
}
