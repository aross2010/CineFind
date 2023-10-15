import React from 'react'
import backdrops from '../data/backdrops'
import '../styles/login.css'
import useWindowSizeHook from '../hooks/widowSizeHook'
import { Link } from 'react-router-dom'

const FILM = backdrops[Math.floor(Math.random() * backdrops.length)]

export default function InfoForm({ form }) {
  const { width } = useWindowSizeHook()
  const STYLES = {
    background: ` center / cover url(${FILM.backdrop})`,
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '3rem',
        padding: '0 0rem',
      }}
    >
      <div className="login-container">
        <div
          className="backdrop-wrapper"
          style={STYLES}
        >
          <Link
            className="backdrop-title link-text"
            to={`/film/${FILM.id}`}
          >
            {FILM.title}
          </Link>
        </div>
        {form}
      </div>
    </div>
  )
}
