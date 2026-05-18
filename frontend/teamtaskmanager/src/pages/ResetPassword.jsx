import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'

function getStrength(pw) {
  if (!pw) return { pct: 0, label: '', color: 'transparent' }
  let s = 0
  if (pw.length >= 8)            s++
  if (pw.length >= 12)           s++
  if (/[A-Z]/.test(pw))         s++
  if (/[0-9]/.test(pw))         s++
  if (/[^A-Za-z0-9]/.test(pw))  s++
  if (s <= 1) return { pct: 20,  label: 'Weak',      color: '#ef4444' }
  if (s <= 2) return { pct: 44,  label: 'Fair',      color: '#f59e0b' }
  if (s <= 3) return { pct: 66,  label: 'Good',      color: '#3b82f6' }
  if (s <= 4) return { pct: 88,  label: 'Strong',    color: '#10b981' }
  return               { pct: 100, label: 'Excellent', color: '#6366f1' }
}

export default function ResetPassword() {
  const [params]          = useSearchParams()
  const navigate          = useNavigate()
  const token             = params.get('token')

  const [form, setForm]   = useState({ password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})
  const [done, setDone]       = useState(false)
  const [mounted, setMounted] = useState(false)

  const strength = getStrength(form.password)

  useEffect(() => {
    setTimeout(() => setMounted(true), 60)
    if (!token) {
      toast.error('Invalid or missing reset token.')
      navigate('/forgot-password')
    }
  }, [token, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.password)              errs.password = 'Password is required'
    else if (form.password.length < 8)  errs.password = 'At least 8 characters'
    else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(form.password)) errs.password = 'Must contain letters and numbers'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    try {
      await authApi.resetPw({ token, password: form.password })
      setDone(true)
      toast.success('Password reset successfully!')
    } catch (err) {
      toast.error(err.message || 'Reset failed. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (hasErr) => ({
    width: '100%', padding: '13px 44px 13px 16px',
    background: hasErr ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.05)',
    border: `1px solid ${hasErr ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.09)'}`,
    borderRadius: '12px', color: '#fff', fontSize: '14px',
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  })

  /* ── Success ── */
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111117] p-6">
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl p-8 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              ✓
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Password updated!</h2>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Link
              to="/login"
              className="block w-full py-3.5 rounded-xl text-sm font-semibold text-white text-center transition-all"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}
            >
              Sign in →
            </Link>
          </div>
        </div>
      </div>
    )
  }

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

        <div className="rounded-2xl p-8 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            🔑
          </div>
          <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Set new password</h1>
          <p className="text-white/35 text-sm mb-7 leading-relaxed">
            Create a strong password for your account.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-2 tracking-wide uppercase">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 8 chars, letters + numbers"
                  autoComplete="new-password"
                  autoFocus
                  style={inputStyle(!!errors.password)}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = errors.password ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div style={{ height: '100%', width: `${strength.pct}%`, background: strength.color, borderRadius: '99px', transition: 'width 0.3s, background 0.3s' }} />
                  </div>
                  <span className="text-[11px] font-semibold mt-1 block" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-400 mt-1.5 font-medium">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-2 tracking-wide uppercase">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={inputStyle(!!errors.confirm)}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = errors.confirm ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              {form.confirm && form.confirm === form.password && (
                <p className="text-xs text-emerald-400 mt-1.5 font-semibold">✓ Passwords match</p>
              )}
              {errors.confirm && <p className="text-xs text-red-400 mt-1.5 font-medium">{errors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resetting password…</>
              ) : 'Reset password →'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-white/15 mt-6">
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            ← Back to sign in
          </Link>
        </p>
      </div>
      <style>{`input::placeholder { color: rgba(255,255,255,0.2); }`}</style>
    </div>
  )
}