import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import all translation files
import enTranslation from './locales/en/translation.json'
import esTranslation from './locales/es/translation.json'
import deTranslation from './locales/de/translation.json'
import frTranslation from './locales/fr/translation.json'

const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  de: { translation: deTranslation },
  fr: { translation: frTranslation }
}

// Initialize i18n
i18n
  .use(LanguageDetector) // Auto-detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false // React already protects from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })

export default i18n
