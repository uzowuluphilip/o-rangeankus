import React, { useState } from 'react'
import PinDotInput from './PinDotInput'
import ResetPinModal from './ResetPinModal'
import axiosInstance from '../../api/axios'
import { usePinContext } from '../../context/PinContext'

/**
 * PinPromptModal Component - Verify PIN before authorizing transaction
 * 
 * Props:
 *   isOpen               bool     Show/hide modal
 *   onClose              fn       Called when modal closes
 *   onSuccess            fn       Called when PIN verified successfully
 *   onFrozen             fn       Called when account gets frozen
 *   onForgotPin          fn       Called when user clicks "Forgot PIN"
 *   transactionDetails   obj      Optional - show recipient/amount (e.g. { recipient: "John", amount: "$500" })
 * 
 * Features:
 * - Shows transaction details if provided
 * - PIN verification via /pin/verify
 * - Tracks and displays remaining attempts
 * - Shows shake animation on error
 * - Auto-detects and handles account freeze
 * - Updates PinContext on state changes
 * - "Forgot PIN" link to reset PIN via email OTP
 */

export default function PinPromptModal({
  isOpen,
  onClose,
  onSuccess,
  onFrozen,
  onForgotPin,
  transactionDetails,
}) {
  const { updateAttempts, updateFrozen } = usePinContext()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [attemptsLeft, setLeft] = useState(5)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [showResetPin, setShowResetPin] = useState(false)

  if (!isOpen) return null

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handlePinChange = async (val) => {
    setPin(val)
    setError('')

    // Auto-submit when 4 digits entered
    if (val.length === 4) {
      setLoading(true)
      try {
        const res = await axiosInstance.post('/pin/verify', { pin: val })
        console.log('[PinPromptModal] PIN verified successfully')
        // PIN correct - clear and call success callback
        setPin('')
        setError('')
        onSuccess?.()
      } catch (err) {
        const data = err.response?.data
        console.log('[PinPromptModal] PIN verification failed:', data)
        setPin('')
        triggerShake()

        // Check if account is now frozen
        if (data?.is_frozen) {
          console.log('[PinPromptModal] Account frozen after failed attempt')
          updateFrozen(true)
          onFrozen?.()
          return
        }

        // Update attempts remaining
        const left = data?.attempts_remaining ?? Math.max(0, attemptsLeft - 1)
        setLeft(left)
        updateAttempts(data?.attempts_used ?? 0, left)

        // Show error message
        const errorMsg =
          data?.message || `Incorrect PIN. ${left} attempt${left !== 1 ? 's' : ''} remaining.`
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <>
      {/* Main PIN modal backdrop and card */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => {
          // Close on backdrop click
          if (e.target === e.currentTarget) onClose?.()
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: '2rem',
            width: '100%',
            maxWidth: 380,
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          }}
        >
          {/* Title */}
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8, color: '#1A1A1A' }}>
            Authorize Transfer
          </h2>

          {/* Transaction summary */}
          {transactionDetails && (
            <div
              style={{
                background: '#f5f5f5',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: '1rem',
                fontSize: 13,
              }}
            >
              <p style={{ margin: '4px 0', color: '#666' }}>
                To: <strong>{transactionDetails.recipient}</strong>
              </p>
              <p style={{ margin: '4px 0', color: '#666' }}>
                Amount: <strong>{transactionDetails.amount}</strong>
              </p>
            </div>
          )}

          <p style={{ fontSize: 13, color: '#888', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Enter your 4-digit transaction PIN to confirm.
          </p>

          {/* Attempts remaining indicator */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: '1rem' }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: i < 5 - attemptsLeft ? '#F0997B' : '#E87462',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#666', marginBottom: '1rem' }}>
            {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining
          </p>

          {/* PIN dot input with shake animation */}
          <div style={{ animation: shake ? 'pinShake 0.4s' : 'none' }}>
            <PinDotInput
              value={pin}
              onChange={handlePinChange}
              hasError={!!error}
              disabled={loading}
            />
          </div>

          {/* Error message */}
          {error && (
            <p
              style={{
                marginTop: '1rem',
                fontSize: 13,
                color: '#A32D2D',
                background: '#FCEBEB',
                padding: '10px 14px',
                borderRadius: 8,
                border: '0.5px solid #F0997B',
              }}
            >
              {error}
            </p>
          )}

          {/* Forgot PIN link - Always visible and functional */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('[PinPromptModal] Forgot PIN clicked - opening ResetPinModal')
              setShowResetPin(true)
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF6B00',
              fontSize: '0.875rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '8px 16px',
              margin: '0.5rem auto',
              display: 'block',
              fontWeight: 600,
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 999,
              transition: 'opacity 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            🔑 Forgot PIN? Reset it
          </button>

          {/* Cancel button */}
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              padding: '12px',
              borderRadius: 8,
              border: '0.5px solid #ccc',
              background: 'transparent',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 14,
              color: '#333',
              fontWeight: 500,
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* ✅ ResetPinModal rendered OUTSIDE the main modal div as sibling */}
      {showResetPin && (
        <ResetPinModal
          onClose={() => {
            console.log('[PinPromptModal] ResetPinModal closed')
            setShowResetPin(false)
          }}
          onSuccess={() => {
            console.log('[PinPromptModal] PIN reset successful')
            setShowResetPin(false)
          }}
        />
      )}

      {/* Shake animation */}
      <style>{`
        @keyframes pinShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </>
  )
}
