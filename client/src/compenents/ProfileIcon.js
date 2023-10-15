import React, { useContext, useEffect, useState, useRef } from 'react'
import { UserContext } from '../context/userContext'
import '../styles/profile-icon.css'
import { BsPersonCircle } from 'react-icons/bs'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import usePopupHook from '../hooks/popupHook'

export default function ProfileIcon() {
  const { user, setUser } = useContext(UserContext)
  const [showDropDown, setShowDropDown] = useState(false)
  const { setPopup } = usePopupHook()
  const navigate = useNavigate()
  const dropdown = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdown &&
        dropdown.current &&
        !dropdown.current.contains(e.target)
      ) {
        setShowDropDown(false)
      }
    }

    document.addEventListener('click', handler, true)

    return () => {
      document.removeEventListener('click', handler)
    }
  })

  const handleLogout = async () => {
    const { data } = await axios.get(
      `chttps://cinefindapi.vercel.app//auth/logout`,
      {
        withCredentials: true,
      }
    )
    setPopup(`Goodbye, ${user.name}!`, true)
    navigate('/')
    setUser(data)
    setShowDropDown(false)
  }

  const userOptions = user && (
    <>
      <Link
        to={`/user/${user.name}`}
        className="profile-option link-text"
        onClick={() => setShowDropDown(false)}
      >
        Profile
      </Link>
      <button
        className="profile-option"
        style={{ color: 'inherit' }}
        onClick={handleLogout}
      >
        Log out
      </button>
    </>
  )

  const noUserOptions = (
    <>
      <Link
        className="profile-option link-text"
        to="/register"
        onClick={() => setShowDropDown(false)}
      >
        Register
      </Link>
      <Link
        className="profile-option link-text"
        to="/login"
        onClick={() => setShowDropDown(false)}
      >
        Log in
      </Link>
    </>
  )

  return (
    <div
      className="profile-icon-container"
      ref={dropdown}
    >
      <button
        className="profile-icon-btn"
        onClick={() => setShowDropDown(!showDropDown)}
      >
        {!user ? (
          <BsPersonCircle
            className="profile-icon"
            style={{ fontSize: '1.75rem' }}
          />
        ) : (
          <img
            className="profile-icon"
            src={user.avatar}
          />
        )}
      </button>

      <div
        hidden={!showDropDown}
        className="profile-icon-dropdown"
      >
        {user ? userOptions : noUserOptions}
      </div>
    </div>
  )
}
