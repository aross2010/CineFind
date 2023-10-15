import { useEffect } from 'react'

import Dropdown from '../Dropdown'
import useWindowSizeHook from '../../hooks/widowSizeHook'

export default function Sort({ sort, setSort, handleSort, alt }) {
  const { width } = useWindowSizeHook()
  useEffect(() => {
    if (sort) handleSort(sort)
  }, [sort])

  const handleSelect = (method) => {
    setSort((prev) => {
      if (prev.value === method.value)
        return {
          ...prev,
          desc: !prev.desc,
        }
      else return method
    })
  }

  const options = [
    { label: 'Rating (TMDB)', value: 'rating', desc: true },
    { label: 'Popularity', value: 'popularity', desc: true },
    { label: 'Release Year', value: 'year', desc: true },
    { label: 'Title', value: 'title', desc: true },
  ]

  return (
    <div
      className="sort-container"
      style={width <= 600 ? { padding: '0' } : {}}
    >
      <Dropdown
        options={options}
        handleSelect={handleSelect}
        selected={sort}
        header={'Sort by'}
        headerDisplayed={alt}
        icons={true}
      />
    </div>
  )
}
