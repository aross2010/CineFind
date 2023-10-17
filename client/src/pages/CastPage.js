import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import '../styles/cast.css'
import Dropdown from '../compenents/Dropdown'
import { PiCaretRightBold, PiCaretLeftBold } from 'react-icons/pi'
import { BsPersonFill } from 'react-icons/bs'
import getAge from '../functions/get-age'
import useWindowSizeHook from '../hooks/widowSizeHook'
import LoadingSpinner from '../compenents/LoadingSpinner'
import { Tooltip } from '@chakra-ui/react'

export default function CastPage() {
  const { id } = useParams()
  const { width } = useWindowSizeHook()
  const [person, setPerson] = useState(null)
  const [isBioExpanded, setIsBioExpanded] = useState(false)
  const [displayedJob, setDisplayedJob] = useState(null)
  const [dropDownOptions, setDropDownOptions] = useState(null)

  useEffect(() => {
    const fetchData = async (id) => {
      const bio = await getBio(id)
      const films = await getFilms(id)
      setPerson({ bio, films })
    }
    fetchData(id)
  }, [id])

  let bioParagraphs = []

  async function getBio(id) {
    const res = await axios.get(`
    https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
    const data = res.data

    bioParagraphs = data.biography.split('\n\n')

    const {
      name,
      birthday,
      also_known_as,
      deathday,
      place_of_birth,
      imdb_id,
      gender,
    } = data

    return {
      name,
      picture: `https://image.tmdb.org/t/p/original/${data.profile_path}`,
      bio: bioParagraphs,
      gender,
      also_known_as,
      birthday,
      deathday,
      place_of_birth,
      imdb_id,
    }
  }

  async function getFilms(id) {
    let obj = {
      crewData: {},
      castData: [],
    }
    const res = await axios.get(
      `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
    )
    const crew = res.data.crew
    const cast = res.data.cast

    let dropDownOptions = []

    crew.forEach((film) => {
      const { job, ...rest } = film

      if (!obj.crewData[job]) obj.crewData[job] = [rest]
      else obj.crewData[job].push(rest)
    })

    for (const job in obj.crewData) {
      if (job === 'Thanks') continue
      dropDownOptions.push({
        label: job,
        value: job,
        num: obj.crewData[job].length,
      })
      if (obj.crewData.hasOwnProperty(job)) {
        obj.crewData[job].sort((a, b) => b.popularity - a.popularity)
      }
    }

    obj.castData = cast.sort((a, b) => b.popularity - a.popularity)

    if (cast.length >= 1) {
      dropDownOptions.push({ label: 'Actor', value: 'Actor', num: cast.length })
    }

    let max = { label: '', num: 0 }
    dropDownOptions.forEach((option) => {
      if (option.num > max.num) {
        max.label = option.label
        max.num = option.num
      }
    })

    dropDownOptions.sort((a, b) => b.num - a.num)

    setDisplayedJob(max)
    setDropDownOptions(dropDownOptions)

    return obj
  }

  const renderedActorFilms =
    person &&
    person.films.castData.map((film) => {
      return (
        <Tooltip
          key={film.id}
          hasArrow
          placement="top"
          className="tooltip"
          bg="var(--secondary-dark)"
          label={`${film.title} ${
            film.release_date && `(${film.release_date.slice(0, 4)})`
          }`}
        >
          {film.poster_path !== null ? (
            <Link
              to={`/film/${film.id}`}
              key={film.title}
            >
              <img
                className="poster"
                src={`https://image.tmdb.org/t/p/original/${film.poster_path}`}
              />
            </Link>
          ) : (
            <Link
              to={`/film/${film.id}`}
              className="no-poster"
            >
              {film.title}
            </Link>
          )}
        </Tooltip>
      )
    })

  const renderedCrewFilms =
    person &&
    person.films.crewData &&
    displayedJob.label !== null &&
    displayedJob.label !== 'Actor' &&
    person.films.crewData[displayedJob.label].map((film) => {
      return (
        <Tooltip
          key={film.id}
          hasArrow
          placement="top"
          className="tooltip"
          bg="var(--secondary-dark)"
          label={`${film.title} ${
            film.release_date && `(${film.release_date.slice(0, 4)})`
          }`}
        >
          <Link
            to={`/film/${film.id}`}
            className={film.poster_path !== null ? 'no-poster' : ''}
          >
            {film.poster_path !== null ? (
              film.title
            ) : (
              <img
                className="poster"
                src={`https://image.tmdb.org/t/p/original/${film.poster_path}`}
              />
            )}
          </Link>
        </Tooltip>
      )
    })

  const renderedBio =
    person &&
    person.bio.bio.map((p, i) => {
      if (!isBioExpanded && i >= 1) return
      return (
        <p
          className="bio-paragraph"
          key={i}
        >
          {p}
        </p>
      )
    })

  const biography = (
    <>
      {' '}
      <div className="bio-wrapper">
        {renderedBio}
        {person && person.bio.bio.length > 2 && (
          <span
            className={`read-more  ${isBioExpanded && 'less'}`}
            onClick={() => setIsBioExpanded(!isBioExpanded)}
          >
            {isBioExpanded ? 'Read Less' : 'Read More'}
            <PiCaretRightBold />
          </span>
        )}
      </div>
    </>
  )

  const additionalNames =
    person &&
    person.bio.also_known_as.map((name, i) => {
      if (i >= 3) return
      return (
        <span
          style={{ display: 'block' }}
          key={i}
        >
          {name}
        </span>
      )
    })

  const convertToDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  const renderedInfo = person && (
    <>
      <div className="additional-info-container">
        {person.bio.birthday && (
          <div>
            <h5 className="info-header">Birthday</h5>
            <span className="info-text">
              {convertToDate(new Date(person.bio.birthday))} (
              {getAge(person.bio.birthday)} years old)
            </span>
          </div>
        )}
        {person.bio.place_of_birth && (
          <div>
            <h5 className="info-header">Birthplace</h5>
            <span className="info-text">{person.bio.place_of_birth}</span>
          </div>
        )}
        {person.bio.gender > 0 && (
          <div>
            <h5 className="info-header">Gender</h5>
            <span className="info-text">
              {person.bio.gender == 1
                ? 'Female'
                : person.bio.gender === 2
                ? 'Male'
                : 'Non-Binary'}
            </span>
          </div>
        )}
        {person.bio.also_known_as.length >= 1 && (
          <div>
            <h5 className="info-header">Also Known As</h5>
            <span className="info-text">{additionalNames}</span>
          </div>
        )}
      </div>
    </>
  )

  const lrg = person && (
    <>
      <div className=" profile-col stick">
        {person.bio.picture.includes('null') ? (
          <div className="person-no-picture">
            <BsPersonFill style={{ fontSize: '10rem' }} />
          </div>
        ) : (
          <img
            className="person-picture"
            alt={`${person.bio.name} portrait`}
            src={person.bio.picture}
          />
        )}

        {renderedInfo}
      </div>
      <div className="bio-col">
        <h2 className="person-name">{person.bio.name}</h2>
        {person.bio.bio[0] && (
          <>
            <h5 className="bio-header">Biography</h5> {biography}
          </>
        )}
        <h5 className="bio-header">Filmography</h5>
        <div className="filmography-header">
          <h6 className="job-title">
            {`${displayedJob.label} - ${displayedJob.num}`}
            {displayedJob.num > 1 ? ' Films' : ' Film'}
          </h6>{' '}
          {dropDownOptions.length > 1 && (
            <Dropdown
              options={dropDownOptions}
              handleSelect={(job) => setDisplayedJob(job)}
              selected={{
                label: displayedJob.label,
                value: displayedJob.label,
              }}
              header={'Job Performed'}
              headerDisplayed={true}
              numbers={true}
            />
          )}
        </div>
        <div className="person-films-container">
          {displayedJob.label === 'Actor'
            ? renderedActorFilms
            : renderedCrewFilms}
        </div>
      </div>
    </>
  )

  const sml = person && (
    <>
      <div style={{ display: 'flex' }}>
        {person.bio.picture.includes('null') ? (
          <div className="person-no-picture">
            <BsPersonFill style={{ fontSize: '10rem' }} />
          </div>
        ) : (
          <div style={{ width: '8rem' }}>
            <img
              className="person-picture light-shadow"
              alt={`${person.bio.name} portrait`}
              src={person.bio.picture}
            />
          </div>
        )}
        <div
          style={{
            paddingLeft: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h2
            className="person-name"
            style={{
              height: 'min-content',
              marginBottom: '0',
              fontWeight: '700',
            }}
          >
            {person.bio.name}
          </h2>
          {person.bio.birthday && (
            <div>
              <h5 className="info-header">Birthday</h5>
              <span className="info-text">
                {convertToDate(new Date(person.bio.birthday))} (
                {getAge(person.bio.birthday)} years old)
              </span>
            </div>
          )}
          {person.bio.place_of_birth && (
            <div>
              <h5 className="info-header">Birthplace</h5>
              <span className="info-text">{person.bio.place_of_birth}</span>
            </div>
          )}
        </div>
      </div>

      {person.bio.bio[0] && biography}
      <h5
        className="bio-header"
        style={{ width: '100%' }}
      >
        Filmography
      </h5>
      <div
        className="filmography-header"
        style={{ width: '100%' }}
      >
        <h6 className="job-title">
          {`${displayedJob.label} - ${displayedJob.num}`}
          {displayedJob.num > 1 ? ' Films' : ' Film'}
        </h6>{' '}
        {dropDownOptions.length > 1 && (
          <div style={{ height: 'auto' }}>
            <Dropdown
              options={dropDownOptions}
              handleSelect={(job) => setDisplayedJob(job)}
              selected={{
                label: displayedJob.label,
                value: displayedJob.label,
              }}
              header={'Job Performed'}
              headerDisplayed={true}
              numbers={true}
            />
          </div>
        )}
      </div>
      <div className="person-films-container">
        {displayedJob.label === 'Actor'
          ? renderedActorFilms
          : renderedCrewFilms}
      </div>
    </>
  )

  return (
    <div
      className="cast-page-container base-container"
      style={width <= 1175 ? { padding: '0 1rem' } : {}}
    >
      {person ? width <= 900 ? sml : lrg : <LoadingSpinner />}
    </div>
  )
}
