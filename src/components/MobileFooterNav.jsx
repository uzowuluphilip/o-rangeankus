import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Send,
  Globe,
  TrendingUp,
  FileText,
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './MobileFooterNav.css'

const MobileFooterNav = () => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
  }

  const menuItems = user?.role === 'admin'
    ? [
        { label: 'Admin', path: '/admin/dashboard', icon: LayoutDashboard }
      ]
    : [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Transfer', path: '/wire-transfer', icon: Send },
        { label: 'Global', path: '/international-transfer', icon: Globe },
        { label: 'History', path: '/transactions', icon: TrendingUp },
        { label: 'Statements', path: '/statements', icon: FileText }
      ]

  return (
    <div className="footer-navbar">
      {menuItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`footer-navbar-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <Icon size={24} />
            <span>{item.label}</span>
          </Link>
        )
      })}

      <button
        className="footer-navbar-item logout-btn"
        onClick={handleLogout}
        title="Logout"
      >
        <LogOut size={24} />
        <span>Logout</span>
      </button>
    </div>
  )
}

export default MobileFooterNav
