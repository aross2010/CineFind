import React, { useContext, useEffect, useState } from 'react'
import '../styles/popup.css'
import { PopupContext } from '../context/popupContext'
import ReactDOM from 'react-dom'

import { RiErrorWarningFill, RiCheckboxCircleFill } from 'react-icons/ri'

export default function Popup() {
  const { popup, setPopup } = useContext(PopupContext)
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    if (timer) {
      clearTimeout(timer)
    }

    if (popup.active) {
      const newtimer = setTimeout(() => {
        setPopup({ ...popup, active: false })
      }, 3000)

      setTimer(newtimer)
    }
  }, [popup])
  return ReactDOM.createPortal(
    <div
      className={`popup-container ${popup.active && 'active'} ${
        popup.success ? ' success' : ' danger'
      }`}
    >
      <span>
        {popup.success ? <RiCheckboxCircleFill /> : <RiErrorWarningFill />}{' '}
        {popup.msg}
      </span>
      <button
        className="popup-cancel"
        onClick={() => setPopup({ ...popup, active: false })}
      >
        &times;
      </button>
    </div>,
    document.getElementById('portal')
  )
}
