import React, { useEffect, useState } from 'react'
import myFilms from '../../data/my-films'
import axios from 'axios'
import netflixLogo from '../../images/netflix.png'
import maxLogo from '../../images/maxLogo.webp'
import huluLogo from '../../images/huluLogo.png'
import DefaultFilmsSkeleton from '../skeletons/DefaultFilmsSkeleton'
import { Tooltip } from '@chakra-ui/react'
import addFilms from '../../functions/add-films'
import { Link } from 'react-router-dom'
import useWindowSizeHook from '../../hooks/widowSizeHook'

export default function DefaultFilms() {
  const [netflixFilms, setNetflixFilms] = useState([])
  const [theatreFilms, setTheatreFilms] = useState([])
  const [maxFilms, setMaxFilms] = useState([])
  const [eraFilms, setEraFilms] = useState({ films: [], decade: null })
  const [huluFilms, setHuluFilms] = useState([])
  const [defaultLoading, setDefaultLoading] = useState(true)
  const { width } = useWindowSizeHook()

  const skeleton = <DefaultFilmsSkeleton count={8} />

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getNetflixFilms = async () => {
    let arr = []
    const res = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&sort_by=vote_count.desc&with_watch_providers=8&watch_region=US`
    )
    const data = res.data.results
    addFilms(data, arr, 8)

    setNetflixFilms(arr)
  }

  const getTheatreFilms = async () => {
    let arr = []
    const current = new Date()
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 2)

    const formattedCurrent = formatDate(current)
    const formattedMonthAgo = formatDate(lastMonth)

    const res = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&with_release_type=3&region=US&primary_release_date.lte=${formattedCurrent}&primary_release_date.gte=${formattedMonthAgo}&page=1&vote_count.gte=25`
    )
    const data = res.data.results
    addFilms(data, arr, 8)

    setTheatreFilms(arr)
  }

  const getMaxFilms = async () => {
    let arr = []
    const res = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&sort_by=vote_count.desc&with_watch_providers=1899&watch_region=US`
    )
    const data = res.data.results
    addFilms(data, arr, 8)
    setMaxFilms(arr)
  }

  const getEraFilms = async () => {
    let arr = []
    const decades = ['1950', '1960', '1970', '1980', '1990']
    const selectedDecade = decades[Math.floor(Math.random() * 4)]
    const res = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&region=US&primary_release_date.lte=${selectedDecade}-12-31&primary_release_date.gte=${selectedDecade}-01-01&sort_by=vote_count.desc`
    )
    const data = res.data.results
    addFilms(data, arr, 8)
    setEraFilms({ films: arr, decade: selectedDecade })
  }

  const getHuluFilms = async () => {
    let arr = []
    const res = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&sort_by=vote_count.desc&with_watch_providers=15&watch_region=US`
    )
    const data = res.data.results
    addFilms(data, arr, 8)
    setHuluFilms(arr)
  }

  const fetchFilms = async () => {
    await getNetflixFilms()
    await getTheatreFilms()
    await getMaxFilms()
    await getEraFilms()
    await getHuluFilms()
  }

  useEffect(() => {
    fetchFilms()
  }, [])

  const handleLoad = () => {
    if (defaultLoading) setDefaultLoading(false)
  }

  const renderPoster = (film, type, i) => {
    return (
      <Tooltip
        hasArrow
        placement="top"
        className="tooltip"
        bg="var(--secondary-dark)"
        key={film.id}
        label={`${film.title} (${film.year})`}
      >
        <li>
          <Link
            to={`/film/${film.id}`}
            className="link-no-text"
          >
            <img
              className={`poster ${width < 815 && 'default'} `}
              src={film.poster}
              onLoad={type && i === 7 ? () => handleLoad() : () => {}}
            />
          </Link>
        </li>
      </Tooltip>
    )
  }

  const renderFilms = (films, hulu) => {
    return (
      <>
        <div
          className={`${
            width < 815
              ? ' sliding-container no-track similar-container'
              : 'default-row-container'
          }`}
          hidden={!defaultLoading}
        >
          {skeleton}
        </div>
        <li
          className={`${
            width < 815
              ? ' sliding-container no-track similar-container'
              : 'default-row-container'
          }`}
          hidden={defaultLoading}
        >
          {films.map((film, i) => {
            return renderPoster(film, hulu, i)
          })}
        </li>
      </>
    )
  }

  const staffFilms = (
    <>
      <h5 className="section-header">Staff Selections</h5>
      {renderFilms(myFilms)}
    </>
  )

  const Netflix = (
    <>
      <h5 className="section-header">
        <img
          src={netflixLogo}
          style={{
            height: '1.05rem',
            marginLeft: '0.5rem',
            marginRight: '0.5rem',
            marginBottom: '0.05rem',
          }}
        />
        Biggest Hits
        <Link
          to={'/films?services=8'}
          className="alt more-link link-text"
        >
          More
        </Link>
      </h5>
      {renderFilms(netflixFilms)}
    </>
  )

  const theatres = (
    <>
      <h5 className="section-header">New releases in theatres</h5>
      {renderFilms(theatreFilms)}
    </>
  )

  const max = (
    <>
      <h5 className="section-header">
        Blockbusters on
        <img
          src={maxLogo}
          style={{
            height: '0.95rem',
            marginLeft: '0.5rem',
            marginBottom: '0.1rem',
          }}
        />
        <Link
          to={'/films?services=1899'}
          className="alt more-link link-text"
        >
          More
        </Link>
      </h5>
      {renderFilms(maxFilms)}
    </>
  )

  const era = (
    <>
      <h5 className="section-header">
        {eraFilms.decade}'s classics
        <Link
          to={`/films?years=${eraFilms.decade}%2B${eraFilms.decade}`}
          className="alt more-link link-text"
        >
          More
        </Link>
      </h5>
      {renderFilms(eraFilms.films)}
    </>
  )

  const hulu = (
    <>
      <h5 className="section-header">
        <img
          src={huluLogo}
          style={{
            height: '1rem',
            marginRight: '0.5rem',
            marginBottom: '0.25rem',
          }}
        />{' '}
        Favorites
        <Link
          to={'/films?services=15'}
          className="alt more-link link-text"
        >
          More
        </Link>
      </h5>
      {renderFilms(huluFilms, true)}
    </>
  )

  const content = (
    <section className="default-films-container">
      <div>{staffFilms}</div>
      <div>{Netflix}</div>
      <div>{theatres}</div>
      <div>{max}</div>
      <div>{era}</div>
      <div>{hulu}</div>
    </section>
  )

  return content
}

// use skeleton for loading
