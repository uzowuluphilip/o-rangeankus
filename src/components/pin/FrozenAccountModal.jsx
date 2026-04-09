import React from 'react'

/**
 * FrozenAccountModal Component - Display when account is frozen
 * 
 * Props:
 *   isOpen    bool   Show/hide modal
 *   onLogout  fn     Called when user dismisses - should trigger logout
 * 
 * Features:
 * - Shows lock icon and warning message
 * - Explains why account is frozen
 * - Directs user to contact support
 * - Logout button with modal dismissal
 */

export default function FrozenAccountModal({ isOpen, onLogout }) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
        {/* Lock icon */}
        <div style={{ fontSize: 48, marginBottom: '1rem' }}>🔒</div>

        {/* Title */}
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#993C1D',
            marginBottom: 12,
          }}
        >
          Account Frozen
        </h2>

        {/* Warning message */}
        <p
          style={{
            fontSize: 13,
            color: '#D85A30',
            lineHeight: 1.6,
            background: '#FAECE7',
            padding: '12px 14px',
            borderRadius: 8,
            border: '0.5px solid #F0997B',
            marginBottom: '1.5rem',
          }}
        >
          Your account has been frozen after too many incorrect PIN attempts.
          <br />
          <br />
          Please contact your branch or support to unfreeze your account before
          trying again.
        </p>

        {/* Contact info */}
        <p style={{ fontSize: 12, color: '#888', marginBottom: '1.5rem' }}>
          Support Email: support@orangebank.com
          <br />
          Support Phone: 1-800-ORANGE-1
        </p>

        {/* Logout button */}
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 8,
            background: '#1D9E75',
            color: '#fff',
            border: 'none',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#18845f'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#1D9E75'
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  )
}
