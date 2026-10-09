import React, { createContext, useContext, useState, useEffect } from 'react'
import { getProfilePictureUrl } from '../utils/profilePictureUrl'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Persist session on mount - check localStorage for existing token
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('authUser')
      
      // Only proceed if both exist and are not null/undefined
      if (storedToken && typeof storedToken === 'string' && storedUser && typeof storedUser === 'string') {
        // Make sure it's valid JSON before parsing
        if (storedUser !== 'undefined' && storedUser !== 'null') {
          try {
            const parsedUser = JSON.parse(storedUser)
            // Ensure profile_picture URL is full
            if (parsedUser.profile_picture) {
              // If it's just a filename (no slashes), construct the full path
              if (!parsedUser.profile_picture.includes('/') && parsedUser.profile_picture.includes('user_')) {
                parsedUser.profile_picture = getProfilePictureUrl(parsedUser.profile_picture)
              } else {
                parsedUser.profile_picture = getProfilePictureUrl(parsedUser.profile_picture)
              }
            }
            setToken(storedToken)
            setUser(parsedUser)
          } catch (parseError) {
            console.error('Invalid JSON in localStorage:', parseError)
            localStorage.removeItem('authToken')
            localStorage.removeItem('authUser')
          }
        }
      }
    } catch (error) {
      console.error('Failed to restore session from localStorage:', error)
      // Clear invalid data
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
    }
    
    setLoading(false)
  }, [])

  // Update profile picture in state
  const updateProfilePicture = (url) => {
    // Handle null (removal), relative paths, and full URLs
    let fullUrl = url
    
    if (url === null || url === undefined) {
      fullUrl = null
    } else if (typeof url === 'string') {
      // If it's just a filename (no slashes), construct the full path
      if (!url.includes('/') && url.includes('user_')) {
        fullUrl = getProfilePictureUrl(url)
      } else {
        fullUrl = getProfilePictureUrl(url)
      }
    }
    
    setUser(prev => ({ 
      ...prev, 
      profile_picture: fullUrl
    }))
    // Also update localStorage
    const storedUser = JSON.parse(localStorage.getItem('authUser') || '{}')
    storedUser.profile_picture = fullUrl
    localStorage.setItem('authUser', JSON.stringify(storedUser))
  }

  // Login user - stores token and user data
  const login = (userData, authToken) => {
    // Build full profile picture URL if it's a relative path
    const userWithFullUrl = {
      ...userData,
      profile_picture: getProfilePictureUrl(userData?.profile_picture)
    }
    setUser(userWithFullUrl)
    setToken(authToken)
    localStorage.setItem('authToken', authToken)
    localStorage.setItem('authUser', JSON.stringify(userWithFullUrl))
  }

  // Logout user - clears all auth data
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    updateProfilePicture
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
