import React, { useContext, useEffect } from 'react'
import { FaCircleXmark } from 'react-icons/fa6'
import Genres from './Genres'
import Services from './Services'
import YearsSlider from './YearsSlider'
import { FiltersContext } from '../../../pages/Find'
import { RiAliensFill, RiNetflixFill, RiTicket2Fill } from 'react-icons/ri'
import usePopupHook from '../../../hooks/popupHook'

export default function FiltersModal({ onClose }) {
  const { handleSubmit, setFilters, filters, setYearInput } =
    useContext(FiltersContext)
  const { setPopup } = usePopupHook()

  const handleClick = (e) => {
    const count = Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value)) return count + value.length
      else return count + 1
    }, 0)
    if (count === 0) {
      setPopup('Must select one filter.')
      return
    }
    onClose()
    handleSubmit(e, 'filters')
  }

  const handleClear = (e) => {
    e.preventDefault()
    const checks = document.querySelectorAll('.checkbox-input')
    checks.forEach((check) => {
      check.checked = false
    })
    setFilters({
      genres: [],
      services: [],
      years: [1930, 2023],
    })

    handleLowerInput(1930, 2023)
    handleUpperInput(1930, 2023)
  }

  const handleLowerInput = (lower, upper) => {
    setYearInput({ lower, upper })
  }

  const handleUpperInput = (lower, upper) => {
    setYearInput({ lower, upper })
  }

  return (
    <>
      <div className="filters-header">
        <h5 className="filters-title">Filters</h5>
        <button onClick={onClose}>
          <FaCircleXmark className="fa-circle-xmark" />
        </button>
      </div>
      <div className="filter-body">
        <div>
          <h6 className="filter-type-header">
            <RiAliensFill style={{ color: 'var(--primary-alt' }} />
            Genres
          </h6>
          <ul className="checkbox-container">{<Genres />}</ul>
        </div>
        <div>
          <h6 className="filter-type-header">
            <RiNetflixFill style={{ color: 'red' }} />
            Streaming Services
          </h6>
          <ul className="checkbox-container">{<Services />}</ul>
        </div>
        <div>
          <h6
            className="filter-type-header"
            id="years-header"
          >
            <RiTicket2Fill style={{ color: 'gold' }} />
            Release Year
          </h6>
          <div className="years-container">
            <YearsSlider
              handleUpperInput={handleUpperInput}
              handleLowerInput={handleLowerInput}
            />
          </div>
        </div>
      </div>
      <div className="apply-clear-container">
        <button
          className=" cancel-btn square-btn"
          onClick={handleClear}
        >
          Clear All
        </button>
        <button
          className=" submit-btn square-btn"
          onClick={handleClick}
          style={{ marginLeft: 'auto' }}
        >
          Apply Filters
        </button>
      </div>
    </>
  )
}
