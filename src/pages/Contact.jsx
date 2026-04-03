import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LandingNavbar from '../components/LandingNavbar'
import './PageInfo.css'

const Contact = () => {
  const { t } = useTranslation()
  return (
    <div className="info-page">
      <LandingNavbar />

      <section className="info-hero">
        <div className="info-hero-content">
          <div className="info-hero-copy">
            <span className="eyebrow">{t('contact.title')}</span>
            <h1>{t('contact.subtitle')}</h1>
            <p>
              {t('contact.description')}
            </p>
            <div className="info-hero-actions">
              <Link to="/" className="btn btn-primary">
                {t('auth.backToHome')}
              </Link>
            </div>
          </div>

          <div className="info-hero-card">
            <div className="info-card">
              <h3>{t('contact.needHelp')}</h3>
              <p>{t('contact.pickChannel')}</p>
              <div className="info-list">
                <div>
                  <span>{t('contact.email')}</span>
                  <p><a href="mailto:support@orangeankus.com">support@orangeankus.com</a></p>
                </div>
                <div>
                  <span>{t('contact.phone')}</span>
                  <p><a href="tel:+18459577340">+1(845)957-7340</a></p>
                </div>
                <div>
                  <span>{t('contact.address')}</span>
                  <p>212 Dolson Ave, Middletown, NY 10940, United States</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-cards">
          <div className="info-card info-card-alt">
            <h3 style={{ color: '#000' }}>{t('contact.reportIssue')}</h3>
            <p>
              {t('contact.reportDescription')}
            </p>
          </div>
          <div className="info-card info-card-alt">
            <h3 style={{ color: '#000' }}>{t('contact.accountGuidance')}</h3>
            <p>
              {t('contact.guidanceDescription')}
            </p>
          </div>
          <div className="info-card info-card-alt">
            <h3 style={{ color: '#000' }}>{t('contact.feedback')}</h3>
            <p>
              {t('contact.feedbackDescription')}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
