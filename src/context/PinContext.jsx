import React, { createContext, useContext, useState, useCallback } from 'react'
import axiosInstance from '../api/axios'

/**
 * PinContext - Manages PIN security state globally
 * 
 * Tracks:
 * - hasPinSet: Whether user has created a PIN
 * - isFrozen: Whether account is frozen due to failed attempts
 * - attemptsUsed: Number of failed PIN attempts
 * - attemptsLeft: Remaining attempts before freeze
 * 
 * Provides methods:
 * - checkPinStatus: Fetch current PIN state from backend
 * - updateFrozen: Update frozen status
 * - updateAttempts: Update attempt counters
 * - markPinSet: Mark PIN as created
 */

const PinContext = createContext()

export function PinProvider({ children }) {
  const [pinState, setPinState] = useState({
    hasPinSet: false,
    isFrozen: false,
    attemptsUsed: 0,
    attemptsLeft: 5,
  })

  // Call this on app load or after login to sync PIN status with backend
  const checkPinStatus = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/pin/check')
      setPinState(prev => ({
        ...prev,
        hasPinSet: res.data.has_pin || false,
        isFrozen: res.data.is_frozen || false,
        attemptsUsed: res.data.attempts_used || 0,
        attemptsLeft: res.data.attempts_remaining || 5,
      }))
      return res.data
    } catch (err) {
      console.error('[PinContext] checkPinStatus failed:', err.response?.data || err.message)
      // Return default state if check fails
      return null
    }
  }, [])

  const updateFrozen = (frozen) => {
    setPinState(prev => ({ ...prev, isFrozen: frozen }))
  }

  const updateAttempts = (used, left) => {
    setPinState(prev => ({
      ...prev,
      attemptsUsed: used,
      attemptsLeft: left,
    }))
  }

  const markPinSet = () => {
    setPinState(prev => ({ ...prev, hasPinSet: true, attemptsUsed: 0 }))
  }

  const value = {
    pinState,
    checkPinStatus,
    updateFrozen,
    updateAttempts,
    markPinSet,
  }

  return (
    <PinContext.Provider value={value}>
      {children}
    </PinContext.Provider>
  )
}

export function usePinContext() {
  const context = useContext(PinContext)
  if (!context) {
    throw new Error('usePinContext must be used within PinProvider')
  }
  return context
}
