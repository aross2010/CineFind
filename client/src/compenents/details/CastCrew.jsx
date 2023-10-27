import React, { useState } from 'react'
import SwitchableHeader from '../multipurpose/SwitchableHeader'
import { BsPersonFill } from 'react-icons/bs'
import { FaChevronRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function CastCrew({ cast, crew }) {
  const noPhoto = 'https://image.tmdb.org/t/p/original/null'

  const [standardView, setStandardView] = useState(true)
  const [restrictedViewCast, setRestrictedViewCast] = useState(true)
  const [restrictedViewCrew, setRestrictedViewCrew] = useState(true)

  const renderedCrew = crew.map((member, i) => {
    if (i >= 25 && restrictedViewCrew && !standardView) return
    return (
      <li key={i}>
        <Link
          to={`/cast/${member.id}`}
          className="link-no-text"
        >
          <div className={standardView ? 'cast-member' : 'cast-member-alt'}>
            <div
              className={
                standardView
                  ? 'cast-photo-container'
                  : 'cast-photo-container-alt'
              }
            >
              {member.photo !== noPhoto ? (
                <img
                  src={member.photo}
                  className={standardView ? 'cast-photo' : 'cast-photo-alt'}
                />
              ) : (
                <BsPersonFill
                  className={
                    standardView ? 'generic-avatar' : 'generic-avatar-alt'
                  }
                />
              )}
            </div>

            <div
              className={
                standardView ? 'cast-text-container' : 'cast-text-container-alt'
              }
            >
              <span className={'cast-name'}>{member.name}</span>
              <span className={'cast-character'}>{member.job}</span>
            </div>
            {!standardView && (
              <FaChevronRight
                style={{ marginLeft: 'auto', marginRight: '0.5rem' }}
              />
            )}
          </div>
        </Link>
      </li>
    )
  })

  const renderedCast = cast.map((member, i) => {
    if (i >= 20 && restrictedViewCast && !standardView) return
    return (
      <li key={i}>
        <Link
          to={`/cast/${member.id}`}
          className="link-no-text"
        >
          <div className={standardView ? 'cast-member' : 'cast-member-alt'}>
            <div
              className={
                standardView
                  ? 'cast-photo-container'
                  : 'cast-photo-container-alt'
              }
            >
              {member.photo !== noPhoto ? (
                <img
                  src={member.photo}
                  className={standardView ? 'cast-photo' : 'cast-photo-alt'}
                />
              ) : (
                <BsPersonFill
                  className={
                    standardView ? 'generic-avatar' : 'generic-avatar-alt'
                  }
                />
              )}
            </div>
            <div
              className={
                standardView ? 'cast-text-container' : 'cast-text-container-alt'
              }
            >
              <span className={'cast-name'}>{member.name}</span>
              <span className={'cast-character'}>{member.character}</span>
            </div>
            {!standardView && (
              <FaChevronRight
                style={{ marginLeft: 'auto', marginRight: '0.5rem' }}
              />
            )}
          </div>
        </Link>
      </li>
    )
  })

  const handleViewChange = (view) => {
    if (view === 'horizontal') setStandardView(true)
    else setStandardView(false)
  }

  const viewAllCast = (
    <div style={{ marginTop: '0.25rem' }}>
      <a
        className="view-all-cast txt-btn"
        onClick={() => setRestrictedViewCast(!restrictedViewCast)}
      >
        {restrictedViewCast ? 'View All' : 'View Less'}
      </a>
    </div>
  )

  const castView = (
    <ul
      className={
        standardView ? 'sliding-container cast-container' : 'cast-container-alt'
      }
    >
      {renderedCast}
      {!standardView && cast.length > 25 && viewAllCast}
    </ul>
  )

  const viewAllCrew = (
    <div style={{ marginTop: '0.25rem' }}>
      <a
        className="view-all-cast txt-btn"
        onClick={() => setRestrictedViewCrew(!restrictedViewCrew)}
      >
        {restrictedViewCrew ? 'View All' : 'View Less'}
      </a>
    </div>
  )

  const crewView = (
    <ul
      className={
        standardView ? 'sliding-container cast-container' : 'cast-container-alt'
      }
    >
      {renderedCrew}
      {!standardView && crew.length > 25 && viewAllCrew}
    </ul>
  )

  const content = []
  const headers = []

  if (cast.length > 0) {
    content.push(castView)
    headers.push('Cast')
  }
  if (crew.length > 0) {
    content.push(crewView)
    headers.push('Crew')
  }

  return (
    <div>
      <SwitchableHeader
        headers={headers}
        content={content}
        icons={true}
        handleChange={handleViewChange}
      />
    </div>
  )
}
