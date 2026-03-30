# API Integration Guide

## 📡 Backend API Configuration

The frontend expects a backend API running with the following configuration:

### Base URL
Set via environment variable:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

Or for production:
```
VITE_API_BASE_URL=https://api.orangebank.com/api
```

### Request Format
All requests:
- Method: As specified per endpoint
- Content-Type: `application/json`
- Headers: `Authorization: Bearer <JWT_TOKEN>`

### Response Format
Expected response structure:
```json
{
  "success": true,
  "data": {
    // response data
  },
  "message": "Success message"
}
```

Or directly return data:
```json
{
  // data directly
}
```

## 🔐 Authentication Endpoints

### User Login
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### User Registration
```
POST /auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Admin Login
```
POST /admin/login
Content-Type: application/json

Body:
{
  "email": "admin@orangebank.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@orangebank.com",
      "role": "admin",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## 👤 User Account Endpoints

### Get Account Details
```
GET /account
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "balance": 10500.50,
    "account_number": "123456789",
    "account_type": "checking",
    "is_frozen": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Get Direct Deposit Information
```
GET /account/direct-deposit
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "routing_number": "021000021",
    "account_number": "123456789",
    "account_type": "checking",
    "bank_name": "Orange Bank"
  }
}
```

### Download Direct Deposit PDF
```
GET /account/direct-deposit/pdf
Headers: Authorization: Bearer {token}

Response: PDF file (binary)
```

## 💸 Transfer Endpoints

### Wire Transfer
```
POST /transfer/wire
Headers: Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "recipient_name": "Jane Smith",
  "bank": "Chase Bank",
  "account_number": "987654321",
  "amount": 500.00,
  "purpose": "Payment"
}

Response:
{
  "success": true,
  "data": {
    "id": "transfer_123",
    "status": "processing",
    "amount": 500.00,
    "recipient_name": "Jane Smith",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### International Transfer
```
POST /transfer/international
Headers: Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "recipient_name": "Juan Garcia",
  "country": "Mexico",
  "account_number": "MXMX123456789",
  "swift_code": "BBMXMXMM",
  "currency": "MXN",
  "amount_usd": 500.00,
  "amount_converted": 8525.00,
  "purpose": "Family support"
}

Response:
{
  "success": true,
  "data": {
    "id": "intl_transfer_456",
    "status": "processing",
    "amount_usd": 500.00,
    "amount_converted": 8525.00,
    "currency": "MXN",
    "recipient_name": "Juan Garcia",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

## 📊 Transaction Endpoints

### Recent Transactions
```
GET /transactions/recent
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": "txn_1",
      "type": "deposit",
      "description": "Salary deposit",
      "amount": 5000.00,
      "status": "completed",
      "created_at": "2024-01-15T09:00:00Z"
    },
    {
      "id": "txn_2",
      "type": "withdrawal",
      "description": "ATM withdrawal",
      "amount": -200.00,
      "status": "completed",
      "created_at": "2024-01-14T15:30:00Z"
    }
  ]
}
```

### All Transactions with Filters
```
GET /transactions?page=1&type=deposit&start_date=2024-01-01&end_date=2024-01-31
Headers: Authorization: Bearer {token}

Query Parameters:
- page: integer (default: 1)
- type: string (deposit, withdrawal, transfer, payment)
- start_date: YYYY-MM-DD
- end_date: YYYY-MM-DD
- limit: integer (default: 20)

