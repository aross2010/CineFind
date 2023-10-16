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
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
          crossorigin="anonymous"
        />
      </head>
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
