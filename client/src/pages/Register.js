import React from 'react'
import { useEffect } from 'react'
import { useState, useContext } from 'react'
import { PiEyeFill, PiEyeSlashFill } from 'react-icons/pi'
import { BsPersonCircle } from 'react-icons/bs'
import { FaRegFolderOpen } from 'react-icons/fa'
import Modal from '../compenents/Modal'
import TextInput from '../compenents/TextInput'
import { ThreeDots } from 'react-loader-spinner'

import axios from 'axios'
import InfoForm from '../compenents/InfoForm'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import usePopupHook from '../hooks/popupHook'

export default function Register() {
  const [isVisible, setIsVisible] = useState(false)
  const { user, setUser } = useContext(UserContext)
  const [data, setData] = useState({
    email: {
      value: '',
      isValid: null,
    },
    name: {
      value: '',
      isValid: null,
    },
    password: {
      value: '',
      isValid: null,
    },
    film: {
      value: {
        tmdbID: 0,
        backdrop: '',
      },
      isValid: null,
    },
    avatar: {
      value: '',
      isValid: null,
    },
  })
  const [showPreviewImage, setShowPreviewImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setPopup } = usePopupHook()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/')
      setPopup('Log out to make a new account.')
    }
  }, [])

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(email) || email.length === 0) return false
    return true
  }

  const validatePassword = (password) => {
    const upper = /[A-Z]/
    const num = /[0-9]/

    const hasUppercase = upper.test(password)
    const hasNum = num.test(password)

    if (hasUppercase && hasNum && password.length >= 8) return true
    return false
  }

  const validateUsername = (username) => {
    return username.length >= 4
  }

  const handleValidations = () => {
    if (!validateEmail(data.email.value)) {
      setData({ ...data, email: { ...data.email, isValid: false } })
      return
    } else {
      setData({ ...data, email: { ...data.email, isValid: true } })
    }

    if (!validateUsername(data.name.value)) {
      setData({ ...data, name: { ...data.name, isValid: false } })
      return
    } else {
      setData({ ...data, name: { ...data.name, isValid: true } })
    }

    if (!validatePassword(data.password.value)) {
      setData({ ...data, password: { ...data.password, isValid: false } })
      return
    } else {
      setData({ ...data, password: { ...data.password, isValid: true } })
    }

    if (!data.film.value.tmdbID) {
      setData({ ...data, film: { ...data.film, isValid: false } })
      return
    } else {
      setData({ ...data, film: { ...data.film, isValid: true } })
    }

    if (!data.avatar.value) {
      setData({ ...data, avatar: { ...data.avatar, isValid: false } })
    } else {
      setData({ ...data, avatar: { ...data.avatar, isValid: true } })
    }
  }

  const handleFilmChange = (e) => {
    if (data.film !== null || e.taget.value.length === 0) {
      setData({
        ...data,
        film: { value: { tmdbID: 0, backdrop: '' }, isValid: null },
      })
    }
  }

  const handleFilmSelection = (id, backdrop) => {
    setData({
      ...data,
      film: {
        value: {
          tmdbID: id,
          backdrop,
        },
        isValid: true,
      },
    })
  }

  const handlePreviewImage = () => {
    setShowPreviewImage(true)
  }

  const previewImageModal = data.avatar.value && (
    <Modal
      open={showPreviewImage}
      style={{
        backgroundColor: 'transparent',
        transition: '200ms ease-in-out',
        boxShadow: 'none',
      }}
      onClose={() => setShowPreviewImage(false)}
    >
      <img
        className="preview-avatar"
        src={URL.createObjectURL(data.avatar.value)}
        onClick={() => setShowPreviewImage(false)}
      />
    </Modal>
  )

  const footer = (
    <span className="login-footer">
      Already have an account?{' '}
      <Link
        className="link-text alt"
        to="/login"
      >
        Log in Here.
      </Link>
    </span>
  )

  const displayFileName = (file) => {
    if (file.name.length < 20) return file.name
    const name = file.name.split('.')

    let fileName = name[0].slice(0, 15)
    return fileName
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { email, name, password, film, avatar } = data
    const formData = new FormData()

    formData.append('avatar', avatar.value)
    formData.append('email', email.value)
    formData.append('name', name.value)
    formData.append('password', password.value)
    formData.append(
      'filmID',
      film.value.tmdbID !== 0 ? film.value.tmdbID : null
    )
    formData.append(
      'filmBackdrop',
      film.value.tmdbID !== 0 ? film.value.backdrop : null
    )

    try {
      // register user
      const registeredUser = await axios.post(
        'chttps://cinefind.vercel.app//auth/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      // hit login & get profile routes
      const loggedInUser = await axios.post(
        'chttps://cinefind.vercel.app//auth/login',
        { username: name.value, password: password.value },
        {
          withCredentials: true,
        }
      )
      const { data } = await axios.get(
        `chttps://cinefind.vercel.app//auth/profile`,
        {
          withCredentials: true,
        }
      )
      setUser(data)
      navigate(-1)
      setPopup(`Welcome to CineFind, ${data.name}!`, true)
    } catch (e) {
      setPopup(e.response.data.error, false)
      handleValidations()
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <div className="login-form-container">
      <form
        name="register"
        onSubmit={handleSubmit}
      >
        <h5>Register</h5>

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
                data.email.isValid === false && 'invalid'
              }`}
            >
              <input
                type="e-mail"
                className="text-input"
                placeholder="E-mail"
                autoComplete="new-password"
                value={data.email.value}
                onChange={(e) =>
                  setData({
                    ...data,
                    email: {
                      value: e.target.value,
                      isValid: null,
                    },
                  })
                }
              />
            </div>
          </div>

          <div>
            <div
              className={`input-container-text ${
                data.name.isValid === false && 'invalid'
              }`}
            >
              <input
                type="text"
                className="text-input"
                placeholder="Username"
                value={data.name.value}
                onChange={(e) =>
                  setData({
                    ...data,
                    name: {
                      value: e.target.value,
                      isValid: null,
                    },
                  })
                }
                maxLength={25}
                autoComplete="off"
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
                autoComplete="off"
                onChange={(e) =>
                  setData({
                    ...data,
                    password: {
                      value: e.target.value,
                      isValid: null,
                    },
                  })
                }
                value={data.password.value}
              />
              {isVisible ? (
                <PiEyeFill
                  className="eye-icon"
                  onClick={() => setIsVisible(true)}
                  style={{ color: 'var(--grey-text)' }}
                />
              ) : (
                <PiEyeSlashFill
                  className="eye-icon"
                  onClick={() => setIsVisible(false)}
                  style={{ color: 'var(--grey-text)' }}
                />
              )}
            </div>
          </div>

          <div>
            <TextInput
              placeholder={'Favorite Film'}
              handleFilmSelection={handleFilmSelection}
              register={true}
              onChange={handleFilmChange}
              film={data.film}
              setData={setData}
              data={data}
            />
          </div>
          <div>
            <div
              className={`input-container-text ${
                data.avatar.isValid === false && 'invalid'
              }`}
              style={{ height: '2.6295rem' }}
            >
              <label
                htmlFor="avatar-upload"
                style={{
                  cursor: 'pointer',
                  height: 'min-content',
                  width: 'fit-content',
                }}
                className="text-input"
              >
                <span
                  className={
                    data.avatar.value ? 'text-input' : 'text-input-placeholder'
                  }
                  style={{ height: '2.5rem' }}
                >
                  {data.avatar.value
                    ? displayFileName(data.avatar.value)
                    : `Profile Picture`}
                </span>

                <FaRegFolderOpen
                  style={{
                    marginLeft: '0.5rem',
                    marginBottom: '1px',
                    color: 'var(--grey-text)',
                  }}
                />

                <input
                  type="file"
                  onChange={(e) =>
                    setData({
                      ...data,
                      avatar: {
                        value: e.target.files[0],
                        isValid: true,
                      },
                    })
                  }
                  className="login-input"
                  id="avatar-upload"
                  accept=".jpg, .webp, .jpeg, .png"
                />
              </label>
              {data.avatar.isValid && (
                <span
                  className="preview-image"
                  onClick={handlePreviewImage}
                >
                  Preview <BsPersonCircle />
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          className="login-btn"
          disabled={loading}
        >
          {loading ? (
            <ThreeDots
              height={26}
              width={26}
              color="var(--primary-text)"
            />
          ) : (
            'Register'
          )}
        </button>
        {footer}
      </form>
    </div>
  )

  return (
    <>
      <InfoForm form={content} />
      {previewImageModal}
    </>
  )
}
