import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'
import { formatDateTime, formatShortDate } from '../utils/dateUtils'

/**
 * Receipt Modal Component
 * Displays full transaction receipt details in a modal
 */
const ReceiptModal = ({ transaction, onClose, onDownload }) => {
  if (!transaction) return null

  const formatAmount = (amount) => {
    return Math.abs(Number(amount)).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      completed: '#4dff88',
      pending: '#FFD700',
      failed: '#ff4d4d',
      rejected: '#ff4d4d'
    }
    return colors[status?.toLowerCase()] || '#888'
  }

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
    >
      {/* Modal Box */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1A1A1A',
          border: '1px solid rgba(255,107,0,0.2)',
          borderRadius: '16px',
          padding: '2rem',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        {/* Receipt Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            {/* Bank Logo Image */}
            <img
              src="/orange-logo.jpg"
              alt="O-rangeankus Bank Logo"
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'contain',
                borderRadius: '50%'
              }}
              onError={(e) => {
                // Fallback to emoji if logo not found
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            {/* Fallback emoji hidden by default */}
            <div style={{ fontSize: '2.5rem', display: 'none' }}>🏦</div>
          </div>

          {/* Bank Name */}
          <h2 style={{
            color: '#FF6B00',
            fontWeight: 800,
            fontSize: '1.5rem',
            margin: 0,
            letterSpacing: '-0.01em',
            fontFamily: 'inherit'
          }}>
            O-rangeankus
          </h2>

          {/* Subtitle */}
          <p style={{
            color: '#FF6B00',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: '0 0 0.5rem 0',
            opacity: 0.8
          }}>
            Bank&Trust
          </p>

          <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Transaction Receipt
          </p>
          <div style={{
            display: 'inline-block',
            marginTop: '0.75rem',
            padding: '4px 16px',
            background: `${getStatusColor(transaction.status)}20`,
            border: `1px solid ${getStatusColor(transaction.status)}50`,
            borderRadius: '100px',
            color: getStatusColor(transaction.status),
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {transaction.status}
          </div>
        </div>

        {/* Amount */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          padding: '1.5rem',
          background: 'rgba(255,107,0,0.06)',
          borderRadius: '12px',
          border: '1px solid rgba(255,107,0,0.15)'
        }}>
          <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Transaction Amount
          </p>
          <p style={{ color: '#FF6B00', fontSize: '2rem', fontWeight: 800, margin: 0 }}>
            ${formatAmount(transaction.amount)}
          </p>
        </div>

        {/* Receipt Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'Transaction ID', value: `#${transaction.transaction_id}` },
            { label: 'Reference', value: transaction.reference_code || 'N/A' },
            { label: 'User', value: transaction.first_name && transaction.last_name ? `${transaction.first_name} ${transaction.last_name}` : 'N/A' },
            { label: 'Type', value: transaction.type || transaction.transaction_type || 'N/A' },
            { label: 'Description', value: transaction.description || 'N/A' },
            { label: 'Transaction Date', value: formatDateTime(transaction.posting_date || transaction.created_at) },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <span style={{ color: '#888', fontSize: '0.875rem', flexShrink: 0 }}>
                {label}
              </span>
              <span style={{
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 600,
                textAlign: 'right',
                wordBreak: 'break-word'
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center'
        }}>
          <p style={{ color: '#555', fontSize: '0.75rem' }}>
            This receipt was generated by O-rangeankus Bank&Trust
          </p>
          <p style={{ color: '#555', fontSize: '0.75rem', marginTop: '0.25rem' }}>
            {formatDateTime(new Date().toISOString())}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            Close
          </button>
          <button
            onClick={() => onDownload(transaction.transaction_id)}
            style={{
              flex: 1,
              padding: '12px',
              background: '#FF6B00',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#e55a00'}
            onMouseOut={e => e.currentTarget.style.background = '#FF6B00'}
          >
            📄 Download PDF
          </button>
        </div>

      </div>
    </div>
  )
}

/**
 * Admin Receipts Page
 * View and download transaction receipts
 */
const AdminReceipts = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

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

  const downloadReceipt = async (transactionId) => {
    try {
      console.log('Downloading PDF for transaction ID:', transactionId)
      
      if (!transactionId) {
        alert('Transaction ID is missing')
        return
      }

      // Use axios to fetch the PDF blob
      const response = await axiosInstance.get(
        `/transactions/receipt?id=${transactionId}`,
        { responseType: 'blob' }
      )

      console.log('Receipt response received, size:', response.data.size)

      // Create download link from blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `receipt-${transactionId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      console.log('PDF download completed')
    } catch (err) {
      console.error('PDF download error:', err)
      console.error('Error response:', err.response?.data)
      alert('Failed to download receipt. The receipt may not be available yet.')
    }
  }

  const handleViewReceipt = (transaction) => {
    setSelectedReceipt(transaction)
    setShowReceiptModal(true)
  }

  const handleCloseReceipt = () => {
    setSelectedReceipt(null)
    setShowReceiptModal(false)
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
        <div className="table-responsive-wrapper">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th className="hide-on-mobile">ID</th>
                <th>Reference</th>
                <th className="hide-on-mobile">User</th>
                <th>Amount</th>
                <th className="hide-on-mobile">Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No transactions found.</td></tr>
              ) : transactions.map(txn => (
                <tr key={txn.transaction_id}>
                  <td className="hide-on-mobile">{txn.transaction_id}</td>
                  <td className="reference-code"><strong>{txn.reference_code}</strong></td>
                  <td className="hide-on-mobile"><small>{txn.first_name} {txn.last_name}</small></td>
                  <td><strong>${Number(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                  <td className="hide-on-mobile"><span className={`badge bg-${txn.status === 'completed' ? 'success' : 'warning'}`}>{txn.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* View Receipt Button */}
                      <button
                        onClick={() => handleViewReceipt(txn)}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(255,107,0,0.1)',
                          border: '1px solid rgba(255,107,0,0.4)',
                          borderRadius: '8px',
                          color: '#FF6B00',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,107,0,0.2)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,107,0,0.1)'}
                      >
                        👁️ View
                      </button>

                      {/* Download PDF Button */}
                      <button
                        onClick={() => downloadReceipt(txn.transaction_id)}
                        style={{
                          padding: '8px 16px',
                          background: 'transparent',
                          border: '1px solid #4da6ff',
                          borderRadius: '8px',
                          color: '#4da6ff',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = 'rgba(77,166,255,0.1)'
                          e.currentTarget.style.borderColor = '#4da6ff'
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.borderColor = '#4da6ff'
                        }}
                      >
                        📄 PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Receipt View Modal */}
      {showReceiptModal && selectedReceipt && (
        <ReceiptModal
          transaction={selectedReceipt}
          onClose={handleCloseReceipt}
          onDownload={downloadReceipt}
        />
      )}
    </DashboardLayout>
  )
}

export default AdminReceipts

