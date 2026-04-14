import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'
import { formatShortDate, formatDateTime, formatForDatetimeInput } from '../utils/dateUtils'

const AdminTransactionDates = () => {
  const [transactions, setTransactions] = useState([])
  const [selected, setSelected] = useState(null)
  const [transactionDate, setTransactionDate] = useState('')
  const [loadingTxns, setLoadingTxns] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadTransactions = async () => {
    try {
      setLoadingTxns(true)
      const resp = await axiosInstance.get('/transactions/all?limit=100')
      setTransactions(resp.data.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load transactions')
    } finally {
      setLoadingTxns(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  // Format date from backend format to datetime-local format
  const formatForInput = (dateStr) => {
    return formatForDatetimeInput(dateStr)
  }

  // Format date from datetime-local back to backend format
  const formatForBackend = (dateStr) => {
    if (!dateStr) return null
    // datetime-local format is: YYYY-MM-DDTHH:mm or YYYY-MM-DDTHH:mm:ss
    // Convert to backend format: YYYY-MM-DD HH:mm:ss
    const parts = dateStr.split('T')
    if (parts.length !== 2) return null
    
    const [datePart, timePart] = parts
    
    // If time is HH:mm (2 colons), add :00 for seconds
    // If time is HH:mm:ss (3 colons), use as-is
    const timeSegments = timePart.split(':')
    const timeWithSeconds = timeSegments.length === 2 
      ? `${timePart}:00`
      : timePart
      
    return `${datePart} ${timeWithSeconds}`
  }

  const selectTransaction = (txn) => {
    setSelected(txn)
    setTransactionDate(formatForInput(txn.posting_date || txn.created_at))
    setSuccess('')
    setError('')
  }

  const submitUpdate = async () => {
    if (!selected) return
    try {
      setSaving(true)
      setError('')

      const payload = {
        transaction_id: selected.transaction_id,
        posting_date: formatForBackend(transactionDate)
      }

      const resp = await axiosInstance.post('/admin/transactions/update-dates', payload)
      if (resp.data.success) {
        setSuccess('Dates updated successfully!')
        setError('')
        // Force full page reload to ensure all data is refreshed
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        setError(resp.data.message || 'Failed to update dates')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Server error')
      console.error('Update error:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="h3 text-primary-text mb-2">Admin Transaction Date Editor</h1>
        <p className="text-secondary">Backdate / frontdate transaction posting/value dates.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-4">
        <h5>Transaction list</h5>
        {loadingTxns ? (
          <div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div>
        ) : (
          <div className="table-responsive-wrapper" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th className="hide-on-mobile">ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th className="hide-on-mobile">Type</th>
                  <th>Status</th>
                  <th className="hide-on-mobile">Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(txn => (
                  <tr key={txn.transaction_id} className={selected?.transaction_id === txn.transaction_id ? 'table-primary' : ''}>
                    <td className="hide-on-mobile"><small>{txn.transaction_id}</small></td>
                    <td><small>{txn.first_name} {txn.last_name}</small></td>
                    <td><strong>${Number(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                    <td className="hide-on-mobile"><small>{txn.type_display || txn.transaction_type || txn.type}</small></td>
                    <td>
                      <span className={`badge ${
                        txn.status === 'completed' ? 'bg-success' :
                        txn.status === 'rejected' || txn.status === 'failed' ? 'bg-danger' :
                        txn.status === 'pending' ? 'bg-warning' :
                        'bg-secondary'
                      }`}>
                        {txn.status ? txn.status.charAt(0).toUpperCase() + txn.status.slice(1) : 'No Status'}
                      </span>
                    </td>
                    <td><small>{formatShortDate(txn.posting_date || txn.created_at)}</small></td>
                    <td>
                      <button className="btn btn-sm btn-outline-light" onClick={() => selectTransaction(txn)}>Edit dates</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="card p-4 bg-dark border-secondary">
          <h5 className="mb-4">Edit transaction #{selected.transaction_id}</h5>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label">Transaction Date</label>
              <input 
                type="datetime-local"
                className="form-control"
                value={transactionDate} 
                onChange={(e) => setTransactionDate(e.target.value)}
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary flex-grow-1" 
              onClick={submitUpdate}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save date changes'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setSelected(null)}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default AdminTransactionDates
