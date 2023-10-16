import axios from 'axios'
import { createContext, useState, useEffect } from 'react'

export const UserContext = createContext({})

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const res = await axios.get(
          `https://cinefindapi.vercel.app/auth/profile`,
          {
            withCredentials: true,
          }
        )
        console.log(res)
        if (res.data) setUser(res.data)
        else setUser(null)
      }
      // setUser(null)
    }
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
