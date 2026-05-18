import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 60) }, [])

  const validate = () => {
    if (!email.trim()) return 'Email address is required'
    if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email address'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    try {
      await authApi.forgotPw(email.toLowerCase().trim())
      setSent(true)
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Success state ── */
  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111117] p-6">
        <div
          className="w-full max-w-md text-center"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s ease' }}
        >
          <div
            className="rounded-2xl p-8 border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              📬
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Check your inbox</h2>
            <p className="text-white/40 text-sm mb-2 leading-relaxed">
              We sent a password reset link to
            </p>
            <p className="text-white/70 font-semibold mb-6 text-sm">{email}</p>
            <p className="text-white/25 text-xs mb-8 leading-relaxed">
              The link expires in <strong className="text-white/40">15 minutes</strong>.
              Check your spam folder if you don't see it.
            </p>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-white transition-colors mb-3"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Resend email
            </button>
            <Link
              to="/login"
              className="block text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Form state ── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111117] p-6">
      <div
        className="w-full max-w-md"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s ease' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
            <span className="text-white text-sm font-bold">TF</span>
          </div>
          <span className="font-bold text-white text-xl tracking-tight">TaskFlow</span>
        </div>

        <div
          className="rounded-2xl p-8 border"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-6"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Back to sign in
          </Link>

          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            🔐
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-white/35 text-sm mb-7 leading-relaxed">
            No worries. Enter your email and we'll send you a secure reset link that expires in 15 minutes.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-white/40 mb-2 tracking-wide uppercase">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="you@company.com"
                autoFocus
                autoComplete="email"
                style={{
                  width: '100%', padding: '13px 16px',
                  background: error ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.09)'}`,
                  borderRadius: '12px', color: '#fff', fontSize: '14px',
                  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                onBlur={e => { e.target.style.borderColor = error ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }}
              />
              {error && (
                <p className="text-xs text-red-400 mt-1.5 font-medium">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}
              onMouseOver={e => !loading && (e.target.style.opacity = '0.9')}
              onMouseOut={e => (e.target.style.opacity = '1')}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending reset link…
                </>
              ) : 'Send reset link →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/15 mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  )
}