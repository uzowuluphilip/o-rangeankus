import React, { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import './LanguageSwitcher.css'

/**
 * LanguageSwitcher Component
 * 
 * Displays a globe icon with current language
 * Opens a dropdown menu to change language
 * Saves language preference to localStorage
 * Features:
 * - Auto-detects outside clicks to close dropdown
 * - Responsive (icon only on mobile, full name on desktop)
 * - Highlights active language
 * - Keyboard support (Escape key closes dropdown)
 */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    // Handle Escape key
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode)
    localStorage.setItem('language', languageCode)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="language-switcher-container" ref={containerRef}>
      <button
        className="language-switcher-btn"
        onClick={toggleDropdown}
        title={`Switch Language: ${currentLanguage.name}`}
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Globe size={20} className="language-icon" />
        <span className="language-name">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown" role="menu">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
              role="menuitem"
              title={`Switch to ${lang.name}`}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-text">
                {lang.name}
                <span className="language-code">[{lang.code.toUpperCase()}]</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher

