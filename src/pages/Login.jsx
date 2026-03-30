import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Mail, Lock, LogIn, Loader, Globe, DollarSign, Home } from 'lucide-react'
import axiosInstance from '../api/axios'
import './Auth.css'

/**
 * Login Page
 * 
 * Features:
 * - Email and password validation
 * - Form submission to POST /auth/login
 * - Stores JWT token in context and localStorage
 * - Redirects to dashboard on success
 * - Error handling and display
 * - Stunning modern design with light/dark mode
 */
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const { isDarkMode } = useTheme()

  // Validate form inputs
  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!password.trim()) {
      setError('Password is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    return true
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)
    try {
      console.log('[Login] Attempting login with email:', email)
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      })

      console.log('[Login] Success response:', response.data)

      // Extract user data and token from response
      const { user, token } = response.data.data || response.data

      if (!user || !token) {
        setError('Invalid response from server')
        setLoading(false)
        return
      }

      // Store in context and localStorage
      login(user, token)

      console.log('[Login] Login successful, redirecting to dashboard')
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error('[Login] Error:', err)
      const message = err.response?.data?.message || err.message || 'Login failed. Please check your credentials and try again.'
      console.error('[Login] Error message:', message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Left side - Branding (hidden on mobile) */}
        <div className="auth-brand">
          <div className="brand-content">
            <div className="brand-logo">💳</div>
            <h1>O-rangeankus</h1>
            <p>Your Financial Gateway</p>
            <div className="brand-features">
              <div className="feature"><DollarSign size={18} className="me-2" style={{ display: 'inline-block' }} /> Instant Transfers</div>
              <div className="feature"><Globe size={18} className="me-2" style={{display: 'inline-block'}} /> Global Banking</div>
              <div className="feature"><Lock size={18} className="me-2" style={{display: 'inline-block'}} /> Secure & Trusted</div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="auth-form-container">
          <div className="form-wrapper">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-link text-white mb-3 p-0"
              style={{ textDecoration: 'none', fontSize: '14px' }}
            >
              <Home size={16} className="me-1" style={{display: 'inline-block'}} />
              Back to Home
            </button>
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your account</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="alert alert-danger slide-in-up">
                <div className="alert-content">{error}</div>
                <button
                  className="alert-close"
                  onClick={() => setError('')}
                >
                  ×
                </button>
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email input */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="show-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="btn btn-primary btn-login"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">
              <span>or</span>
            </div>

            {/* Admin login link */}
            {/* <Link to="/admin" className="btn btn-secondary btn-full">
              Admin Login
            </Link> */}

            {/* Register link */}
            <p className="auth-footer">
              Don't have an account?{' '}
              <Link to="/register" className="link-primary">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
