import React, { useState, useRef } from 'react'
import axiosInstance from '../../api/axios'

export default function ProfileModal({ isOpen, onClose, user, onUpdated }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageError, setImageError] = useState(false)
  const inputRef = useRef()

  // Build profile picture URL from filename
  const buildProfileUrl = (filename) => {
    if (!filename) return null
    
    let value = String(filename).trim()
    console.log('[ProfileModal] Raw pic value:', value)
    
    // Remove protocol (http://, https://)
    let extracted = value.replace(/^https?:\/\//, '')
    console.log('[ProfileModal] After removing protocol:', extracted)
    
    // Remove known domains that might be stuck to filename
    // Handles: api.orangeankus.comuser_22_123.jpg → user_22_123.jpg
    extracted = extracted.replace(/^(api\.)?orangeankus\.com/i, '')
    extracted = extracted.replace(/^localhost(:\d+)?/i, '')
    console.log('[ProfileModal] After removing domains:', extracted)
    
    // If still has /profiles/ path, extract after it
    if (extracted.includes('profiles/')) {
      extracted = extracted.split('profiles/')[1] || extracted
      console.log('[ProfileModal] After extracting from profiles/:', extracted)
    }
    
    // Remove any remaining slashes and query strings
    extracted = extracted.split('/').pop().split('?')[0]
    console.log('[ProfileModal] Final extracted filename:', extracted)
    
    // Validate
    if (!extracted || extracted === 'null' || extracted === 'undefined' || !extracted.includes('user_')) {
      console.warn('[ProfileModal] Invalid filename:', extracted)
      return null
    }
    
    const url = `https://api.orangeankus.com/uploads/profiles/${extracted}`
    console.log('[ProfileModal] Built URL:', url)
    return url
  }
  
  const existingProfileUrl = buildProfileUrl(user?.profile_picture)

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    
    if (selected.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB')
      return
    }
    
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setImageError(false)
    setError('')
  }

  const handleUpload = async () => {
    if (!file) return
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const formData = new FormData()
      formData.append('profile_picture', file)
      
      console.log('[ProfileModal] Uploading file:', file.name)
      
      const res = await axiosInstance.post('/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: false
      })
      
      console.log('[ProfileModal] FULL API response:', JSON.stringify(res.data, null, 2))
      console.log('[ProfileModal] profile_picture field:', res.data.profile_picture)
      console.log('[ProfileModal] profile_picture type:', typeof res.data.profile_picture)
      
      if (res.data.success) {
        // ✅ Get ONLY the filename from response
        const filename = res.data.profile_picture
        console.log('[ProfileModal] Received filename from backend:', filename)
        
        // ✅ Update localStorage with ONLY filename
        const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}')
        currentUser.profile_picture = filename
        localStorage.setItem('authUser', JSON.stringify(currentUser))
        console.log('[ProfileModal] Saved to localStorage:', filename)
        console.log('[ProfileModal] Verified from localStorage:', JSON.parse(localStorage.getItem('authUser')).profile_picture)
        
        // ✅ Notify parent and force reload
        onUpdated?.(filename)
        setSuccess('Profile picture updated!')
        
        // Reload page to show new picture
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } catch (err) {
      console.error('[ProfileModal] Upload error:', err)
      setError(err.response?.data?.message || 'Upload failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      console.log('[ProfileModal] Removing profile picture...')
      
      const res = await axiosInstance.delete('/profile/picture')
      
      console.log('[ProfileModal] Remove response:', res.data)
      
      if (res.data.success) {
        // ✅ Update localStorage to remove profile picture
        const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}')
        currentUser.profile_picture = null
        localStorage.setItem('authUser', JSON.stringify(currentUser))
        console.log('[ProfileModal] Removed from localStorage')
        
        // ✅ Notify parent - pass null to clear the picture
        onUpdated?.(null)
        setSuccess('Profile picture removed!')
        
        // Close modal after short delay to show success message
        setTimeout(() => {
          onClose()
        }, 1000)
      }
    } catch (err) {
      console.error('[ProfileModal] Remove error:', err)
      setError(err.response?.data?.message || 'Failed to remove picture. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', 
      inset: 0, 
      zIndex: 1000,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#1a1a1a', 
        borderRadius: 16,
        padding: '2rem', 
        width: '100%', 
        maxWidth: 380,
        textAlign: 'center', 
        border: '0.5px solid #333'
      }}>
        <h2 style={{ 
          fontSize: 18, 
          fontWeight: 500, 
          marginBottom: '1.5rem', 
          color: '#fff' 
        }}>
          Update Profile Picture
        </h2>

        {/* Avatar preview - LARGER */}
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            width: 140, 
            height: 140, 
            borderRadius: '50%',
            overflow: 'hidden', 
            margin: '0 auto 1rem',
            border: '4px solid #E07B00', 
            cursor: 'pointer',
            background: '#2a2a2a', 
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(224, 123, 0, 0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {preview && !imageError ? (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              onError={() => {
                console.warn('Preview image failed to load:', preview)
                setImageError(true)
              }}
            />
          ) : existingProfileUrl && !imageError ? (
            <img
              src={existingProfileUrl}
              alt="Current Profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              onError={() => {
                console.warn('Profile image failed to load:', existingProfileUrl)
                setImageError(true)
              }}
            />
          ) : (
            <span style={{ 
              color: '#E07B00', 
              fontSize: 48, 
              fontWeight: 700,
              userSelect: 'none'
            }}>
              {user?.first_name?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>

        <p style={{ fontSize: 12, color: '#888', marginBottom: '1.5rem' }}>
          Click the circle to choose a photo
        </p>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <button
          onClick={() => inputRef.current?.click()}
          style={{
            width: '100%', 
            padding: '11px', 
            borderRadius: 8,
            border: '0.5px solid #444', 
            background: 'transparent',
            color: '#fff', 
            fontSize: 14, 
            cursor: 'pointer',
            marginBottom: '0.75rem'
          }}
        >
          Choose photo
        </button>

        {file && (
          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              width: '100%', 
              padding: '12px', 
              borderRadius: 8,
              background: '#E07B00', 
              color: '#fff', 
              border: 'none',
              fontSize: 14, 
              fontWeight: 500, 
              cursor: 'pointer',
              marginBottom: '0.75rem', 
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Uploading...' : 'Save picture'}
          </button>
        )}

        {existingProfileUrl && (
          <button
            onClick={handleRemove}
            disabled={loading}
            style={{
              width: '100%', 
              padding: '12px', 
              borderRadius: 8,
              background: 'transparent', 
              color: '#FF4444', 
              border: '1px solid #FF4444',
              fontSize: 14, 
              fontWeight: 500, 
              cursor: 'pointer',
              marginBottom: '0.75rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Removing...' : 'Remove picture'}
          </button>
        )}

        {error && (
          <p style={{
            fontSize: 13, 
            color: '#A32D2D', 
            background: '#FCEBEB',
            padding: '10px', 
            borderRadius: 8, 
            marginBottom: '0.75rem'
          }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{
            fontSize: 13, 
            color: '#3B6D11', 
            background: '#EAF3DE',
            padding: '10px', 
            borderRadius: 8, 
            marginBottom: '0.75rem'
          }}>
            {success}
          </p>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%', 
            padding: '11px', 
            borderRadius: 8,
            border: '0.5px solid #444', 
            background: 'transparent',
            color: '#888', 
            fontSize: 14, 
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
