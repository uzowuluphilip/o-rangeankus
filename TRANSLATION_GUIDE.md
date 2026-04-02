# Multi-Language Translation Setup - Integration Guide

✅ **All files have been created and configured!**

## What's Ready to Use

### ✅ Translation System
- `src/i18n/i18n.js` - Main configuration file with localStorage persistence
- `src/i18n/locales/en/translation.json` - English translations  
- `src/i18n/locales/es/translation.json` - Spanish translations
- `src/i18n/locales/de/translation.json` - German translations
- `src/i18n/locales/fr/translation.json` - French translations

### ✅ Language Switcher Component
- `src/components/LanguageSwitcher.jsx`  - Ready to use
- Responsive design (icon-only on mobile, full name on desktop)
- Click outside to close  
- Keyboard support (Escape key)
- Shows language codes in brackets: `English [EN]`, `Español [ES]`, etc.
- Active language highlighted with primary color
- Saves language preference to localStorage

### ✅ Initialization
- `src/main.jsx` - Already imports i18n before App renders

---

## How to Use

### 1️⃣ Add Language Switcher to Navbar

**In your `Navbar.jsx` or Header component:**

```jsx
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      {/* ... existing navbar content ... */}
      
      {/* Add this in your navbar, typically in the top right */}
      <div className="d-flex align-items-center ms-auto gap-3">
        <LanguageSwitcher />
        {/* Your other nav items */}
      </div>
    </nav>
  )
}
```

### 2️⃣ Translate Text in Any Component

**Example:**

```jsx
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.accountBalance')}</p>
      <button>{t('common.submit')}</button>
    </div>
  )
}
```

### 3️⃣ Using Variables in Translations

**In translation JSON:**
```json
{
  "greeting": "Hello {{name}}, welcome to {{app}}"
}
```

**In component:**
```jsx
const { t } = useTranslation()
<p>{t('greeting', { name: 'John', app: 'Orange Bank' })}</p>
```

---

## Available Translation Keys

All keys are organized by section. Access them with dot notation: `t('section.key')`

### **Navigation**
```
nav.home
nav.about
nav.features
nav.pricing
nav.contact
nav.login
nav.register
nav.logout
nav.dashboard
nav.profile
nav.settings
```

### **Dashboard**
```
dashboard.welcome
dashboard.overview
dashboard.accountBalance
dashboard.totalInvested
dashboard.availableBalance
dashboard.recentTransactions
dashboard.quickActions
dashboard.noTransactions
dashboard.viewAll
```

### **Banking & Transfers**
```
banking.wireTransfer
banking.internationalTransfer
banking.directDeposit
banking.withdrawal
banking.deposit
banking.transferFunds
banking.recipientName
banking.bankName
banking.accountNumber
banking.routingNumber
banking.amount
banking.currency
banking.transferSuccess
banking.transferFailed
banking.insufficientBalance
```

### **Authentication**
```
auth.email
auth.password
auth.confirmPassword
auth.firstName
auth.lastName
auth.signIn
auth.signUp
auth.loginSuccess
auth.registerSuccess
auth.invalidEmail
auth.passwordMinLength
```

### **Transactions**
```
transactions.history
transactions.transactionID
transactions.date
transactions.type
transactions.amount
transactions.status
transactions.pending
transactions.completed
transactions.failed
```

### **Common/Shared**
```
common.submit
common.cancel
common.save
common.delete
common.edit
common.close
common.back
common.next
common.loading
common.error
common.success
common.required
common.search
```

### **Investment**
```
investments.plans
investments.myInvestments
investments.investNow
investments.dailyReturn
investments.totalReturn
```

---

## Integration Checklist

After adding translation keys to your components, you can verify they work:

- [ ] Add `<LanguageSwitcher />` to Navbar
- [ ] Add another `<LanguageSwitcher />` to Dashboard header (if separate)
- [ ] Test language switching in browser
- [ ] Check that language persists on page refresh (localStorage)
- [ ] On mobile, verify only globe icon shows
- [ ] On desktop, verify language name + icon shows

---

## Components That Should Be Translated

Here are the main files you'll want to update (add gradually - don't need to do all at once):

### High Priority
- `src/components/Navbar.jsx` - Navigation labels
- `src/pages/Login.jsx` - Auth form labels
- `src/pages/Register.jsx` - Registration form labels  
- `src/pages/Dashboard.jsx` - Dashboard text

### Medium Priority
- `src/pages/WireTransfer.jsx` - Transfer labels  
- `src/pages/InternationalTransfer.jsx`
- `src/pages/DirectDeposit.jsx`
- `src/pages/TransactionHistory.jsx`

### Can Do Later
- Other admin pages
- Settings pages
- Footer components
- Error messages

---

## Example: Translate Dashboard Component

**Before:**
```jsx
export default function Dashboard() {
  return (
    <>
      <h1>Welcome back</h1>
      <div>
        <h3>Account Balance</h3>
        <p>${balance}</p>
      </div>
      <button>View All Transactions</button>
    </>
  )
}
```

**After:**
```jsx
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t } = useTranslation()
  
  return (
    <>
      <h1>{t('dashboard.welcome')}</h1>
      <div>
        <h3>{t('dashboard.accountBalance')}</h3>
        <p>${balance}</p>
      </div>
      <button>{t('dashboard.viewAll')}</button>
    </>
  )
}
```

---

## Adding New Translations

Want to add a new translation key? Add it to **all 4 language files**:

1. Open `src/i18n/locales/en/translation.json`
2. Add your new key under the appropriate section
3. Repeat for `es/`, `de/`, and `fr/` translation.json files

Example:
```json
// en/translation.json
{
  "newSection": {
    "myNewKey": "English text here"
  }
}

// es/translation.json
{
  "newSection": {
    "myNewKey": "Texto en español aquí"
  }
}
```

---

## Browser Developer Tools

To diagnose i18n issues:

```javascript
// In browser console
i18next.language // Shows current language
localStorage.getItem('language') // Shows saved preference
i18next.changeLanguage('fr') // Switch language programmatically
```

---

## Responsive Behavior

**Desktop (≥768px):** Shows globe icon + language name  
**Tablet (576px-767px):** Shows globe icon + language name  
**Mobile (<576px):** Shows only globe icon (to save space)

The dropdown menu adjusts position automatically and never overflows the screen.

---

## Keyboard Shortcuts

Inside the language dropdown:
- **Escape** - Closes dropdown
- **Click outside** - Closes dropdown
- **Tab** - Navigate through options
- **Enter/Space** - Select language

---

## Persistence

Your language choice is automatically saved to localStorage and restored when you visit the site again. No additional code needed!

The order of language detection:
1. Check localStorage for saved preference
2. Auto-detect from browser language
3. Fall back to English

---

## Questions or Issues?

All the infrastructure is set up. Just:
1. Import `useTranslation` hook in your components
2. Use `t('key')` for any text you want translated
3. The language switcher will handle everything else!

Happy translating! 🌍
