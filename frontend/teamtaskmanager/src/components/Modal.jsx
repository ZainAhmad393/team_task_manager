import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const SIZES = {
  sm:   480,
  md:   560,
  lg:   672,
  xl:   768,
  full: '100%',
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  footer,
  hideHeader = false,
}) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handle = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(20,20,42,0.35)',
          backdropFilter: 'blur(3px)',
          animation: 'fadeIn 0.2s ease both',
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: SIZES[size] || SIZES.md,
          maxHeight: '90vh',
          background: 'white',
          borderRadius: 20,
          boxShadow: 'var(--shadow-modal)',
          border: '1px solid var(--surface-150)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleIn 0.25s var(--ease-spring) both',
        }}
      >
        {/* Header */}
        {!hideHeader && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            padding: '20px 24px', flexShrink: 0,
            borderBottom: '1px solid var(--surface-100)',
          }}>
            <div>
              <h2
                id="modal-title"
                style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--surface-900)', margin: 0 }}
              >
                {title}
              </h2>
              {description && (
                <p style={{ fontSize: 13, marginTop: 2, color: 'var(--surface-500)', margin: '4px 0 0' }}>
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                flexShrink: 0, marginLeft: 16,
                width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'transparent', color: 'var(--surface-400)',
                transition: 'all 120ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-100)'; e.currentTarget.style.color = 'var(--surface-700)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--surface-400)' }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '16px 24px', flexShrink: 0,
            borderTop: '1px solid var(--surface-100)',
            background: 'var(--surface-50)',
            borderRadius: '0 0 20px 20px',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}