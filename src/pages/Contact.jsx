import React from 'react'
import { Link } from 'react-router-dom'
import LandingNavbar from '../components/LandingNavbar'
import './PageInfo.css'

const Contact = () => {
  return (
    <div className="info-page">
      <LandingNavbar />

      <section className="info-hero">
        <div className="info-hero-content">
          <div className="info-hero-copy">
            <span className="eyebrow">Contact Us</span>
            <h1>Talk to O-rangeankus Support</h1>
            <p>
              Have a question or need help with your account? Our support team is available 24/7
              to assist with transfers, deposits, account setup, and security.
            </p>
            <div className="info-hero-actions">
              <Link to="/" className="btn btn-primary">
                Back to Home
              </Link>
            </div>
          </div>

          <div className="info-hero-card">
            <div className="info-card">
              <h3>Need help fast?</h3>
              <p>Pick the channel that works best for you.</p>
              <div className="info-list">
                <div>
                  <span>Email</span>
                  <p>support@O-rangeankus.com</p>
                </div>
                <div>
                  <span>Phone</span>
                  <p>+1 (123) 347-638</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-cards">
          <div className="info-card info-card-alt">
            <h3 style={{ color: '#000' }}>Report an Issue</h3>
            <p>
              If you believe there is suspicious activity on your account, contact us immediately and we will
              begin an investigation right away.
            </p>
          </div>
          <div className="info-card info-card-alt">
            <h3 style={{ color: '#000' }}>Account Guidance</h3>
            <p>
              Need help setting up direct deposit, transfers, or security settings? Our experts are
              here to guide you every step of the way.
            </p>
          </div>
          <div className="info-card info-card-alt">
            <h3 style={{ color: '#000' }}>Feedback</h3>
            <p>
              Your feedback helps us improve O-rangeankus. Share your ideas and we’ll use them to
              make banking simpler and safer.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
