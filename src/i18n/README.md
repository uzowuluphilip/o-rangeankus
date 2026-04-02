# i18n Translation Setup Guide

## Files Created

1. **`src/i18n/config.js`** - i18n configuration with translations for English, Spanish, German, French
2. **`src/components/LanguageSwitcher.jsx`** - Language switcher dropdown component
3. **`src/components/LanguageSwitcher.css`** - Styling for language switcher

## How to Use

### In any React component:

```jsx
import { useTranslation } from 'react-i18next'

export default function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('submit')}</button>
    </div>
  )
}
```

### Add the Language Switcher to your Navbar:

```jsx
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* ... other navbar content ... */}
      <LanguageSwitcher />
    </nav>
  )
}
```

## Available Translation Keys

All keys are available in these languages: `en`, `es`, `de`, `fr`

### Common Keys
- `welcome` - Welcome message
- `dashboard` - Dashboard
- `logout` - Logout
- `login` - Login
- `cancel` - Cancel
- `submit` - Submit
- `save` - Save
- `error` - Error
- `success` - Success
- `loading` - Loading

### Banking-Specific Keys
- `wireTransfer` - Wire Transfer
- `internationalTransfer` - International Transfer
- `directDeposit` - Direct Deposit
- `accountBalance` - Account Balance
- `recentTransactions` - Recent Transactions
- `insufficientBalance` - Insufficient Balance
- `transferCompleted` - Transfer Completed
- `transferFailed` - Transfer Failed

## Programmatic Language Change

```jsx
const { i18n } = useTranslation()

// Change language
i18n.changeLanguage('es') // Spanish
i18n.changeLanguage('de') // German
i18n.changeLanguage('fr') // French
i18n.changeLanguage('en') // English

// Get current language
console.log(i18n.language) // 'en', 'es', 'de', or 'fr'
```

## Adding More Translations

Edit `src/i18n/config.js` and add new keys to each language object:

```javascript
const resources = {
  en: {
    translation: {
      myNewKey: 'My translation in English'
    }
  },
  es: {
    translation: {
      myNewKey: 'Mi traducción en español'
    }
  },
  // ... etc
}
```

## With Variables/Interpolation

```jsx
// In config.js
trans: 'Hello {{name}}, your balance is {{balance}}'

// In component
const { t } = useTranslation()
t('trans', { name: 'John', balance: '$100' })
// Output: "Hello John, your balance is $100"
```

## Save Language Preference to LocalStorage

To persist language choice across sessions, you can add:

```jsx
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export default function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('language') || 'en'
    i18n.changeLanguage(savedLang)
  }, [])

  // Save when language changes
  const handleLanguageChange = (lang) => {
    localStorage.setItem('language', lang)
    i18n.changeLanguage(lang)
  }
}
```
