import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import BankLogo from './BankLogo'
import './LandingNavbar.css'

/**
 * LandingNavbar Component
 * 
 * Navbar for the landing page featuring:
 * - Logo/branding
 * - Theme toggle
 * - Login and Register CTA buttons
 * - Responsive design
 */
const LandingNavbar = () => {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="landing-navbar">
      <div className="container-fluid">
        <div className="navbar-content">
          {/* Brand */}
          <Link to="/" className="navbar-brand">
            <img src="./orange-logo.jpg" alt="O-rangeankus Bank" className='logo-image' />
            <BankLogo />
          </Link>

          {/* Right side - Theme toggle + Language switcher + CTA buttons */}
          <div className="navbar-right">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link to="/login" className="btn btn-nav-secondary">
              {t('nav.login')}
            </Link>
            <Link to="/register" className="btn btn-nav-primary">
              {t('nav.register')}
            </Link>
          </div>

          {/* Mobile menu toggle (hidden by default) */}
          <button
            className="navbar-mobile-toggle"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t('common.closeMenu') : t('common.openMenu')}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/contact" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            {t('nav.contact')}
          </Link>
          <Link to="/terms" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            {t('landing.termsOfService')}
          </Link>
          <Link to="/login" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            {t('nav.login')}
          </Link>
          <Link to="/register" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            {t('nav.register')}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default LandingNavbar
