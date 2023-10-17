import React, { useContext, useEffect, useState } from 'react'
import '../styles/popup.css'
import { PopupContext } from '../context/popupContext'
import ReactDOM from 'react-dom'

import {
  RiErrorWarningFill,
  RiCheckboxCircleFill,
  RiCloseFill,
} from 'react-icons/ri'

export default function Popup() {
  const { popup, setPopup } = useContext(PopupContext)
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    if (timer) {
      clearTimeout(timer)
    }

    if (popup.active) {
      setTimer(
        setTimeout(() => {
          setPopup({ ...popup, active: false })
        }, 3000)
      )
    }
  }, [popup])
  return ReactDOM.createPortal(
    <div
      className={`popup-container ${popup.active && 'active'} ${
        popup.success ? ' success' : ' danger'
      }`}
    >
      <span>
        {popup.success ? (
          <RiCheckboxCircleFill className="popup-icon check" />
        ) : (
          <RiErrorWarningFill className="popup-icon warn" />
        )}{' '}
        {popup.msg}
      </span>
      <button
        className="popup-cancel"
        onClick={() => setPopup({ ...popup, active: false })}
      >
        <RiCloseFill />
      </button>
    </div>,
    document.getElementById('portal')
  )
}
