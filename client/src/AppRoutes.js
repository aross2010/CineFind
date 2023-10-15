import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Find from './pages/Find'
import FilmPage from './pages/FilmPage'
import CastPage from './pages/CastPage'
import GameHub from './pages/GameHub'
import Game from './pages/Game'
import ListsHub from './pages/ListsHub'
import ListCreate from './pages/ListCreate'
import ListPage from './pages/ListPage'
import UserPage from './pages/UserPage'
import LogIn from './pages/LogIn'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
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
        element={<Game />}
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
        element={<LogIn />}
      />
      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  )
}
