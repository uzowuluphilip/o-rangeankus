import React from 'react'
import './BankLogo.css'

/**
 * BankLogo Component
 * 
 * A reusable, professional bank logo with geometric icon and text.
 * Professional bank-style typography with responsive design.
 * 
 * Usage:
 * <BankLogo />
 */
const BankLogo = () => {
  return (
    <div className="bank-logo">
      <div className="logo-content">
        {/* <div className="logo-top">ORANGE</div> */}
        <div className="logo-middle">O-rangeankus</div>
        <div className="logo-bottom">BANK&TRUST</div>
      </div>
    </div>
  )
}

export default BankLogo
