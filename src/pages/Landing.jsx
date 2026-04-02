import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Globe, Shield, Clock, TrendingUp, Lock } from 'lucide-react'
import LandingNavbar from '../components/LandingNavbar'
import ScrollToTopButton from '../components/ScrollToTopButton'
import './Landing.css'

/**
 * Landing Page
 * 
 * Professional banking landing page featuring:
 * - Hero section with value proposition
 * - Key features showcase
 * - How it works section
 * - Security & trust section
 * - CTA section
 * - Footer
 */
const Landing = () => {
  return (
    <div className="landing-page">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Modern Banking at Your Fingertips</h1>
            <p className="hero-subtitle">
              Fast, secure, and simple. Experience the future of banking with O-rangeankus.
              Manage your money, transfer funds globally, and grow your wealth all in one place.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary-large">
                Open Account Today
              </Link>
              <Link to="/login" className="btn btn-secondary-large">
                Already a Customer?
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-back" />
              <div className="card-front">
                <div className="card-top">
                  <div className="chip" />
                  <div className="contactless">• •</div>
                </div>
                <div className="card-brand">O-rangeankus</div>
                <div className="card-number">5248 9021 6743 2105</div>
                <div className="card-row">
                  <div className="card-info">
                    <span>Cardholder</span>
                    <strong>******</strong>
                  </div>
                  <div className="card-info">
                    <span>Expires</span>
                    <strong>******</strong>
                  </div>
                </div>
                <div className="card-dots">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="features-section">
        <div className="section-header">
          <h2>Powerful Features for Modern Banking</h2>
          <p>Everything you need to manage your finances seamlessly</p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon primary">
              <Zap size={32} />
            </div>
            <h3>Wire Transfers</h3>
            <p>
              Fast domestic and international wire transfers with competitive rates and real-time tracking.
              Send money to anyone, anywhere, anytime.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon success">
              <Globe size={32} />
            </div>
            <h3>International Transfers</h3>
            <p>
              Send money globally with multi-currency support. Transparent fees and real exchange rates
              make international banking simple.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon info">
              <TrendingUp size={32} />
            </div>
            <h3>Direct Deposit</h3>
            <p>
              Set up direct deposit for your salary and get your paycheck faster. Automatic, reliable,
              and completely secure.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-icon warning">
              <Clock size={32} />
            </div>
            <h3>24/7 Access</h3>
            <p>
              Bank whenever you want. Our platform is available around the clock for your convenience.
              No downtime, no limits.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="feature-card">
            <div className="feature-icon success">
              <Lock size={32} />
            </div>
            <h3>Bank-Grade Security</h3>
            <p>
              Your data is protected with military-grade encryption. We comply with all major banking
              regulations and security standards.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="feature-card">
            <div className="feature-icon primary">
              <Shield size={32} />
            </div>
            <h3>Account Protection</h3>
            <p>
              Your deposits are insured up to the maximum allowed. Peace of mind knowing your money
              is protected by us.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get started in just 3 simple steps</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up in minutes with just your email and phone number. Quick verification process.</p>
          </div>

          <div className="step-divider">→</div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Verify Identity</h3>
            <p>Complete secure identity verification. Your information stays protected with us.</p>
          </div>

          <div className="step-divider">→</div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Start Banking</h3>
            <p>Start transferring money, setting up deposits, and managing your finances instantly.</p>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="trust-section">
        <div className="trust-content">
          <div className="trust-text">
            <h2>Banking You Can Trust</h2>
            <p>
              We take security seriously. O-rangeankus is committed to protecting your financial
              information with industry-leading security standards.
            </p>

            <div className="trust-points">
              <div className="trust-point">
                <div className="check-icon">✓</div>
                <div>
                  <h4>256-Bit Encryption</h4>
                  <p>Bank-grade security protects all your data</p>
                </div>
              </div>

              <div className="trust-point">
                <div className="check-icon">✓</div>
                <div>
                  <h4>FDIC Protected</h4>
                  <p>Your deposits are insured and protected</p>
                </div>
              </div>

              <div className="trust-point">
                <div className="check-icon">✓</div>
                <div>
                  <h4>24/7 Support</h4>
                  <p>Our team is always here to help</p>
                </div>
              </div>

              <div className="trust-point">
                <div className="check-icon">✓</div>
                <div>
                  <h4>Fraud Protection</h4>
                  <p>Advanced monitoring catches suspicious activity instantly</p>
                </div>
              </div>
            </div>
          </div>

          <div className="trust-visual">
            <div className="security-badge">
              <Lock size={48} />
              <div>
                <p className="security-label">SSL SECURE</p>
                <p className="security-sub">Bank-Grade Encryption</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Experience Modern Banking?</h2>
          <p>Join thousands of satisfied customers using O-rangeankus.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary-large">
              Open Your Account Free
            </Link>
            <Link to="/login" className="btn btn-secondary-large">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          {/* <div className="footer-section">
            <h4>Orange Bank & Trust</h4>
            <p>Modern banking made simple.</p>
          </div> */}

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>Email: support@orangeankus.com</li>
              <li>Phone: 1123347638</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 O-rangeankus Bank&Trust. All rights reserved.</p>
        </div>
      </footer>
      <ScrollToTopButton />
    </div>
  )
}

export default Landing
