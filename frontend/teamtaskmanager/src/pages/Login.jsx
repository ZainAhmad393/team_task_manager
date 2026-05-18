import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../context/Authstore'
import logo from '../assets/logo.png'
/* ─── tiny hook: animated counter ─── */
function useCount(target, duration = 1400) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const t = setInterval(() => {
      start = Math.min(start + step, target)
      setVal(start)
      if (start >= target) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [target, duration])
  return val
}

const FEATURES = [
  { icon: '⚡', text: 'Real-time task updates' },
  { icon: '🔐', text: 'Enterprise-grade security' },
  { icon: '👥', text: 'Unlimited team members' },
  { icon: '📊', text: 'Progress analytics' },
]

export default function Login() {
  const [view, setView] = useState('login') // 'login' | 'forgot' | 'sent'
  const [form, setForm] = useState({ email: '', password: '' })
  const [forgotEmail, setForgotEmail] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [mounted, setMounted] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const emailRef = useRef(null)

  const tasks  = useCount(12847)
  const teams  = useCount(2419)
  const uptime = useCount(99)

  useEffect(() => {
    setTimeout(() => setMounted(true), 60)
    emailRef.current?.focus()
  }, [])

  // Show success toast if redirected from register
  useEffect(() => {
    if (location.state?.registered) {
      toast.success('Account created! Sign in to continue.')
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back! 👋')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid email or password'
      toast.error(msg)
      setErrors({ password: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      toast.error('Enter a valid email address')
      return
    }
    setLoading(true)
    // Stubbed – swap for real API call
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setView('sent')
  }

  const S = {
    root: {
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      background: '#0f0f13',
    },
    // ── LEFT ──
    left: {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: '52px 56px',
      background: 'linear-gradient(145deg, #0d0d11 0%, #13111e 50%, #0d0d11 100%)',
      borderRight: '1px solid rgba(255,255,255,0.04)',
    },
    blob1: {
      position: 'absolute', top: -160, left: -100,
      width: 560, height: 560,
      background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 65%)',
      pointerEvents: 'none',
    },
    blob2: {
      position: 'absolute', bottom: -120, right: -80,
      width: 440, height: 440,
      background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 65%)',
      pointerEvents: 'none',
    },
    grid: {
      position: 'absolute', inset: 0,
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
      `,
      backgroundSize: '48px 48px',
      pointerEvents: 'none',
    },
    logo: {
      display: 'flex', alignItems: 'center', gap: 10,
      fontWeight: 700, fontSize: 20, color: '#fff',
      letterSpacing: '-0.5px', zIndex: 1,
    },
    logoMark: {
      width: 38, height: 38,
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      borderRadius: 11,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 800, color: '#fff',
      boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
    },
    hero: {
      flex: 1, display: 'flex', flexDirection: 'column',
      justifyContent: 'center', zIndex: 1,
    },
    badge: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(99,102,241,0.12)',
      border: '1px solid rgba(99,102,241,0.25)',
      borderRadius: 99, padding: '4px 12px',
      fontSize: 11, fontWeight: 600,
      color: '#818cf8', letterSpacing: '1.5px',
      textTransform: 'uppercase', marginBottom: 24, width: 'fit-content',
    },
    dot: {
      width: 6, height: 6, borderRadius: '50%',
      background: '#818cf8',
      animation: 'pulse 2s ease-in-out infinite',
    },
    headline: {
      fontSize: 'clamp(36px, 3.5vw, 54px)',
      fontWeight: 800, lineHeight: 1.08,
      letterSpacing: '-2px', color: '#fff',
      margin: '0 0 20px',
    },
    gradText: {
      background: 'linear-gradient(135deg, #818cf8, #c084fc)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    sub: {
      fontSize: 15, color: 'rgba(255,255,255,0.38)',
      lineHeight: 1.75, fontWeight: 300,
      maxWidth: 360, marginBottom: 40,
    },
    features: {
      display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48,
    },
    feat: {
      display: 'flex', alignItems: 'center', gap: 12,
    },
    featIcon: {
      width: 34, height: 34, borderRadius: 9,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, flexShrink: 0,
    },
    featText: { fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 400 },
    statsRow: {
      display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
      gap: 1, background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16, overflow: 'hidden', zIndex: 1,
    },
    statCell: {
      background: 'rgba(255,255,255,0.02)',
      padding: '18px 12px', textAlign: 'center',
    },
    statNum: {
      fontWeight: 800, fontSize: 24, color: '#fff',
      letterSpacing: '-1px', lineHeight: 1,
    },
    statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 3 },

    // ── RIGHT ──
    right: {
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '48px 32px',
      background: '#111117',
    },
    formWrap: {
      width: '100%', maxWidth: 420,
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    },
    // form card
    card: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 24, padding: '36px 32px',
      backdropFilter: 'blur(12px)',
    },
    eyebrow: {
      fontSize: 11, fontWeight: 600, letterSpacing: '2.5px',
      textTransform: 'uppercase',
      color: '#818cf8', marginBottom: 10,
    },
    cardTitle: {
      fontSize: 28, fontWeight: 800, color: '#fff',
      letterSpacing: '-0.8px', margin: '0 0 6px',
    },
    cardSub: {
      fontSize: 14, color: 'rgba(255,255,255,0.3)',
      fontWeight: 300, marginBottom: 28,
    },
    // field
    fieldWrap: { marginBottom: 16 },
    fieldLabel: {
      display: 'block', fontSize: 12, fontWeight: 500,
      color: 'rgba(255,255,255,0.5)', letterSpacing: '0.3px', marginBottom: 7,
    },
    inputWrap: { position: 'relative' },
    input: {
      width: '100%', padding: '13px 16px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 12, color: '#fff', fontSize: 14,
      fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
      transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    },
    inputErr: {
      borderColor: 'rgba(239,68,68,0.5)',
    },
    pwToggle: {
      position: 'absolute', right: 14, top: '50%',
      transform: 'translateY(-50%)',
      background: 'none', border: 'none',
      color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
      fontSize: 16, padding: 0, lineHeight: 1,
      transition: 'color 0.15s',
    },
    errText: { fontSize: 12, color: '#f87171', marginTop: 5 },
    forgotLink: {
      textAlign: 'right', marginBottom: 4, marginTop: -8,
    },
    forgotBtn: {
      background: 'none', border: 'none',
      color: '#818cf8', fontSize: 12, cursor: 'pointer',
      padding: 0, fontFamily: 'inherit', fontWeight: 500,
      transition: 'color 0.15s',
    },
    submitBtn: {
      width: '100%', padding: '14px',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      border: 'none', borderRadius: 12, color: '#fff',
      fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
      cursor: 'pointer', marginTop: 4,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'opacity 0.15s, transform 0.1s',
      boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
      letterSpacing: '0.2px',
    },
    divider: {
      display: 'flex', alignItems: 'center', gap: 12,
      margin: '24px 0',
    },
    divLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' },
    divText: { fontSize: 12, color: 'rgba(255,255,255,0.2)' },
    bottomLink: {
      textAlign: 'center', fontSize: 13,
      color: 'rgba(255,255,255,0.3)',
    },
    // spinner
    spinner: {
      width: 16, height: 16,
      border: '2px solid rgba(255,255,255,0.25)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      animation: 'spin 0.65s linear infinite',
    },
  }

  /* ─── FORGOT PASSWORD VIEWS ─── */
  if (view === 'forgot') {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          input { transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
          input:focus { border-color: rgba(99,102,241,0.6) !important; background: rgba(99,102,241,0.05) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
          input::placeholder { color: rgba(255,255,255,0.18); }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
          button:hover { opacity: 0.88; }
          button:active { transform: scale(0.985); }
        `}</style>
        <div style={{ minHeight: '100vh', background: '#111117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif" }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <div style={S.card}>
              <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, padding: 0, transition: 'color 0.15s' }}>
                ← Back to sign in
              </button>
              <div style={{ fontSize: 36, marginBottom: 16 }}>🔐</div>
              <h2 style={{ ...S.cardTitle, marginBottom: 8 }}>Forgot password?</h2>
              <p style={S.cardSub}>No worries. Enter your email and we'll send you reset instructions.</p>
              <form onSubmit={handleForgot}>
                <div style={S.fieldWrap}>
                  <label style={S.fieldLabel}>Email address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="you@company.com"
                    style={S.input}
                    autoFocus
                  />
                </div>
                <button type="submit" disabled={loading} style={S.submitBtn}>
                  {loading ? <><div style={S.spinner} /> Sending…</> : 'Send reset link'}
                </button>
              </form>
              <p style={{ ...S.bottomLink, marginTop: 24 }}>
                Remember your password?{' '}
                <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, padding: 0 }}>
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (view === 'sent') {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>
        <div style={{ minHeight: '100vh', background: '#111117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif" }}>
          <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
            <div style={S.card}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>📬</div>
              <h2 style={{ ...S.cardTitle, marginBottom: 10 }}>Check your inbox</h2>
              <p style={{ ...S.cardSub, marginBottom: 24 }}>
                We sent a password reset link to<br />
                <strong style={{ color: 'rgba(255,255,255,0.65)' }}>{forgotEmail}</strong>
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginBottom: 28 }}>
                Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => { setView('forgot'); setForgotEmail('') }} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, padding: 0, fontWeight: 500 }}>
                  try again
                </button>
              </p>
              <button onClick={() => setView('login')} style={{ ...S.submitBtn, boxShadow: 'none', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
                Back to sign in
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ─── MAIN LOGIN VIEW ─── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: rgba(99,102,241,0.6) !important; background: rgba(99,102,241,0.05) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; }
        input::placeholder { color: rgba(255,255,255,0.18); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media(max-width:860px){ .ll-panel{display:none!important} .login-root{grid-template-columns:1fr!important} }
        .feat-item:hover .feat-icon { background: rgba(99,102,241,0.12) !important; border-color: rgba(99,102,241,0.2) !important; }
        .pw-toggle:hover { color: rgba(255,255,255,0.7) !important; }
        .forgot-btn:hover { color: #a5b4fc !important; }
        .submit-btn:hover:not(:disabled) { opacity: 0.91; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(99,102,241,0.45) !important; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99) translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .stat-cell:hover { background: rgba(255,255,255,0.035) !important; }
      `}</style>

      <div style={S.root} className="login-root">

        {/* ══ LEFT PANEL ══ */}
        <div style={S.left} className="ll-panel">
          <div style={S.blob1} />
          <div style={S.blob2} />
          <div style={S.grid} />

          {/* Logo */}
          <div style={S.logo}>
            <div style={S.logoMark}>
  <img src={logo} alt="TaskFlow" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 11 }} />
</div>
            TaskFlow
          </div>

          {/* Hero */}
          <div style={S.hero}>
            <div style={S.badge}>
              <div style={S.dot} />
              All systems operational
            </div>

            <h1 style={S.headline}>
              Where great<br />
              teams{' '}
              <span style={S.gradText}>get things done</span>
            </h1>

            <p style={S.sub}>
              Manage tasks, coordinate teams, and deliver projects on time — all in one beautifully simple workspace.
            </p>

            <div style={S.features}>
              {FEATURES.map(f => (
                <div style={S.feat} key={f.text} className="feat-item">
                  <div style={S.featIcon} className="feat-icon">{f.icon}</div>
                  <span style={S.featText}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={S.statsRow}>
            {[
              { n: `${tasks.toLocaleString()}+`, l: 'Tasks completed' },
              { n: `${teams.toLocaleString()}+`, l: 'Active teams' },
              { n: `${uptime}%`,                 l: 'Uptime SLA' },
            ].map(s => (
              <div style={S.statCell} className="stat-cell" key={s.l}>
                <div style={S.statNum}>{s.n}</div>
                <div style={S.statLabel}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div style={S.right}>
          <div style={S.formWrap}>

            {/* Mobile logo */}
            <div style={{ display: 'none', alignItems: 'center', gap: 8, marginBottom: 32, justifyContent: 'center' }} className="mobile-logo">
              <div style={S.logoMark}>TF</div>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>TaskFlow</span>
            </div>

            <div style={S.card}>
              <p style={S.eyebrow}>Welcome back</p>
              <h2 style={S.cardTitle}>Sign in to TaskFlow</h2>
              <p style={S.cardSub}>Enter your credentials to access your workspace.</p>

              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div style={S.fieldWrap}>
                  <label style={S.fieldLabel}>Email address</label>
                  <div style={S.inputWrap}>
                    <input
                      ref={emailRef}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      autoComplete="email"
                      style={{ ...S.input, ...(errors.email ? S.inputErr : {}) }}
                    />
                  </div>
                  {errors.email && <p style={S.errText}>{errors.email}</p>}
                </div>

                {/* Password */}
                <div style={S.fieldWrap}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <label style={{ ...S.fieldLabel, marginBottom: 0 }}>Password</label>
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      style={S.forgotBtn}
                      className="forgot-btn"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={S.inputWrap}>
                    <input
                      type={showPw ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      style={{ ...S.input, paddingRight: 44, ...(errors.password ? S.inputErr : {}) }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      style={S.pwToggle}
                      className="pw-toggle"
                    >
                      {showPw ? '🙈' : '👁'}
                    </button>
                  </div>
                  {errors.password && <p style={S.errText}>{errors.password}</p>}
                </div>

                <button type="submit" disabled={loading} style={S.submitBtn} className="submit-btn">
                  {loading
                    ? <><div style={S.spinner} />Signing in…</>
                    : 'Sign in →'
                  }
                </button>
              </form>

              {/* Divider */}
              <div style={S.divider}>
                <div style={S.divLine} />
                <span style={S.divText}>or</span>
                <div style={S.divLine} />
              </div>

              <p style={S.bottomLink}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
                  Create one free
                </Link>
              </p>
            </div>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.14)', marginTop: 20 }}>
              By signing in you agree to our{' '}
              <span style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>Terms</span>
              {' & '}
              <span style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>Privacy Policy</span>
            </p>
          </div>
        </div>

      </div>
    </>
  )
}