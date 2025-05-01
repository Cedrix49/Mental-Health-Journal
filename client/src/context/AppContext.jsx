import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContent = createContext()

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(false)

  // Fetch basic user data AND last journal entry summary
  const getUserData = async () => {
    try {
      // 1) Basic user info
      const { data: userRes } = await axios.get(`${backendUrl}/api/user/data`)
      if (!userRes.success) {
        toast.error(userRes.message)
        return
      }

      const user = userRes.userData

      // 2) Last journal entry summary
      try {
        const { data: lastRes } = await axios.get(`${backendUrl}/api/journal/last-entry`)
        if (lastRes.success && lastRes.hasEntry) {
          user.lastMood = lastRes.lastMood
          user.lastEntryDate = lastRes.lastEntryDate
        }
      } catch (lastErr) {
        console.error('Failed to fetch last entry:', lastErr)
      }

      setUserData(user)
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Check auth state, then load user data
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`)
      if (data.success) {
        setIsLoggedIn(true)
        await getUserData()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getAuthState()
  }, [])
  
  const value = {
    backendUrl,
    isLoggedIn, setIsLoggedIn,
    userData, setUserData,
    getUserData
  }

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  )
}
