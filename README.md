# O-rangeankus Frontend

A production-ready banking frontend built with Vite, React, and Bootstrap 5. This application provides a secure, responsive interface for users to manage their accounts, perform transfers, and view transactions.

## 🎨 Features

- **Modern Dark Theme** - Custom orange and dark theme with Bootstrap 5
- **Authentication** - JWT-based auth with Context API
- **User Dashboard** - View balance, recent transactions, quick actions
- **Transfer Services**:
  - Domestic wire transfers
  - International transfers with real-time exchange rates
  - Direct deposit setup
- **Account Management**:
  - Transaction history with filters
  - Monthly account statements (PDF download)
  - Routing number and account display
- **Admin Portal**:
  - User management
  - Transaction monitoring
  - Account freeze functionality
- **Responsive Design** - Mobile-first, fully responsive
- **Form Validation** - Client-side validation on all forms
- **Error Handling** - Comprehensive error handling and user feedback
- **API Integration** - Axios with automatic JWT injection and 401 handling

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your API base URL:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── api/
│   └── axios.js              # Configured axios instance with interceptors
├── components/
│   ├── Navbar.jsx            # Top navigation bar
│   ├── Sidebar.jsx           # Dashboard sidebar navigation
│   ├── ProtectedRoute.jsx    # Route protection component
│   └── TransactionTable.jsx  # Reusable transaction table
├── context/
│   └── AuthContext.jsx       # Authentication state management
├── layouts/
│   └── DashboardLayout.jsx   # Dashboard layout wrapper
├── pages/
│   ├── Login.jsx             # User login page
│   ├── Register.jsx          # User registration page
│   ├── Dashboard.jsx         # User dashboard
│   ├── WireTransfer.jsx      # Wire transfer form
│   ├── InternationalTransfer.jsx  # International transfer form
│   ├── DirectDeposit.jsx     # Direct deposit setup
│   ├── TransactionHistory.jsx    # Transaction history & filters
│   ├── AccountStatements.jsx     # Statement list & download
│   ├── AdminLogin.jsx        # Admin login page
│   └── AdminDashboard.jsx    # Admin control panel
├── styles/
│   └── theme.css             # Global theme and custom styles
├── App.jsx                   # Main app component with routing
└── main.jsx                  # React entry point
```

## 🎯 Routing

### Public Routes
- `/login` - User login
- `/register` - User registration  
- `/admin` - Admin login

### Protected User Routes
- `/dashboard` - User dashboard
- `/wire-transfer` - Domestic wire transfer
- `/international-transfer` - International transfer with exchange rates
- `/direct-deposit` - Direct deposit setup
- `/transactions` - Transaction history with filtering
- `/statements` - Account statements

### Protected Admin Routes
- `/admin/dashboard` - Admin control panel

## 🔐 Authentication Flow

1. User submits login credentials (email + password)
2. Frontend sends POST request to `/auth/login` or `/auth/register`
3. Backend returns JWT token and user data
4. Token is stored in localStorage and context
5. Token automatically attached to all API requests via axios interceptor
6. On 401 response, user is redirected to login and session cleared
7. User can manually logout, clearing localStorage and context

### Token Storage
- **localStorage**: Persists session across browser refreshes
- **Context**: Provides app-wide access to auth state

## 🌐 API Integration

### Base Configuration
- Base URL: Loaded from `VITE_API_BASE_URL` environment variable
- Default: `http://localhost:8000/api`
- Timeout: 10 seconds
- Content-Type: `application/json`

### Authentication Headers
All requests automatically include:
```
Authorization: Bearer <JWT_TOKEN>
```

### Error Handling
- 401 Unauthorized: Logout and redirect to login
- Network errors: Caught and logged
- Response errors: User-friendly messages displayed

## 🎨 Theme & Styling

### Color Palette
- **Primary**: `#FF6600` (Orange)
- **Background**: `#09090b` (Near Black)
- **Surface**: `#18181b` (Dark Gray)
- **Primary Text**: `#fafafa` (Off White)
- **Secondary Text**: `#a1a1aa` (Gray)
- **Borders**: `#27272a` (Light Gray)

