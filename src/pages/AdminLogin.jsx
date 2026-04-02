import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, LogIn, Loader, ShieldAlert } from 'lucide-react'
import axiosInstance from '../api/axios'
import './Auth.css'

/**
 * Admin Login Page
 * 
 * Features:
 * - Separate admin login endpoint: POST /admin/login
 * - Email and password validation
 * - Stores token with admin role
 * - Redirects to admin dashboard
 * - Stunning modern design with light/dark mode
 */
const AdminLogin = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

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
      console.log('[AdminLogin] Attempting to login with email:', email)
      const response = await axiosInstance.post('/admin/login', {
        email,
        password
      })

      console.log('[AdminLogin] Response:', response.data)

      // Extract admin user data and token from response
      const responseData = response.data.data || response.data
      console.log('[AdminLogin] Extracted data:', responseData)

      const { user, token } = responseData

      if (!user || !token) {
        setError('Invalid response from server. Missing user or token.')
        setLoading(false)
        return
      }

      console.log('[AdminLogin] User before update:', user)

      // Ensure admin role is set
      const adminUser = { ...user, role: 'admin' }
      console.log('[AdminLogin] Admin user after role set:', adminUser)

      // Store in context and localStorage
      login(adminUser, token)

      console.log('[AdminLogin] Login successful, redirecting to admin dashboard')
      // Redirect to admin dashboard
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('[AdminLogin] Login error:', err)
      const message = err.response?.data?.message || err.message || 'Admin login failed. Please try again.'
      console.error('[AdminLogin] Error message:', message)
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
            <div className="brand-logo" style={{ fontSize: '4rem' }}>🔐</div>
            <h1>Admin Portal</h1>
            <p>Secure Administration</p>
            <div className="brand-features">
              <div className="feature">📊 Dashboard & Analytics</div>
              <div className="feature">👥 User Management</div>
              <div className="feature"><Lock size={18} className="me-2" style={{display: 'inline-block'}} /> Restricted Access</div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="auth-form-container">
          <div className="form-wrapper">
            <div className="admin-badge">
              <ShieldAlert size={20} />
              Authorized Personnel Only
            </div>

            <div className="form-header">
              <h2>Admin Login</h2>
              <p>Access the administration panel</p>
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
                <label htmlFor="email">Admin Email</label>
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="admin@orangebank.com"
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
                    Sign In as Admin
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">
              <span>or</span>
            </div>

            {/* User login link */}
            <Link to="/login" className="btn btn-secondary btn-full">
              User Login
            </Link>

            {/* Support message */}
            <p className="auth-footer admin-notice">
              This area is restricted to authorized administrators only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
