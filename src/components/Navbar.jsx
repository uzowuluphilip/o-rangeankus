import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'
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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom" style={{ padding: '0 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          
          {/* LEFT SIDE — Logo only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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

          {/* RIGHT SIDE — Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Welcome text */}
            {user && (
              <div className="user-greeting" style={{ whiteSpace: 'nowrap' }}>
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
        </div>
      </nav>
    </>
  )
}

export default Navbar
