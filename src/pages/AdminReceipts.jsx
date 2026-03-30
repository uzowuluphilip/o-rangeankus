import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'

const AdminReceipts = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const resp = await axiosInstance.get('/transactions/all?limit=100')
      setTransactions(resp.data.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load transaction history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const downloadReceipt = (id) => {
    const url = `${process.env.REACT_APP_BACKEND_URL || 'https://api.orangeankus.com/'}/transactions/receipt?id=${id}`
    window.open(url, '_blank')
  }

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="h3 text-primary-text mb-2">Admin Receipt Export</h1>
        <p className="text-secondary">Download PDF receipts for any transaction.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Reference</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No transactions found.</td></tr>
              ) : transactions.map(txn => (
                <tr key={txn.transaction_id}>
                  <td>{txn.transaction_id}</td>
                  <td>{txn.reference_code}</td>
                  <td>{txn.first_name} {txn.last_name}</td>
                  <td>${Number(txn.amount).toFixed(2)}</td>
                  <td>{txn.status}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-info" onClick={() => downloadReceipt(txn.transaction_id)}>
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}

export default AdminReceipts
