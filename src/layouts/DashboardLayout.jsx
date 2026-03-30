import React from 'react'
import { Menu, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import MobileFooterNav from '../components/MobileFooterNav'
import './DashboardLayout.css'

/**
 * DashboardLayout Component
 * 
 * Wraps dashboard pages with:
 * - Top navbar
 * - Left sidebar (responsive)
 * - Main content area
 * - Mobile-friendly design with footer nav
 */
const DashboardLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        {/* Sidebar - hidden on mobile */}
        <div className="sidebar-container d-none d-md-block">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="main-content">
          <div className="content-area">
            {/* Mobile sidebar menu button */}
            <div className="d-md-none">
              <button
                className="mobile-menu-btn"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileSidebar"
                aria-controls="mobileSidebar"
              >
                <Menu size={20} />
                Toggle Menu
              </button>
            </div>

            {/* Mobile sidebar offcanvas */}
            <div
              className="offcanvas offcanvas-start"
              tabIndex="-1"
              id="mobileSidebar"
              aria-labelledby="mobileSidebarLabel"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="mobileSidebarLabel">
                  Navigation
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="offcanvas-body p-0">
                <Sidebar />
              </div>
            </div>

            {/* Page content */}
            <div className="page-content">
              {children}
            </div>
          </div>
        </div>
      </div>
      <MobileFooterNav />
    </>
  )
}

export default DashboardLayout
