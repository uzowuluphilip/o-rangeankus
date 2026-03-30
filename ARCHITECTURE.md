# Orange Bank Frontend - Architecture Guide

## 🏗️ Architecture Overview

The Orange Bank frontend is built using a modern React architecture with the following principles:

### Core Principles
- **Component-Based**: Reusable, composable components
- **State Management**: Centralized auth state + local component state
- **API-First**: All data from backend API
- **Responsive**: Mobile-first design approach
- **Secure**: JWT-based authentication with HTTP-only context

## 🔄 Data Flow

```
User Action
     ↓
Component Event Handler
     ↓
Axios API Call
     ↓
Request Interceptor (adds JWT)
     ↓
Backend API
     ↓
Response Interceptor (handles 401)
     ↓
Context Update / State Update
     ↓
Component Re-render
     ↓
UI Update
```

## 🔐 Authentication Architecture

### Login Flow
```
1. User enters email + password
2. POST /auth/login
3. Backend validates credentials
4. Response includes: { user, token }
5. Frontend calls login(user, token)
6. Token stored in localStorage
7. User stored in React Context
8. Redirect to /dashboard
```

### Session Persistence
```
1. App mounts
2. Check localStorage for authToken
3. If exists, restore token + user to context
4. User remains logged in across page refreshes
```

### Token Usage
```
Every Request:
{
  headers: {
    Authorization: `Bearer ${token}`
  }
}
```

### Logout Flow
```
1. User clicks logout
2. logout() called from context
3. localStorage cleared
4. Context state cleared
5. Redirect to /login
```

## 🏗️ Component Architecture

### Page Components
- **Location**: `src/pages/`
- **Purpose**: Full-page views (Dashboard, Login, etc.)
- **Characteristics**: 
  - Often wrap with layout component
  - Fetch data on mount
  - Manage complex state

### Reusable Components
- **Location**: `src/components/`
- **Purpose**: Shared UI elements
- **Examples**:
  - `ProtectedRoute` - Route protection wrapper
  - `TransactionTable` - Paginated transaction list
  - `Navbar` - Top navigation
  - `Sidebar` - Dashboard navigation

### Layout Components
- **Location**: `src/layouts/`
- **Purpose**: Common page structure
- **Example**: `DashboardLayout` - Navbar + Sidebar + Content

## 📊 State Management Strategy

### Global State (Context API)
**AuthContext** - Authentication state:
```javascript
{
  user: { id, name, email, role },
  token: "jwt_token",
  isAuthenticated: boolean,
  loading: boolean,
  login(user, token),
  logout()
}
```

**When to use**: User data, auth checks, token access

### Local Component State
```javascript
const [formData, setFormData] = useState({})
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
```

**When to use**: Form inputs, UI state, temporary loading states

### URL State
```javascript
// Query parameters for filtering
/transactions?type=deposit&start_date=2024-01-01
```

**When to use**: Filters, pagination, navigation state

## 🔗 API Integration Pattern

### Standard API Call Pattern
```javascript
const [data, setData] = useState(null)
const [error, setError] = useState('')
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/endpoint')
      setData(response.data.data || response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error message')
    } finally {
      setLoading(false)
    }
  }
  
  fetchData()
}, [dependencies])
```

### Handling Forms
```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  
  // Validate
  if (!validateForm()) return
  
  try {
    setLoading(true)
    const response = await axiosInstance.post('/endpoint', formData)
    
    // Success handling
    setSuccess('Success message')
    // Reset form & redirect
  } catch (err) {
    setError(err.response?.data?.message)
  } finally {
    setLoading(false)
  }
}
```

## 🛡️ Error Handling Strategy

### Levels of Error Handling

**1. Request Interceptor** (axios.js)
- Validates request
- Adds auth headers

**2. Response Interceptor** (axios.js)
- Handles 401 Unauthorized
- Catches network errors
- Redirects to login if needed

**3. Component Level** (Pages)
- Try-catch on API calls
- User-friendly error messages
- Error alerts in UI

**4. Form Validation** (Components)
- Client-side validation
- Prevents invalid submissions
- Real-time feedback

## 📱 Responsive Design Strategy

### Breakpoints
- `xs` (0px) - Mobile
- `sm` (576px) - Small tablets
- `md` (768px) - Tablets (Sidebar hidden)
- `lg` (1024px) - Desktop
- `xl` (1920px) - Large screens

