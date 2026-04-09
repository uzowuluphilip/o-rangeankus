import axios from 'axios'

/**
 * Axios Configuration
 * 
 * Creates a configured axios instance with:
 * - Base URL pointing to the backend public folder
 * - Authorization header with JWT token
 * - Global error handling for 401 responses
 * - Response timeout handling
 */

// Create axios instance with base URL (WITHOUT /api - it's in the endpoint paths)
const axiosInstance = axios.create({
  baseURL: 'https://api.orangeankus.com',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Request Interceptor
 * Attaches JWT token from localStorage to every request
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handles global errors like 401 (Unauthorized)
 * ✅ Does NOT logout on PIN errors or frozen account warnings
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const status = error.response?.status
    const isPinError = error.response?.data?.pin_error === true
    const isFrozenWarning = error.response?.data?.is_frozen === true
    const url = error.config?.url || ''
    
    // Check if this is a PIN-related endpoint
    const isPinEndpoint = 
      url.includes('/pin/verify') ||
      url.includes('/pin/set') ||
      url.includes('/pin/check') ||
      url.includes('/pin/reset')

    // ✅ Only logout on REAL authentication failures
    // NOT on wrong PIN (pin_error=true), frozen account (is_frozen=true), or PIN endpoints
    if (status === 401 && !isPinError && !isFrozenWarning && !isPinEndpoint) {
      // Real auth failure - token expired or invalid
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      window.location.href = '/login'
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance