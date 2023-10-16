import React, { useContext, useEffect, useState } from 'react'
import AppRoutes from './AppRoutes'
import './styles/style.css'
import Navbar from './compenents/Navbar'
import Footer from './compenents/Footer'
import Popup from './compenents/Popup'
import Loading from './compenents/LoadingSpinner'
import { UserContext } from './context/userContext'
import useWindowSizeHook from './hooks/widowSizeHook'

import './styles/style.css'
import './styles/cast.css'
import './styles/checkbox.css'
import './styles/details.css'
import './styles/dropdown.css'
import './styles/find.css'
import './styles/footer.css'
import './styles/game.css'
import './styles/lists.css'
import './styles/login.css'
import './styles/modal.css'
import './styles/navbar.css'
import './styles/popup.css'
import './styles/profile-icon.css'
import './styles/review.css'
import './styles/switchable.css'
import './styles/textInput.css'
import './styles/user.css'
import './styles/year-slider.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export const AppContext = React.createContext()

function App() {
  const { user } = useContext(UserContext)
  const { width } = useWindowSizeHook()
  const [userLoaded, setUserLoaded] = useState(null)

  useEffect(() => {
    if (user !== undefined) setUserLoaded(true)
  }, [user])

  return (
    <>
      <head></head>
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div
          className="container-fluid"
          style={width < 1175 ? { overflowX: 'hidden' } : {}}
        >
          {!userLoaded ? <Loading /> : <AppRoutes />}
          <Popup />
        </div>
      </div>

      <Footer />
    </>
  )
}

export default App
