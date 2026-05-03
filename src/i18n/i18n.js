import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import all translation files
import enTranslation from './locales/en/translation.json'
import esTranslation from './locales/es/translation.json'
import deTranslation from './locales/de/translation.json'
import frTranslation from './locales/fr/translation.json'
import ptTranslation from './locales/pt/translation.json'
import itTranslation from './locales/it/translation.json'
import jaTranslation from './locales/ja/translation.json'
import zhTranslation from './locales/zh/translation.json'
import ruTranslation from './locales/ru/translation.json'
import arTranslation from './locales/ar/translation.json'
import thTranslation from './locales/th/translation.json'
import trTranslation from './locales/tr/translation.json'

const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  de: { translation: deTranslation },
  fr: { translation: frTranslation },
  pt: { translation: ptTranslation },
  it: { translation: itTranslation },
  ja: { translation: jaTranslation },
  zh: { translation: zhTranslation },
  ru: { translation: ruTranslation },
  ar: { translation: arTranslation },
  th: { translation: thTranslation },
  tr: { translation: trTranslation }
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
