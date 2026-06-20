import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LandingNavbar from '../components/LandingNavbar'
import './PageInfo.css'

const Terms = () => {
  const { t } = useTranslation()
  return (
    <div className="info-page">
      <LandingNavbar />

      <section className="info-hero">
        <div className="info-hero-content">
          <div className="info-hero-copy">
            <span className="eyebrow">{t('terms.title')}</span>
            <h1>{t('terms.brandName')} {t('terms.heading')}</h1>
            <p>
              {t('terms.termsIntro')}
            </p>
            <div className="info-hero-actions">
              <Link to="/" className="btn btn-primary">
                {t('auth.backToHome')}
              </Link>
            </div>
          </div>

          <div className="info-hero-card">
            <div className="info-card">
              <h3>{t('terms.importantToKnow')}</h3>
              <p>
                {t('terms.importantText')}
              </p>
              <div className="info-list">
                <div>
                  <span>{t('terms.accountUseTitle')}</span>
                  <p>{t('terms.accountUseDesc')}</p>
                </div>
                <div>
                  <span>{t('terms.transfersTitle')}</span>
                  <p>{t('terms.transfersDesc')}</p>
                </div>
                <div>
                  <span>{t('terms.privacyTitle')}</span>
                  <p>{t('terms.privacyDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section terms-details">
        <div className="term-block">
          <h2>{t('terms.yourAccountTitle')}</h2>
          <p>
            {t('terms.yourAccountDesc')}
          </p>
        </div>
        <div className="term-block">
          <h2>{t('terms.transfersPaymentsTitle')}</h2>
          <p>
            {t('terms.transfersPaymentsDesc')}
          </p>
        </div>
        <div className="term-block">
          <h2>{t('terms.privacySecurityTitle')}</h2>
          <p>
            {t('terms.privacySecurityDesc')}
          </p>
        </div>
      </section>
    </div>
  )
}

export default Terms
