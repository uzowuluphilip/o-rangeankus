import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'
import { Clipboard, Calendar, Download } from 'lucide-react'
import { formatDate } from '../utils/dateUtils'

/**
 * Account Statements Page
 * 
 * Features:
 * - List monthly statements
 * - Download PDF for each statement
 * - Statement date display in local timezone
 * - Opening/closing balances
 */
const AccountStatements = () => {
  const { t } = useTranslation()
  const [statements, setStatements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloadingId, setDownloadingId] = useState(null)

  // Fetch account statements
  useEffect(() => {
    const fetchStatements = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get('/account/statements')
        setStatements(response.data.data || response.data || [])
      } catch (err) {
        const message = err.response?.data?.message || t('accountStatements.failedLoad')
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchStatements()
  }, [])

  // Handle statement download
  const handleDownloadStatement = async (statementId) => {
    try {
      setDownloadingId(statementId)
      const response = await axiosInstance.get(
        `/account/statements/${statementId}/download`,
        { responseType: 'blob' }
      )

      // Create blob URL and trigger download (as .html file)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `statement-${statementId}.html`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)
      
      setDownloadingId(null)
    } catch (err) {
      console.error('Failed to download statement:', err)
      setError(t('accountStatements.downloadFailed'))
      setDownloadingId(null)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '500px' }}>
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">{t('common.loading')}</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="h3 text-primary-text mb-2"><Clipboard size={28} className="me-2" style={{display: 'inline-block'}} /> {t('accountStatements.title')}</h1>
        <p className="text-secondary">{t('accountStatements.subtitle')}</p>
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

      {/* Statements List */}
      {statements.length === 0 ? (
        <div className="alert alert-info text-center py-5">
        {t('accountStatements.noStatements')}
        </div>
      ) : (
        <div className="row">
          {statements.map((statement) => (
            <div key={statement.statement_id || statement.month || statement.start_date} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100 hover-shadow">
                <div className="card-body d-flex flex-column">
                  {/* Statement period */}
                  <h6 className="card-title text-primary-text fw-bold mb-1">
                    <Calendar size={16} className="me-1" style={{display: 'inline-block'}} /> {formatDate(statement.start_date)}
                  </h6>
                  <p className="text-secondary small mb-3">
                    {formatDate(statement.start_date)} - {formatDate(statement.end_date)}
                  </p>

                  {/* Statement details */}
                  <div className="mb-4 flex-grow-1">
                    <div className="mb-3">
                    <p className="text-secondary small mb-1">{t('accountStatements.openingBalance')}</p>
                      <p className="text-primary-text fw-bold" style={{ fontSize: '0.95rem' }}>
                        ${parseFloat(statement.opening_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="mb-3">
                    <p className="text-secondary small mb-1">{t('accountStatements.closingBalance')}</p>
                      <p className="text-success fw-bold" style={{ fontSize: '0.95rem' }}>
                        ${parseFloat(statement.closing_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div>
                      <p className="text-secondary small mb-1">{t('accountStatements.transactions')}</p>
                      <p className="text-primary-orange fw-bold" style={{ fontSize: '0.95rem' }}>
                        {statement.transactions_count || 0}
                      </p>
                    </div>
                  </div>

                  {/* Download statement button */}
                  <button
                    className="btn btn-primary w-100 py-2"
                    onClick={() => handleDownloadStatement(statement.statement_id)}
                    disabled={downloadingId === statement.statement_id}
                  >
                    {downloadingId === statement.statement_id ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('accountStatements.downloading')}
                      </>
                    ) : (
                      <><Download size={16} className="me-2" style={{display: 'inline-block'}} />Download Statement</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info box - Only show when user has statements */}
      {statements.length > 0 && (
        <div className="card border-info mt-5">
          <div className="card-body">
            <h6 className="card-title text-info mb-2">ℹ️ {t('accountStatements.about.title')}</h6>
            <ul className="small text-secondary mb-0">
              <li>{t('accountStatements.about.item1')}</li>
              <li>{t('accountStatements.about.item2')}</li>
              <li>{t('accountStatements.about.item3')}</li>
              <li>{t('accountStatements.about.item4')}</li>
            </ul>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default AccountStatements
