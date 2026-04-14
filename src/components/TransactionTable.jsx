import React, { useState } from 'react'
import { formatShortDate } from '../utils/dateUtils'

/**
 * TransactionTable Component
 * 
 * Reusable table component for displaying transactions.
 * Features:
 * - Responsive design with local timezone dates
 * - Status badge coloring
 * - Pagination support
 * - Sortable Date column
 */
const TransactionTable = ({ transactions, loading, onPageChange, currentPage, totalPages }) => {
  const [sortOrder, setSortOrder] = useState('desc')
  // 'desc' = newest date at top (default)
  // 'asc'  = oldest date at top
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="alert alert-info text-center py-5">
        No transactions found
      </div>
    )
  }

  // Determine badge color based on transaction status
  const getStatusBadge = (transaction) => {
    // ONLY use status, never type
    const status = transaction.status
    const badgeMap = {
      completed: 'bg-success',
      pending: 'bg-warning',
      failed: 'bg-danger',
      rejected: 'bg-danger'
    }
    // Default to red (danger) for any unknown status, not gray
    return badgeMap[status] || 'bg-danger'
  }

  // Get display name for transaction status
  const getStatusDisplay = (transaction) => {
    // Get the actual status from the transaction
    const status = transaction.status
    
    // If status exists, capitalize and return it
    if (status) {
      return status.charAt(0).toUpperCase() + status.slice(1)
    }
    
    // Default to Rejected if no status is found
    return 'Rejected'
  }

  // Get display name for transaction type
  const getTransactionTypeDisplay = (transaction) => {
    // Check description first for Wire/International (most reliable)
    const description = transaction.description || ''
    if (description.toLowerCase().includes('wire')) {
      return 'Transfer'
    }
    if (description.toLowerCase().includes('international')) {
      return 'Transfer'
    }
    if (description.toLowerCase().includes('direct_deposit')) {
      return 'Transfer'
    }
    
    // Fall back to type field
    const type = transaction.type || transaction.transaction_type
    const typeMap = {
      wire: 'Transfer',
      international: 'Transfer',
      direct_deposit: 'Transfer',
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      profit: 'Profit'
    }
    return typeMap[type] || type || 'Transfer'
  }

  // Sort transactions by date before rendering
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.posting_date || a.created_at)
    const dateB = new Date(b.posting_date || b.created_at)
    return sortOrder === 'desc'
      ? dateB - dateA // newest first
      : dateA - dateB // oldest first
  })

  return (
    <div className="table-responsive-wrapper">
      <table className="table table-dark table-hover align-middle">
        <thead>
          <tr>
            <th
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Date {sortOrder === 'desc' ? '↓' : '↑'}
            </th>
            <th>Type</th>
            <th className="hide-on-mobile">Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction, index) => (
            <tr key={transaction.id || transaction.transaction_id || `transaction-${index}`}>
              <td>{formatShortDate(transaction.posting_date || transaction.created_at)}</td>
              <td className="fw-bold">{getTransactionTypeDisplay(transaction)}</td>
              <td className="text-secondary hide-on-mobile description-cell">{transaction.description || '-'}</td>
              <td className={transaction.amount < 0 ? 'text-danger' : 'text-success'}>
                {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td>
                <span className={`badge ${getStatusBadge(transaction)}`}>
                  {getStatusDisplay(transaction)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link bg-surface border-secondary"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button
                  className="page-link bg-surface border-secondary"
                  onClick={() => onPageChange(page)}
                  style={{
                    backgroundColor: currentPage === page ? 'var(--primary-color)' : 'var(--surface-color)',
                    color: currentPage === page ? 'white' : 'var(--primary-text)'
                  }}
                >
                  {page}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link bg-surface border-secondary"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default TransactionTable
