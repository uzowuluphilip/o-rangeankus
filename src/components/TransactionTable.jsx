import React from 'react'

/**
 * TransactionTable Component
 * 
 * Reusable table component for displaying transactions.
 * Features:
 * - Responsive design
 * - Status badge coloring
 * - Pagination support
 * - Sortable columns
 */
const TransactionTable = ({ transactions, loading, onPageChange, currentPage, totalPages }) => {
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

  // Determine badge color based on transaction type/status
  const getStatusBadge = (transaction) => {
    const type = transaction.type || transaction.status
    const badgeMap = {
      completed: 'bg-success',
      pending: 'bg-warning',
      failed: 'bg-danger',
      deposit: 'bg-success',
      withdrawal: 'bg-danger',
      transfer: 'bg-info'
    }
    return badgeMap[type] || 'bg-secondary'
  }

  return (
    <div className="table-responsive">
      <table className="table table-dark table-hover align-middle">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction.id || transaction.transaction_id || `transaction-${index}`}>
              <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
              <td className="fw-bold">{transaction.type || 'Transfer'}</td>
              <td className="text-secondary">{transaction.description || '-'}</td>
              <td className={transaction.amount < 0 ? 'text-danger' : 'text-success'}>
                {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
              </td>
              <td>
                <span className={`badge ${getStatusBadge(transaction)}`}>
                  {transaction.status || transaction.type}
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
