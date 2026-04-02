import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'
import { DollarSign, Lightbulb } from 'lucide-react'

/**
 * Wire Transfer Page
 * 
 * Features:
 * - Form for wire transfer details
 * - Recipient name, bank, account number, amount
 * - Validation
 * - POST /transfer/wire endpoint
 * - Success/error notifications
 */
const WireTransfer = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    recipientName: '',
    bank: '',
    accountNumber: '',
    routingNumber: '',
    amount: '',
    purpose: ''
  })
  const [accountBalance, setAccountBalance] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Validate form inputs
  const validateForm = () => {
    if (!formData.recipientName.trim()) {
      setError(t('wireTransfer.recipientNameRequired'))
      return false
    }
    if (!formData.bank.trim()) {
      setError(t('wireTransfer.bankNameRequired'))
      return false
    }
    if (!formData.accountNumber.trim()) {
      setError(t('wireTransfer.accountNumberRequired'))
      return false
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError(t('wireTransfer.validAmountRequired'))
      return false
    }
    return true
  }

  React.useEffect(() => {
    const loadBalance = async () => {
      try {
        const response = await axiosInstance.get('/transactions/balance')
        const balanceData = response.data.data || response.data
        setAccountBalance(parseFloat(balanceData.total_balance || 0))
      } catch (err) {
        console.error('[WireTransfer] Failed to fetch balance', err)
      }
    }

    loadBalance()
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    if (parseFloat(formData.amount) > accountBalance) {
      setError(t('wireTransfer.insufficientBalance'))
      return
    }

    setLoading(true)
    try {
      const response = await axiosInstance.post('/transactions/simulate', {
        type: 'wire',
        recipient_name: formData.recipientName,
        bank: formData.bank,
        account_number: formData.accountNumber,
        routing_number: formData.routingNumber,
        amount: parseFloat(formData.amount),
        purpose: formData.purpose
      })

      setSuccess(t('wireTransfer.wireInitiated'))
      
      // Reset form
      setFormData({
        recipientName: '',
        bank: '',
        accountNumber: '',
        amount: '',
        purpose: ''
      })

      // Redirect to dashboard after 2 seconds
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      const message = err.response?.data?.message || t('wireTransfer.wireFailed')
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="h3 text-primary-text mb-2"><DollarSign size={28} className="me-2" style={{display: 'inline-block'}} /> {t('wireTransfer.title')}</h1>
        <p className="text-secondary">{t('wireTransfer.subtitle')}</p>
        <p className="text-secondary">{t('wireTransfer.availableBalance', { amount: accountBalance.toFixed(2) })}</p>
      </div>

      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="card">
            <div className="card-body p-4">
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

              {/* Success alert */}
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

              <form onSubmit={handleSubmit}>
                {/* Recipient Name */}
                <div className="mb-4">
                  <label htmlFor="recipientName" className="form-label text-primary-text">
                    {t('wireTransfer.formLabels.recipientName')} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipientName"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Bank Name */}
                <div className="mb-4">
                  <label htmlFor="bank" className="form-label text-primary-text">
                    {t('wireTransfer.formLabels.bank')} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bank"
                    name="bank"
                    value={formData.bank}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Account Number */}
                <div className="mb-4">
                  <label htmlFor="accountNumber" className="form-label text-primary-text">
                    {t('wireTransfer.formLabels.accountNumber')} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Routing Number */}
                <div className="mb-4">
                  <label htmlFor="routingNumber" className="form-label text-primary-text">
                    {t('wireTransfer.formLabels.routingNumber')} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="routingNumber"
                    name="routingNumber"
                    value={formData.routingNumber}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <label htmlFor="amount" className="form-label text-primary-text">
                    {t('wireTransfer.formLabels.amount')} <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-primary-orange">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="amount"
                      name="amount"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Purpose */}
                <div className="mb-4">
                  <label htmlFor="purpose" className="form-label text-primary-text">
                    {t('wireTransfer.formLabels.purpose')} ({t('common.optional')})
                  </label>
                  <textarea
                    className="form-control"
                    id="purpose"
                    name="purpose"
                    placeholder="Bill payment, savings, etc."
                    rows="3"
                    value={formData.purpose}
                    onChange={handleChange}
                    disabled={loading}
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="d-grid gap-2 d-sm-flex">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('common.loading')}
                      </>
                    ) : (
                      t('banking.sendTransfer')
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info box */}
          <div className="card mt-4 border-info">
            <div className="card-body">
              <h6 className="card-title text-info mb-2">ℹ️ {t('wireTransfer.infoBox.title')}</h6>
              <ul className="small text-secondary mb-0">
                <li>{t('wireTransfer.infoBox.item1')}</li>
                <li>{t('wireTransfer.infoBox.item2')}</li>
                <li>{t('wireTransfer.infoBox.item3')}</li>
                <li>{t('wireTransfer.infoBox.item4')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right sidebar - Quick tips */}
        <div className="col-12 col-lg-4">
          <div className="card bg-dark">
            <div className="card-body">
              <h6 className="card-title text-primary-orange mb-3"><Lightbulb size={20} className="me-2" style={{display: 'inline-block'}} /> {t('wireTransfer.tips.title')}</h6>
              <ul className="small text-secondary mb-0 ps-3">
                <li className="mb-2">{t('wireTransfer.tips.item1')}</li>
                <li className="mb-2">{t('wireTransfer.tips.item2')}</li>
                <li className="mb-2">{t('wireTransfer.tips.item3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default WireTransfer
