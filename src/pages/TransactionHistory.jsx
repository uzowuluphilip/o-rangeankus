import React, { useState, useEffect } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import TransactionTable from '../components/TransactionTable'
import axiosInstance from '../api/axios'
import { FileText } from 'lucide-react'

/**
 * Transaction History Page
 * 
 * Features:
 * - Filter by date range
 * - Filter by transaction type
 * - Paginated table display
 * - Fetches from GET /transactions?filters
 */
const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: ''
  })

  // Fetch transactions with filters
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        
        // Build query string from filters
        const params = new URLSearchParams({
          page: currentPage,
          ...(filters.type && { type: filters.type }),
          ...(filters.startDate && { start_date: filters.startDate }),
          ...(filters.endDate && { end_date: filters.endDate })
        })

        const response = await axiosInstance.get(`/transactions/user?${params}`)
        const data = response.data.data || response.data

        setTransactions(Array.isArray(data) ? data : (data.transactions || []))
        setTotalPages(data.total_pages || 1)
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load transactions'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [filters, currentPage])

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="h3 text-primary-text mb-2"><FileText size={28} className="me-2" style={{display: 'inline-block'}} /> Transaction History</h1>
        <p className="text-secondary">View and filter your transactions</p>
      </div>

      {/* Filters Card */}
      <div className="card mb-4">
        <div className="card-body p-4">
          <h6 className="card-title text-primary-text mb-4">Filters</h6>
          <div className="row">
            {/* Transaction Type Filter */}
            <div className="col-12 col-md-4 mb-3">
              <label htmlFor="typeFilter" className="form-label text-secondary small">
                Transaction Type
              </label>
              <select
                className="form-select"
                id="typeFilter"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="transfer">Transfer</option>
                <option value="payment">Payment</option>
              </select>
            </div>

            {/* Start Date Filter */}
            <div className="col-12 col-md-4 mb-3">
              <label htmlFor="startDateFilter" className="form-label text-secondary small">
                Start Date
              </label>
              <input
                type="date"
                className="form-control"
                id="startDateFilter"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            {/* End Date Filter */}
            <div className="col-12 col-md-4 mb-3">
              <label htmlFor="endDateFilter" className="form-label text-secondary small">
                End Date
              </label>
              <input
                type="date"
                className="form-control"
                id="endDateFilter"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Active filters display */}
          {(filters.type || filters.startDate || filters.endDate) && (
            <div className="mt-3">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setFilters({ type: '', startDate: '', endDate: '' })}
              >
                Clear Filters
              </button>
            </div>
          )}
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

      {/* Transactions Table */}
      <div className="card">
        <div className="card-body p-0">
          <TransactionTable
            transactions={transactions}
            loading={loading}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>

      {/* Summary Stats */}
      {transactions.length > 0 && (
        <div className="row mt-4">
          <div className="col-12 col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="card-title text-secondary small">Total Transactions</h6>
                <h3 className="text-primary-orange fw-bold">{transactions.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="card-title text-secondary small">Total Received</h6>
                <h3 className="text-success fw-bold">
                  ${(() => {
                    const total = (Array.isArray(transactions) ? transactions : [])
                      .filter(t => t && parseFloat(t.amount) > 0)
                      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
                    return (total || 0).toFixed(2);
                  })()}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="card-title text-secondary small">Total Sent</h6>
                <h3 className="text-danger fw-bold">
                  ${(() => {
                    const total = (Array.isArray(transactions) ? transactions : [])
                      .filter(t => t && parseFloat(t.amount) < 0)
                      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
                    return Math.abs(total || 0).toFixed(2);
                  })()}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default TransactionHistory
