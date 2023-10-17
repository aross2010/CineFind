import axios from 'axios'
import { createContext, useState, useEffect } from 'react'

export const UserContext = createContext({})

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(undefined)

  const fetchUser = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      await axios
        .get(`https://cinefindapi.vercel.app/auth/profile`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => setUser(res.data))
        .catch((e) => {
          setUser(null)
        })
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
