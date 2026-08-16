'use client'

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
    if (e) e.preventDefault()
    if (isLocked()) {
      setErr(`Too many failed attempts. Locked for ${lockMinsLeft()} minutes.`)
      return
    }
    setLoading(true)
    setErr('')
    const res = await login(email, pass)
    setLoading(false)
    if (res.ok) {
      onSuccess()
    } else {
      setErr(res.msg || 'Invalid email or password')
    }
  }

  return (
    <div className="adm-login">
      <div className="adm-login__card">
        {/* Brand Header */}
        <div className="adm-login__logo">
          <div className="adm-login__logo-icon">🐛</div>
          <div>
            <div style={{ fontSize: '.68rem', fontWeight: 800, color: 'var(--a-green2)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
              A to Z Pest Solutions
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--a-text)', letterSpacing: '-0.01em' }}>
              Admin Portal
            </div>
          </div>
        </div>

        <div className="adm-login__title">Admin Sign In</div>
        <div className="adm-login__sub">Sign in to manage bookings, leads, services &amp; SEO</div>

        {err && (
          <div className="adm-login__error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="adm-form-group" style={{ marginBottom: '1rem' }}>
            <label className="adm-label" style={{ marginBottom: '.25rem' }}>Email Address</label>
            <input
              className="adm-input"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="adm-form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="adm-label" style={{ marginBottom: '.25rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="adm-input"
                type={show ? 'text' : 'password'}
                placeholder="Enter password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: '2.8rem' }}
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '0',
                  bottom: '0',
                  width: '44px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--a-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {show ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            className="adm-btn adm-btn--primary adm-login__btn"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeLinecap="round"></path>
                </svg>
                <span>Verifying credentials…</span>
              </>
            ) : (
              <span>Sign In to Dashboard →</span>
            )}
          </button>
        </form>

        <div className="adm-login__hint">
          <span>🔒 Protected with encrypted JWT authentication</span>
        </div>
      </div>
    </div>
  )
}
