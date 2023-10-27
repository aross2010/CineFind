import { NavLink, useLocation } from 'react-router-dom'
import '../../styles/navbar.css'
import logo from '../../images/logo.png'
import altlogo from '../../images/altlogo.png'
import ProfileIcon from './ProfileIcon'
import useWindowSizeHook from '../../hooks/widowSizeHook'

function Navbar() {
  const location = useLocation()
  const { width } = useWindowSizeHook()

  const isActive =
    location.pathname === '/films' || location.pathname.startsWith('/film')

  const isDetails =
    location.pathname.startsWith('/film/') ||
    location.pathname.match(/^\/list\/[^/]+$/) !== null ||
    location.pathname.startsWith('/user/')

  const isCondensed =
    location.pathname.match(/^\/list\/[^/]+$/) !== null ||
    location.pathname.startsWith('/user/')

  return (
    <nav
      className="navbar-custom"
      style={
        width < 800
          ? {
              backgroundColor: 'var(--secondary-dark)',
            }
          : isDetails
          ? { background: 'transparent' }
          : { backgroundColor: '#14181c' }
      }
    >
      <div
        className="nav-content"
        style={
          isDetails && isCondensed && width > 800
            ? {
                maxWidth: '1050px',
                paddingRight: '3.25rem',
                paddingLeft: '3.25rem',
              }
            : isDetails
            ? { maxWidth: '1050px' }
            : {}
        }
      >
        <div className="left-nav">
          <NavLink to="/">
            <img
              className={width > 600 ? 'logo' : 'alt-logo'}
              src={width > 600 ? logo : altlogo}
            />
          </NavLink>
        </div>
        <div className="middle-nav">
          <NavLink
            to="/films"
            className={
              isActive ? 'active NavLink uppercase' : 'NavLink uppercase'
            }
          >
            Films
          </NavLink>

          <NavLink
            to="/game"
            className="NavLink uppercase"
          >
            CineQ
          </NavLink>
          <NavLink
            to="/lists"
            className={`NavLink uppercase ${
              location.pathname.startsWith('/list') && 'active'
            }`}
          >
            Lists
          </NavLink>
        </div>
        <div className="right-nav">
          <ProfileIcon />
        </div>
      </div>
      <div
        hidden={!isDetails}
        className="nav-shadow"
      ></div>
    </nav>
  )
}

export default Navbar
