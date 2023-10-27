import { Routes, Route } from 'react-router-dom'
import HomeGuest from './pages/HomeGuest'
import Find from './pages/FindPage'
import FilmPage from './pages/FilmPage'
import CastPage from './pages/CastPage'
import GameHub from './pages/GameHub'
import GamePage from './pages/GamePage'
import ListsHub from './pages/ListsHub'
import ListCreate from './pages/ListCreate'
import ListPage from './pages/ListPage'
import UserPage from './pages/UserPage'
import LogInPage from './pages/LogInPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import HomeUser from './pages/HomeUser'
import { useContext, useEffect } from 'react'
import { UserContext } from './context/userContext'

export default function AppRoutes() {
  const { user } = useContext(UserContext)
  let loggedIn = false

  if (localStorage.getItem('token')) {
    loggedIn = true
  }

  useEffect(() => {
    if (!loggedIn && user) loggedIn = true
  }, [user])

  return (
    <Routes>
      <Route
        path="/"
        element={loggedIn ? <HomeUser /> : <HomeGuest />}
      />

      <Route
        path="/films"
        element={<Find />}
      />
      <Route
        path="/film/:id"
        element={<FilmPage />}
      />
      <Route
        path="/cast/:id"
        element={<CastPage />}
      />
      <Route
        path="/game"
        element={<GameHub />}
      ></Route>
      <Route
        path="/game/:id"
        element={<GamePage />}
      />
      <Route
        path="/lists"
        element={<ListsHub />}
      />
      <Route
        path="/lists/create"
        element={<ListCreate />}
      />
      <Route
        path="/list/edit/:id"
        element={<ListCreate />}
      />
      <Route
        path="/list/:id"
        element={<ListPage />}
      />
      <Route
        path="/user/:username"
        element={<UserPage />}
      />

      <Route
        path="/login"
        element={<LogInPage />}
      />
      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  )
}
