import React, { useState, useEffect, useRef } from 'react'

/**
 * PinDotInput Component - Reusable 4-digit PIN input
 * 
 * Props:
 *   value        string   current PIN string e.g. "12"
 *   onChange     fn       called with new string on each keypress
 *   hasError     bool     turns dots red when true
 *   disabled     bool     disables input
 * 
 * Features:
 * - Shows 4 dots, fills as user types
 * - Hides actual PIN characters for security
 * - Error state styling (red border/background)
 * - Auto-focus for better UX
 * - Mobile-friendly with hidden input
 */

export default function PinDotInput({ value = '', onChange, hasError, disabled }) {
  const inputRef = useRef()

  // Auto-focus input when enabled
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [disabled])

  // Handle input changes - only allow digits, max 4
  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    onChange(val)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      {/* Dot display - 4 dots showing filled/error/empty state */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            onClick={() => !disabled && inputRef.current?.focus()}
            style={{
              width: 52,
              height: 56,
              borderRadius: 8,
              border: `1.5px solid ${
                hasError
                  ? '#E24B4A'
                  : value.length > i
                  ? '#1D9E75'
                  : '#ccc'
              }`,
              background: hasError ? '#FCEBEB' : '#f9f9f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: hasError ? '#E24B4A' : '#1A1A1A',
              fontWeight: 'bold',
              cursor: disabled ? 'default' : 'text',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            {value.length > i ? '●' : ''}
          </div>
        ))}
      </div>

      {/* Hidden real input - mobile keyboard friendly */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 1,
          height: 1,
          pointerEvents: 'none',
        }}
        aria-label="Transaction PIN input"
      />
    </div>
  )
}
