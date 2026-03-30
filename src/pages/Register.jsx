import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, UserPlus, Loader, Globe, DollarSign, Home } from 'lucide-react'
import axiosInstance from '../api/axios'
import './Auth.css'

/**
 * Register Page
 * 
 * Features:
 * - Full name, email, password validation
 * - Password confirmation check
 * - Form submission to POST /auth/register
 * - Auto-login after successful registration
 * - Stunning modern design with light/dark mode
 */
const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Validate form inputs
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required')
      return false
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
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
      console.log('[Register] Submitting form with data:', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email
      })

      const response = await axiosInstance.post('/auth/register', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password
      })

      console.log('[Register] Response:', response.data)

      // Extract user data and token from response
      const { user, token } = response.data.data || response.data

      if (!user || !token) {
        console.error('[Register] Missing user or token in response:', response.data)
        setError('Invalid response from server')
        setLoading(false)
        return
      }

      console.log('[Register] User registered successfully:', user)
      
      // Show success message briefly
      setError('') // Clear any errors
      
      // Store in context and localStorage
      login(user, token)

      console.log('[Register] Login successful, redirecting to dashboard')
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error('[Register] Error occurred:', err)
      console.error('[Register] Error response:', err.response?.data)
      
      const message = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || 'Registration failed. Please try again.'
      
      console.error('[Register] Final error message:', message)
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

        {/* Right side - Registration Form */}
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
              <h2>Create Account</h2>
              <p>Join O-rangeankus today</p>
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

            {/* Registration form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {/* First Name input */}
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Last Name input */}
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Email input */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
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
                <small className="password-hint">At least 6 characters</small>
              </div>

              {/* Confirm password input */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="show-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="auth-footer">
              Already have an account?{' '}
              <Link to="/login" className="link-primary">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
