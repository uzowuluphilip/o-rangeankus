const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.orangeannkus.com').replace(/\/+$/, '')

export const getProfilePictureUrl = (value) => {
  if (!value) return null

  const input = String(value).trim()
  const withoutQuery = input.split(/[?#]/, 1)[0]
  const filename = withoutQuery.split('/').pop()

  if (!filename || filename === 'null' || filename === 'undefined') return null

  return `${API_BASE_URL}/uploads/profiles/${filename}`
}