# Orange Bank Frontend - Developer Guide & Talking Points

## 🎯 Project Overview for Developers

### What is Orange Bank Frontend?
A modern, production-ready banking web application built with React, Vite, and Bootstrap. It's a single-page application (SPA) that provides users with secure access to banking services including transfers, transaction history, and account management.

### Tech Stack Quick Reference
- **Framework**: React 18.2 (latest)
- **Build Tool**: Vite 5.0
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Bootstrap 5 + Custom CSS
- **State Management**: Context API
- **Language**: JavaScript (ES6+)

### Why These Choices?
- **Vite**: Lightning-fast build tool, excellent DX, HMR (Hot Module Replacement)
- **React**: Industry standard, large ecosystem, component-based architecture
- **Bootstrap**: Proven, accessible, extensive component library
- **Context API**: Lightweight auth state management (no Redux needed for this scale)
- **Axios**: Simple, elegant HTTP client with interceptors support

---

## 🏗️ Architecture Quick Talk

### "How does the app flow?"

1. **Entry Point**: User lands on `/login`
2. **Authentication**: Submits credentials → Backend returns JWT token
3. **Session**: Token stored locally + in React context
4. **Protected Routes**: ProtectedRoute component wraps authenticated pages
5. **API Calls**: Every request automatically includes JWT in header
6. **Token Expiry**: If 401 received, user logged out and redirected to login

### "Why Context API and not Redux?"

This app only needs global state for authentication:
- User data (id, name, email, role)
- JWT token
- Login/logout functions
- Loading state

Context API is perfect for this. Redux would be overkill and add unnecessary complexity. **If we added more global state later (settings, notifications, etc.), Redux would become justified.**

### "How do you handle API errors?"

**Three-layer error handling**:
1. **Request Interceptor**: Adds JWT, validates request
2. **Response Interceptor**: Catches 401s, handles network errors
3. **Component Level**: Try-catch on API calls, user-friendly messages

```javascript
// Component level
try {
  const response = await axiosInstance.post('/endpoint', data)
  setData(response.data.data)
} catch (err) {
  setError(err.response?.data?.message || 'Error occurred')
}
```

---

## 💡 Key Design Decisions Explained

### 1. **Dark Theme by Default**
```
Why? Modern banking apps use dark themes for reduced eye strain, 
     professional appearance, and better focus on content.
     
Color choices: Orange primary (#FF6600) for warmth and trust,
              dark backgrounds for contrast and readability.
```

### 2. **Responsive Mobile-First Design**
```
Why? Most users access banking on mobile. 
     Mobile-first ensures optimal experience on all devices.
     
Breakpoints: md-768px (tablets), lg-1024px (desktop)
            Sidebar hidden on mobile, accessible via menu
```

### 3. **Form Validation on Both Client & Server**
```
Client-side: Fast feedback, better UX
Server-side: Security, prevent malicious data

Benefits: Reduced server load, better user experience,
          still secure even if client validation bypassed
```

### 4. **Axios Interceptors for JWT Management**
```
Request Interceptor: Automatically adds Authorization header
Response Interceptor: Handles 401 globally
Benefit: DRY principle - don't add header to every request
```

### 5. **Protected Routes Pattern**
```javascript
<Route path="/dashboard" 
  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
/>

Why? Declarative, reusable, clear intent
     Prevents unauthorized access elegantly
     Can add role-based access easily
```

---

## 🎯 Common Developer Scenarios

### Scenario 1: "I need to add a new page"

**Steps**:
1. Create file in `src/pages/NewPage.jsx`
2. Add route in `App.jsx`: 
   ```jsx
   <Route path="/new-page" element={<ProtectedRoute><NewPage /></ProtectedRoute>} />
   ```
3. Add navigation link in `Sidebar.jsx`

**Code structure**:
```jsx
// Always start with this
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'
import { useState, useEffect } from 'react'

const NewPage = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch data
  }, [])

  return (
    <DashboardLayout>
      {/* Content */}
    </DashboardLayout>
  )
}

export default NewPage
```

### Scenario 2: "I need to call an API endpoint"

**Pattern**:
```javascript
const response = await axiosInstance.post('/transfer/wire', {
  recipient_name: formData.recipientName,
  bank: formData.bank,
  account_number: formData.accountNumber,
  amount: parseFloat(formData.amount)
})

// Token is automatically injected!
// If response is 401, user is logged out automatically!
```

