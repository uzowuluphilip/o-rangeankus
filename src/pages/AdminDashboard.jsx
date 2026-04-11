import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '../layouts/DashboardLayout'
import TransactionTable from '../components/TransactionTable'
import axiosInstance from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { formatShortDate } from '../utils/dateUtils'

/**
 * Admin Dashboard Page
 * 
 * Features:
 * - View all users
 * - View all transactions
 * - Freeze account button
 * - Admin statistics
 * - Fetches from:
 *   - GET /admin/users
 *   - GET /admin/transactions
 *   - PATCH /admin/freeze/:id
 */
const AdminDashboard = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [freezingUserId, setFreezingUserId] = useState(null)
  const { user } = useAuth()

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true)
        setError('')
        
        console.log('[AdminDashboard] Current user:', user)
        console.log('[AdminDashboard] User role:', user?.role)
        
        if (user?.role !== 'admin') {
          console.error('[AdminDashboard] User is not an admin!')
          setError(t('admin.noAccess'))
          setLoading(false)
          return
        }
        
        console.log('[AdminDashboard] Fetching admin data...')

        // Fetch statistics
        console.log('[AdminDashboard] Fetching statistics...')
        const statsResponse = await axiosInstance.get('/admin/statistics')
        console.log('[AdminDashboard] Statistics response:', statsResponse.data)
        setStats(statsResponse.data.data || statsResponse.data)

        // Fetch users
        console.log('[AdminDashboard] Fetching users...')
        const usersResponse = await axiosInstance.get('/admin/users?limit=10')
        console.log('[AdminDashboard] Users response:', usersResponse.data)
        setUsers(usersResponse.data.data || usersResponse.data || [])

        // Fetch transactions
        console.log('[AdminDashboard] Fetching transactions...')
        const txResponse = await axiosInstance.get('/admin/transactions?limit=10')
        console.log('[AdminDashboard] Transactions response:', txResponse.data)
        setTransactions(txResponse.data.data || txResponse.data || [])
        
        console.log('[AdminDashboard] All data fetched successfully')
      } catch (err) {
        console.error('[AdminDashboard] Error fetching data:', err)
        console.error('[AdminDashboard] Error response:', err.response?.data)
        console.error('[AdminDashboard] Error status:', err.response?.status)
        
        if (err.response?.status === 401) {
          setError(t('admin.authExpired'))
        } else if (err.response?.status === 403) {
          setError(t('admin.permissionDenied'))
        } else {
          const message = err.response?.data?.message || err.message || t('admin.failedLoad')
          setError(message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  // Handle freeze account
  const handleFreezeAccount = async (userId) => {
    if (!window.confirm(t('admin.freezeConfirm'))) {
      return
    }

    setFreezingUserId(userId)
    try {
      await axiosInstance.post(`/admin/user/freeze`, {
        id: userId,
        freeze: true
      })
      
      // Update user status in list
      setUsers(users.map(user =>
        user.id === userId ? { ...user, is_frozen: !user.is_frozen } : user
      ))
      setError('')
    } catch (err) {
      const message = err.response?.data?.message || t('admin.freezeFailed')
      setError(message)
    } finally {
      setFreezingUserId(null)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '500px' }}>
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="h3 text-primary-text mb-2">👨‍💼 {t('admin.dashboard')}</h1>
        <p className="text-secondary">{t('admin.manageOperations')}</p>
      </div>

      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2 mb-3">
          <a href="/admin/users" className="btn btn-outline-secondary">{t('admin.users')}</a>
          <a href="/admin/balance" className="btn btn-outline-secondary">{t('admin.balanceManagement')}</a>
          <a href="/admin/pending-transfers" className="btn btn-outline-secondary">{t('admin.pendingTransfers')}</a>
          <a href="/admin/transaction-dates" className="btn btn-outline-secondary">{t('admin.transactionDates')}</a>
          <a href="/admin/receipts" className="btn btn-outline-secondary">{t('admin.receipts')}</a>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="row mb-5">
          <div className="col-12 col-md-4 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="card-title text-secondary mb-2">Total Users</h6>
                <h2 className="text-primary-orange fw-bold">{stats.total_users || 0}</h2>
                <p className="text-secondary small">Active accounts</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="card-title text-secondary mb-2">Total Transactions</h6>
                <h2 className="text-success fw-bold">{stats.total_transactions || 0}</h2>
                <p className="text-secondary small">All-time</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="card-title text-secondary mb-2">Total Volume</h6>
                <h2 className="text-info fw-bold">${parseFloat(stats.total_volume || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                <p className="text-secondary small">Processed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Users */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="text-primary-text mb-0">Recent Users</h5>
          </div>

          <div className="card">
            <div className="table-responsive-wrapper">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className="hide-on-mobile">Email</th>
                    <th className="hide-on-mobile">Created</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-secondary py-4">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id}>
                        <td className="fw-bold">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : user.name || user.email || 'N/A'
                          }
                        </td>
                        <td className="text-secondary hide-on-mobile">{user.email || 'N/A'}</td>
                        <td className="text-secondary hide-on-mobile small">
                          {user.created_at 
                            ? formatShortDate(user.created_at)
                            : 'Unknown Date'
                          }
                        </td>
                        <td>
                          <span className={`badge ${user.is_frozen ? 'bg-danger' : 'bg-success'}`}>
                            {user.is_frozen ? 'Frozen' : 'Active'}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm ${user.is_frozen ? 'btn-outline-success' : 'btn-outline-danger'}`}
                            onClick={() => handleFreezeAccount(user.id)}
                            disabled={freezingUserId === user.id}
                          >
                            {freezingUserId === user.id ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              user.is_frozen ? 'Unfreeze' : 'Freeze'
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="row">
        <div className="col-12">
          <div className="mb-4">
            <h5 className="text-primary-text mb-0">Recent Transactions</h5>
          </div>

          <div className="card">
            <div className="card-body p-0">
              <TransactionTable
                transactions={transactions}
                loading={false}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
