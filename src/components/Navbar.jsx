import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, Menu } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import './Navbar.css'
import BankLogo from './BankLogo'

/**
 * Navbar Component
 * 
 * Responsive navigation bar with:
 * - Logo/branding
 * - Theme toggle
 * - Navigation links (responsive)
 * - User menu with logout
 * - Modern material design
 */
const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
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

        {/* Toggle button for mobile - MUST come after brand */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <Menu size={24} />
        </button>

        {/* Navigation links - collapsible menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto w-100 d-flex flex-column flex-lg-row align-items-lg-center gap-3">
            {/* Theme Toggle & Language Switcher */}
            <div className="d-flex align-items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>

            {/* User Info and Logout */}
            {user && (
              <>
                <div className="user-greeting">
                  Welcome, <strong>{user?.first_name || user?.email}</strong>
                </div>
                <button
                  className="btn btn-logout"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
