import { createContext, useState, useEffect } from 'react'

export const PopupContext = createContext({})

export function PopupContextProvider({ children }) {
  const [popup, setPopup] = useState({
    active: false,
    msg: '',
    success: false,
  })

  return (
    <PopupContext.Provider
      value={{
        popup,
        setPopup,
      }}
    >
      {children}
    </PopupContext.Provider>
  )
}
