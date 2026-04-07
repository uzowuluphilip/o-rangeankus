import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import axiosInstance from '../api/axios'
import './Auth.css'

/**
 * Reset Password Page
 * 
 * Features:
 * - Password input with strength indicator
 * - Confirm password verification
 * - Token validation from URL
 * - POST /auth/reset-password endpoint
 * - Success/error notifications
 * - Redirect to login on success
 */
const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [invalidToken, setInvalidToken] = useState(false)
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setInvalidToken(true)
    }
  }, [token])

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 6) strength += 1
    if (password.length >= 10) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[!@#$%^&*]/.test(password)) strength += 1

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Weak', color: '#ff6b6b' },
      { strength: 2, label: 'Fair', color: '#ffa500' },
      { strength: 3, label: 'Good', color: '#ffeb3b' },
      { strength: 4, label: 'Strong', color: '#4ade80' },
      { strength: 5, label: 'Very Strong', color: '#00bb00' }
    ]

    return levels[strength]
  }

  const validateForm = () => {
    if (!password.trim()) {
      setError('Password is required')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    if (!confirmPassword.trim()) {
      setError('Please confirm your password')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        token,
        password
      })

      if (response.data.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(response.data.message || 'Failed to reset password')
      }
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const strength = getPasswordStrength()

  if (invalidToken) {
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
                  <AlertCircle size={64} color="#ff6b6b" style={{ marginBottom: '20px' }} />
                  <h2 style={{ color: '#ff6b6b', marginBottom: '15px' }}>Invalid Reset Link</h2>
                  <p style={{ color: '#b0b0b0', marginBottom: '30px' }}>
                    The password reset link is missing or invalid. Please request a new one from the login page.
                  </p>
                  <a href="/login" className="btn btn-primary" style={{ display: 'inline-block' }}>
                    Go to Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
                  <h2 style={{ color: '#4ade80', marginBottom: '15px' }}>Password Reset Successful!</h2>
                  <p style={{ color: '#b0b0b0', marginBottom: '30px' }}>
                    Your password has been reset successfully. Redirecting to login...
                  </p>
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
              <h2 className="text-center text-primary-text mb-3">Reset Password</h2>
              <p className="text-secondary text-center mb-4">
                Enter your new password below.
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
                  <label htmlFor="password" className="form-label text-primary-text">
                    New Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-primary-orange">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control bg-dark border-secondary text-light"
                      id="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary bg-dark border-secondary text-light"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {password && (
                    <div style={{ marginTop: '10px' }}>
                      <small className="text-secondary">
                        Password Strength:{' '}
                        <span style={{ color: strength.color, fontWeight: 'bold' }}>
                          {strength.label}
                        </span>
                      </small>
                      <div style={{
                        height: '4px',
                        backgroundColor: '#2a3f5f',
                        borderRadius: '2px',
                        marginTop: '5px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          backgroundColor: strength.color,
                          width: `${(strength.strength / 5) * 100}%`,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label text-primary-text">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-primary-orange">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      className="form-control bg-dark border-secondary text-light"
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary bg-dark border-secondary text-light"
                      onClick={() => setShowConfirm(!showConfirm)}
                      disabled={loading}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {confirmPassword && password === confirmPassword && (
                    <small className="text-success" style={{ display: 'block', marginTop: '5px' }}>
                      ✓ Passwords match
                    </small>
                  )}
                  {confirmPassword && password !== confirmPassword && (
                    <small className="text-danger" style={{ display: 'block', marginTop: '5px' }}>
                      ✗ Passwords do not match
                    </small>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
