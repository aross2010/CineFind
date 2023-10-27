import React, { useContext, useRef } from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function Backdrop({ src }) {
  const backdropRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    document.body.style.background = '#14181c'

    return () => {
      document.body.style.background =
        '#14181c url(https://s.ltrbxd.com/static/img/content-bg.0d9a0f0f.png) 0 -1px repeat-x'
    }
  })

  const STYLES = {
    background: ` center / cover url(${src})`,
  }

  useEffect(() => {
    const nav = document.querySelector('.navbar-custom')
    nav.style.position = 'absolute'
    nav.style.zIndex = 2

    return () => {
      nav.style.position = 'relative'
      nav.style.zIndex = 1
    }
  }, [])

  return (
    <>
      <div
        className={`backdrop-img ${
          location.pathname.startsWith('/film') ? 'details' : 'alt'
        }`}
        style={STYLES}
        ref={backdropRef}
      />
      <div
        className={`filter ${
          location.pathname.startsWith('/film') ? 'details' : 'alt'
        }`}
      ></div>
    </>
  )
}
