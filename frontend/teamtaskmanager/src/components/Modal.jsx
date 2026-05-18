import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const SIZES = {
  sm:   'max-w-sm',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-3xl',
  full: 'max-w-full mx-4',
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

  /* Lock body scroll */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Escape key */
  useEffect(() => {
    if (!isOpen) return
    const handle = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [isOpen, onClose])

  // ✅ REMOVED: the auto-focus useEffect that was stealing focus on every render

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: 'rgba(20,20,42,0.35)', backdropFilter: 'blur(3px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`relative w-full ${SIZES[size]} animate-scale-in flex flex-col`}
        style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-modal)',
          border: '1px solid var(--surface-150)',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        {!hideHeader && (
          <div
            className="flex items-start justify-between px-6 py-5 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--surface-100)' }}
          >
            <div>
              <h2
                id="modal-title"
                className="text-[15px] font-semibold tracking-tight"
                style={{ color: 'var(--surface-900)' }}
              >
                {title}
              </h2>
              {description && (
                <p
                  className="text-sm mt-0.5"
                  style={{ color: 'var(--surface-500)' }}
                >
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              data-skip-focus
              className="flex-shrink-0 ml-4 w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--surface-400)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--surface-100)'
                e.currentTarget.style.color = 'var(--surface-700)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--surface-400)'
              }}
              aria-label="Close modal"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="px-6 py-4 flex-shrink-0 rounded-b-[20px]"
            style={{
              borderTop: '1px solid var(--surface-100)',
              background: 'var(--surface-50)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}