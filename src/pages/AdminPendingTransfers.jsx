import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'

const AdminPendingTransfers = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPending = async () => {
    try {
      setLoading(true)
      const resp = await axiosInstance.get('/withdrawals/pending?status=pending')
      setRequests(resp.data.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error loading pending transfers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPending()
  }, [])

  const changeStatus = async (withdrawalId, approve) => {
    try {
      const url = approve ? '/withdrawals/approve' : '/withdrawals/reject'
      await axiosInstance.post(url, { withdrawal_id: withdrawalId })
      await loadPending()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Action failed')
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="h3 text-primary-text mb-2">Pending Transfer Approvals</h1>
        <p className="text-secondary">Approve or reject pending transfer requests.</p>
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
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length ? requests.map(req => (
                <tr key={req.withdrawal_id}>
                  <td>{req.withdrawal_id}</td>
                  <td>{req.first_name} {req.last_name} ({req.email})</td>
                  <td>${Number(req.amount).toFixed(2)}</td>
                  <td>{req.status}</td>
                  <td>{req.created_at}</td>
                  <td>
                    <button className="btn btn-success btn-sm me-2" onClick={() => changeStatus(req.withdrawal_id, true)}>Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={() => changeStatus(req.withdrawal_id, false)}>Decline</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center">No pending transfers</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}

export default AdminPendingTransfers
