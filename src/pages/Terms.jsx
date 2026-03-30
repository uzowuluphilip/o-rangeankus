import React from 'react'
import { Link } from 'react-router-dom'
import LandingNavbar from '../components/LandingNavbar'
import './PageInfo.css'

const Terms = () => {
  return (
    <div className="info-page">
      <LandingNavbar />

      <section className="info-hero">
        <div className="info-hero-content">
          <div className="info-hero-copy">
            <span className="eyebrow">Terms of Service</span>
            <h1>O-rangeankus Terms & Conditions</h1>
            <p>
              These terms describe how you may use the O-rangeankus platform, including account access,
              transfer services, privacy expectations, and security responsibilities.
            </p>
            <div className="info-hero-actions">
              <Link to="/" className="btn btn-primary">
                Back to Home
              </Link>
            </div>
          </div>

          <div className="info-hero-card">
            <div className="info-card">
              <h3>Important to know</h3>
              <p>
                By using O-rangeankus, you agree to our service terms, privacy standards, and transaction policies.
              </p>
              <div className="info-list">
                <div>
                  <span>Account use</span>
                  <p>Keep your credentials secure and notify us of any unauthorized access.</p>
                </div>
                <div>
                  <span>Transfers</span>
                  <p>All transfers must comply with applicable laws and bank policies.</p>
                </div>
                <div>
                  <span>Privacy</span>
                  <p>We process data securely and only as needed to provide services.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section terms-details">
        <div className="term-block">
          <h2>1. Your Account</h2>
          <p>
            You are responsible for keeping your login details safe. If you suspect unauthorized access,
            notify O-rangeankus immediately.
          </p>
        </div>
        <div className="term-block">
          <h2>2. Transfers & Payments</h2>
          <p>
            We process transfers according to the selected service. Fees and delivery times may vary
            depending on the destination and payment method.
          </p>
        </div>
        <div className="term-block">
          <h2>3. Privacy & Security</h2>
          <p>
            We use industry-standard encryption and monitor account activity to keep your information protected.
            We never sell your personal data.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Terms
