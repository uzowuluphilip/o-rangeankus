import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'

const AdminTransactionDates = () => {
  const [transactions, setTransactions] = useState([])
  const [selected, setSelected] = useState(null)
  const [postingDate, setPostingDate] = useState('')
  const [valueDate, setValueDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const resp = await axiosInstance.get('/transactions/all?limit=100')
      setTransactions(resp.data.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const selectTransaction = (txn) => {
    setSelected(txn)
    setPostingDate(txn.posting_date || '')
    setValueDate(txn.value_date || '')
    setSuccess('')
    setError('')
  }

  const submitUpdate = async () => {
    if (!selected) return
    try {
      const payload = {
        transaction_id: selected.transaction_id,
        posting_date: postingDate || null,
        value_date: valueDate || null
      }

      const resp = await axiosInstance.put('/admin/transactions/update-dates', payload)
      if (resp.data.success) {
        setSuccess('Dates updated successfully')
        setError('')
        loadTransactions()
        setSelected(null)
      } else {
        setError(resp.data.message || 'Failed to update dates')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Server error')
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
        {loading ? (
          <div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div>
        ) : (
          <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(txn => (
                  <tr key={txn.transaction_id} className={selected?.transaction_id === txn.transaction_id ? 'table-primary' : ''}>
                    <td>{txn.transaction_id}</td>
                    <td>{txn.first_name} {txn.last_name}</td>
                    <td>${Number(txn.amount).toFixed(2)}</td>
                    <td>{txn.transaction_type || txn.type}</td>
                    <td>{txn.status}</td>
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
        <div className="card p-3 bg-dark border-secondary">
          <h5>Edit transaction #{selected.transaction_id}</h5>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label">Posting Date (YYYY-MM-DD HH:MM:SS)</label>
              <input className="form-control" value={postingDate} onChange={(e) => setPostingDate(e.target.value)} placeholder="2026-03-01 12:00:00" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Value Date (YYYY-MM-DD HH:MM:SS)</label>
              <input className="form-control" value={valueDate} onChange={(e) => setValueDate(e.target.value)} placeholder="2026-03-01 12:00:00" />
            </div>
          </div>
          <button className="btn btn-primary" onClick={submitUpdate}>Save date changes</button>
        </div>
      )}
    </DashboardLayout>
  )
}

export default AdminTransactionDates
