import { useState } from 'react'
import { login, isLocked, lockMinsLeft } from './adminAuth'
import './admin.css'

export default function AdminLogin({ onSuccess }) {
  const [email, setEmail]     = useState('')
  const [pass, setPass]       = useState('')
  const [err, setErr]         = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow]       = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (isLocked()) { setErr(`Too many attempts. Locked for ${lockMinsLeft()} min.`); return }
    setLoading(true); setErr('')
    const res = await login(email, pass)
    setLoading(false)
    if (res.ok) onSuccess()
    else setErr(res.msg)
  }

  return (
    <div className="adm adm-login">
      <div className="adm-login__card adm-animate">
        {/* Logo */}
        <div className="adm-login__logo">
          <div className="adm-login__logo-icon">🐛</div>
          <div>
            <div style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--a-muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>A to Z Pest Solutions</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--a-text)' }}>Admin Portal</div>
          </div>
        </div>

        <div className="adm-login__title">Welcome back</div>
        <div className="adm-login__sub">Sign in to manage your pest control business</div>

        {err && (
          <div className="adm-login__error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="adm-form-group" style={{ marginBottom: '.85rem' }}>
            <label className="adm-label">Email Address</label>
            <input
              className="adm-input"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="adm-form-group" style={{ marginBottom: '.85rem' }}>
            <label className="adm-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="adm-input"
                type={show ? 'text' : 'password'}
                placeholder="Enter password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: '.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--a-muted)', display: 'flex' }}>
                {show
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <button className="adm-btn adm-btn--primary adm-login__btn" type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Sign In →'}
          </button>
        </form>

        <div className="adm-login__hint">🔒 Session expires after 2 hours of inactivity</div>
      </div>
    </div>
  )
}
