import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './context/userContext'
import { PopupContextProvider } from './context/popupContext'
import { SkeletonTheme } from 'react-loading-skeleton'

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
