import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/admin/users')
      setUsers(response.data.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleLock = async (userId, currentFrozen) => {
    try {
      const response = await axiosInstance.post('/admin/user/freeze', {
        id: userId,
        freeze: !currentFrozen
      })
      if (response.data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_frozen: !currentFrozen } : u))
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update lock status')
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="h3 text-primary-text mb-2">Admin Users</h1>
        <p className="text-secondary">Manage user accounts and lock/unlock access.</p>
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
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Account Locked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.first_name || '—'} {user.last_name || ''}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.is_frozen ? 'Yes' : 'No'}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${user.is_frozen ? 'btn-success' : 'btn-danger'}`}
                      onClick={() => toggleLock(user.id, user.is_frozen)}
                    >
                      {user.is_frozen ? 'Unlock' : 'Lock'}
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

export default AdminUsers
