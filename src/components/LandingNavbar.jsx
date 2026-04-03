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

  const handleMenuLinkClick = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="landing-navbar">
      <div className="container-fluid">
        <div className="navbar-content">
          {/* Brand */}
          <Link to="/" className="navbar-brand">
            <img src="./orange-logo.jpg" alt="O-rangeankus Bank" className='logo-image' />
            <BankLogo />
          </Link>

          {/* Desktop: Theme toggle + Language switcher + CTA buttons */}
          <div className="navbar-right d-none d-lg-flex">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link to="/login" className="btn btn-nav-secondary">
              {t('nav.login')}
            </Link>
            <Link to="/register" className="btn btn-nav-primary">
              {t('nav.register')}
            </Link>
          </div>

          {/* Mobile: Theme toggle + Language switcher + Hamburger menu */}
          <div className="navbar-mobile d-lg-none d-flex align-items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />

            {/* Hamburger button */}
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
        </div>

        {/* Mobile menu - Dropdown with pages */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/contact" className="mobile-menu-link" onClick={handleMenuLinkClick}>
            {t('nav.contact')}
          </Link>
          <Link to="/terms" className="mobile-menu-link" onClick={handleMenuLinkClick}>
            {t('landing.termsOfService')}
          </Link>
          <div className="mobile-menu-divider"></div>
          <Link to="/login" className="mobile-menu-link" onClick={handleMenuLinkClick}>
            {t('nav.login')}
          </Link>
          <Link to="/register" className="mobile-menu-link" onClick={handleMenuLinkClick}>
            {t('nav.register')}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default LandingNavbar
