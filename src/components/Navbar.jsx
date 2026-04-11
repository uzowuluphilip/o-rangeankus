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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          
          {/* LEFT SIDE — Logo only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Brand Logo */}
            <Link
              className="navbar-brand text-primary-orange"
              to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
              style={{ margin: 0 }}
            >
              <img src="./orange-logo.jpg" alt="" className='rounded-circle' style={{ height: 40}} />
              <BankLogo />
            </Link>
          </div>

          {/* RIGHT SIDE — Desktop Controls */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            '@media (max-width: 991px)': {
              display: 'none'
            }
          }} className="navbar-desktop-controls">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Welcome text */}
            {user && (
              <div className="user-greeting" style={{ whiteSpace: 'nowrap', display: 'none' }}>
                {t('nav.welcome')}, <strong>{user?.first_name || user?.email}</strong>
              </div>
            )}
            
            {/* Logout button */}
            {user && (
              <button
                className="btn btn-logout"
                onClick={handleLogout}
                title={t('nav.logout')}
                style={{ flexShrink: 0 }}
              >
                <LogOut size={18} />
                {t('nav.logout')}
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="navbar-mobile" style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Theme Toggle on Mobile */}
            <ThemeToggle />
            
            {/* Language Switcher on Mobile */}
            <LanguageSwitcher />
            
            {/* Mobile menu toggle button */}
            <button
              className="navbar-mobile-toggle"
              onClick={toggleMobileMenu}
              title="Toggle menu"
              style={{ display: 'inline-flex' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`navbar-mobile-menu ${mobileMenuOpen ? 'open' : ''}`} style={{ marginTop: '0.5rem' }}>
          {/* Welcome text */}
          {user && (
            <div className="mobile-menu-greeting">
              {t('nav.welcome')}, <strong>{user?.first_name || user?.email}</strong>
            </div>
          )}

          {/* Divider */}
          {user && <div className="mobile-menu-divider"></div>}

          {/* Logout button */}
          {user && (
            <button
              className="mobile-menu-logout"
              onClick={handleLogout}
              title={t('nav.logout')}
            >
              <LogOut size={18} />
              {t('nav.logout')}
            </button>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
