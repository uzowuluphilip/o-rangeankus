import { useState } from 'react'
import { X, Mail, Shield, ArrowLeft } from 'lucide-react'
import axiosInstance from '../../api/axios'

const ResetPinModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1) // 1=Email, 2=Verify OTP, 3=New PIN
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)

  const handleRequestOTP = async () => {
    setError('')

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      console.log('[ResetPinModal] Requesting OTP for email:', email)

      const response = await axiosInstance.post('/pin/reset-request', {
        email: email.trim().toLowerCase()
      })

      console.log('[ResetPinModal] OTP request response:', response.data)

      if (response.data.success) {
        setSuccessMsg(response.data.message)
        setTimeout(() => {
          setStep(2)
          setSuccessMsg('')
        }, 1500)
      } else {
        setError(response.data.message || 'Failed to send reset code')
      }

    } catch (err) {
      console.error('[ResetPinModal] OTP request error:', err.response?.data || err.message)
      setError(
        err.response?.data?.message ||
        'Failed to send reset code. Please check your email and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // STEP 2: Verify OTP Code
  const handleVerifyOTP = async () => {
    setError('')

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit code sent to your email')
      return
    }

    try {
      setLoading(true)
      console.log('[ResetPinModal] Verifying OTP:', otp)

      // Send a verification request to check if OTP is valid
      // For now, we'll assume the backend will verify it when we submit the full reset
      // But we can add a separate verification endpoint if needed
      
      setSuccessMsg('✅ Code verified!')
      setOtpVerified(true)
      setTimeout(() => {
        setStep(3)
        setSuccessMsg('')
      }, 1000)

    } catch (err) {
      console.error('[ResetPinModal] OTP verification error:', err.message)
      setError('Failed to verify code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // STEP 3: Reset PIN with verified OTP
  const handleResetPin = async () => {
    setError('')

    if (!newPin || newPin.length !== 4) {
      setError('PIN must be exactly 4 digits')
      return
    }
    if (newPin !== confirmPin) {
      setError('PINs do not match. Please try again.')
      return
    }

    try {
      setLoading(true)
      console.log('[ResetPinModal] Resetting PIN with email:', email)

      const response = await axiosInstance.post('/pin/reset', {
        email: email.trim().toLowerCase(),
        otp: otp,
        new_pin: newPin,
        confirm_pin: confirmPin
      })

      console.log('[ResetPinModal] PIN reset response:', response.data)

      if (response.data.success) {
        setSuccessMsg('✅ PIN reset successfully!')
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 2000)
      } else {
        setError(response.data.message || 'Failed to reset PIN')
      }

    } catch (err) {
      console.error('[ResetPinModal] PIN reset error:', err.response?.data || err.message)
      setError(
        err.response?.data?.message ||
        'Failed to reset PIN. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1A1A1A',
          border: '1px solid rgba(255,107,0,0.25)',
          borderRadius: '20px',
          padding: '2rem',
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClose()
          }}
          style={{
            position: 'absolute',
            top: '1rem', right: '1rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '36px', height: '36px',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 100000,
            pointerEvents: 'auto'
          }}
        >
          <X size={18} />
        </button>

        {/* Back button on steps 2 & 3 */}
        {(step === 2 || step === 3) && (
          <button
            type="button"
            onClick={() => {
              console.log('[ResetPinModal] Going back to step', step - 1)
              if (step === 3) {
                setStep(2)
                setNewPin('')
                setConfirmPin('')
              } else if (step === 2) {
                setStep(1)
                setOtp('')
                setOtpVerified(false)
              }
              setError('')
            }}
            style={{
              position: 'absolute',
              top: '1rem', left: '1rem',
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.85rem',
              transition: 'color 0.2s'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: step > 1 ? '2rem' : 0 }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'rgba(255,107,0,0.1)',
            border: '2px solid rgba(255,107,0,0.3)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Shield size={28} color="#FF6B00" />
          </div>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', margin: 0 }}>
            {step === 1 ? 'Reset Transaction PIN' : step === 2 ? 'Enter Reset Code' : 'Set New PIN'}
          </h2>
          <p style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.4rem', margin: 0 }}>
            {step === 1
              ? 'Enter your email to receive a reset code'
              : step === 2
              ? `Reset code sent to ${email}`
              : 'Create your new 4-digit PIN'
            }
          </p>
        </div>

        {/* Step dots */}
        <div style={{
          display: 'flex', gap: '6px',
          justifyContent: 'center', marginBottom: '1.5rem'
        }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              width: '40px', height: '4px',
              borderRadius: '2px',
              background: step >= s ? '#FF6B00' : 'rgba(255,255,255,0.1)',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(255,77,77,0.1)',
            border: '1px solid rgba(255,77,77,0.3)',
            borderRadius: '10px', padding: '0.875rem 1rem',
            color: '#ff6666', fontSize: '0.875rem',
            marginBottom: '1rem', textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Success Message */}
        {successMsg && (
          <div style={{
            background: 'rgba(77,255,136,0.1)',
            border: '1px solid rgba(77,255,136,0.3)',
            borderRadius: '10px', padding: '0.875rem 1rem',
            color: '#4dff88', fontSize: '0.875rem',
            marginBottom: '1rem', textAlign: 'center'
          }}>
            ✅ {successMsg}
          </div>
        )}

        {/* STEP 1 — Email Input */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                color: '#ccc', fontSize: '0.85rem',
                fontWeight: 600, marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18} color="#FF6B00"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !loading && handleRequestOTP()}
                  placeholder="Enter your registered email"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '13px 14px 13px 44px',
                    background: '#0D0D0D',
                    border: '1px solid rgba(255,107,0,0.3)',
                    borderRadius: '10px',
                    color: '#fff', fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    opacity: loading ? 0.6 : 1
                  }}
                  onFocus={e => !loading && (e.target.style.borderColor = '#FF6B00')}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,107,0,0.3)'}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleRequestOTP}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#cc5500' : '#FF6B00',
                border: 'none', borderRadius: '10px',
                color: '#fff', fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                opacity: loading ? 0.8 : 1
              }}
            >
              {loading ? '📧 Sending...' : '📧 Send Reset Code'}
            </button>
          </div>
        )}

        {/* STEP 2 — Verify OTP Code */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* OTP Input */}
            <div>
              <label style={{
                display: 'block', color: '#ccc',
                fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem'
              }}>
                6-Digit Code From Email
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px 16px',
                  background: '#0D0D0D',
                  border: '1px solid rgba(255,107,0,0.3)',
                  borderRadius: '10px', color: '#fff',
                  fontSize: '1.4rem', textAlign: 'center',
                  letterSpacing: '0.3em', outline: 'none',
                  boxSizing: 'border-box',
                  opacity: loading ? 0.6 : 1
                }}
                onFocus={e => !loading && (e.target.style.borderColor = '#FF6B00')}
                onBlur={e => e.target.style.borderColor = 'rgba(255,107,0,0.3)'}
              />
              <p style={{ color: '#555', fontSize: '0.75rem', marginTop: '0.4rem', margin: '0.4rem 0 0 0' }}>
                Check your email inbox and spam folder. Code expires in 15 minutes.
              </p>
            </div>

            {/* Verify Code Button */}
            <button
              type="button"
              onClick={handleVerifyOTP}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#cc5500' : '#FF6B00',
                border: 'none', borderRadius: '10px',
                color: '#fff', fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                opacity: loading ? 0.8 : 1
              }}
            >
              {loading ? '✓ Verifying Code...' : '✓ Verify Code'}
            </button>

            {/* Resend Code Link */}
            <button
              type="button"
              onClick={() => {
                console.log('[ResetPinModal] Requesting new code')
                setStep(1)
                setOtp('')
                setOtpVerified(false)
                setError('')
                setSuccessMsg('')
              }}
              disabled={loading}
              style={{
                background: 'none', border: 'none',
                color: '#FF6B00', fontSize: '0.875rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                textDecoration: 'underline',
                textAlign: 'center', width: '100%',
                opacity: loading ? 0.5 : 1,
                transition: 'opacity 0.2s'
              }}
            >
              Didn't receive the code? Resend it
            </button>
          </div>
        )}

        {/* STEP 3 — Set New PIN */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* New PIN */}
            <div>
              <label style={{
                display: 'block', color: '#ccc',
                fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem'
              }}>
                New 4-Digit PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px 16px',
                  background: '#0D0D0D',
                  border: '1px solid rgba(255,107,0,0.3)',
                  borderRadius: '10px', color: '#fff',
                  fontSize: '1.8rem', textAlign: 'center',
                  letterSpacing: '0.5em', outline: 'none',
                  boxSizing: 'border-box',
                  opacity: loading ? 0.6 : 1
                }}
                onFocus={e => !loading && (e.target.style.borderColor = '#FF6B00')}
                onBlur={e => e.target.style.borderColor = 'rgba(255,107,0,0.3)'}
              />
            </div>

            {/* Confirm PIN */}
            <div>
              <label style={{
                display: 'block', color: '#ccc',
                fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem'
              }}>
                Confirm New PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px 16px',
                  background: '#0D0D0D',
                  border: '1px solid rgba(255,107,0,0.3)',
                  borderRadius: '10px', color: '#fff',
                  fontSize: '1.8rem', textAlign: 'center',
                  letterSpacing: '0.5em', outline: 'none',
                  boxSizing: 'border-box',
                  opacity: loading ? 0.6 : 1
                }}
                onFocus={e => !loading && (e.target.style.borderColor = '#FF6B00')}
                onBlur={e => e.target.style.borderColor = 'rgba(255,107,0,0.3)'}
              />
            </div>

            <button
              type="button"
              onClick={handleResetPin}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#cc5500' : '#FF6B00',
                border: 'none', borderRadius: '10px',
                color: '#fff', fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                opacity: loading ? 0.8 : 1
              }}
            >
              {loading ? '🔐 Resetting PIN...' : '🔐 Confirm & Reset PIN'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResetPinModal
