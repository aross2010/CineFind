import axios from 'axios'
import { createContext, useState, useEffect } from 'react'

export const UserContext = createContext({})

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const fetchUser = async () => {
      // if (!user) {
      //   const { data } = await axios.get(
      //     `https://www.cinefindapi.vercel.app/auth/profile`,
      //     {
      //       withCredentials: true,
      //     }
      //   )

      //   if (data) setUser(data)
      //   else setUser(null)
      // }
      setUser(null)
    }
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
