import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'
import TransactionReceiptModal from '../components/TransactionReceiptModal'
import { useAuth } from '../context/AuthContext'
import { usePinContext } from '../context/PinContext'
import PinSetupModal from '../components/pin/PinSetupModal'
import PinPromptModal from '../components/pin/PinPromptModal'
import FrozenAccountModal from '../components/pin/FrozenAccountModal'
import usePinFlow from '../hooks/usePinFlow'
import { Globe, Lightbulb, Clock } from 'lucide-react'

/**
 * International Transfer Page
 * 
 * Features:
 * - Recipient details form
 * - Currency selector
 * - Real-time exchange rate preview
 * - Dynamic amount conversion
 * - PIN security before transfer
 * - Transaction receipt modal
 */
const InternationalTransfer = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { checkPinStatus } = usePinContext()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    recipientName: '',
    country: '',
    accountNumber: '',
    swiftCode: '',
    currency: 'EUR',
    amount: '',
    purpose: ''
  })
  const [exchangeRate, setExchangeRate] = useState(1)
  const [convertedAmount, setConvertedAmount] = useState('0.00')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState(null)
  const [accountBalance, setAccountBalance] = useState(0)

  // Validate form inputs
  const validateForm = () => {
    if (!formData.recipientName.trim()) {
      setError(t('internationalTransfer.recipientNameRequired'))
      return false
    }
    if (!formData.country.trim()) {
      setError(t('internationalTransfer.countryRequired'))
      return false
    }
    if (!formData.accountNumber.trim()) {
      setError(t('internationalTransfer.accountNumberRequired'))
      return false
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError(t('internationalTransfer.validAmountRequired'))
      return false
    }
    return true
  }

  // Actual transfer submission - called after PIN verification
  const submitTransfer = async () => {
    setError('')
    setSuccess('')

    if (!validateForm()) return

    if (parseFloat(formData.amount) > accountBalance) {
      setError(t('internationalTransfer.insufficientBalance'))
      return
    }

    setLoading(true)
    try {
      const response = await axiosInstance.post('/transactions/simulate', {
        type: 'international',
        recipient_name: formData.recipientName,
        country: formData.country,
        account_number: formData.accountNumber,
        swift_code: formData.swiftCode,
        currency: formData.currency,
        amount: parseFloat(formData.amount),
        purpose: formData.purpose
      })

      console.log('[InternationalTransfer] Transfer successful:', response.data)

      // Set receipt data from the API response
      setReceiptData({
        id: response.data.transaction_id || response.data?.id,
        reference: response.data.reference_code || response.data?.reference,
        type: response.data.type || 'International Transfer',
        amount: response.data.amount || formData.amount,
        recipient: formData.recipientName,
        description: formData.purpose || 'International Transfer',
        status: response.data.status || 'completed',
        posting_date: response.data.posting_date || new Date().toISOString(),
        value_date: response.data.value_date || new Date().toISOString(),
        sender: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'User',
        country: formData.country,
        currency: formData.currency
      })
      // Show the receipt modal immediately
      setShowReceipt(true)

      // Reset form
      setFormData({
        recipientName: '',
        country: '',
        accountNumber: '',
        swiftCode: '',
        currency: 'EUR',
        amount: '',
        purpose: ''
      })
    } catch (err) {
      const message = err.response?.data?.message || t('internationalTransfer.transferFailed')
      console.error('[InternationalTransfer] Transfer failed:', err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // PIN flow management
  const {
    triggerTransaction,
    showSetup,
    setShowSetup,
    showPrompt,
    setShowPrompt,
    showFrozen,
    setShowFrozen,
    handleSetupSuccess,
    handlePinSuccess,
    handleFrozen,
  } = usePinFlow({
    onTransactionApproved: submitTransfer,
    onFrozen: () => {
      console.log('[InternationalTransfer] Account frozen - logging out')
      logout()
      navigate('/login')
    },
  })

  // Check PIN status on component mount
  useEffect(() => {
    const checkPin = async () => {
      try {
        await checkPinStatus()
      } catch (err) {
        console.error('[InternationalTransfer] Failed to check PIN status:', err)
      }
    }
    checkPin()
  }, [checkPinStatus])

  // Load account balance
  useEffect(() => {
    const loadBalance = async () => {
      try {
        const response = await axiosInstance.get('/transactions/balance')
        const balanceData = response.data.data || response.data
        setAccountBalance(parseFloat(balanceData.total_balance || 0))
      } catch (err) {
        console.error('[InternationalTransfer] Failed to fetch balance', err)
      }
    }

    loadBalance()
  }, [])

  // Supported currencies with exchange rates (mock data - replace with real API)
  const currencies = {
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CAD: 1.36,
    AUD: 1.53,
    CHF: 0.88,
    CNY: 7.08,
    MXN: 17.05
  }

  // Update exchange rate when currency changes
  useEffect(() => {
    const rate = currencies[formData.currency] || 1
    setExchangeRate(rate)
    if (formData.amount) {
      setConvertedAmount((parseFloat(formData.amount) * rate).toFixed(2))
    }
  }, [formData.currency])

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Update converted amount when USD amount changes
    if (name === 'amount' && value) {
      setConvertedAmount((parseFloat(value) * exchangeRate).toFixed(2))
    }
  }

  // Form submission - triggers PIN flow
  const handleSubmit = (e) => {
    e.preventDefault()
    triggerTransaction()
  }

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="h3 text-primary-text mb-2"><Globe size={28} className="me-2" style={{display: 'inline-block'}} /> {t('internationalTransfer.title')}</h1>
        <p className="text-secondary">{t('internationalTransfer.subtitle')}</p>
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
                    {t('internationalTransfer.formLabels.recipientName')} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipientName"
                    name="recipientName"
                    placeholder="Full name"
                    value={formData.recipientName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Country */}
                <div className="mb-4">
                  <label htmlFor="country" className="form-label text-primary-text">
                    {t('internationalTransfer.formLabels.country')} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    placeholder="e.g., France, United Kingdom"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Account Number */}
                <div className="mb-4">
                  <label htmlFor="accountNumber" className="form-label text-primary-text">
                    {t('internationalTransfer.formLabels.accountNumber')} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="accountNumber"
                    name="accountNumber"
                    placeholder="DE89370400440532013000"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* SWIFT Code */}
                <div className="mb-4">
                  <label htmlFor="swiftCode" className="form-label text-primary-text">
                    {t('internationalTransfer.formLabels.swiftCode')} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="swiftCode"
                    name="swiftCode"
                    placeholder="DEUTDE8E"
                    value={formData.swiftCode}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Currency and Amount */}
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label htmlFor="currency" className="form-label text-primary-text">
                      {t('internationalTransfer.formLabels.currency')} <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      {Object.keys(currencies).map(curr => (
                        <option key={curr} value={curr}>
                          {curr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-4">
                    <label htmlFor="amount" className="form-label text-primary-text">
                      {t('internationalTransfer.formLabels.amount')} <span className="text-danger">*</span>
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
                        style={{
                          MozAppearance: 'textfield',
                          appearance: 'textfield'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Exchange Rate Preview */}
                {formData.amount && (
                  <div className="card bg-dark mb-4 border-primary-orange">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <p className="text-secondary small mb-1">{t('internationalTransfer.exchangeRate')}</p>
                          <h5 className="text-primary-orange fw-bold">${formData.amount}</h5>
                        </div>
                        <div className="col-md-6">
                          <p className="text-secondary small mb-1">{t('internationalTransfer.convertedAmount')}</p>
                          <h5 className="text-success fw-bold">
                            {convertedAmount} {formData.currency}
                          </h5>
                        </div>
                      </div>
                      <hr className="border-secondary my-3" />
                      <p className="text-secondary small mb-0">
                        Exchange rate: 1 USD = {exchangeRate.toFixed(4)} {formData.currency}
                      </p>
                    </div>
                  </div>
                )}

                {/* Purpose */}
                <div className="mb-4">
                  <label htmlFor="purpose" className="form-label text-primary-text">
                    {t('internationalTransfer.formLabels.purpose')} ({t('common.optional')})
                  </label>
                  <textarea
                    className="form-control"
                    id="purpose"
                    name="purpose"
                    placeholder="Reason for transfer"
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
        </div>

        {/* Right sidebar */}
        <div className="col-12 col-lg-4">
          <div className="card bg-dark">
            <div className="card-body">
              <h6 className="card-title text-primary-orange mb-3"><Lightbulb size={20} className="me-2" style={{display: 'inline-block'}} /> {t('internationalTransfer.whatYouNeed.title')}</h6>
              <ul className="small text-secondary mb-4 ps-3">
                <li className="mb-2">{t('internationalTransfer.whatYouNeed.item1')}</li>
                <li className="mb-2">{t('internationalTransfer.whatYouNeed.item2')}</li>
                <li className="mb-2">{t('internationalTransfer.whatYouNeed.item3')}</li>
                <li>{t('internationalTransfer.whatYouNeed.item4')}</li>
              </ul>
            </div>
          </div>

          <div className="card border-info mt-4">
            <div className="card-body">
              <h6 className="card-title text-info mb-2"><Clock size={20} className="me-2" style={{display: 'inline-block'}} /> {t('internationalTransfer.processingTime.title')}</h6>
              <p className="small text-secondary mb-0">
                {t('internationalTransfer.processingTime.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      {showReceipt && receiptData && (
        <TransactionReceiptModal
          receipt={receiptData}
          onClose={() => {
            setShowReceipt(false)
            setReceiptData(null)
            // Redirect to dashboard after closing receipt
            setTimeout(() => navigate('/dashboard'), 500)
          }}
        />
      )}

      {/* PIN Setup Modal - First time PIN creation */}
      <PinSetupModal
        isOpen={showSetup}
        onClose={() => setShowSetup(false)}
        onSuccess={handleSetupSuccess}
      />

      {/* PIN Prompt Modal - Verify PIN before each transaction */}
      <PinPromptModal
        isOpen={showPrompt}
        onClose={() => setShowPrompt(false)}
        onSuccess={handlePinSuccess}
        onFrozen={handleFrozen}
        transactionDetails={{
          recipient: formData.recipientName,
          amount: `${formData.currency} ${parseFloat(formData.amount).toFixed(2)} ($${parseFloat(convertedAmount).toFixed(2)})`,
        }}
      />

      {/* Frozen Account Modal - Account locked after failed attempts */}
      <FrozenAccountModal
        isOpen={showFrozen}
        onLogout={() => {
          setShowFrozen(false)
          logout()
          navigate('/login')
        }}
      />
    </DashboardLayout>
  )
}

export default InternationalTransfer
