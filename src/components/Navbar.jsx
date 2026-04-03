import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { LogOut, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import './Navbar.css'
import BankLogo from './BankLogo'

/**
 * Navbar Component
 * 
 * Responsive navigation bar with:
 * - Logo/branding
 * - Theme toggle (always visible)
 * - Language switcher
 * - User menu with logout button (desktop) or dropdown (mobile)
 * - Modern material design
 */
const Navbar = () => {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setDropdownOpen(false)
  }

  const handleDropdownLinkClick = () => {
    setDropdownOpen(false)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        {/* Brand */}
        <Link
          className="navbar-brand text-primary-orange"
          to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
        >
          <img src="./orange-logo.jpg" alt="" className='rounded-circle' style={{ height: 40}} />
          <BankLogo />
        </Link>

        {/* Desktop: Nav links + Theme toggle + Language Switcher */}
        {/* <div className="navbar-desktop-nav d-none d-lg-flex align-items-center gap-3">
          <Link to="/dashboard" className="nav-link">{t('nav.dashboard')}</Link>
          <Link to="/wire-transfer" className="nav-link">{t('nav.wireTransfer')}</Link>
          <Link to="/direct-deposit" className="nav-link">{t('nav.directDeposit')}</Link>
          <Link to="/international-transfer" className="nav-link">{t('nav.internationalTransfer')}</Link>
          <Link to="/account-statements" className="nav-link">{t('nav.accountStatements')}</Link>
        </div> */}

        {/* Desktop: Controls (Theme, Language, User, Logout) */}
        <div className="navbar-desktop-controls d-none d-lg-flex gap-3 align-items-center">
          <ThemeToggle />
          <LanguageSwitcher />
          {user && (
            <>
              <div className="user-greeting">
                {t('nav.welcome')}, <strong>{user?.first_name || user?.email}</strong>
              </div>
              <button
                className="btn btn-logout"
                onClick={handleLogout}
                title={t('nav.logout')}
              >
                <LogOut size={18} />
                {t('nav.logout')}
              </button>
            </>
          )}
        </div>

        {/* Mobile: Right side controls */}
        <div className="navbar-mobile d-lg-none d-flex align-items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />

          {/* Hamburger menu button */}
          <button
            className="navbar-mobile-toggle"
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-label={dropdownOpen ? t('common.closeMenu') : t('common.openMenu')}
          >
            {dropdownOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`navbar-mobile-menu ${dropdownOpen ? 'open' : ''}`}>
          {/* <Link to="/dashboard" className="mobile-menu-link" onClick={handleDropdownLinkClick}>
            {t('nav.dashboard')}
          </Link>
          <Link to="/wire-transfer" className="mobile-menu-link" onClick={handleDropdownLinkClick}>
            {t('nav.wireTransfer')}
          </Link>
          <Link to="/direct-deposit" className="mobile-menu-link" onClick={handleDropdownLinkClick}>
            {t('nav.directDeposit')}
          </Link>
          <Link to="/international-transfer" className="mobile-menu-link" onClick={handleDropdownLinkClick}>
            {t('nav.internationalTransfer')}
          </Link>
          <Link to="/account-statements" className="mobile-menu-link" onClick={handleDropdownLinkClick}>
            {t('nav.accountStatements')}
          </Link> */}
          <div className="mobile-menu-divider"></div>
          {user && (
            <>
              <div className="mobile-menu-greeting">
                {t('nav.welcome')}, <strong>{user?.first_name || user?.email}</strong>
              </div>
              <button
                className="mobile-menu-logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                {t('nav.logout')}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
