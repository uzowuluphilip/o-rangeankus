import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import './LanguageSwitcher.css'

/**
 * Language Switcher Component
 * 
 * Allows users to change the app language between:
 * - English
 * - Spanish
 * - German
 * - French
 */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language)

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
  }

  return (
    <div className="language-switcher-container">
      <button
        className="language-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Change language"
      >
        <Globe size={20} />
        <span className="language-flag">{currentLanguage?.flag}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${
                i18n.language === lang.code ? 'active' : ''
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
