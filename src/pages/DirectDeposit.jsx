import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'
import { ArrowDownToLine, Sparkles, Lock, HelpCircle } from 'lucide-react'

/**
 * Direct Deposit Setup Page
 * 
 * Features:
 * - Display routing number
 * - Display account number
 * - Download PDF button
 * - Shareable bank details
 */
const DirectDeposit = () => {
  const { t } = useTranslation()
  const [directDepositData, setDirectDepositData] = useState(null)
  const [formData, setFormData] = useState({
    routing_number: '',
    account_number: '',
    account_type: 'Checking',
    bank_name: 'Orange Bank'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(null)

  // Fetch direct deposit information
  useEffect(() => {
    const fetchDirectDepositInfo = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get('/account/direct-deposit')
        const data = response.data.data || response.data
        setDirectDepositData(data)
        setFormData({
          routing_number: data.routing_number || '',
          account_number: data.account_number || '',
          account_type: data.account_type || 'Checking',
          bank_name: data.bank_name || 'Orange Bank'
        })
      } catch (err) {
        const message = err.response?.data?.message || t('directDeposit.failed')
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchDirectDepositInfo()
  }, [])

  // Handle copy to clipboard
  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text)
    setCopied(fieldName)
    setTimeout(() => setCopied(null), 2000)
  }

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      const response = await axiosInstance.get('/account/direct-deposit/pdf', {
        responseType: 'blob'
      })
      
      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'direct-deposit-form.pdf')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(t('directDeposit.failedDownload'))
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
        <h1 className="h3 text-primary-text mb-2"><ArrowDownToLine size={28} className="me-2" style={{display: 'inline-block'}} /> {t('directDeposit.title')}</h1>
        <p className="text-secondary">{t('directDeposit.subtitle')}</p>
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

      <div className="row">
        <div className="col-12 col-lg-8">
          {/* Bank Information Card */}
          <div className="card mb-4">
            <div className="card-body p-4">
              <h5 className="card-title text-primary-text mb-4">{t('directDeposit.bankName')}</h5>

              {/* Routing Number */}
              <div className="mb-4">
                <label className="form-label text-secondary small">{t('directDeposit.routingNumber')}</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.routing_number}
                    placeholder="N/A"
                    onChange={(e) => setFormData(prev => ({ ...prev, routing_number: e.target.value }))}
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={() => handleCopy(formData.routing_number, 'routing')}
                  >
                    {copied === 'routing' ? `✓ ${t('directDeposit.copied')}` : t('directDeposit.copy')}
                  </button>
                </div>
              </div>

              {/* Account Number */}
              <div className="mb-4">
                <label className="form-label text-secondary small">{t('directDeposit.accountNumber')}</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.account_number}
                    placeholder="N/A"
                    onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={() => handleCopy(formData.account_number, 'account')}
                  >
                    {copied === 'account' ? `✓ ${t('directDeposit.copied')}` : t('directDeposit.copy')}
                  </button>
                </div>
              </div>

              {/* Account Type */}
              <div className="mb-4">
                <label className="form-label text-secondary small">{t('directDeposit.accountType')}</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.account_type}
                  placeholder="Checking"
                  onChange={(e) => setFormData(prev => ({ ...prev, account_type: e.target.value }))}
                />
              </div>

              {/* Bank Name */}
              <div className="mb-4">
                <label className="form-label text-secondary small">{t('directDeposit.bankName')}</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.bank_name}
                  placeholder="Orange Bank"
                  onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                />
              </div>

              {/* Download PDF */}
              <button
                className="btn btn-primary w-100 py-2"
                onClick={handleDownloadPDF}
              >
                📄 {t('directDeposit.downloadPDF')}
              </button>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="card">
            <div className="card-body p-4">
              <h5 className="card-title text-primary-text mb-4">How to Set Up Direct Deposit</h5>
              <ol className="text-primary-text">
                <li className="mb-3">
                  <strong>Provide Employer</strong>
                  <p className="text-secondary small mb-0">
                    Share the routing number and account number with your employer's payroll department
                  </p>
                </li>
                <li className="mb-3">
                  <strong>Complete Authorization</strong>
                  <p className="text-secondary small mb-0">
                    Sign any required documents (use our downloadable form if needed)
                  </p>
                </li>
                <li className="mb-3">
                  <strong>Wait for Verification</strong>
                  <p className="text-secondary small mb-0">
                    Direct deposits usually start within 1-2 pay cycles
                  </p>
                </li>
                <li>
                  <strong>Track Payment</strong>
                  <p className="text-secondary small mb-0">
                    Monitor your transactions page for incoming deposits
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="col-12 col-lg-4">
          {/* Quick Benefits */}
          <div className="card bg-dark mb-4">
            <div className="card-body">
              <h6 className="card-title text-primary-orange mb-3"><Sparkles size={20} className="me-2" style={{display: 'inline-block'}} /> {t('directDeposit.benefits.title')}</h6>
              <ul className="small text-secondary mb-0 ps-3">
                <li className="mb-2">{t('directDeposit.benefits.item1')}</li>
                <li className="mb-2">{t('directDeposit.benefits.item2')}</li>
                <li className="mb-2">{t('directDeposit.benefits.item3')}</li>
                <li>{t('directDeposit.benefits.item4')}</li>
              </ul>
            </div>
          </div>

          {/* Security Info */}
          <div className="card border-success mb-4">
            <div className="card-body">
              <h6 className="card-title text-success mb-2"><Lock size={20} className="me-2" style={{display: 'inline-block'}} /> {t('directDeposit.security.title')}</h6>
              <p className="small text-secondary mb-0">
                {t('directDeposit.security.description')}
              </p>
            </div>
          </div>

          {/* Support */}
          <div className="card border-info">
            <div className="card-body">
              <h6 className="card-title text-info mb-2"><HelpCircle size={20} className="me-2" style={{display: 'inline-block'}} /> {t('directDeposit.needHelp.title')}</h6>
              <p className="small text-secondary mb-0">
                {t('directDeposit.needHelp.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DirectDeposit
