function isActiveFilter(check, activeFilters) {
  const id = parseInt(check.value)
  const type = check.classList.contains('services-input') ? 'service' : 'genre'

  if (
    (type === 'service' &&
      Array.isArray(activeFilters.services) &&
      activeFilters.services.includes(id)) ||
    activeFilters.services === id
  ) {
    return true
  } else if (
    (type === 'genre' &&
      Array.isArray(activeFilters.genres) &&
      activeFilters.genres.includes(id)) ||
    activeFilters.genres === id
  )
    return true

  return false
}

export default isActiveFilter
