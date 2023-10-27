import { useContext, useEffect, useState } from 'react'
import RangeSlider from 'react-range-slider-input'
import 'react-range-slider-input/dist/style.css'
import { FiltersContext } from '../../../pages/FindPage'
import '../../../styles/year-slider.css'

export default function YearSlider({ handleLowerInput, handleUpperInput }) {
  const { filters, setFilters, yearInput, setYearInput } =
    useContext(FiltersContext)
  const [resetYears, setResetYears] = useState(false)

  useEffect(() => {
    if (
      filters.years &&
      filters.years[0] === 1930 &&
      filters.years[1] === 2023
    ) {
      setResetYears(true)
    }
  }, [filters])

  useEffect(() => {
    if (resetYears) {
      setFilters((previousFilters) => {
        return {
          ...previousFilters,
          years: [],
        }
      })
    }
    setResetYears(false)
  }, [resetYears])

  const handleChange = (e) => {
    setFilters((previousFilters) => {
      return {
        ...previousFilters,
        years: [e[0], e[1]],
      }
    })
    setYearInput({ lower: e[0], upper: e[1] })
  }

  const handleUpperBlur = (e) => {
    if (
      yearInput.upper > 1930 &&
      yearInput.upper <= 2023 &&
      yearInput.upper > yearInput.lower
    ) {
      setFilters((previousFilters) => {
        return {
          ...previousFilters,
          years: [previousFilters.years[0], parseInt(yearInput.upper)],
        }
      })
    } else {
      setFilters((previousFilters) => {
        return {
          ...previousFilters,
        }
      })
      setYearInput({ lower: yearInput.lower, upper: filters.years[1] })
    }
  }

  const handleLowerBlur = (e) => {
    if (
      yearInput.lower > 1930 &&
      yearInput.lower <= 2023 &&
      yearInput.lower < yearInput.upper
    ) {
      setFilters((previousFilters) => {
        return {
          ...previousFilters,
          years: [parseInt(yearInput.lower), previousFilters.years[1]],
        }
      })
    } else {
      setFilters((previousFilters) => {
        return {
          ...previousFilters,
        }
      })
      setYearInput({ lower: filters.years[0], upper: yearInput.upper })
    }
  }

  const handleUpperChange = (e) => {
    const val = e.target.value
    const lower = yearInput.lower
    handleUpperInput(lower, val)
  }

  const handleLowerChange = (e) => {
    const val = e.target.value
    const upper = yearInput.upper
    handleLowerInput(val, upper)
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') e.target.blur()
  }

  return (
    <>
      <RangeSlider
        min={1930}
        max={2023}
        step={1}
        defaultValue={[1930, 2023]}
        value={filters.years && filters.years.length > 0 ? filters.years : ''}
        onInput={handleChange}
      />
      <div className="year-labels-container">
        <span>1930</span>
        <span>2023</span>
      </div>
      <div className="displayed-year-container">
        <div className="displayed-year">
          <input
            type="number"
            min={1930}
            max={2023}
            className="year-input lower"
            value={yearInput.lower}
            onBlur={handleLowerBlur}
            onChange={handleLowerChange}
            onKeyUp={handleKeyUp}
          />
        </div>
        <span>to</span>
        <div className="displayed-year">
          <input
            type="number"
            min={1930}
            max={2023}
            className="year-input upper"
            value={yearInput.upper}
            onBlur={handleUpperBlur}
            onChange={(e) => handleUpperChange(e)}
            onKeyUp={handleKeyUp}
          />
        </div>
      </div>
    </>
  )
}
