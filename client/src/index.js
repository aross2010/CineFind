import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './context/userContext'
import { PopupContextProvider } from './context/popupContext'
import { SkeletonTheme } from 'react-loading-skeleton'
import '/styles/styles.css'
import '/styles/cast.css'
import '/styles/checkbox.css'
import '/styles/details.css'
import '/styles/dropdown.css'
import '/styles/find.css'
import '/styles/footer.css'
import '/styles/game.css'
import '/styles/lists.css'
import '/styles/login.css'
import '/styles/modal.css'
import '/styles/navbar.css'
import '/styles/popup.css'
import '/styles/profile-icon.css'
import '/styles/review.css'
import '/styles/switchable.css'
import '/styles/textInput.css'
import '/styles/user.css'
import '/styles/year-slider.css'

import { inject } from '@vercel/analytics'

inject()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <UserContextProvider>
      <PopupContextProvider>
        <SkeletonTheme
          baseColor="#313131"
          highlightColor="#525252"
        >
          <App />
        </SkeletonTheme>
      </PopupContextProvider>
    </UserContextProvider>
  </BrowserRouter>
)
