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

document.body.style.background =
  '#14181c url(https://s.ltrbxd.com/static/img/content-bg.0d9a0f0f.png) 0 -1px repeat-x'

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
