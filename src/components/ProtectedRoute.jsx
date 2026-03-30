import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Redirects to login if user is not authenticated.
 * 
 * Usage:
 * <Route 
 *   path="/dashboard" 
 *   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
 * />
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth()

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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole) {
    if (user?.role !== requiredRole) {
      // If admin tries to access user routes, send to admin dashboard
      if (user?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />
      }
      // If user tries to access admin routes, send to login
      return <Navigate to="/login" replace />
    }
  } else {
    // For user routes without requiredRole, prevent admins from accessing
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }
  }

  return children
}

export default ProtectedRoute