### Mobile Handling
```jsx
{/* Hidden on mobile */}
<div className="d-none d-md-block">Desktop Only</div>

{/* Visible only on mobile */}
<div className="d-md-none">Mobile Only</div>

{/* Responsive grid */}
<div className="row">
  <div className="col-12 col-md-6 col-lg-4">Responsive</div>
</div>
```

## 🎨 Styling Architecture

### Theme System
- CSS variables in `:root` (theme.css)
- Bootstrap CSS customization
- Dark mode as default

### CSS Organization
```css
/* Variables */
:root { --primary-color: #FF6600; }

/* Bootstrap overrides */
.btn-primary { /* override */ }
.card { /* override */ }

/* Custom utilities */
.text-primary-orange { color: var(--primary-color); }

/* Animations */
@keyframes fadeIn { /* animation */ }

/* Responsive utilities */
@media (max-width: 768px) { /* Mobile styles */ }
```

### Component Styling
- Bootstrap classes for structure
- Custom theme classes for colors
- Inline styles for dynamic values
- CSS modules for scoped styles (optional)

## 🔄 Component Lifecycle Best Practices

### Data Fetching
```javascript
useEffect(() => {
  // Setup: Fetch data
  const fetchData = async () => { /* ... */ }
  fetchData()
  
  // Cleanup: Not needed for fetching, but for timers/subscriptions
  // return () => { /* cleanup */ }
}, [dependencies]) // Include all external dependencies
```

### Form Handling
```javascript
// 1. Initialize state
const [form, setForm] = useState({ field: '' })

// 2. Handle changes
const handleChange = (e) => {
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
}

// 3. Validate
const validate = () => { /* return boolean */ }

// 4. Submit
const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validate()) return
  // API call...
}
```

## 👥 Component Hierarchy Example

```
App (Router setup)
├── AuthProvider (Context)
│   ├── ProtectedRoute
│   │   ├── DashboardLayout
│   │   │   ├── Navbar
│   │   │   ├── Sidebar
│   │   │   └── Dashboard (Page)
│   │   │       ├── TransactionTable (Component)
│   │   │       └── Card (Bootstrap)
│   │   └── WireTransfer (Page)
│   ├── Login (Page)
│   └── Register (Page)
```

## 🔗 Integration Points with Backend

### Expected Backend Endpoints

**Authentication**
```
POST /auth/login
POST /auth/register
POST /admin/login
```

**User Account**
```
GET /account
GET /account/direct-deposit
```

**Transfers**
```
POST /transfer/wire
POST /transfer/international
```

**Transactions**
```
GET /transactions/recent
GET /transactions (with filters: type, start_date, end_date, page)
```

**Statements**
```
GET /account/statements
GET /account/statements/:id/download
GET /account/direct-deposit/pdf
```

**Admin**
```
GET /admin/users
GET /admin/transactions
GET /admin/statistics
PATCH /admin/freeze/:id
```

## 🚀 Performance Optimization

### Implemented
- Code splitting (React Router lazy loading ready)
- Conditional rendering (d-none for hidden elements)
- Memoization opportunities (can add React.memo if needed)
- Efficient re-renders (proper dependency arrays)

### Recommended Additions
- `React.memo()` for expensive components
- `useMemo()` for expensive calculations
- `useCallback()` for callback optimization
- Image optimization for profile pictures
- Lazy loading for route components

## 📝 Coding Standards

### File Structure
```
ComponentName.jsx
- Imports
- Comment block with purpose
- Component function
- State hooks
- Effect hooks
- Event handlers
- Render JSX
- Export default
```

### Naming Conventions
- Components: PascalCase (Dashboard.jsx)
- Files: PascalCase for components, camelCase for utilities
- Functions: camelCase (handleSubmit, fetchData)
- Variables: camelCase (userData, isLoading)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL)

### Comments
```javascript
/**
 * Component Purpose
 * 
 * Features/Details
 * What it does and why
 */
```

## 🔐 Security Considerations

### Implemented
- JWT token storage (localStorage + Context)
- Automatic token injection in requests
- 401 handling with session clear
- Password field type (not text)
- Protected routes
- HTTPS ready (in production)

### Best Practices
- Never log sensitive data
- Validate all inputs (client + server)
- Use HTTPS in production
- Keep dependencies updated
- Implement CSRF protection (backend)
- Never expose secrets in frontend

---

**Last Updated**: March 2026
**Version**: 1.0.0
