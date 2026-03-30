import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Send,
  Globe,
  TrendingUp,
  FileText,
  ArrowDownToLine
} from 'lucide-react'
import './Sidebar.css'

/**
 * Sidebar Component
 * 
 * Dashboard navigation sidebar with:
 * - Active link highlighting
 * - Responsive design (hidden on mobile)
 * - User role-based menu items
 * - Modern lucide icons
 */
const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (path) => location.pathname === path

  // User menu items with lucide icons
  const userMenuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Wire Transfer', path: '/wire-transfer', icon: Send },
    { label: 'International Transfer', path: '/international-transfer', icon: Globe },
    { label: 'Direct Deposit', path: '/direct-deposit', icon: ArrowDownToLine },
    { label: 'Transaction History', path: '/transactions', icon: TrendingUp },
    { label: 'Statements', path: '/statements', icon: FileText }
  ]

  // Admin menu items
  const adminMenuItems = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: LayoutDashboard },
    { label: 'Pending Transfers', path: '/admin/pending-transfers', icon: Send },
    { label: 'Transaction Dates', path: '/admin/transaction-dates', icon: TrendingUp },
    { label: 'Receipts', path: '/admin/receipts', icon: FileText }
  ]

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h5 className="sidebar-title">Navigation</h5>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={20} className="sidebar-icon" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
