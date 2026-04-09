import React, { useState } from 'react'
import PinDotInput from './PinDotInput'
import axiosInstance from '../../api/axios'
import { usePinContext } from '../../context/PinContext'

/**
 * PinSetupModal Component - Create PIN for first time
 * 
 * Props:
 *   isOpen       bool     Show/hide modal
 *   onClose      fn       Called when modal closes
 *   onSuccess    fn       Called after PIN is successfully created
 * 
 * Features:
 * - Step 1: Enter new PIN
 * - Step 2: Confirm PIN matches
 * - Error handling if PINs don't match
 * - Auto-advance to step 2 when 4 digits entered
 * - Back button to re-enter
 * - Disables input during API call
 */

export default function PinSetupModal({ isOpen, onClose, onSuccess }) {
  const { markPinSet } = usePinContext()
  const [step, setStep] = useState(1) // 1 = enter, 2 = confirm
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handlePinComplete = (val) => {
    setPin(val)
    setError('')
    // Auto-advance to step 2 when 4 digits entered
    if (val.length === 4) {
      setTimeout(() => {
        setStep(2)
        setConfirm('')
      }, 200)
    }
  }

  const handleConfirmComplete = async (val) => {
    setConfirm(val)
    setError('')
    // Auto-submit when 4 digits entered
    if (val.length === 4) {
      if (val !== pin) {
        setError('PINs do not match. Please try again.')
        // Clear confirm field after showing error
        setTimeout(() => {
          setConfirm('')
        }, 500)
        return
      }

      // Send PIN to backend
      setLoading(true)
      try {
        await axiosInstance.post('/pin/set', { pin: val })
        console.log('[PinSetupModal] PIN set successfully')
        markPinSet()
        onSuccess?.()
        // Close modal after success
        setTimeout(() => {
          onClose?.()
        }, 300)
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to set PIN. Please try again.'
        console.error('[PinSetupModal] Set PIN failed:', err.response?.data || err.message)
        setError(errorMsg)
        setConfirm('')
      } finally {
        setLoading(false)
      }
    }
  }

  const goBack = () => {
    setStep(1)
    setPin('')
    setConfirm('')
    setError('')
  }

  return (
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
        {/* Step indicator - progress dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: '1.5rem' }}>
          {[1, 2].map(s => (
            <div
              key={s}
              style={{
                width: 28,
                height: 4,
                borderRadius: 2,
                background: step >= s ? '#1D9E75' : '#ddd',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        {/* Title and description */}
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8, color: '#1A1A1A' }}>
          {step === 1 ? 'Create Transaction PIN' : 'Confirm Your PIN'}
        </h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {step === 1
            ? 'Enter a 4-digit PIN. You will use this to authorize every transfer.'
            : 'Re-enter your PIN to confirm it matches.'}
        </p>

        {/* PIN dot input */}
        <PinDotInput
          value={step === 1 ? pin : confirmPin}
          onChange={step === 1 ? handlePinComplete : handleConfirmComplete}
          hasError={!!error}
          disabled={loading}
        />

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

        {/* Buttons */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: 10 }}>
          {step === 2 && (
            <button
              onClick={goBack}
              disabled={loading}
              style={{
                flex: 1,
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
              Back
            </button>
          )}
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
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
    </div>
  )
}
