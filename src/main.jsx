import React from 'react'
import ReactDOM from 'react-dom/client'
import './i18n/i18n' // Initialize i18n BEFORE importing App
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/theme.css'
import './styles/responsive-tables.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
