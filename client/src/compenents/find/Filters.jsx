import React, { useContext, useEffect, useState } from 'react'
import Modal from '../multipurpose/Modal'
import FiltersModal from '../find/filters/FiltersModal'
import { PiSlidersHorizontalLight } from 'react-icons/pi'
import { FiltersContext } from '../../pages/FindPage'
import isActiveFilter from '../../functions/is-active-filter'

function Filters() {
  const [showModal, setShowModal] = useState(false)
  const { setFilters, activeFilters, setYearInput } = useContext(FiltersContext)

  useEffect(() => {
    const checks = document.querySelectorAll('.checkbox-input')
    checks.forEach((check) => {
      isActiveFilter(check, activeFilters)
        ? (check.checked = true)
        : (check.checked = false)
    })
    if (activeFilters.years) {
      setFilters((previousFilters) => {
        return {
          ...previousFilters,
          years: [activeFilters.years[0], activeFilters.years[1]],
        }
      })
      setYearInput({
        lower: activeFilters.years[0],
        upper: activeFilters.years[1],
      })
    } else {
      setFilters((previousFilters) => {
        return {
          ...previousFilters,
          years: [1930, 2023],
        }
      })
      setYearInput({ lower: 1930, upper: 2023 })
    }
  }, [activeFilters])

  const handleClick = (e) => {
    e.preventDefault()
    setShowModal(true)
  }

  const FILTER_MODAL_STYLES = {
    width: '650px',
    display: 'flex',
    flexDirection: 'column',
    transition: '200ms ease-in-out',
    padding: '0.5rem',
  }

  return (
    <>
      <div className="filters-container">
        <button
          className="filters-btn"
          onClick={handleClick}
        >
          <PiSlidersHorizontalLight />
          Filters
        </button>
      </div>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        style={FILTER_MODAL_STYLES}
      >
        <FiltersModal onClose={() => setShowModal(false)} />
      </Modal>
    </>
  )
}

export default Filters
