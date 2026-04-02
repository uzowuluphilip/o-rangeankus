import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '../layouts/DashboardLayout'
import TransactionTable from '../components/TransactionTable'
import axiosInstance from '../api/axios'
import { useAuth } from '../context/AuthContext'
import {
  Wallet,
  Send,
  Globe,
  TrendingUp,
  ArrowDownToLine,
  CreditCard,
  Inbox
} from 'lucide-react'
import './Dashboard.css'

/**
 * Dashboard Page
 * 
 * User dashboard displaying:
 * - Account balance
 * - Recent transactions
 * - Quick action buttons for transfers
 * - Fetches data from:
 *   - GET /account (balance)
 *   - GET /transactions/recent (recent transactions)
 */
const Dashboard = () => {
  const [accountData, setAccountData] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch account data
        const accountResponse = await axiosInstance.get('/account')
        const accountData = accountResponse.data.data || accountResponse.data
        
        // Fetch balance separately (same way as WireTransfer)
        const balanceResponse = await axiosInstance.get('/transactions/balance')
        const balanceData = balanceResponse.data.data || balanceResponse.data
        
        // Merge account data with balance
        setAccountData({
          ...accountData,
          balance: balanceData.total_balance || balanceData.balance || 0
        })

        // Fetch recent transactions
        const transactionsResponse = await axiosInstance.get('/transactions/recent')
        setRecentTransactions(transactionsResponse.data.data || transactionsResponse.data || [])
      } catch (err) {
        const message = err.response?.data?.message || t('messages.failedLoadDashboard')
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        {/* Page header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">{t('dashboard.welcome', { name: user?.first_name || t('common.user') })}</h1>
            <p className="dashboard-subtitle">{t('dashboard.manageFinances')}</p>
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <div className="alert alert-danger slide-in-up">
            <div className="alert-content">{error}</div>
            <button
              className="alert-close"
              onClick={() => setError('')}
            >
              ×
            </button>
          </div>
        )}

        {/* Account cards grid */}
        <div className="dashboard-grid">
          {/* Account balance card */}
          <div className="card-modern">
            <div className="card-header">
              <h6 className="card-title">{t('dashboard.accountBalance')}</h6>
              <div className="card-icon">
                <Wallet size={28} />
              </div>
            </div>
            <h2 className="card-value">
              ${accountData?.balance?.toFixed(2) || '0.00'}
            </h2>
            <button
              className="btn btn-primary w-100"
              onClick={() => navigate('/statements')}
            >
              {t('dashboard.viewStatements')}
            </button>
          </div>

          {/* Account info card */}
          <div className="card-modern">
            <div className="card-header">
              <h6 className="card-title">{t('dashboard.accountNumber')}</h6>
              <div className="card-icon">
                <CreditCard size={28} />
              </div>
            </div>
            <h2 className="card-value">{accountData?.account_number || 'N/A'}</h2>
            <button
              className="btn btn-secondary w-100"
              onClick={() => navigate('/direct-deposit')}
            >
              {t('dashboard.setupDirectDeposit')}
            </button>
          </div>

          {/* Account status card */}
          <div className="card-modern">
            <div className="card-header">
              <h6 className="card-title">{t('dashboard.accountStatus')}</h6>
              <div className="card-icon">
                <CreditCard size={28} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <span className="badge bg-success me-2">✓ {t('dashboard.active')}</span>
              <span className="badge bg-info">{t('dashboard.verified')}</span>
            </div>
            <p className="text-tertiary small mb-0">
              {t('dashboard.accountVerified')}
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="dashboard-section">
          <h5 className="section-title">
            <TrendingUp size={24} />
            {t('dashboard.quickActions')}
          </h5>
          <div className="btn-action-group">
            <button
              className="btn-action"
              onClick={() => navigate('/wire-transfer')}
              title={t('banking.sendDomestically')}
            >
              <Send size={24} />
              {t('banking.wireTransfer')}
            </button>
            <button
              className="btn-action"
              onClick={() => navigate('/international-transfer')}
              title={t('banking.sendInternationally')}
            >
              <Globe size={24} />
              {t('banking.international')}
            </button>
            <button
              className="btn-action"
              onClick={() => navigate('/direct-deposit')}
              title={t('banking.receiveDirectDeposits')}
            >
              <ArrowDownToLine size={24} />
              {t('banking.directDeposit')}
            </button>
            <button
              className="btn-action"
              onClick={() => navigate('/transactions')}
              title={t('transactions.viewHistory')}
            >
              <TrendingUp size={24} />
              {t('transactions.history')}
            </button>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h5 className="section-title">
              <TrendingUp size={24} />
              {t('dashboard.recentTransactions')}
            </h5>
            <button
              className="view-all-link"
              onClick={() => navigate('/transactions')}
            >
              {t('dashboard.viewAll')}
            </button>
          </div>
          {recentTransactions.length > 0 ? (
            <TransactionTable
              transactions={recentTransactions.slice(0, 5)}
              loading={false}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Inbox size={48} /></div>
              <h4 className="empty-state-title">{t('dashboard.noTransactions')}</h4>
              <p className="empty-state-text">
                {t('dashboard.noTransactionsDescription')}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
