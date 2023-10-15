import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import '../styles/find.css'

import Filters from '../compenents/find/Filters'
import deconstructParams from '../functions/deconstruct-params'
import getFilteredData from '../functions/getFilteredData'
import getSearchedData from '../functions/getSearchedData'
import createParams from '../functions/create-params'
import ResultsSection from '../compenents/find/ResultsSection'
import Sort from '../compenents/find/Sort'
import sortFilms from '../functions/sort-films'
import DefaultFilms from '../compenents/find/DefaultFilms'
import TextInput from '../compenents/TextInput'
import ListWrapper from '../compenents/lists/ListWrapper'
import useWindowSizeHook from '../hooks/widowSizeHook'

export const FiltersContext = React.createContext()

function Find() {
  const [films, setFilms] = useState([])
  const [isLandingPage, setIsLandingPage] = useState(true)
  const [activeFilters, setActiveFilters] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams({})
  const [activeFilterCount, setActiveFilterCount] = useState(null)
  const [yearInput, setYearInput] = useState({ lower: 1930, upper: 2023 })
  const [sort, setSort] = useState({
    label: 'Popularity',
    value: 'popularity',
    desc: true,
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    years: [],
    genres: [],
    services: [],
    runtime: [],
  })

  const location = useLocation()
  const results = useRef()
  const { width } = useWindowSizeHook()

  const handleSubmit = (e, type) => {
    e.preventDefault()
    if (type === 'search') {
      setSearchParams(createParams(null, searchQuery))
    } else setSearchParams(createParams(filters, null))
    setSearchQuery('')
  }

  const handleSort = (method) => {
    setFilms(sortFilms(films, method))
  }

  useEffect(() => {
    if (location.search) setIsLandingPage(false)
    else {
      setIsLandingPage(true)
      return
    }
    const params = new URLSearchParams(window.location.search)
    if (params.size === 0) return
    const activeFilters = deconstructParams(params)
    setActiveFilters(activeFilters)
    setFilters(activeFilters)
    const { searchQuery, genres, services, years, runtime } = activeFilters
    const fetchData = async () => {
      setLoading(true)
      if (genres || services || years || runtime) {
        const { data } = await getFilteredData(
          genres,
          services,
          years,
          runtime,
          sort
        )
        setFilms(data)
      } else {
        const { data } = await getSearchedData(searchQuery, sort)
        setFilms(data)
      }
      setLoading(false)
    }
    fetchData()
  }, [searchParams])

  let values = {
    filters,
    setFilters,
    handleSubmit,
    activeFilters,
    activeFilterCount,
    setActiveFilterCount,
    yearInput,
    setYearInput,
    searchQuery,
    setSearchQuery,
  }

  const handleFilmSelection = (id, navigate) => {
    navigate(`/film/${id}`)
  }

  return (
    <FiltersContext.Provider value={values}>
      <form
        onSubmit={(e) => handleSubmit(e, 'search')}
        autoComplete="off"
      >
        <div
          className="main-container"
          style={width <= 1175 ? { padding: '0 1.5rem' } : { padding: 0 }}
        >
          <div
            className="query-container"
            style={
              width <= 600
                ? { marginBottom: '1rem', marginLeft: '0', marginTop: '2rem' }
                : {}
            }
          >
            <div
              style={
                width > 600
                  ? { width: '22.5rem', height: '100%' }
                  : { width: '100%', height: '100%' }
              }
            >
              <TextInput
                shadow
                search={true}
                placeholder={'Find a film...'}
                handleFilmSelection={handleFilmSelection}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
              />
            </div>

            {width > 600 && (
              <div className="sort-filter-container">
                <Filters />
              </div>
            )}

            {width <= 600 && isLandingPage && <Filters />}
          </div>
          {width <= 600 && !isLandingPage && (
            <div
              className="sort-filter-container"
              style={{
                marginBottom: '1rem',
                marginRight: 'auto',
                marginLeft: '0',
              }}
            >
              {!isLandingPage && (
                <Sort
                  sort={sort}
                  setSort={setSort}
                  handleSort={handleSort}
                />
              )}

              <Filters />
            </div>
          )}

          {isLandingPage ? (
            <DefaultFilms />
          ) : (
            <div ref={results}>
              <ResultsSection
                results={films.length}
                handleSubmit={handleSubmit}
                loading={loading}
                active={activeFilterCount}
              />
              <ListWrapper
                films
                list={films}
                maxDisplayed={12}
                topContainer={results}
              />
            </div>
          )}
        </div>
      </form>
    </FiltersContext.Provider>
  )
}

export default Find
