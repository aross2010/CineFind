function deconstructParams(params) {
  const obj = {}

  for (const [key, value] of params.entries()) {
    if (key === 'genres' || key === 'services' || key === 'years') {
      obj[key] = value.split('+').map(Number)
    } else {
      obj[key] = value
    }
  }

  return obj
}

export default deconstructParams
