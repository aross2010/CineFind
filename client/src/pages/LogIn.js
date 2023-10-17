import React, { useEffect, useContext, useState } from 'react'
import '../styles/login.css'
import { PiEyeFill, PiEyeSlashFill } from 'react-icons/pi'
import { ThreeDots } from 'react-loader-spinner'
import InfoForm from '../compenents/InfoForm'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import usePopupHook from '../hooks/popupHook'

export default function LogIn() {
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    username: {
      value: '',
      isValid: null,
    },
    password: {
      value: '',
      isValid: null,
    },
  })
  const { setPopup } = usePopupHook()
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate(-1)
      setPopup('Log out to switch accounts.')
    }
  }, [])

  const footer = (
    <span className="login-footer">
      Don't have an account?{' '}
      <Link
        className="link-text alt"
        to="/register"
      >
        Register Here.
      </Link>
    </span>
  )

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    const { username, password } = data
    try {
      const user = {
        username: username.value,
        password: password.value,
      }
      const res = await axios.post(
        'https://cinefindapi.vercel.app/auth/login',
        user
      )
      setData({
        username: {
          value: '',
          isValid: null,
        },
        password: {
          value: '',
          isValid: null,
        },
      })
      const token = res.data.token
      localStorage.setItem('token', token)
      const { data } = await axios.get(
        `https://cinefindapi.vercel.app/auth/profile`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )

      setUser(data)
      navigate('/') // navigate to previous page
      setPopup(`Welcome back, ${data.name}!`, true)
    } catch (e) {
      setPopup(e.response.data.error)
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <div className="login-form-container">
      <form
        name="Log in"
        onSubmit={handleSubmit}
      >
        <h5>Log in</h5>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div
              className={`input-container-text ${
                data.username.isValid === false && 'invalid'
              }`}
            >
              <input
                type="text"
                className="text-input"
                placeholder="Username"
                value={data.username.value}
                onChange={(e) =>
                  setData({
                    ...data,
                    username: { value: e.target.value, isValid: null },
                  })
                }
                maxLength={25}
              />
            </div>
          </div>

          <div>
            <div
              className={`input-container-text ${
                data.password.isValid === false && 'invalid'
              }`}
            >
              <input
                type={!isVisible ? 'password' : 'text'}
                className="text-input"
                placeholder="Password"
                onChange={(e) =>
                  setData({
                    ...data,
                    password: { value: e.target.value, isVavlid: null },
                  })
                }
                value={data.password.value}
              />
              {isVisible ? (
                <PiEyeFill
                  className="eye-icon"
                  onClick={() => setIsVisible(false)}
                  style={{ color: 'var(--grey-text)' }}
                />
              ) : (
                <PiEyeSlashFill
                  className="eye-icon"
                  onClick={() => setIsVisible(true)}
                  style={{ color: 'var(--grey-text)' }}
                />
              )}
            </div>
          </div>
        </div>

        <button className="login-btn">
          {' '}
          {loading ? (
            <ThreeDots
              height={26}
              width={26}
              color="var(--primary-text)"
            />
          ) : (
            'Log in'
          )}
        </button>
        {footer}
      </form>
    </div>
  )

  return <InfoForm form={content} />
}

// create outline for register/login forms and seperate into different pages
