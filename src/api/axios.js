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
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
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