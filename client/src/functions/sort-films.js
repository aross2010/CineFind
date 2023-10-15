export default function sortFilms(films, sort) {
  const arr = [...films]

  const { desc, value } = sort

  if (desc) {
    if (value === 'rating') arr.sort((a, b) => b.rating - a.rating)
    else if (value === 'year') arr.sort((a, b) => b.year - a.year)
    else if (value === 'popularity')
      arr.sort((a, b) => b.popularity - a.popularity)
    else if (value === 'title')
      arr.sort((a, b) => a.title.localeCompare(b.title))
  }

  if (!desc) {
    if (value === 'rating') arr.sort((a, b) => a.rating - b.rating)
    else if (value === 'year') arr.sort((a, b) => a.year - b.year)
    else if (value === 'popularity')
      arr.sort((a, b) => a.popularity - b.popularity)
    else if (value === 'title')
      arr.sort((a, b) => b.title.localeCompare(a.title))
  }

  return arr
}
