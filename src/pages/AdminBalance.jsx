import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'
import { DollarSign, User, Search, Loader } from 'lucide-react'

/**
 * Admin Balance Management Page
 * 
 * Features:
 * - Search users by email
 * - Update user balance
 * - Set specific balance amount
 */
const AdminBalance = () => {
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [newBalance, setNewBalance] = useState('')
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load all users
  const loadUsers = async () => {
    try {
      setSearching(true)
      const response = await axiosInstance.get('/admin/users')
      setUsers(response.data.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load users')
      setUsers([])
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setNewBalance(user.balance || user.total_balance || 0)
    setError('')
    setSuccess('')
  }

  // Submit balance update
  const handleUpdateBalance = async () => {
    if (!selectedUser || !selectedUser.email) {
      setError('Please select a user')
      return
    }

    if (newBalance === '' || isNaN(newBalance)) {
      setError('Please enter a valid balance amount')
      return
    }

    const balanceAmount = parseFloat(newBalance)
    if (balanceAmount < 0) {
      setError('Balance cannot be negative')
      return
    }

    setLoading(true)
    try {
      const response = await axiosInstance.post('/admin/update-balance', {
        email: selectedUser.email,
        balance: balanceAmount
      })

      if (response.data.success) {
        setSuccess(`Balance updated successfully for ${selectedUser.first_name} ${selectedUser.last_name}`)
        setError('')
        setSelectedUser(null)
        setNewBalance('')
        // Reload users to reflect changes
        loadUsers()
      } else {
        setError(response.data.message || 'Failed to update balance')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="h3 text-primary-text mb-2">
          <DollarSign size={28} className="me-2" style={{ display: 'inline-block' }} />
          Manage User Balance
        </h1>
        <p className="text-secondary">Update user account balances</p>
      </div>

      <div className="row">
        {/* Left side - User Search and List */}
        <div className="col-12 col-lg-6 mb-4">
          <div className="card">
            <div className="card-body p-4">
              <h5 className="mb-3">Search Users</h5>

              {/* Search input */}
              <div className="input-group mb-3">
                <span className="input-group-text bg-dark border-secondary">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="Search by email, first name or last name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Users list */}
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {searching ? (
                  <div className="text-center">
                    <div className="spinner-border text-warning" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-muted text-center">No users found</p>
                ) : (
                  <div className="list-group list-group-dark">
                    {filteredUsers.map(user => (
                      <button
                        key={user.user_id}
                        className={`list-group-item list-group-item-action ${
                          selectedUser?.user_id === user.user_id
                            ? 'bg-warning text-dark'
                            : 'bg-dark border-secondary'
                        }`}
                        onClick={() => handleSelectUser(user)}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="text-start">
                            <h6 className="mb-1">
                              <User size={14} className="me-2" style={{ display: 'inline-block' }} />
                              {user.first_name} {user.last_name}
                            </h6>
                            <small>{user.email}</small>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold">
                              ${parseFloat(user.balance || user.total_balance || 0).toFixed(2)}
                            </div>
                            <small className="text-muted">Current balance</small>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Balance Update Form */}
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-body p-4">
              <h5 className="mb-4">Update Balance</h5>

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

              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {success}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setSuccess('')}
                  ></button>
                </div>
              )}

              {selectedUser ? (
                <>
                  <div className="mb-4 p-3 bg-dark rounded border border-secondary">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-primary-text mb-1">Selected User</h6>
                        <p className="mb-0 text-secondary">{selectedUser.first_name} {selectedUser.last_name}</p>
                        <small className="text-muted">{selectedUser.email}</small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          setSelectedUser(null)
                          setNewBalance('')
                        }}
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-primary-text">Current Balance</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-primary-orange">$</span>
                      <input
                        type="text"
                        className="form-control bg-dark border-secondary text-white"
                        value={parseFloat(selectedUser.balance || selectedUser.total_balance || 0).toFixed(2)}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-primary-text">New Balance</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-primary-orange">$</span>
                      <input
                        type="number"
                        className="form-control bg-dark border-secondary text-white"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        disabled={loading}
                        style={{
                          MozAppearance: 'textfield',
                          appearance: 'textfield'
                        }}
                      />
                    </div>
                    <small className="text-muted d-block mt-2">
                      Difference: ${(parseFloat(newBalance || 0) - parseFloat(selectedUser.balance || selectedUser.total_balance || 0)).toFixed(2)}
                    </small>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-lg w-100"
                    onClick={handleUpdateBalance}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader size={18} className="me-2 spinner" style={{ display: 'inline-block' }} />
                        Updating...
                      </>
                    ) : (
                      <>
                        <DollarSign size={18} className="me-2" style={{ display: 'inline-block' }} />
                        Update Balance
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center text-muted p-5">
                  <User size={48} className="mb-3 opacity-50" style={{ display: 'block' }} />
                  <p>Select a user from the list to update their balance</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminBalance
