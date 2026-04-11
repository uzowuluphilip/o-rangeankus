import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { LogOut, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import ProfileModal from './profile/ProfileModal'
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
  const { user, logout, updateProfilePicture } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // Get user from localStorage for avatar
  const storedUser = JSON.parse(localStorage.getItem('authUser') || '{}')
  const firstName = storedUser?.first_name || user?.first_name || 'U'
  const initial = firstName[0].toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login')
    setDropdownOpen(false)
  }

  const handleDropdownLinkClick = () => {
    setDropdownOpen(false)
  }

  // Simple avatar component — shows profile picture or initials
  const Avatar = ({ onClickExtra } = {}) => {
    const [imgFailed, setImgFailed] = useState(false)
    
    // Build profile pic URL from filename only
    const buildProfileUrl = (pic) => {
      if (!pic) return null
      
      let value = String(pic).trim()
      console.log('[Avatar] Raw pic value:', value)
      
      // Remove protocol (http://, https://)
      let filename = value.replace(/^https?:\/\//, '')
      console.log('[Avatar] After removing protocol:', filename)
      
      // Remove known domains that might be stuck to filename
      // Handles: api.orangeankus.comuser_22_123.jpg → user_22_123.jpg
      filename = filename.replace(/^(api\.)?orangeankus\.com/i, '')
      filename = filename.replace(/^localhost(:\d+)?/i, '')
      console.log('[Avatar] After removing domains:', filename)
      
      // If still has /profiles/ path, extract after it
      if (filename.includes('profiles/')) {
        filename = filename.split('profiles/')[1] || filename
        console.log('[Avatar] After extracting from profiles/:', filename)
      }
      
      // Remove any remaining slashes and query strings
      filename = filename.split('/').pop().split('?')[0]
      console.log('[Avatar] Final extracted filename:', filename)
      
      // Validate
      if (!filename || filename === 'null' || filename === 'undefined' || !filename.includes('user_')) {
        console.warn('[Avatar] Invalid filename:', filename)
        return null
      }
      
      const url = `https://api.orangeankus.com/uploads/profiles/${filename}`
      console.log('[Avatar] Built URL:', url)
      return url
    }

    const profilePicUrl = buildProfileUrl(storedUser?.profile_picture)

    return (
      <div
        onClick={() => {
          setShowProfile(true)
          onClickExtra?.()
        }}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '2px solid #FF6B00',
          background: 'rgba(255,107,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          color: '#FF6B00',
          fontWeight: 800,
          fontSize: '1.3rem',
          transition: 'all 0.2s',
          boxShadow: '0 0 0 0 rgba(255,107,0,0)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(255,107,0,0.2)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 0 rgba(255,107,0,0)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
        title="Click to update profile picture"
      >
        {profilePicUrl && !imgFailed ? (
          <img
            src={profilePicUrl}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
            onLoad={() => console.log('[Avatar] Profile picture loaded successfully:', profilePicUrl)}
            onError={() => {
              console.log('[Avatar] Profile picture failed to load:', profilePicUrl)
              setImgFailed(true)
            }}
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>
    )
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom" style={{ padding: '0 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          
          {/* LEFT SIDE — Logo + Avatar */}
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

            {/* Avatar - right next to logo */}
            {user && <Avatar />}
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

      {/* Profile Picture Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onUpdated={(url) => updateProfilePicture(url)}
      />
    </>
  )
}

export default Navbar
