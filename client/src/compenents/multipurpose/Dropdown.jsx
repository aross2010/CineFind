import { useEffect, useRef, useState } from 'react'
import { FiChevronDown, FiArrowDown, FiArrowUp } from 'react-icons/fi'
import '../../styles/dropdown.css'

export default function Dropdown({
  options,
  handleSelect,
  selected,
  header,
  icons,
  headerDisplayed,
  numbers,
  alt,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownEl = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownEl &&
        dropdownEl.current &&
        !dropdownEl.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handler, true)

    return () => {
      document.removeEventListener('click', handler)
    }
  })

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (value) => {
    handleSelect(value)
    setIsOpen(!isOpen)
  }

  const renderedOptions = options.map((option, index) => {
    return (
      <div
        key={option.label}
        onClick={() => handleOptionClick(option)}
        className={`dropdown-option ${
          selected &&
          selected.value === option.value &&
          `dropdown-option-selected`
        }`}
      >
        {option.label}
        {icons &&
          (selected && selected.value === option.value ? (
            selected.desc ? (
              <FiArrowDown />
            ) : (
              <FiArrowUp />
            )
          ) : null)}
        {numbers && <span style={{ fontWeight: '400' }}>{option.num}</span>}
      </div>
    )
  })

  return (
    <div
      className={`dropdown-container-custom ${alt && 'alt'}`}
      ref={dropdownEl}
      style={
        alt
          ? { minWidth: '6rem' }
          : numbers
          ? { minWidth: '12rem' }
          : { minWidth: '8rem' }
      }
    >
      <div
        className="dropdown-header-custom"
        onClick={handleClick}
      >
        {headerDisplayed ? header : selected.label}
        <FiChevronDown className={`chevron-down ${isOpen ? 'rotated' : ''}`} />
      </div>
      <div
        hidden={!isOpen}
        className="dropdown-menu-custom"
        style={headerDisplayed && { paddingTop: '0' }}
      >
        {!headerDisplayed && (
          <span className="dropdown-menu-header-custom">{header}</span>
        )}
        <div className="dropdown-options-container">{renderedOptions}</div>
      </div>
    </div>
  )
}
