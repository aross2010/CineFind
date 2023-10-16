import React, { useContext, useEffect, useState } from 'react'
import AppRoutes from './AppRoutes'
import './styles/style.css'
import Navbar from './compenents/Navbar'
import Footer from './compenents/Footer'
import Popup from './compenents/Popup'
import Loading from './compenents/LoadingSpinner'
import { UserContext } from './context/userContext'
import useWindowSizeHook from './hooks/widowSizeHook'

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
