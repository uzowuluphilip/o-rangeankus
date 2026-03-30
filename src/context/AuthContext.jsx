import React, { createContext, useContext, useState, useEffect } from 'react'

/**
 * AuthContext - Manages global authentication state
 * Provides:
 * - user: Current logged-in user object
 * - token: JWT token stored in localStorage
 * - login: Function to authenticate and set user + token
 * - logout: Function to clear user and token
 */
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

  // Login user - stores token and user data
  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('authToken', authToken)
    localStorage.setItem('authUser', JSON.stringify(userData))
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
    logout
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
