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
        <div className="table-responsive-wrapper">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th className="hide-on-mobile">ID</th>
                <th>Name</th>
                <th className="hide-on-mobile">Email</th>
                <th className="hide-on-mobile">Role</th>
                <th>Locked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="hide-on-mobile">{user.id}</td>
                  <td>{user.first_name || '—'} {user.last_name || ''}</td>
                  <td className="hide-on-mobile">{user.email}</td>
                  <td className="hide-on-mobile">{user.role}</td>
                  <td className="text-center">{user.is_frozen ? '🔒' : '✓'}</td>
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
