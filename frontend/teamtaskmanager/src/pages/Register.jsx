import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../context/authStore'

/* ─── Password strength ─── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'transparent' }
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'Weak',   color: '#ef4444', pct: 20 }
  if (score <= 2) return { score, label: 'Fair',   color: '#f59e0b', pct: 44 }
  if (score <= 3) return { score, label: 'Good',   color: '#3b82f6', pct: 66 }
  if (score <= 4) return { score, label: 'Strong', color: '#10b981', pct: 88 }
  return { score, label: 'Excellent', color: '#6366f1', pct: 100 }
}

const BENEFITS = [
  { icon: '🚀', title: 'Get started instantly', desc: 'No setup needed. Create your first team in seconds.' },
  { icon: '🔒', title: 'Bank-grade security',   desc: 'AES-256 encryption, bcrypt passwords, HTTP-only sessions.' },
  { icon: '📱', title: 'Works everywhere',       desc: 'Desktop, tablet, mobile — one seamless experience.' },
]

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw]     = useState(false)
  const [showCf, setShowCf]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})
  const [agreed, setAgreed]     = useState(false)
  const [mounted, setMounted]   = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const strength = getStrength(form.password)

  useEffect(() => { setTimeout(() => setMounted(true), 60) }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim())         errs.name    = 'Full name is required'
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'

    if (!form.email.trim())        errs.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address'

    if (!form.password)            errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'At least 8 characters required'
    else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(form.password)) errs.password = 'Must contain letters and numbers'

    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    if (!agreed) errs.agreed = 'You must agree to the terms'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    setLoading(true)
    try {
      await register({ name: form.name.trim(), email: form.email.toLowerCase(), password: form.password })
      toast.success('Welcome to TaskFlow! 🎉')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.'
      toast.error(msg)
      if (msg.toLowerCase().includes('email')) setErrors({ email: msg })
    } finally {
      setLoading(false)
    }
  }

  const progress = [
    form.name.trim().length > 0,
    /\S+@\S+\.\S+/.test(form.email),
    form.password.length >= 8 && /(?=.*[A-Za-z])(?=.*\d)/.test(form.password),
    form.confirm === form.password && form.confirm.length > 0,
  ]
  const progressPct = (progress.filter(Boolean).length / 4) * 100

  const S = {
    root: {
      minHeight: '100vh', display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      background: '#0f0f13',
    },
    left: {
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      padding: '52px 56px',
      background: 'linear-gradient(145deg, #0d0d11, #150f1e 60%, #0d0d11)',
      borderRight: '1px solid rgba(255,255,255,0.04)',
    },
    blob1: { position:'absolute', top:-140, right:-100, width:500, height:500, background:'radial-gradient(circle,rgba(168,85,247,0.2) 0%,transparent 65%)', pointerEvents:'none' },
    blob2: { position:'absolute', bottom:-80, left:-60, width:380, height:380, background:'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 65%)', pointerEvents:'none' },
    grid: { position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`, backgroundSize:'48px 48px', pointerEvents:'none' },
    logo: { display:'flex', alignItems:'center', gap:10, fontWeight:700, fontSize:20, color:'#fff', letterSpacing:'-0.5px', zIndex:1 },
    logoMark: { width:38, height:38, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#fff', boxShadow:'0 4px 16px rgba(124,58,237,0.4)' },
    hero: { flex:1, display:'flex', flexDirection:'column', justifyContent:'center', zIndex:1 },
    badge: { display:'inline-flex', alignItems:'center', gap:6, background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.22)', borderRadius:99, padding:'4px 12px', fontSize:11, fontWeight:600, color:'#c084fc', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:24, width:'fit-content' },
    headline: { fontSize:'clamp(34px,3.2vw,52px)', fontWeight:800, lineHeight:1.1, letterSpacing:'-2px', color:'#fff', margin:'0 0 18px' },
    gradText: { background:'linear-gradient(135deg,#a78bfa,#e879f9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
    sub: { fontSize:15, color:'rgba(255,255,255,0.35)', lineHeight:1.75, fontWeight:300, maxWidth:360, marginBottom:40 },
    benefits: { display:'flex', flexDirection:'column', gap:20, marginBottom:48 },
    benefit: { display:'flex', alignItems:'flex-start', gap:14 },
    bIcon: { width:40, height:40, borderRadius:11, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 },
    bTitle: { fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.75)', marginBottom:2 },
    bDesc:  { fontSize:12, color:'rgba(255,255,255,0.3)', lineHeight:1.5 },
    progWrap: { zIndex:1 },
    progLabel: { fontSize:11, fontWeight:500, color:'rgba(255,255,255,0.25)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:10 },
    progTrack: { height:3, background:'rgba(255,255,255,0.07)', borderRadius:99, overflow:'hidden', marginBottom:8 },
    progFill:  { height:'100%', background:'linear-gradient(90deg,#7c3aed,#c084fc)', borderRadius:99, transition:'width 0.4s cubic-bezier(0.16,1,0.3,1)' },
    progSteps: { display:'flex', gap:0 },
    progStep:  { flex:1, fontSize:10, color:'rgba(255,255,255,0.2)', transition:'color 0.3s' },
    progStepDone: { color:'rgba(192,132,252,0.7)' },
    // right
    right: { display:'flex', alignItems:'center', justifyContent:'center', padding:'36px 32px', background:'#111117', overflowY:'auto' },
    formWrap: { width:'100%', maxWidth:440, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)', transition:'opacity 0.5s ease, transform 0.5s ease' },
    card: { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:24, padding:'36px 32px', backdropFilter:'blur(12px)' },
    eyebrow: { fontSize:11, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color:'#a78bfa', marginBottom:10 },
    cardTitle: { fontSize:26, fontWeight:800, color:'#fff', letterSpacing:'-0.7px', margin:'0 0 6px' },
    cardSub: { fontSize:14, color:'rgba(255,255,255,0.3)', fontWeight:300, marginBottom:28 },
    fieldWrap: { marginBottom:15 },
    fieldLabel: { display:'block', fontSize:12, fontWeight:500, color:'rgba(255,255,255,0.5)', letterSpacing:'0.3px', marginBottom:7 },
    inputWrap: { position:'relative' },
    input: { width:'100%', padding:'13px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:12, color:'#fff', fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s,background 0.2s,box-shadow 0.2s' },
    inputErr: { borderColor:'rgba(239,68,68,0.5)' },
    errText: { fontSize:12, color:'#f87171', marginTop:5 },
    pwToggle: { position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', fontSize:15, padding:0, lineHeight:1 },
    submitBtn: { width:'100%', padding:'14px', background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', border:'none', borderRadius:12, color:'#fff', fontSize:15, fontWeight:600, fontFamily:'inherit', cursor:'pointer', marginTop:4, display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 24px rgba(124,58,237,0.35)', letterSpacing:'0.2px', transition:'opacity 0.15s,transform 0.1s,box-shadow 0.2s' },
    divider: { display:'flex', alignItems:'center', gap:12, margin:'22px 0' },
    divLine: { flex:1, height:1, background:'rgba(255,255,255,0.06)' },
    divText: { fontSize:12, color:'rgba(255,255,255,0.2)' },
    bottomLink: { textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.3)' },
    spinner: { width:16, height:16, border:'2px solid rgba(255,255,255,0.25)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.65s linear infinite' },
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: rgba(124,58,237,0.6) !important; background: rgba(124,58,237,0.05) !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.12) !important; }
        input::placeholder { color: rgba(255,255,255,0.18); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width:860px){ .reg-left{display:none!important} .reg-root{grid-template-columns:1fr!important} }
        .submit-btn2:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(124,58,237,0.45) !important; }
        .submit-btn2:active:not(:disabled) { transform: scale(0.99) translateY(0); }
        .submit-btn2:disabled { opacity: 0.5; cursor: not-allowed; }
        .pw-toggle2:hover { color: rgba(255,255,255,0.65) !important; }
        .check-box { appearance: none; width: 17px; height: 17px; border: 1.5px solid rgba(255,255,255,0.15); border-radius: 5px; background: rgba(255,255,255,0.04); cursor: pointer; position: relative; flex-shrink: 0; transition: all 0.15s; margin-top: 2px; }
        .check-box:checked { background: #7c3aed; border-color: #7c3aed; }
        .check-box:checked::after { content:'✓'; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:10px; color:#fff; font-weight:700; }
      `}</style>

      <div style={S.root} className="reg-root">

        {/* ══ LEFT ══ */}
        <div style={S.left} className="reg-left">
          <div style={S.blob1} /><div style={S.blob2} /><div style={S.grid} />

          <div style={S.logo}>
            <div style={S.logoMark}>TF</div>
            TaskFlow
          </div>

          <div style={S.hero}>
            <div style={S.badge}>✦ Free to start</div>
            <h1 style={S.headline}>
              Build something<br />
              <span style={S.gradText}>remarkable</span>
            </h1>
            <p style={S.sub}>
              Join thousands of teams already using TaskFlow to ship faster, stay organised, and hit every deadline.
            </p>

            <div style={S.benefits}>
              {BENEFITS.map(b => (
                <div style={S.benefit} key={b.title}>
                  <div style={S.bIcon}>{b.icon}</div>
                  <div>
                    <div style={S.bTitle}>{b.title}</div>
                    <div style={S.bDesc}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live progress */}
            <div style={S.progWrap}>
              <div style={S.progLabel}>Profile completion</div>
              <div style={S.progTrack}>
                <div style={{ ...S.progFill, width: `${progressPct}%` }} />
              </div>
              <div style={S.progSteps}>
                {['Name','Email','Password','Confirm'].map((s, i) => (
                  <span key={s} style={{ ...S.progStep, ...(progress[i] ? S.progStepDone : {}) }}>
                    {progress[i] ? '✓ ' : ''}{s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p style={{ fontSize:12, color:'rgba(255,255,255,0.12)', zIndex:1 }}>© 2024 TaskFlow. All rights reserved.</p>
        </div>

        {/* ══ RIGHT ══ */}
        <div style={S.right}>
          <div style={S.formWrap}>
            <div style={S.card}>
              <p style={S.eyebrow}>Get started</p>
              <h2 style={S.cardTitle}>Create your account</h2>
              <p style={S.cardSub}>Free forever. No credit card required.</p>

              <form onSubmit={handleSubmit} noValidate>

                {/* Name */}
                <div style={S.fieldWrap}>
                  <label style={S.fieldLabel}>Full name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Jane Smith" autoComplete="name"
                    style={{ ...S.input, ...(errors.name ? S.inputErr : {}) }} />
                  {errors.name && <p style={S.errText}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div style={S.fieldWrap}>
                  <label style={S.fieldLabel}>Work email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="jane@company.com" autoComplete="email"
                    style={{ ...S.input, ...(errors.email ? S.inputErr : {}) }} />
                  {errors.email && <p style={S.errText}>{errors.email}</p>}
                </div>

                {/* Password */}
                <div style={S.fieldWrap}>
                  <label style={S.fieldLabel}>Password</label>
                  <div style={S.inputWrap}>
                    <input type={showPw ? 'text' : 'password'} name="password" value={form.password}
                      onChange={handleChange} placeholder="Min 8 chars, letters + numbers"
                      autoComplete="new-password"
                      style={{ ...S.input, paddingRight:44, ...(errors.password ? S.inputErr : {}) }} />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      style={S.pwToggle} className="pw-toggle2">
                      {showPw ? '🙈' : '👁'}
                    </button>
                  </div>
                  {/* Strength meter */}
                  {form.password && (
                    <div style={{ marginTop:8 }}>
                      <div style={{ height:3, background:'rgba(255,255,255,0.07)', borderRadius:99, overflow:'hidden', marginBottom:5 }}>
                        <div style={{ height:'100%', width:`${strength.pct}%`, background:strength.color, borderRadius:99, transition:'width 0.3s, background 0.3s' }} />
                      </div>
                      <span style={{ fontSize:11, color:strength.color, fontWeight:600 }}>{strength.label}</span>
                    </div>
                  )}
                  {errors.password && <p style={S.errText}>{errors.password}</p>}
                </div>

                {/* Confirm */}
                <div style={S.fieldWrap}>
                  <label style={S.fieldLabel}>Confirm password</label>
                  <div style={S.inputWrap}>
                    <input type={showCf ? 'text' : 'password'} name="confirm" value={form.confirm}
                      onChange={handleChange} placeholder="••••••••"
                      autoComplete="new-password"
                      style={{ ...S.input, paddingRight:44, ...(errors.confirm ? S.inputErr : {}) }} />
                    <button type="button" onClick={() => setShowCf(v => !v)}
                      style={S.pwToggle} className="pw-toggle2">
                      {showCf ? '🙈' : '👁'}
                    </button>
                  </div>
                  {form.confirm && form.confirm === form.password && (
                    <p style={{ fontSize:11, color:'#10b981', marginTop:5, fontWeight:500 }}>✓ Passwords match</p>
                  )}
                  {errors.confirm && <p style={S.errText}>{errors.confirm}</p>}
                </div>

                {/* Terms */}
                <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:20 }}>
                  <input type="checkbox" id="terms" checked={agreed}
                    onChange={e => { setAgreed(e.target.checked); setErrors(p => ({ ...p, agreed:'' })) }}
                    className="check-box" />
                  <label htmlFor="terms" style={{ fontSize:13, color:'rgba(255,255,255,0.35)', lineHeight:1.5, cursor:'pointer' }}>
                    I agree to the{' '}
                    <span style={{ color:'#a78bfa', fontWeight:500, cursor:'pointer' }}>Terms of Service</span>
                    {' '}and{' '}
                    <span style={{ color:'#a78bfa', fontWeight:500, cursor:'pointer' }}>Privacy Policy</span>
                  </label>
                </div>
                {errors.agreed && <p style={{ ...S.errText, marginTop:-12, marginBottom:12 }}>{errors.agreed}</p>}

                <button type="submit" disabled={loading} style={S.submitBtn} className="submit-btn2">
                  {loading ? <><div style={S.spinner} />Creating account…</> : 'Create account →'}
                </button>
              </form>

              <div style={S.divider}>
                <div style={S.divLine} /><span style={S.divText}>or</span><div style={S.divLine} />
              </div>
              <p style={S.bottomLink}>
                Already have an account?{' '}
                <Link to="/login" style={{ color:'#a78bfa', fontWeight:600, textDecoration:'none' }}>Sign in</Link>
              </p>
            </div>

            <p style={{ textAlign:'center', fontSize:12, color:'rgba(255,255,255,0.14)', marginTop:20 }}>
              🔒 Your data is encrypted and never shared.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}