import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import axiosInstance from '../api/axios'
import './Auth.css'

/**
 * Forgot Password Page
 * 
 * Features:
 * - Email input for password reset request
 * - Validation
 * - POST /auth/forgot-password endpoint
 * - Success/error notifications
 * - Link back to login
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isDarkMode } = useTheme()

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateEmail()) return

    setLoading(true)
    try {
      const response = await axiosInstance.post('/auth/forgot-password', {
        email
      })

      if (response.data.success) {
        setSuccess(true)
        setEmail('')
      } else {
        setError(response.data.message || 'Failed to send reset link')
      }
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-brand">
            <div className="brand-content">
              <div className="brand-logo">💳</div>
              <h1>Orange Bank</h1>
              <p>Your Financial Gateway</p>
            </div>
          </div>

          <div className="auth-form-container">
            <div className="card">
              <div className="card-body p-5">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <CheckCircle size={64} color="#4ade80" style={{ marginBottom: '20px' }} />
                  <h2 style={{ color: '#4ade80', marginBottom: '15px' }}>Check Your Email</h2>
                  <p style={{ color: '#b0b0b0', marginBottom: '10px' }}>
                    We've sent a password reset link to:
                  </p>
                  <p style={{ color: 'white', fontWeight: 'bold', marginBottom: '30px' }}>
                    {email}
                  </p>
                  <p style={{ color: '#b0b0b0', fontSize: '14px', marginBottom: '30px' }}>
                    Click the link in the email to reset your password. The link will expire in 24 hours.
                  </p>
                  <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block' }}>
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-brand">
          <div className="brand-content">
            <div className="brand-logo">💳</div>
            <h1>Orange Bank</h1>
            <p>Your Financial Gateway</p>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="card">
            <div className="card-body p-5">
              <h2 className="text-center text-primary-text mb-3">Forgot Password?</h2>
              <p className="text-secondary text-center mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setError('')}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label text-primary-text">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-primary-orange">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      className="form-control bg-dark border-secondary text-light"
                      id="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="text-center">
                <Link to="/login" className="text-primary-orange text-decoration-none">
                  <ArrowLeft size={16} style={{ display: 'inline-block', marginRight: '8px' }} />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
