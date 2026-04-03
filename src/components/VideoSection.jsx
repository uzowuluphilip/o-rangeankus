import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

const VideoSection = () => {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef(null)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Button is visible when: 1. Video is paused (always show) OR 2. Video is playing AND user is hovering
  const showPlayButton = !isPlaying || isHovered

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .video-section-responsive {
            padding: 2rem 0 !important;
          }
          .video-wrapper {
            aspect-ratio: 16/9 !important;
            width: 100% !important;
            max-width: none !important;
          }
          .center-play-button {
            width: 52px !important;
            height: 52px !important;
          }
        }
        @media (min-width: 769px) {
          .video-section-responsive {
            padding: 4rem 0 !important;
          }
          .video-wrapper {
            aspect-ratio: 21/9 !important;
            max-width: 90% !important;
            margin: 0 auto !important;
          }
          .center-play-button {
            width: 64px !important;
            height: 64px !important;
          }
        }
      `}</style>
      <section className="video-section-responsive" style={{
        width: '100%',
        background: '#0D0D0D',
        paddingLeft: 0,
        paddingRight: 0,
        margin: 0
      }}>
        {/* Section Label */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '0 1rem' }}>
          <h2 style={{
            color: '#fff',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            marginTop: '0.5rem'
          }}>
            {t('video.title')}{' '}
            <span style={{ color: '#FF6B00' }}>{t('video.highlight')}</span>{' '}
            {t('video.subtitle')}
          </h2>
        </div>

        {/* Video Wrapper */}
        <div
          className="video-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          }}
        >
          {/* Local Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              border: 'none'
            }}
          >
            <source src="/videos/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Dark overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.2)',
            pointerEvents: 'none'
          }} />

          {/* Center Play/Pause Button */}
          <button
            className="center-play-button"
            onClick={togglePlay}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${showPlayButton ? 1 : 0.8})`,
              background: 'rgba(255, 107, 0, 0.85)',
              border: 'none',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              opacity: showPlayButton ? 1 : 0,
              transition: 'opacity 0.3s ease, transform 0.2s ease',
              pointerEvents: showPlayButton ? 'auto' : 'none',
              boxShadow: '0 8px 32px rgba(255,107,0,0.5)',
              backdropFilter: 'blur(4px)',
              minWidth: '52px',
              minHeight: '52px'
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying
              ? <Pause size={24} color="#fff" />
              : <Play size={24} color="#fff" />
            }
          </button>

          {/* Mute Button - Bottom Right, Small and Subtle */}
          <button
            onClick={toggleMute}
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              minWidth: '36px',
              minHeight: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: isHovered ? 'auto' : 'none'
            }}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} color="#fff" /> : <Volume2 size={16} color="#fff" />}
          </button>
        </div>
      </section>
    </>
  )
}

export default VideoSection
