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
import { DollarSign, Lightbulb } from 'lucide-react'

/**
 * Wire Transfer Page
 * 
 * Features:
 * - Form for wire transfer details
 * - Recipient name, bank, account number, amount
 * - $35 transaction fee
 * - PIN security before transfer
 * - Transaction receipt modal
 * - Bootstrap + inline styling
 */
const TRANSFER_FEE = 35

const WireTransfer = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { checkPinStatus } = usePinContext()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientAddress: '',
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
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState(null)


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
    if (!formData.recipientAddress.trim()) {
      setError(t('wireTransfer.recipientAddressRequired'))
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

  // Actual transfer submission - called after PIN verification
  const submitTransfer = async () => {
    setError('')
    setSuccess('')

    if (!validateForm()) return

    const transferAmount = parseFloat(formData.amount)
    const totalDeducted = transferAmount + TRANSFER_FEE

    if (totalDeducted > accountBalance) {
      setError(`Insufficient balance. You need $${totalDeducted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (including $${TRANSFER_FEE} fee)`)
      return
    }

    setLoading(true)
    try {
      const response = await axiosInstance.post('/transactions/simulate', {
        type: 'wire',
        recipient_name: formData.recipientName,
        recipient_address: formData.recipientAddress,
        bank: formData.bank,
        account_number: formData.accountNumber,
        routing_number: formData.routingNumber,
        amount: transferAmount,
        fee: TRANSFER_FEE,
        total_deducted: totalDeducted,
        purpose: formData.purpose
      })

      console.log('[WireTransfer] Transfer successful:', response.data)

      // Set receipt data from the API response
      setReceiptData({
        id: response.data.transaction_id || response.data?.id,
        reference: response.data.reference_code || response.data?.reference,
        type: response.data.type || 'Wire Transfer',
        amount: response.data.amount || formData.amount,
        fee: TRANSFER_FEE,
        recipient: formData.recipientName,
        recipientAddress: formData.recipientAddress,
        description: formData.purpose || 'Wire Transfer',
        status: response.data.status || 'completed',
        posting_date: response.data.posting_date || new Date().toISOString(),
        sender: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'User',
        bank: formData.bank
      })
      // Show the receipt modal immediately
      setShowReceipt(true)

      // Reset form
      setFormData({
        recipientName: '',
        recipientAddress: '',
        bank: '',
        accountNumber: '',
        routingNumber: '',
        amount: '',
        purpose: ''
      })
    } catch (err) {
      const message = err.response?.data?.message || t('wireTransfer.wireFailed')
      console.error('[WireTransfer] Transfer failed:', err)
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
      console.log('[WireTransfer] Account frozen - logging out')
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
        console.error('[WireTransfer] Failed to check PIN status:', err)
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
        console.error('[WireTransfer] Failed to fetch balance', err)
      }
    }

    loadBalance()
  }, [])

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Form submission - triggers PIN flow
  const handleSubmit = (e) => {
    e.preventDefault()
    triggerTransaction()
  }

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="h3 text-primary-text mb-2"><DollarSign size={28} className="me-2" style={{display: 'inline-block'}} /> {t('wireTransfer.title')}</h1>
        <p className="text-secondary">{t('wireTransfer.subtitle')}</p>
        <p className="text-secondary">{t('wireTransfer.availableBalance', { amount: parseFloat(accountBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) })}</p>
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

                {/* Recipient Address */}
                <div className="mb-4">
                  <label htmlFor="recipientAddress" className="form-label text-primary-text">
                    {t('wireTransfer.formLabels.recipientAddress')} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipientAddress"
                    name="recipientAddress"
                    placeholder="123 Main Street, New York, NY 10001"
                    value={formData.recipientAddress}
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
                      style={{
                        MozAppearance: 'textfield',
                        appearance: 'textfield'
                      }}
                    />
                  </div>
                </div>

                {/* Fee Display */}
                {formData.amount && parseFloat(formData.amount) > 0 && (
                  <div style={{
                    background: 'rgba(255,107,0,0.06)',
                    border: '1px solid rgba(255,107,0,0.2)',
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ color: '#888', fontSize: '0.875rem' }}>Transfer Amount</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>
                        ${parseFloat(formData.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ color: '#888', fontSize: '0.875rem' }}>Transaction Fee</span>
                      <span style={{ color: '#FF6B00', fontWeight: 600 }}>+$35.00</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>Total Deducted</span>
                      <span style={{ color: '#FF6B00', fontSize: '1.1rem', fontWeight: 800 }}>
                        ${(parseFloat(formData.amount || 0) + TRANSFER_FEE).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}

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
          amount: `$${parseFloat(formData.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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

export default WireTransfer
