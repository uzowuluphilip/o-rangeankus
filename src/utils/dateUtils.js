/**
 * Date Formatting Utilities
 * 
 * Automatically converts UTC dates from backend to viewer's local timezone
 * Uses browser's locale and timezone settings for display
 * 
 * CRITICAL: Backend dates must be UTC (stored with gmdate() in PHP)
 * This adds 'Z' suffix to tell JavaScript the date is UTC, ensuring correct conversion
 */

/**
 * Full date and time — e.g. "April 10, 2026 at 08:30:37 PM"
 * @param {string|Date} dateStr - ISO string or Date object from backend (UTC)
 * @returns {string} Formatted date and time in viewer's local timezone
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A'
  // Add 'Z' suffix if missing—this tells JavaScript the time is UTC
  // JavaScript will automatically convert to viewer's local timezone
  const utcStr = dateStr.endsWith('Z') ? dateStr : dateStr.replace(' ', 'T') + 'Z'
  const date = new Date(utcStr)
  if (isNaN(date)) return 'N/A'
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

/**
 * Date only — e.g. "April 10, 2026"
 * @param {string|Date} dateStr - ISO string or Date object from backend (UTC)
 * @returns {string} Formatted date in viewer's local timezone
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  // Add 'Z' suffix if missing—critical for proper UTC interpretation
  const utcStr = dateStr.endsWith('Z') ? dateStr : dateStr.replace(' ', 'T') + 'Z'
  const date = new Date(utcStr)
  if (isNaN(date)) return 'N/A'
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Short date — e.g. "4/10/2026"
 * @param {string|Date} dateStr - ISO string or Date object from backend (UTC)
 * @returns {string} Formatted short date in viewer's local timezone
 */
export const formatShortDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  // Add 'Z' suffix if missing—tells JavaScript date is UTC
  const utcStr = dateStr.endsWith('Z') ? dateStr : dateStr.replace(' ', 'T') + 'Z'
  const date = new Date(utcStr)
  if (isNaN(date)) return 'N/A'
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
}

/**
 * Time only — e.g. "08:30 PM"
 * @param {string|Date} dateStr - ISO string or Date object from backend (UTC)
 * @returns {string} Formatted time in viewer's local timezone
 */
export const formatTime = (dateStr) => {
  if (!dateStr) return 'N/A'
  // Add 'Z' suffix if missing—marks date as UTC for proper conversion
  const utcStr = dateStr.endsWith('Z') ? dateStr : dateStr.replace(' ', 'T') + 'Z'
  const date = new Date(utcStr)
  if (isNaN(date)) return 'N/A'
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Relative time — e.g. "2 hours ago"
 * @param {string|Date} dateStr - ISO string or Date object from backend (UTC)
 * @returns {string} Relative time display
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'N/A'
  // Add 'Z' suffix if missing—UTC indicator for JavaScript
  const utcStr = dateStr.endsWith('Z') ? dateStr : dateStr.replace(' ', 'T') + 'Z'
  const date = new Date(utcStr)
  if (isNaN(date)) return 'N/A'
  
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return formatDate(dateStr)
}

/**
 * Date and time for input fields — e.g. "2026-04-10T20:30:37"
 * Used in datetime-local inputs
 * @param {string|Date} dateStr - ISO string or Date object from backend (UTC)
 * @returns {string} Formatted for input[type="datetime-local"]
 */
export const formatForDatetimeInput = (dateStr) => {
  if (!dateStr) return ''
  // Add 'Z' suffix if missing—marks as UTC
  const utcStr = dateStr.endsWith('Z') ? dateStr : dateStr.replace(' ', 'T') + 'Z'
  const date = new Date(utcStr)
  if (isNaN(date)) return ''
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}
