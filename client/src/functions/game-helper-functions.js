import { PiCalendarCheckBold, PiClockBold } from 'react-icons/pi'

const deconstructID = (id) => {
  return ((id - 9) / 2 + 989) / 6 - 2143
}

const renderYears = (year, filmsGuessed, correctGuesses, isWin) => {
  let max = 1000000
  let min = -1
  let match = false

  for (let i = 0; i < filmsGuessed.length; i++) {
    if (filmsGuessed[i].year > year && filmsGuessed[i].year < max) {
      max = filmsGuessed[i].year
    } else if (filmsGuessed[i].year < year && filmsGuessed[i].year > min) {
      min = filmsGuessed[i].year
    } else {
      match = filmsGuessed[i].year === year
      if (match) {
        correctGuesses[i] = true
        break
      }
    }
  }

  if (match || isWin === false) {
    return <span className={match ? 'match' : 'no-match'}>{year}</span>
  } else {
    return (
      <span style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {min === -1 ? '?' : min} <span>&lt;</span>{' '}
        <PiCalendarCheckBold
          style={{
            fontSize: '1.25rem',
            color: 'var(--blue-dark)',
          }}
        />{' '}
        <span>&lt;</span> {max === 1000000 ? '?' : max}
      </span>
    )
  }
}

const renderRuntime = (runtime, filmsGuessed, correctGuesses, isWin) => {
  let max = 1000000
  let min = -1
  let match = false

  for (let i = 0; i < filmsGuessed.length; i++) {
    if (filmsGuessed[i].runtime > runtime && filmsGuessed[i].runtime < max) {
      max = filmsGuessed[i].runtime
    } else if (
      filmsGuessed[i].runtime < runtime &&
      filmsGuessed[i].runtime > min
    ) {
      min = filmsGuessed[i].runtime
    } else {
      match = filmsGuessed[i].runtime === runtime
      if (match) {
        correctGuesses[i] = true
        break
      }
    }
  }

  if (match || isWin == false) {
    return <span className={match ? 'match' : 'no-match'}>{runtime} min</span>
  } else {
    return (
      <span style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {min === -1 ? '?' : min} <span>&lt;</span>{' '}
        <PiClockBold
          style={{ fontSize: '1.25rem', color: 'var(--blue-dark)' }}
        />{' '}
        <span>&lt;</span> {max === 1000000 ? '?' : max}
      </span>
    )
  }
}

const renderDirectors = (directors, filmsGuessed, correctGuesses, isWin) => {
  return directors.map((dir, i) => {
    const name = dir.name
    const unknownName = dir.name.replace(/[a-zA-Z]/g, 'x')
    let match = false
    for (let i = 0; i < filmsGuessed.length; i++) {
      match = filmsGuessed[i].director.some((obj) => obj.id === dir.id)
      if (match) {
        correctGuesses[i] = true
        break
      }
    }

    return (
      <span
        className={
          match ? 'match' : isWin === false ? 'no-match' : 'unknown-name'
        }
        key={dir.id}
      >
        {match || isWin === false ? name : unknownName}
        {directors.length > 1 && i !== directors.length - 1 && ', '}
      </span>
    )
  })
}

const renderGenres = (genres, filmsGuessed, correctGuesses, isWin) => {
  return genres.map((genre, i) => {
    let match = false
    for (let i = 0; i < filmsGuessed.length; i++) {
      match = filmsGuessed[i].genres.some((obj) => obj.id === genre.id)
      if (match) {
        correctGuesses[i] = true
        break
      }
    }
    return (
      <span
        key={genre.id}
        className={`game-genre ${
          match ? 'match' : isWin === false ? 'no-match' : ''
        }`}
      >
        {match || isWin === false ? genre.name : '?'}
      </span>
    )
  })
}

const renderCast = (cast, filmsGuessed, correctGuesses, isWin) => {
  return cast.map((member, i) => {
    if (i >= 12) return
    let match = false
    const name = member.name
    const unknownName = name.replace(/[a-zA-Z]/g, 'x')
    for (let i = 0; i < filmsGuessed.length; i++) {
      match = filmsGuessed[i].cast.some((obj) => obj.id === member.id)
      if (match) {
        correctGuesses[i] = true
        break
      }
    }

    return (
      <div
        className="game-cast-member-container"
        key={member.id}
      >
        <span
          className={`game-cast-name ${
            match ? 'match' : isWin === false ? 'no-match' : 'unknown-name'
          }`}
        >
          {match || isWin === false ? name : unknownName}
        </span>
        <span className="game-cast-gender">
          {member.gender === 1
            ? 'F'
            : member.gender == 2
            ? 'M'
            : member.gender == 0
            ? '-'
            : 'N-B'}
        </span>
      </div>
    )
  })
}

const renderGuessedFilms = (filmsGuessed, correctGuesses, isWin) => {
  return filmsGuessed.map((film, i) => {
    return (
      <li
        key={i}
        className={`preview-container`}
        style={{ width: '100%' }}
      >
        <div className="rank-display">
          <div className="rank">{i + 1}</div>
        </div>
        {film && (
          <>
            <div
              style={{
                height: '80%',
                aspectRatio: '2/3',
                marginLeft: '0.5rem',
              }}
            >
              <img
                className=" poster"
                src={film.poster}
              />
            </div>

            <h5
              className={`preview-title ${
                isWin && filmsGuessed.length === i + 1
                  ? 'match'
                  : correctGuesses[i]
                  ? 'semi-match'
                  : 'no-match'
              }`}
              style={{ fontSize: '1rem' }}
            >
              {film.title}
            </h5>
          </>
        )}
      </li>
    )
  })
}

export {
  deconstructID,
  renderYears,
  renderRuntime,
  renderDirectors,
  renderGenres,
  renderCast,
  renderGuessedFilms,
}
