'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import CTABanner from '../sections/CTABanner'
import { addClient } from '../admin/clientsData'
import './PageStyles.css'

const CONTACT_INFO = [
  { icon: Phone,  label: 'Phone / WhatsApp', value: '9845559710', href: 'tel:+919845559710' },
  { icon: Mail,   label: 'Email Address',    value: 'info@pestcontrolbengaluru.in', href: 'mailto:info@pestcontrolbengaluru.in' },
  { icon: MapPin, label: 'Office Address',   value: 'No. 64, 6th Main, Hanumanthappa Layout, Sultanpalya, RT Nagar, Bengaluru – 560032', href: null },
  { icon: Clock,  label: 'Working Hours',    value: '24 Hours / 7 Days / 365 Days a Year', href: null },
]

const SERVICES_LIST = [
  'Termite Treatment', 'Bed Bugs Treatment', 'Cockroach Treatment', 'Rodent Treatment',
  'Mosquito Treatment', 'Honey Bee Treatment', 'Ticks & Fleas Treatment', 'Wood Borer Treatment', 'General Pest Control',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '+91 ', email: '', service: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePhoneChange = (e) => {
    let val = e.target.value
    if (!val.startsWith('+91')) {
      val = '+91 ' + val.replace(/^\+?91\s*/, '')
    }
    const digits = val.slice(4).replace(/\D/g, '').slice(0, 10)
    setForm((prev) => ({ ...prev, phone: '+91 ' + digits }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (!form.name || phoneDigits.length < 12 || !form.service) {
      toast.error('Please enter a valid 10-digit phone number and required fields.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      addClient({ name: form.name, phone: form.phone, email: form.email, service: form.service, message: form.message, source: 'Contact Form' })
      setLoading(false)
      toast.success('Thank you! We\'ll contact you within 30 minutes.')
      setForm({ name: '', phone: '+91 ', email: '', service: '', message: '' })
    }, 1800)
  }

  return (
    <div className="page-enter">
        <section className="page-hero" aria-label="Contact page header">
          <div className="page-hero__bg" aria-hidden="true" />
          <div className="container page-hero__content">
            <div className="eyebrow">📞 Get In Touch</div>
            <h1 className="display-xl">Contact <span className="gradient-text">Us</span></h1>
            <p className="body-lg text-muted" style={{ maxWidth: 540, margin: '1rem auto 0' }}>
              <strong>Contact us</strong> today for expert pest control across Bangalore. We're ready to help 24/7. Call, WhatsApp, or fill in the form below for a FREE inspection.
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="contact-section-heading">
          <div className="container">
            <h2 id="contact-section-heading" className="sr-only">Contact Information and Booking Form</h2>
            <div className="contact-grid">
              {/* Info Column */}
              <div className="contact-info">
                {CONTACT_INFO.map(({ icon: Icon, label, value, href }) =>
                  href ? (
                    <motion.a
                      key={label}
                      href={href}
                      className="contact-info__item"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      aria-label={`${label}: ${value}`}
                    >
                      <div className="contact-info__icon" aria-hidden="true"><Icon size={20} /></div>
                      <div>
                        <div className="contact-info__label">{label}</div>
                        <div className="contact-info__value">{value}</div>
                      </div>
                    </motion.a>
                  ) : (
                    <motion.div
                      key={label}
                      className="contact-info__item"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      aria-label={`${label}: ${value}`}
                    >
                      <div className="contact-info__icon" aria-hidden="true"><Icon size={20} /></div>
                      <div>
                        <div className="contact-info__label">{label}</div>
                        <div className="contact-info__value">{value}</div>
                      </div>
                    </motion.div>
                  )
                )}

                {/* Map embed */}
                <motion.div
                  className="contact-info__item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  style={{ flexDirection: 'column', padding: 0, overflow: 'hidden' }}
                >
                  <iframe
                    title="A to Z Pest Solutions Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.5!2d77.5946!3d13.0186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSultanpalya%2C%20RT%20Nagar%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1"
                    width="100%"
                    height="220"
                    style={{ border: 0, borderRadius: 'var(--radius-md)', display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    aria-label="Map showing A to Z Pest Solutions location in RT Nagar, Bengaluru"
                  />
                </motion.div>
              </div>

              {/* Form Column */}
              <motion.div
                className="form-card"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                  Book a Free Inspection
                </h2>
                <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.75rem' }}>
                  Fill in the form below and our team will call you within 30 minutes.
                </p>

                <form onSubmit={handleSubmit} noValidate aria-label="Pest control booking form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Full Name *</label>
                      <input
                        id="name" name="name" type="text" className="form-input"
                        placeholder="Your name" value={form.name} onChange={handleChange}
                        required aria-required="true" autoComplete="name"
                        maxLength={100}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Phone Number *</label>
                      <input
                        id="phone" name="phone" type="tel" className="form-input"
                        placeholder="+91 98455 59710" value={form.phone} onChange={handlePhoneChange}
                        required aria-required="true" autoComplete="tel"
                        maxLength={15}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      id="email" name="email" type="email" className="form-input"
                      placeholder="you@example.com" value={form.email} onChange={handleChange}
                      autoComplete="email" maxLength={254}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="service" className="form-label">Service Required *</label>
                    <select
                      id="service" name="service" className="form-select"
                      value={form.service} onChange={handleChange}
                      required aria-required="true"
                    >
                      <option value="">Select a service…</option>
                      {SERVICES_LIST.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Additional Message</label>
                    <textarea
                      id="message" name="message" className="form-textarea"
                      placeholder="Describe your pest problem, property size, or any specific requirements…"
                      value={form.message} onChange={handleChange}
                      maxLength={1000} rows={4}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary form-submit"
                    disabled={loading}
                    aria-label="Submit booking request"
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ animation: 'spin-slow 0.8s linear infinite' }}>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        Sending…
                      </span>
                    ) : (
                      <><Send size={16} aria-hidden="true" /> Send Request</>
                    )}
                  </button>
                  <p style={{ color: 'var(--clr-text-dim)', marginTop: '0.75rem', textAlign: 'center' }}>
                    🔒 Your information is secure and will never be shared with third parties.
                  </p>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
        <CTABanner />
      </div>
  )
}