### Scenario 3: "I need to display filtered data"

```javascript
// Build query string
const params = new URLSearchParams({
  page: currentPage,
  type: filters.type,
  start_date: filters.startDate,
  end_date: filters.endDate
})

// Fetch with query
const response = await axiosInstance.get(`/transactions?${params}`)
```

### Scenario 4: "Form submission feels verbose"

That's intentional! It handles:
- Validation
- Loading states
- Error messages
- Success feedback
- Form reset
- Navigation

None of that is "boilerplate" - it's essential UX.

---

## 🔐 Security Talking Points

### "Where do we store the JWT?"
**localStorage** - Gives us:
- Persistent sessions (page refresh)
- Easy to access across components via Context
- Common industry practice

**Note**: In production, consider HttpOnly cookies for additional XSS protection, but requires backend support.

### "How do we prevent CSRF attacks?"
Handled by backend with CSRF tokens. Frontend just needs to:
- Include them in POST/PATCH/DELETE requests
- Send via Authorization header (JWT does this)

### "What about XSS attacks?"
React escapes all text by default. We're safe unless we use:
- `dangerouslySetInnerHTML` (which we don't)
- External scripts (which we don't)
- User-submitted HTML (which we don't)

### "Is HTTPS required?"
**Absolutely.** JWTs should only travel over HTTPS. In development we use HTTP for convenience, but production MUST use HTTPS.

---

## 📊 Performance Talking Points

### "How fast is the app?"
**Loading Times**:
- Vite dev: ~100-200ms
- Build: ~2-3 seconds
- Production bundle: ~150-200KB gzipped

### "Why is it fast?"
1. **Vite's ESM**: Native ES modules during dev
2. **Code splitting**: Router automatically splits pages
3. **Lazy loading**: Routes can use React.lazy() for optimized loading
4. **Minification**: Build process removes all unnecessary code
5. **Gzip**: Server compresses responses 60%+
6. **Browser caching**: HTML revalidated, JS cached for 1 year

### "What optimizations are easy to add?"
```javascript
// 1. Lazy load routes
const Dashboard = React.lazy(() => import('./pages/Dashboard'))

// 2. Memoize expensive components
const TransactionTable = React.memo(({ data }) => ...)

// 3. useCallback for event handlers
const handleClick = useCallback(() => { ... }, [])

// 4. useMemo for expensive computations
const sortedData = useMemo(() => { ... }, [data])
```

---

## 🧩 Component Communication

### "How do components communicate?"

**1. Parent → Child**: Props
```javascript
<TransactionTable transactions={data} loading={loading} />
```

**2. Child → Parent**: Callbacks
```javascript
<TransactionTable onPageChange={handlePageChange} />
```

**3. Sibling → Sibling**: Context or state lifting
```javascript
// Context (global)
const { user, logout } = useAuth()

// State lifting (move state to common parent)
```

**4. Non-related**: Context API
```javascript
// AuthContext available everywhere
const { token, user } = useAuth()
```

### "When do I need useEffect?"
- Fetch data on component mount: ✅ YES
- Fetch on prop change: ✅ YES
- Update localStorage: ✅ YES
- Update document title: ✅ YES
- Attach event listeners: ✅ YES
- Track form changes: ❌ NO (use onChange directly)
- Initialize state: ❌ NO (use initialState in useState)

---

## 🐛 Debugging Tips

### "App won't load"
```
1. Check browser console (F12)
2. Check Network tab for API errors
3. Verify VITE_API_BASE_URL is set
4. Check localStorage for auth token
5. Check if backend is running
```

### "User stays logged out after refresh"
```
Issues:
1. localStorage being cleared
2. Token not being restored in useEffect
3. Backend session timing out

Solution:
Check AuthContext.jsx useEffect on mount
```

### "API calls failing"
```
Check axios.js:
1. Request interceptor adding token?
2. Response interceptor handling errors?
3. API base URL correct?
4. CORS enabled on backend?
```

### "Styles not applying"
```
1. Check class name spelling
2. Verify theme.css is imported in main.jsx
3. Clear browser cache (Ctrl+Shift+Del)
4. Bootstrap CSS loaded? (in main.jsx)
5. CSS specificity issue? (check DevTools)
```

---

## 📚 Code Examples for Teaching

### Example 1: Authentication Flow
```javascript
// 1. User logs in
const response = await axiosInstance.post('/auth/login', { email, password })

// 2. Extract data
const { user, token } = response.data.data

// 3. Store in context
login(user, token)

// 4. Token automatically used in future requests
// Request interceptor: config.headers.Authorization = `Bearer ${token}`

// 5. If token expires (401 response)
// Response interceptor: logout and redirect

// 6. User logs out
logout() // Clears localStorage and context
```

### Example 2: Handling Form Submission
```javascript
const handleSubmit = async (e) => {
  // 1. Prevent default form submission
  e.preventDefault()
  
  // 2. Clear previous errors
  setError('')
  
  // 3. Validate
  if (!validateForm()) return
  
  // 4. Set loading
  setLoading(true)
  
  try {
    // 5. Make API call
    const response = await axiosInstance.post('/transfer/wire', {
      recipient_name: formData.recipientName,
      bank: formData.bank,
      account_number: formData.accountNumber,
      amount: parseFloat(formData.amount)
    })
    
    // 6. Success feedback
    setSuccess('Transfer sent!')
    
    // 7. Reset form
    setFormData({ ... })
    
    // 8. Redirect (optional)
    setTimeout(() => navigate('/dashboard'), 2000)
    
  } catch (err) {
    // 9. Error handling
    const message = err.response?.data?.message || 'An error occurred'
    setError(message)
  } finally {
    // 10. Clear loading
    setLoading(false)
  }
}
```

### Example 3: Fetching Paginated Data
```javascript
const [data, setData] = useState([])
const [page, setPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)

// Refetch when page changes
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `/transactions?page=${page}`
      )
      setData(response.data.data.transactions)
      setTotalPages(response.data.data.total_pages)
    } catch (err) {
      setError(err.response?.data?.message)
    }
  }
  
  fetchData()
}, [page]) // Add page to dependency array!
```

---

## 🎓 Teaching/Onboarding Checklist

When onboarding a new developer:

- [ ] Explain Vite's advantages over Create React App
- [ ] Walk through authentication flow
- [ ] Show how to add a new page
- [ ] Show how to make an API call
- [ ] Explain Context API usage
- [ ] Show ProtectedRoute pattern
- [ ] Explain error handling layers
- [ ] Show responsive design approach
- [ ] Review component folder structure
- [ ] Practice form submission pattern

---

## ❓ FAQ - Common Questions Developers Ask

**Q: Why use Context instead of Redux?**
A: Context is sufficient for auth state. Redux adds complexity without benefit at this scale.

**Q: Can I use different state management?**
A: Yes, replace AuthContext with any solution (Redux, Zustand, Recoil). But stick with Context for now.

**Q: Why is error handling so verbose in forms?**
A: Because users need feedback. Loading states, success messages, and error messages are UX essentials, not boilerplate.

**Q: Can I remove Bootstrap and use Tailwind?**
A: Yes, but theme.css would need rewriting. Stick with Bootstrap for consistency.

**Q: How do I add TypeScript?**
A: Vite supports TS out of box. Change .jsx to .tsx and add types. Recommend for next iteration.

**Q: Should I use React Hooks or Class Components?**
A: Only Hooks. They're simpler, modern, and what all examples show.

**Q: How do I add dark/light mode toggle?**
A: Create a ThemeContext, update CSS variables dynamically. See how AuthContext works as a starting point.

---

## 🚀 Next Steps for Developers

1. **Understand the Stack**: Read about Vite, React Hooks, and React Router
2. **Explore the Code**: Open each folder, read comments, understand structure
3. **Try a Task**: Add a new component, modify a page, call an API
4. **Ask Questions**: Refer to Architecture.md, API.md, and this guide
5. **Practice**: Build a dummy feature (not production code)
6. **Contribute**: Follow code standards and patterns

---

## 📞 Getting Help

- **Architecture questions**: See ARCHITECTURE.md
- **API questions**: See API.md
- **Deployment questions**: See DEPLOYMENT.md
- **Code questions**: Check comments in source files
- **Team questions**: Ask the dev team

---

**Last Updated**: March 2026
**Version**: 1.0.0

*Remember: Code is read much more often than it's written. Write with clarity first, cleverness second.*
