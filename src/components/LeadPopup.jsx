'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, MessageCircle, CheckCircle2, FileText } from 'lucide-react'
import { addClient } from '../admin/clientsData'
import './LeadPopup.css'

const DELAY_MS = 5000

export default function LeadPopup() {
  const pathname = usePathname()
  const [visible,   setVisible]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [form,      setForm]      = useState({ name: '', phone: '+91 ' })
  const [errors,    setErrors]    = useState({})

  useEffect(() => {
    // Only show popup on the homescreen ('/')
    if (pathname !== '/') {
      setVisible(false)
      return
    }

    const timer = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [pathname])

  if (pathname !== '/') return null

  const close = () => {
    setVisible(false)
  }

  const handlePhoneChange = (e) => {
    let val = e.target.value
    if (!val.startsWith('+91')) {
      val = '+91 ' + val.replace(/^\+?91\s*/, '')
    }
    const digits = val.slice(4).replace(/\D/g, '').slice(0, 10)
    setForm((prev) => ({ ...prev, phone: '+91 ' + digits }))
    setErrors((prev) => ({ ...prev, phone: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Please enter your name'
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (!form.phone.trim() || phoneDigits.length < 12) {
      e.phone = 'Please enter a valid 10-digit phone number'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      addClient({ ...form, source: 'Popup Form' })
      setLoading(false)
      setDone(true)
      setTimeout(close, 3000)
    }, 800)
  }

  return (
    <AnimatePresence>
      {visible ? (
        <>
          {/* Mobile: bottom sheet backdrop */}
          <motion.div
            key="lead-backdrop"
            className="lead-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          <motion.div
            key="lead-popup-card"
            className="lead-popup"
            role="dialog"
            aria-modal="true"
            aria-label="Get a free pest control inspection"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            {/* Close button */}
            <button className="lead-close" onClick={close} aria-label="Close form">
              <X size={16} />
            </button>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  className="lead-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle2 size={44} className="lead-success-icon" />
                  <div style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, color: 'var(--clr-text)', marginBottom: '.5rem' }}>We'll call you shortly!</div>
                  <p>Our team will contact you within 30 minutes.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Header */}
                  <div className="lead-header">
                    <div className="lead-badge">🔥 Free Offer</div>
                    <div className="lead-title">Get a <span>Free Inspection</span></div>
                    <p className="lead-sub">Our expert visits your home at no cost. Zero obligation.</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="lead-form">
                    <div className="lead-field">
                      <input
                        type="text"
                        placeholder="Your Full Name *"
                        value={form.name}
                        onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
                        className={errors.name ? 'lead-input error' : 'lead-input'}
                        autoComplete="name"
                        maxLength={80}
                      />
                      {errors.name && <span className="lead-error">{errors.name}</span>}
                    </div>
                    <div className="lead-field">
                      <input
                        type="tel"
                        placeholder="+91 98455 59710"
                        value={form.phone}
                        onChange={handlePhoneChange}
                        className={errors.phone ? 'lead-input error' : 'lead-input'}
                        autoComplete="tel"
                        maxLength={15}
                      />
                      {errors.phone && <span className="lead-error">{errors.phone}</span>}
                    </div>
                    <button type="submit" className="lead-submit" disabled={loading}>
                      {loading ? (
                        <span className="lead-spinner" />
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          Book Free Inspection
                        </>
                      )}
                    </button>
                  </form>

                  {/* Alternative CTAs */}
                  <div className="lead-alts">
                    <a href="tel:+919845559710" className="lead-alt-btn lead-call" aria-label="Call our pest control team directly">
                      <Phone size={14} /> Call Specialist
                    </a>
                    <a
                      href="https://wa.me/919845559710?text=Hi%2C%20I%20need%20a%20free%20pest%20control%20inspection."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lead-alt-btn lead-wa"
                      aria-label="Chat on WhatsApp for free inspection booking"
                    >
                      <MessageCircle size={14} /> WhatsApp Chat
                    </a>
                  </div>

                  <p className="lead-privacy">🔒 We never share your details with anyone.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      ) : (
        /* Minimal Floating Contact Form Button on Bottom-Left */
        <motion.button
          key="lead-trigger-btn"
          className="lead-trigger-btn"
          onClick={() => setVisible(true)}
          aria-label="Open Free Inspection Booking Form"
          title="Book Free Inspection"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 220, damping: 18 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.93 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            <path d="m9 14 2 2 4-4" />
          </svg>
          <span className="lead-trigger-pulse" aria-hidden="true" />
          <span className="lead-trigger-tooltip">Free Inspection</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
