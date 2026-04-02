import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '../layouts/DashboardLayout'
import axiosInstance from '../api/axios'
import { Globe, Lightbulb, Clock } from 'lucide-react'

/**
 * International Transfer Page
 * 
 * Features:
 * - Recipient details form
 * - Currency selector
 * - Real-time exchange rate preview
 * - Dynamic amount conversion
 * - POST /transfer/international endpoint
 */
const InternationalTransfer = () => {
  const { t } = useTranslation()
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
  const navigate = useNavigate()

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
    if (!formData.swiftCode.trim()) {
      setError(t('internationalTransfer.swiftCodeRequired'))
      return false
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError(t('internationalTransfer.validAmountRequired'))
      return false
    }
    return true
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setLoading(true)
    try {
      await axiosInstance.post('/transactions/simulate', {
        type: 'international',
        recipient_name: formData.recipientName,
        country: formData.country,
        account_number: formData.accountNumber,
        swift_code: formData.swiftCode,
        currency: formData.currency,
        amount: parseFloat(formData.amount),
        purpose: formData.purpose
      })

      setSuccess(t('internationalTransfer.transferInitiated'))
      
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

      // Redirect to dashboard after 2 seconds
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      const message = err.response?.data?.message || t('internationalTransfer.transferFailed')
      setError(message)
    } finally {
      setLoading(false)
    }
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
              <h6 className="card-title text-primary-orange mb-3"><Lightbulb size={20} className="me-2" style={{display: 'inline-block'}} /> What You Need</h6>
              <ul className="small text-secondary mb-4 ps-3">
                <li className="mb-2">Recipient's full name</li>
                <li className="mb-2">IBAN or account number</li>
                <li className="mb-2">SWIFT code (8-11 characters)</li>
                <li>Recipient's country</li>
              </ul>
            </div>
          </div>

          <div className="card border-info mt-4">
            <div className="card-body">
              <h6 className="card-title text-info mb-2"><Clock size={20} className="me-2" style={{display: 'inline-block'}} /> Processing Time</h6>
              <p className="small text-secondary mb-0">
                International transfers typically take 2-5 business days
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InternationalTransfer
