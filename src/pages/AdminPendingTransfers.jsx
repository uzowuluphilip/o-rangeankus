import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'
import { formatShortDate } from '../utils/dateUtils'

const AdminPendingTransfers = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionInProgress, setActionInProgress] = useState(null)

  const loadPendingTransactions = async () => {
    try {
      setLoading(true)
      const resp = await axiosInstance.get('/admin/transactions/pending?limit=100')
      setTransactions(resp.data.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error loading pending transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPendingTransactions()
  }, [])

  const approveTransaction = async (transactionId) => {
    try {
      setActionInProgress(transactionId)
      await axiosInstance.post('/admin/transactions/approve', { transaction_id: transactionId })
      setError('')
      await loadPendingTransactions()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to approve transaction')
    } finally {
      setActionInProgress(null)
    }
  }

  const rejectTransaction = async (transactionId) => {
    try {
      setActionInProgress(transactionId)
      await axiosInstance.post('/admin/transactions/reject', { transaction_id: transactionId })
      setError('')
      await loadPendingTransactions()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reject transaction')
    } finally {
      setActionInProgress(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="h3 text-primary-text mb-2">Pending Transaction Approvals</h1>
        <p className="text-secondary">Review and approve or reject pending transactions from users.</p>
      </div>

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

      {loading ? (
        <div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th className="hide-on-mobile">ID</th>
                <th>User</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th className="hide-on-mobile">Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length ? transactions.map(txn => (
                <tr key={txn.transaction_id}>
                  <td className="hide-on-mobile small">{txn.transaction_id}</td>
                  <td><strong>{txn.first_name} {txn.last_name}</strong></td>
                  <td><small>{txn.type_display || txn.transaction_type}</small></td>
                  <td><strong className={txn.amount < 0 ? 'text-danger' : 'text-success'}>
                    {txn.amount < 0 ? '-' : '+'}${Math.abs(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </strong></td>
                  <td className="text-secondary small">{txn.description || '-'}</td>
                  <td className="hide-on-mobile small">{formatShortDate(txn.created_at)}</td>
                  <td className="action-buttons d-flex gap-2">
                    <button 
                      className="btn btn-success btn-sm me-2" 
                      onClick={() => approveTransaction(txn.transaction_id)}
                      disabled={actionInProgress === txn.transaction_id}
                    >
                      {actionInProgress === txn.transaction_id ? 'Processing...' : 'Approve'}
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => rejectTransaction(txn.transaction_id)}
                      disabled={actionInProgress === txn.transaction_id}
                    >
                      {actionInProgress === txn.transaction_id ? 'Processing...' : 'Reject'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="text-center">No pending transactions</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}

export default AdminPendingTransfers