### Bootstrap Overrides
- Custom button colors and hover states
- Dark form inputs with orange focus state
- Card styling with border animations
- Badge colors for status indicators
- Alert styling for dark theme

### CSS Classes
Custom utility classes available:
- `.text-primary-orange` - Orange text
- `.text-secondary` - Gray text
- `.bg-surface` - Surface background
- `.border-primary-orange` - Orange border
- `.shadow-lg` - Large shadow
- `.rounded-lg` - 12px border radius
- `.transition-all` - Smooth transitions
- `.fade-in` - Fade in animation

## 📝 Key Components

### ProtectedRoute
Guards routes requiring authentication:
```jsx
<Route 
  path="/dashboard" 
  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
/>
```

Optional role-based access:
```jsx
<Route 
  path="/admin/dashboard" 
  element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} 
/>
```

### AuthContext
Global authentication state:
```jsx
const { user, token, isAuthenticated, login, logout } = useAuth()
```

### TransactionTable
Reusable paginated transaction table:
```jsx
<TransactionTable
  transactions={data}
  loading={isLoading}
  onPageChange={handlePageChange}
  currentPage={page}
  totalPages={totalPages}
/>
```

## 🛠️ Development Practices

### Code Style
- Functional components with hooks only
- Clear comments explaining purpose and logic
- Reusable components breaking down complexity
- Consistent naming conventions
- No code duplication

### Validation
- Client-side form validation on all forms
- Email format validation
- Amount validation (positive numbers)
- Password confirmation validation
- Date range validation

### Error Handling
- Try-catch blocks on all async operations
- User-friendly error messages
- Error alerts with dismissible buttons
- Fallback UI states
- Loading spinners during async operations

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px (md), 1024px (lg)
- Sidebar hidden on mobile, accessible via menu
- Touch-friendly buttons and inputs
- Responsive grid layout

## 📦 Dependencies

### Core
- `react` (18.2.0) - UI library
- `react-dom` (18.2.0) - DOM rendering
- `react-router-dom` (6.20.0) - Routing

### API & State
- `axios` (1.6.5) - HTTP client
- Context API (built-in) - State management

### UI
- `bootstrap` (5.3.2) - Component library

### Development
- `vite` (5.0.8) - Build tool
- `@vitejs/plugin-react` (4.2.1) - React plugin
- `eslint` (8.55.0) - Code linting
- `eslint-plugin-react` (7.33.2) - React linting
- `eslint-plugin-react-hooks` (4.6.0) - Hooks linting

## 🔄 API Endpoints Expected

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /admin/login` - Admin login

### User Account
- `GET /account` - Account details and balance
- `GET /account/direct-deposit` - Direct deposit info

### Transfers
- `POST /transfer/wire` - Wire transfer
- `POST /transfer/international` - International transfer

### Transactions
- `GET /transactions/recent` - Recent transactions
- `GET /transactions` - All transactions with filters
- `GET /transactions?page=X&type=Y&start_date=Z&end_date=W` - Filtered transactions

### Account Statements
- `GET /account/statements` - List statements
- `GET /account/statements/:id/download` - Download statement PDF
- `GET /account/direct-deposit/pdf` - Download DD form

### Admin
- `GET /admin/users` - List all users
- `GET /admin/transactions` - List all transactions
- `GET /admin/statistics` - System statistics
- `PATCH /admin/freeze/:id` - Freeze/unfreeze account

## 🧪 Testing

Run linter:
```bash
npm run lint
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)
- [Bootstrap 5](https://getbootstrap.com)
- [Axios Documentation](https://axios-http.com)

## 🤝 Contributing

Follow these guidelines:
1. Use functional components + hooks
2. Write clear comments
3. Keep components small and focused
4. Use semantic HTML
5. Maintain responsive design
6. Add proper error handling

## 📄 License

This project is part of Orange Bank and is proprietary.

## 👨‍💻 Support

For issues or questions, contact the development team.

---

**Built with ❤️ using Vite, React, and Bootstrap**
