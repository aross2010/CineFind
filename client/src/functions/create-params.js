export default function createParams(filters, searchQuery) {
  let params = {}

  if (searchQuery) {
    params.searchQuery = searchQuery
    return params
  }

  const { services, genres, years, runtime } = filters

  if (Array.isArray(services)) {
    if (services.length > 0 && services.length < 2)
      params.services = services[0]
    else if (services.length >= 2) params.services = services.join('+')
  }

  if (Array.isArray(genres)) {
    if (genres.length > 0 && genres.length < 2) params.genres = genres[0]
    else if (genres.length >= 2) params.genres = genres.join('+')
  }

  if (years.length === 2) params.years = years.join('+')
  if (runtime && runtime.length === 2) params.runtime = runtime.join('+')

  return params
}
