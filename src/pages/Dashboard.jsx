import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '../layouts/DashboardLayout'
import TransactionTable from '../components/TransactionTable'
import ProfileModal from '../components/profile/ProfileModal'
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
 * Helper function to build profile picture URL from filename
 */
const buildProfileUrl = (pic) => {
  if (!pic) return null
  
  let value = String(pic).trim()
  
  // Remove protocol (http://, https://)
  let filename = value.replace(/^https?:\/\//, '')
  
  // Remove known domains that might be stuck to filename
  filename = filename.replace(/^(api\.)?orangeankus\.com/i, '')
  filename = filename.replace(/^localhost(:\d+)?/i, '')
  
  // If still has /profiles/ path, extract after it
  if (filename.includes('profiles/')) {
    filename = filename.split('profiles/')[1] || filename
  }
  
  // Remove any remaining slashes and query strings
  filename = filename.split('/').pop().split('?')[0]
  
  // Validate
  if (!filename || filename === 'null' || filename === 'undefined') {
    return null
  }
  
  return `https://api.orangeankus.com/uploads/profiles/${filename}`
}

/**
 * Dashboard Page
 * 
 * User dashboard displaying:
 * - Account balance
 * - Account number (with copy button)
 * - Recent transactions
 * - Quick action buttons for transfers
 * - Fetches data from:
 *   - GET /account (balance, account_number)
 *   - GET /transactions/recent (recent transactions)
 */
const Dashboard = () => {
  const [accountData, setAccountData] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()
  const { user, updateProfilePicture } = useAuth()
  const { t } = useTranslation()

  // Reset imgFailed whenever user's profile picture changes
  useEffect(() => {
    setImgFailed(false)
    console.log('[Dashboard] Reset imgFailed, user profile_picture:', user?.profile_picture)
  }, [user?.profile_picture])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch account data
        const accountResponse = await axiosInstance.get('/account')
        console.log('[Dashboard] /account API Response:', accountResponse.data)
        
        const accountData = accountResponse.data.data || accountResponse.data
        console.log('[Dashboard] Extracted accountData:', accountData)
        console.log('[Dashboard] Account Number from API:', accountData?.account_number)
        
        // Fetch balance separately (same way as WireTransfer)
        const balanceResponse = await axiosInstance.get('/transactions/balance')
        const balanceData = balanceResponse.data.data || balanceResponse.data
        
        // Merge account data with balance
        const merged = {
          ...accountData,
          balance: balanceData.total_balance || balanceData.balance || 0
        }
        
        console.log('[Dashboard] Final merged accountData:', merged)
        console.log('[Dashboard] Final account_number:', merged.account_number)
        
        setAccountData(merged)

        // Fetch recent transactions
        const transactionsResponse = await axiosInstance.get('/transactions/recent')
        setRecentTransactions(transactionsResponse.data.data || transactionsResponse.data || [])
      } catch (err) {
        console.error('[Dashboard] Error fetching data:', err)
        const message = err.response?.data?.message || t('messages.failedLoadDashboard')
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Copy account number to clipboard
  const handleCopyAccountNumber = () => {
    if (accountData?.account_number) {
      navigator.clipboard.writeText(accountData.account_number)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Format account number as 1234 5678 9012
  const formatAccountNumber = (number) => {
    if (!number) return null
    return number.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
        </div>
      </DashboardLayout>
    )
  }

  console.log('[Dashboard] Rendering with accountData:', accountData)
  console.log('[Dashboard] account_number value:', accountData?.account_number)

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        {/* Page header */}
        <div className="dashboard-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '30px'}}>
            <div>
              <h1 className="dashboard-title">{t('dashboard.welcome', { name: user?.first_name || t('common.user') })}</h1>
              <p className="dashboard-subtitle">{t('dashboard.manageFinances')}</p>
            </div>
            
            {/* Profile picture - Round Avatar with fallback to initials */}
            <div
              onClick={() => setShowProfile(true)}
              title="Click to update profile picture"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '3px solid #FF6600',
                background: 'rgba(255, 102, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255, 102, 0, 0.2)',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                overflow: 'hidden',
                position: 'relative'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {user?.profile_picture && !imgFailed ? (
                <img 
                  src={buildProfileUrl(user.profile_picture)} 
                  alt={`${user.first_name}'s profile`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  onError={() => {
                    console.log('[Dashboard] Profile picture failed to load')
                    setImgFailed(true)
                  }}
                />
              ) : (
                <span style={{
                  color: '#FF6600',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  userSelect: 'none'
                }}>
                  {user?.first_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
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
              ${parseFloat(accountData?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            <h2 className="card-value" style={{ letterSpacing: '2px', fontSize: '1.8rem', marginBottom: '1rem' }}>
              {accountData?.account_number 
                ? formatAccountNumber(accountData.account_number)
                : 'Generating...'}
            </h2>
            {accountData?.account_number && (
              <button
                onClick={handleCopyAccountNumber}
                title={copied ? 'Copied!' : 'Copy account number'}
                style={{
                  background: 'transparent',
                  border: '0.5px solid #E07B00',
                  borderRadius: 6,
                  padding: '6px 12px',
                  color: copied ? '#1D9E75' : '#E07B00',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '1rem',
                  width: '100%'
                }}
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            )}
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

      {/* Profile Picture Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onUpdated={(pictureData) => {
          // Handle both uploads (string URL) and removals (null)
          console.log('[Dashboard] onUpdated called with:', pictureData)
          updateProfilePicture(pictureData)
          
          // Reset imgFailed state for removals to show initials
          if (pictureData === null) {
            setImgFailed(false)
          }
        }}
      />
    </DashboardLayout>
  )
}

export default Dashboard