Response:
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_1",
        "type": "deposit",
        "description": "Salary",
        "amount": 5000.00,
        "status": "completed",
        "created_at": "2024-01-15T09:00:00Z"
      }
    ],
    "total": 15,
    "current_page": 1,
    "total_pages": 1
  }
}
```

## 📋 Statements Endpoints

### List Account Statements
```
GET /account/statements
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": "stmt_202401",
      "period_start": "2024-01-01",
      "period_end": "2024-01-31",
      "opening_balance": 10000.00,
      "closing_balance": 10500.50,
      "transaction_count": 5,
      "created_at": "2024-01-31T23:59:59Z"
    },
    {
      "id": "stmt_202312",
      "period_start": "2023-12-01",
      "period_end": "2023-12-31",
      "opening_balance": 9500.00,
      "closing_balance": 10000.00,
      "transaction_count": 8,
      "created_at": "2023-12-31T23:59:59Z"
    }
  ]
}
```

### Download Statement PDF
```
GET /account/statements/:statement_id/download
Headers: Authorization: Bearer {token}

Response: PDF file (binary)
```

## 👥 Admin Endpoints

### Get All Users
```
GET /admin/users?page=1&limit=20
Headers: Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com",
        "balance": 10500.50,
        "is_frozen": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "current_page": 1,
    "total_pages": 5
  }
}
```

### Get All Transactions (Admin)
```
GET /admin/transactions?page=1&limit=50
Headers: Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_1",
        "user_id": 1,
        "type": "deposit",
        "amount": 5000.00,
        "status": "completed",
        "created_at": "2024-01-15T09:00:00Z"
      }
    ],
    "total": 1500,
    "current_page": 1,
    "total_pages": 30
  }
}
```

### Get Admin Statistics
```
GET /admin/statistics
Headers: Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "data": {
    "total_users": 500,
    "total_transactions": 10500,
    "total_volume": 2500000.00,
    "active_users": 450,
    "frozen_accounts": 5
  }
}
```

### Freeze/Unfreeze Account
```
PATCH /admin/freeze/:user_id
Headers: Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "is_frozen": true
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "is_frozen": true,
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

## ⚠️ Error Responses

### Standard Error Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": "Validation error message"
  }
}
```

### Common Error Codes

**400 Bad Request**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "message": "Access denied. Admin role required"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Server Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🔄 Request/Response Flow

### Successful Request
```
1. Component calls axiosInstance.post('/endpoint', data)
2. Request Interceptor adds Authorization header
3. Request sent to backend
4. Backend processes request
5. Response returns JSON with { data, message }
6. Response Interceptor checks status
7. Component receives response.data.data
8. State updated, component re-renders
```

### Failed Request (Non-401)
```
1. Component catches error
2. Extracts error.response?.data?.message
3. Sets error state with message
4. User sees error alert
```

### Unauthorized Request (401)
```
1. Response Interceptor detects 401
2. localStorage cleared (token, user)
3. User redirected to /login
4. Session effectively ended
```

## 📦 Pagination

Endpoints that support pagination:
- `/transactions`
- `/account/statements`
- `/admin/users`
- `/admin/transactions`

### Pagination Parameters
```
page: integer (1-indexed)
limit: integer (default: 20)
```

### Pagination Response
```json
{
  "data": [ /* items */ ],
  "total": 100,
  "current_page": 1,
  "total_pages": 5,
  "per_page": 20
}
```

## 🔗 Frontend Usage Examples

### Login
```javascript
const response = await axiosInstance.post('/auth/login', {
  email: 'user@example.com',
  password: 'password'
})
const { user, token } = response.data.data
login(user, token)
```

### Fetch Account
```javascript
const response = await axiosInstance.get('/account')
const accountData = response.data.data
setAccountData(accountData)
```

### Create Wire Transfer
```javascript
const response = await axiosInstance.post('/transfer/wire', {
  recipient_name: 'Jane Smith',
  bank: 'Chase Bank',
  account_number: '987654321',
  amount: 500.00
})
const transferId = response.data.data.id
```

### Get Filtered Transactions
```javascript
const params = new URLSearchParams({
  page: 1,
  type: 'deposit',
  start_date: '2024-01-01',
  end_date: '2024-01-31'
})
const response = await axiosInstance.get(`/transactions?${params}`)
const transactions = response.data.data.transactions
```

---

**API Version**: 1.0.0
**Last Updated**: March 2026
