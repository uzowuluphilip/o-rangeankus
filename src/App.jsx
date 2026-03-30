import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import WireTransfer from './pages/WireTransfer'
import InternationalTransfer from './pages/InternationalTransfer'
import DirectDeposit from './pages/DirectDeposit'
import TransactionHistory from './pages/TransactionHistory'
import AccountStatements from './pages/AccountStatements'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminPendingTransfers from './pages/AdminPendingTransfers'
import AdminTransactionDates from './pages/AdminTransactionDates'
import AdminReceipts from './pages/AdminReceipts'
import Contact from './pages/Contact'
import Terms from './pages/Terms'

/**
 * Smart redirect component that sends users to correct dashboard or shows landing page
 */
const SmartRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth()
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Landing />
  }
  
  return user?.role === 'admin' ? 
    <Navigate to="/admin/dashboard" replace /> : 
    <Navigate to="/dashboard" replace />
}

/**
 * App Component - Main application router
 * 
 * Routes:
 * Public (Unauthenticated):
 *   / - Landing page (public)
 *   /login - User login
 *   /register - User registration
 *   /admin - Admin login
 * 
 * Protected (User):
 *   /dashboard - User dashboard
 *   /wire-transfer - Wire transfer form
 *   /international-transfer - International transfer
 *   /direct-deposit - Direct deposit setup
 *   /transactions - Transaction history
 *   /statements - Account statements
 * 
 * Protected (Admin):
 *   /admin/dashboard - Admin dashboard
 *   /admin/users - Admin users
 *   /admin/pending-transfers - Admin pending transfers
 *   /admin/transaction-dates - Admin transaction dates
 *   /admin/receipts - Admin receipts
 */
const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminLogin />} />

            {/* User Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wire-transfer"
              element={
                <ProtectedRoute>
                  <WireTransfer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/international-transfer"
              element={
                <ProtectedRoute>
                  <InternationalTransfer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/direct-deposit"
              element={
                <ProtectedRoute>
                  <DirectDeposit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statements"
              element={
                <ProtectedRoute>
                  <AccountStatements />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pending-transfers"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPendingTransfers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/transaction-dates"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminTransactionDates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/receipts"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminReceipts />
                </ProtectedRoute>
              }
            />

            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />

            {/* Smart redirect based on role */}
            <Route path="/" element={<SmartRedirect />} />
            <Route path="*" element={<SmartRedirect />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
