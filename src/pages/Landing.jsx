import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  return (
    <div className="landing-page">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">{t('landing.heroTitle')}</h1>
            <p className="hero-subtitle">
              {t('landing.heroSubtitle')}
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary-large">
                {t('landing.openAccount')}
              </Link>
              <Link to="/login" className="btn btn-secondary-large">
                {t('landing.alreadyCustomer')}
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
          <h2>{t('landing.powerfulFeatures')}</h2>
          <p>{t('landing.manageFinances')}</p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon primary">
              <Zap size={32} />
            </div>
            <h3>{t('banking.wireTransfer')}</h3>
            <p>
              {t('landing.wireTransfersDesc')}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon success">
              <Globe size={32} />
            </div>
            <h3>{t('banking.internationalTransfer')}</h3>
            <p>
              {t('landing.internationalDesc')}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon info">
              <TrendingUp size={32} />
            </div>
            <h3>{t('banking.directDeposit')}</h3>
            <p>
              {t('landing.directDepositDesc')}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-icon warning">
              <Clock size={32} />
            </div>
            <h3>{t('landing.access24_7')}</h3>
            <p>
              {t('landing.access24_7Desc')}
            </p>
          </div>

          {/* Feature 5 */}
          <div className="feature-card">
            <div className="feature-icon success">
              <Lock size={32} />
            </div>
            <h3>{t('landing.bankGradeSecurity')}</h3>
            <p>
              {t('landing.securityDesc')}
            </p>
          </div>

          {/* Feature 6 */}
          <div className="feature-card">
            <div className="feature-icon primary">
              <Shield size={32} />
            </div>
            <h3>{t('landing.accountProtection')}</h3>
            <p>
              {t('landing.protectionDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>{t('landing.howItWorks')}</h2>
          <p>{t('landing.simpleSteps')}</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>{t('landing.createAccount')}</h3>
            <p>{t('landing.createAccountDesc')}</p>
          </div>

          <div className="step-divider">→</div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>{t('landing.verifyIdentity')}</h3>
            <p>{t('landing.verifyDesc')}</p>
          </div>

          <div className="step-divider">→</div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>{t('landing.startBanking')}</h3>
            <p>{t('landing.startBankingDesc')}</p>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="trust-section">
        <div className="trust-content">
          <div className="trust-text">
            <h2>{t('landing.bankTrust')}</h2>
            <p>
              {t('landing.trustDescription')}
            </p>

            <div className="trust-points">
              <div className="trust-point">
                <div className="check-icon">✓</div>
                <div>
                  <h4>{t('landing.encryption')}</h4>
                  <p>{t('landing.encryptionDesc')}</p>
                </div>
              </div>

              <div className="trust-point">
                <div className="check-icon">✓</div>
                <div>
                  <h4>{t('landing.fdicProtected')}</h4>
                  <p>{t('landing.fdicDesc')}</p>
                </div>
              </div>

              <div className="trust-point">
                <div className="check-icon">✓</div>
                <div>
                  <h4>{t('landing.support24_7')}</h4>
                  <p>{t('landing.supportDesc')}</p>
                </div>
              </div>

              <div className="trust-point">
                <div className="check-icon">✓</div>
                <div>
                  <h4>{t('landing.fraudProtection')}</h4>
                  <p>{t('landing.fraudDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="trust-visual">
            <div className="security-badge">
              <Lock size={48} />
              <div>
                <p className="security-label">SSL SECURE</p>
                <p className="security-sub">{t('landing.bankGradeSecurity')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>{t('landing.ready')}</h2>
          <p>{t('landing.joinThousands')}</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary-large">
              {t('landing.openAccountFree')}
            </Link>
            <Link to="/login" className="btn btn-secondary-large">
              {t('landing.signIn')}
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
            <h4>{t('landing.quickLinks')}</h4>
            <ul>
              <li><Link to="/contact">{t('landing.contactUs')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t('landing.legal')}</h4>
            <ul>
              <li><Link to="/terms">{t('landing.termsOfService')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t('landing.supportFooter')}</h4>
            <ul>
              <li>{t('landing.email')}</li>
              <li>{t('landing.phone')}</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('landing.copyright')}</p>
        </div>
      </footer>
      <ScrollToTopButton />
    </div>
  )
}

export default Landing
