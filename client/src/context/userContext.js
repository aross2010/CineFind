import axios from 'axios'
import { createContext, useState, useEffect } from 'react'

export const UserContext = createContext({})

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      console.log('token present')
    }
    setUser(null)
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
