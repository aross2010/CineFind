import React, { useState, useEffect } from 'react'
import '../../styles/switchable.css'
import { HiSwitchHorizontal, HiSwitchVertical } from 'react-icons/hi'
import Dropdown from './Dropdown'
import useWindowSizeHook from '../../hooks/widowSizeHook'

let count = 0

export default function SwitchableHeader({
  loading,
  skeleton,
  headers,
  content,
  handleChange,
  icons,
  sortable,
  data,
  sortedDiscussions,
  setSortedDiscussions,
}) {
  const [selected, setSelected] = useState(headers[0])
  const [selectedIcon, setSelectedIcon] = useState('horizontal')
  const { width } = useWindowSizeHook()
  useEffect(() => {
    if (!headers.includes(selected)) setSelected(headers[0])
  }, [width])

  const handleClick = (i) => {
    setSelected(headers[i])
    if (!sortable) return
    if (i == 1 && count === 0) {
      count++
      const prevDiscussions = [...sortedDiscussions]
      setSortedDiscussions(prevDiscussions)
    }
  }

  const renderedHeaders = headers.map((header, i) => {
    return (
      <h6
        key={i}
        className={`switchable-header uppercase ${
          selected === header && 'selected'
        }`}
        onClick={() => handleClick(i)}
      >
        {header}
      </h6>
    )
  })

  const selectedIndex = headers.indexOf(selected)

  const handleViewChange = (view) => {
    handleChange(view)
    setSelectedIcon(view)
  }

  const displayedIcons = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.1rem',
        marginLeft: 'auto',
      }}
    >
      <HiSwitchHorizontal
        className={`switchable-icon ${
          selectedIcon === 'horizontal' && 'selected-switchable-icon'
        }`}
        onClick={() => handleViewChange('horizontal')}
      />
      <HiSwitchVertical
        className={`switchable-icon ${
          selectedIcon === 'vertical' && 'selected-switchable-icon'
        }`}
        onClick={() => handleViewChange('vertical')}
      />
    </div>
  )

  const renderedContent = content.map((el, i) => {
    return loading ? (
      skeleton
    ) : (
      <div
        key={i}
        hidden={i !== selectedIndex}
        className="switchable-content"
      >
        {content[i]}
      </div>
    )
  })

  const reviewDropdown = sortable && (
    <Dropdown
      headerDisplayed
      selected={data.reviews.selected}
      handleSelect={data.reviews.handleSelect}
      icons
      header={'sort'}
      options={data.reviews.options}
      alt
    />
  )

  const discussionsDropdown = sortable && (
    <Dropdown
      headerDisplayed
      selected={data.discussions.selected}
      handleSelect={data.discussions.handleSelect}
      icons
      header={'sort'}
      options={data.discussions.options}
      alt
    />
  )

  const listsDropdown = sortable && (
    <Dropdown
      headerDisplayed
      selected={data.lists.selected}
      handleSelect={data.lists.handleSelect}
      icons
      header={'sort'}
      options={data.lists.options}
      alt
    />
  )

  const sortableDropdown = sortable && (
    <>
      {selectedIndex === 0 && reviewDropdown}
      {selectedIndex === 1 && discussionsDropdown}
      {selectedIndex === 2 && listsDropdown}
    </>
  )

  return (
    <div className="switchable-container">
      <div className="switchable-header-container">
        {renderedHeaders}
        {sortable && sortableDropdown}
        {icons && displayedIcons}
      </div>
      {renderedContent}
    </div>
  )
}
