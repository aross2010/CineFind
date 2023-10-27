import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import addFilms from '../../functions/add-films'
import { PiMagnifyingGlassBold } from 'react-icons/pi'
import { ThreeDots } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/searchbar.css'

export default function TextInput({
  placeholder,
  search,
  moreInfo,
  handleFilmSelection,
  setSearchQuery,
  searchQuery,
  disabled,
  register,
  onChange,
  data,
  shadow,
}) {
  const [textInput, setTextInput] = useState('')
  const [showDropDown, setShowDropDown] = useState(false)
  const [dropDownOptions, setDropDownOptions] = useState(null)
  const [selectedFilmIndex, setSelectedFilmIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const dropDownMenu = useRef()
  const input = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    document.addEventListener('keydown', toggleFilms)
    document.addEventListener('click', toggleDropDown)

    if (searchQuery === '') setDropDownOptions(null)

    return () => {
      document.removeEventListener('keydown', toggleFilms)
      document.addEventListener('click', toggleDropDown)
    }
  }) // no empty array because need to keep event listener after first re-render

  const handleSelection = (film) => {
    if (!register) setSelectedFilmIndex(-1)

    setShowDropDown(false)
    if (!register) setTextInput('')
    else setTextInput(`${dropDownOptions[selectedFilmIndex].title}`)
    setDropDownOptions(null)
    if (moreInfo) handleFilmSelection(film)
    else handleFilmSelection(film.id, film.backdrop)
  }

  const toggleDropDown = (e) => {
    if (
      dropDownMenu &&
      dropDownMenu.current &&
      !dropDownMenu.current.contains(e.target) &&
      !input.current.contains(e.target)
    ) {
      setShowDropDown(false)
      if (search) setSelectedFilmIndex(-1)
      else setSelectedFilmIndex(0)
    }
  }

  const toggleFilms = (e) => {
    if (e.key === 'ArrowDown' && dropDownOptions) {
      e.preventDefault()
      if (selectedFilmIndex < dropDownOptions.length - 1)
        setSelectedFilmIndex(selectedFilmIndex + 1)
      else if (selectedFilmIndex === dropDownOptions.length - 1)
        setSelectedFilmIndex(0)
    } else if (e.key === 'ArrowUp' && dropDownOptions) {
      e.preventDefault()
      if (selectedFilmIndex > 0) setSelectedFilmIndex(selectedFilmIndex - 1)
      else if (selectedFilmIndex === 0)
        setSelectedFilmIndex(dropDownOptions.length - 1)
    }

    if (e.key === 'Enter' && selectedFilmIndex !== -1 && showDropDown) {
      if (!search) {
        e.preventDefault()
        handleSelection(dropDownOptions[selectedFilmIndex])
      } else if (search)
        handleFilmSelection(dropDownOptions[selectedFilmIndex].id, navigate)
    }
  }

  const handleChange = async (e) => {
    if (search) {
      setSearchQuery(e.target.value)
      setSelectedFilmIndex(-1)
    } else {
      setTextInput(e.target.value)
      setSelectedFilmIndex(0)
    }
    const input = e.target.value
    if (input.length >= 2) {
      setIsLoading(true)
      const films = await fetchFilms(input)
      if (films.length >= 1) {
        setDropDownOptions(films)
        setShowDropDown(true)
      } else {
        setDropDownOptions(null)
        setShowDropDown(false)
      }
    } else {
      setDropDownOptions(null)
      setShowDropDown(false)
    }
    setIsLoading(false)
    if (register) onChange(e)
  }

  const fetchFilms = async (input) => {
    let arr = []
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${input}`
    )
    const data = res.data.results
    addFilms(data, arr, 10)
    return arr
  }

  const renderedOptions =
    dropDownOptions &&
    dropDownOptions.map((film, i) => {
      const content = (
        <div
          onMouseEnter={() => setSelectedFilmIndex(i)}
          className={
            i === selectedFilmIndex
              ? 'text-input-dropdown-option selected'
              : 'text-input-dropdown-option'
          }
          onClick={() => handleSelection(film)}
          key={film.id}
        >
          {film.title} {film.year && `(${film.year})`}
        </div>
      )

      return search ? (
        <Link
          key={film.id}
          to={`/film/${film.id}`}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {content}
        </Link>
      ) : (
        content
      )
    })

  const revealDropDown = () => {
    setShowDropDown(true)
  }

  return (
    <div
      className={`input-container-text ${
        register && data.film.isValid === false && 'invalid'
      }`}
      style={shadow ? { boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)' } : {}}
    >
      {!register && (
        <button
          type="submit"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'inherit',
            marginRight: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            padding: '0',
          }}
          disabled={!search || searchQuery.length < 2}
        >
          <PiMagnifyingGlassBold />
        </button>
      )}

      <input
        type="text"
        className="text-input"
        onChange={handleChange}
        placeholder={placeholder}
        onFocus={dropDownOptions && revealDropDown}
        ref={input}
        value={search ? searchQuery : textInput}
        disabled={disabled}
      />
      {isLoading && (
        <ThreeDots
          color="#76F88E"
          height={18}
          width={18}
        />
      )}

      {showDropDown && (
        <div
          ref={dropDownMenu}
          className="text-input-dropdown-menu-container"
        >
          <div
            className="text-input-dropdown-menu"
            onMouseLeave={() => setSelectedFilmIndex(-1)}
          >
            {renderedOptions}
          </div>
        </div>
      )}
    </div>
  )
}
