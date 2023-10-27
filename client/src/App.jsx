import AppRoutes from './AppRoutes'
import './styles/style.css'
import Navbar from './compenents/navbar/Navbar'
import Footer from './compenents/multipurpose/Footer'
import Popup from './compenents/multipurpose/Popup'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
      <Popup />
    </>
  )
}

export default App
