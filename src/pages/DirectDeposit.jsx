import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'
import { ArrowDownToLine, Sparkles, Lock, HelpCircle } from 'lucide-react'

/**
 * Direct Deposit Setup Page
 * 
 * Features:
 * - Display unique routing number per user
 * - Display user's real 12-digit account number
 * - Download PDF button
 * - Shareable bank details
 */

// Helper function to generate routing number from user ID if not provided
const generateRoutingNumber = (userId) => {
  if (!userId) return 'Loading...'
  return '02' + String(userId).padStart(8, '0')
}

const DirectDeposit = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  
  // Debug: Log user data to console
  useEffect(() => {
    console.log('[DirectDeposit] User data:', user)
    if (user) {
      console.log('[DirectDeposit] routing_number from context:', user.routing_number)
      console.log('[DirectDeposit] account_number:', user.account_number)
      console.log('[DirectDeposit] user_id:', user.user_id)
      
      // If routing_number is not in context, generate it from user_id
      const finalRoutingNumber = user.routing_number || generateRoutingNumber(user.user_id)
      console.log('[DirectDeposit] final routing_number:', finalRoutingNumber)
    }
  }, [user])
  
  const [formData, setFormData] = useState({
    routing_number: user?.routing_number || generateRoutingNumber(user?.user_id) || 'Loading...',
    account_number: user?.account_number || 'Loading...',
    account_type: 'Checking',
    bank_name: 'O-rangeankus Bank & Trust'
  })
  
  const [copiedRouting, setCopiedRouting] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [error, setError] = useState('')

  // Update form when user data loads
  useEffect(() => {
    if (user?.account_number || user?.user_id) {
      const routingNum = user?.routing_number || generateRoutingNumber(user?.user_id)
      setFormData(prev => ({
        ...prev,
        account_number: user?.account_number || prev.account_number,
        routing_number: routingNum
      }))
    }
  }, [user?.account_number, user?.routing_number, user?.user_id])

  // Handle copy routing number to clipboard
  const copyRouting = () => {
    const routingNum = user?.routing_number || generateRoutingNumber(user?.user_id) || ''
    navigator.clipboard.writeText(routingNum)
    setCopiedRouting(true)
    setTimeout(() => setCopiedRouting(false), 2000)
  }

  // Handle copy account number to clipboard
  const copyAccount = () => {
    navigator.clipboard.writeText(user?.account_number || '')
    setCopiedAccount(true)
    setTimeout(() => setCopiedAccount(false), 2000)
  }

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      console.log('[DirectDeposit] Starting PDF download...')
      const response = await axiosInstance.get('/account/direct-deposit/pdf', {
        responseType: 'blob'
      })
      
      console.log('[DirectDeposit] Response status:', response.status)
      console.log('[DirectDeposit] Response type:', response.type)
      console.log('[DirectDeposit] Response data type:', typeof response.data)
      console.log('[DirectDeposit] Response data:', response.data)
      
      // Check if response is an error JSON instead of blob
      if (response.data.type === 'application/json') {
        console.error('[DirectDeposit] Received JSON error instead of HTML')
        const text = await response.data.text()
        const errorData = JSON.parse(text)
        setError(`Error: ${errorData.message || 'Failed to generate form'}`)
        return
      }
      
      // response.data is already a Blob, don't wrap it again
      const url = window.URL.createObjectURL(response.data)
      console.log('[DirectDeposit] Created object URL:', url)
      
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'direct-deposit-form.html')
      document.body.appendChild(link)
      console.log('[DirectDeposit] Clicking download link...')
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('[DirectDeposit] Download complete')
    } catch (err) {
      console.error('[DirectDeposit] Download error:', err)
      console.error('[DirectDeposit] Error message:', err.message)
      if (err.response) {
        console.error('[DirectDeposit] Error response:', err.response)
      }
      setError(t('directDeposit.failedDownload') + ' - ' + (err.message || 'Unknown error'))
    }
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
                    value={user?.routing_number || generateRoutingNumber(user?.user_id) || 'Loading...'}
                    disabled
                    placeholder="N/A"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#000',
                      colorScheme: 'light dark'
                    }}
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={copyRouting}
                  >
                    {copiedRouting ? `✓ ${t('directDeposit.copied')}` : t('directDeposit.copy')}
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
                    value={user?.account_number || 'Loading...'}
                    disabled
                    placeholder="N/A"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#000',
                      colorScheme: 'light dark'
                    }}
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={copyAccount}
                  >
                    {copiedAccount ? `✓ ${t('directDeposit.copied')}` : t('directDeposit.copy')}
                  </button>
                </div>
              </div>

              {/* Account Type */}
              <div className="mb-4">
                <label className="form-label text-secondary small">{t('directDeposit.accountType')}</label>
                <input
                  type="text"
                  className="form-control"
                  value="Checking"
                  disabled
                  placeholder="Checking"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#000',
                    colorScheme: 'light dark'
                  }}
                />
              </div>

              {/* Bank Name */}
              <div className="mb-4">
                <label className="form-label text-secondary small">{t('directDeposit.bankName')}</label>
                <input
                  type="text"
                  className="form-control"
                  value="O-rangeankus Bank & Trust"
                  disabled
                  placeholder="O-rangeankus Bank & Trust"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#000',
                    colorScheme: 'light dark'
                  }}
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
              <h5 className="card-title text-primary-text mb-4">{t('directDeposit.setup.title')}</h5>
              <ol className="text-primary-text">
                <li className="mb-3">
                  <strong>{t('directDeposit.setup.step1Title')}</strong>
                  <p className="text-secondary small mb-0">
                    {t('directDeposit.setup.step1Desc')}
                  </p>
                </li>
                <li className="mb-3">
                  <strong>{t('directDeposit.setup.step2Title')}</strong>
                  <p className="text-secondary small mb-0">
                    {t('directDeposit.setup.step2Desc')}
                  </p>
                </li>
                <li className="mb-3">
                  <strong>{t('directDeposit.setup.step3Title')}</strong>
                  <p className="text-secondary small mb-0">
                    {t('directDeposit.setup.step3Desc')}
                  </p>
                </li>
                <li>
                  <strong>{t('directDeposit.setup.step4Title')}</strong>
                  <p className="text-secondary small mb-0">
                    {t('directDeposit.setup.step4Desc')}
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
