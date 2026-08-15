'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import CTABanner from '../../sections/CTABanner'
import '../PageStyles.css'

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  const id = `faq-${q.slice(0, 15).replace(/\s+/g, '-').toLowerCase()}`
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button
        className="faq-item__btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
      >
        {q}
        <ChevronDown size={18} className="faq-item__icon" aria-hidden="true" />
      </button>
      {open && (
        <motion.div
          id={id}
          className="faq-item__body"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
        >
          {a}
        </motion.div>
      )}
    </div>
  )
}

function ReviewsSection({ serviceTitle }) {
  const [reviews, setReviews] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', rating: 5, text: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let all = []
        try {
          const res = await fetch('/api/reviews')
          if (res.ok) {
            all = await res.json()
            localStorage.setItem('azt_reviews', JSON.stringify(all))
          } else {
            all = JSON.parse(localStorage.getItem('azt_reviews')) || []
          }
        } catch {
          all = JSON.parse(localStorage.getItem('azt_reviews')) || []
        }

        const approved = all.filter(r => r.service === serviceTitle && r.status === 'approved')
        
        setReviews(prev => {
          if (prev.length !== approved.length) return approved;
          const prevIds = prev.map(p => p.id).join(',')
          const newIds = approved.map(a => a.id).join(',')
          return prevIds === newIds ? prev : approved;
        })
      } catch { setReviews([]) }
    }

    fetchReviews()
    const intervalId = setInterval(fetchReviews, 2000)

    return () => clearInterval(intervalId)
  }, [serviceTitle])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.text) return
    const newRev = {
      service: serviceTitle,
      name: formData.name,
      rating: formData.rating,
      text: formData.text,
      status: 'pending',
      date: new Date().toISOString()
    }

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRev)
      })
    } catch (err) {
      console.warn('API submission failed, falling back to localStorage:', err)
      const all = JSON.parse(localStorage.getItem('azt_reviews')) || []
      all.unshift({ ...newRev, id: 'REV-' + Math.random().toString(36).slice(2, 9).toUpperCase() })
      localStorage.setItem('azt_reviews', JSON.stringify(all))
    }

    setSubmitted(true)
    setShowForm(false)
    setFormData({ name: '', rating: 5, text: '' })
  }

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#F59E0B' : '#E5E7EB', fontSize: '1.2rem' }}>★</span>
    ))
  }

  return (
    <section className="section" style={{ backgroundColor: 'rgba(22, 163, 74, 0.03)', borderTop: '1px solid var(--clr-border)' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <h2 className="display-lg">Customer <span className="gradient-text">Reviews</span></h2>
          <p className="text-muted" style={{ maxWidth: 600, margin: '1rem auto' }}>See what our clients have to say about our {serviceTitle} service.</p>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {reviews.length > 0 ? (
            <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {reviews.map(r => (
                <div key={r.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--clr-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: 700, color: 'var(--clr-text)', fontSize: '1rem' }}>{r.name}</h4>
                    <div>{renderStars(r.rating)}</div>
                  </div>
                  <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{r.text}</p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--a-muted)', marginTop: '0.75rem' }}>{new Date(r.date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px dashed var(--clr-border)', color: 'var(--clr-text-muted)', marginBottom: '2rem' }}>
              No reviews yet. Be the first to review our {serviceTitle} service!
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            {submitted ? (
              <div style={{ padding: '1rem', background: 'rgba(22, 163, 74, 0.1)', color: 'var(--clr-primary)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                Thank you! Your review has been submitted...
              </div>
            ) : showForm ? (
              <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--clr-border)', textAlign: 'left' }}>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--clr-text)' }}>Write a Review</h4>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Rating</label>
                  <select className="form-select" value={formData.rating} onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}>
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                    <option value={2}>⭐⭐ (2/5)</option>
                    <option value={1}>⭐ (1/5)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Review</label>
                  <textarea className="form-textarea" required rows="4" value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} placeholder="Tell us about your experience..."></textarea>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Submit Review</button>
                  <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>Leave a Review</button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const OTHER_SERVICES = [
  { to: '/termite-treatment', label: '🪵 Termite Treatment' },
  { to: '/pre-construction-termite-treatment', label: '🏗️ Pre-Construction Termite' },
  { to: '/post-construction-termite-treatment', label: '🏠 Post-Construction Termite' },
  { to: '/bed-bugs-treatment', label: '🛏️ Bed Bugs Treatment' },
  { to: '/cockroach-treatment', label: '🪳 Cockroach Treatment' },
  { to: '/rodent-treatment', label: '🐀 Rodent Treatment' },
  { to: '/mosquito-treatment', label: '🦟 Mosquito Treatment' },
  { to: '/honey-bee-treatment', label: '🐝 Honey Bee Treatment' },
  { to: '/ticks-fleas-treatment', label: '🦗 Ticks & Fleas' },
  { to: '/wood-borer-treatment', label: '🪲 Wood Borer Treatment' },
  { to: '/ant-pest-control', label: '🐜 Ant Pest Control' },
]

gsap.registerPlugin(ScrollTrigger)

export default function ServiceDetailPage({ _meta, image, bgImage, title, tagline, intro, signs, benefits, process, faqs }) {
  const slugId = title.replace(/\s/g, '-').toLowerCase()
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Process items stagger
      gsap.from('.service-detail__process-item', {
        scrollTrigger: {
          trigger: '.service-detail__process',
          start: 'top 85%',
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      })

      // Sidebar cards stagger
      gsap.from('.service-sidebar__card', {
        scrollTrigger: {
          trigger: '.service-sidebar',
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      })

      // FAQ list stagger
      if (document.querySelector('.faq-list')) {
        gsap.from('.faq-item', {
          scrollTrigger: {
            trigger: '.faq-list',
            start: 'top 85%',
          },
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: title,
    name: `${title} Bangalore`,
    description: intro,
    provider: {
      '@type': 'LocalBusiness',
      name: 'A to Z Pest Solutions',
      telephone: '+919845559710',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'No. 64, 6th Main, Hanumanthappa Layout, Sultanpalya, RT Nagar',
        addressLocality: 'Bengaluru',
        postalCode: '560032',
        addressCountry: 'IN',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Bengaluru',
    },
  }

  return (
    <article className="page-enter" ref={containerRef}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {/* Hero */}
      <section className={`page-hero ${bgImage ? 'page-hero--dark' : ''}`} aria-label={`${title} page header`}>
        <div className="page-hero__bg-wrapper">
          {bgImage && (
            <img src={bgImage} alt={`${title} Professional Service Background`} className="page-hero__bg-img" />
          )}
          <div className="page-hero__bg-overlay" />
        </div>
        {/* Animated floating orbs */}
        <div className="orb orb--1" aria-hidden="true" />
        <div className="orb orb--2" aria-hidden="true" />
        <div className="orb orb--3" aria-hidden="true" />
        <div className="container page-hero__content">
          <div className="eyebrow">🛡️ Expert Treatment</div>
          {image && (
            <div style={{ width: '120px', height: '120px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--clr-bg)', boxShadow: 'var(--shadow-lg)' }}>
              <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <h1 className="display-xl">{title}</h1>
          <p className="body-lg text-muted" style={{ maxWidth: 640, margin: '1rem auto 0' }}>
            Get expert <strong>{title}</strong> in Bangalore. {tagline}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <a
              href="tel:+919845559710"
              className="btn btn-primary"
              aria-label={`Call now for ${title} in Bangalore`}
            >
              <Phone size={16} aria-hidden="true" /> Call for Free Inspection
            </a>
            <a
              href={`https://wa.me/919845559710?text=Hi%2C%20I%20need%20${encodeURIComponent(title)}%20in%20Bangalore.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              aria-label={`WhatsApp us about ${title}`}
            >
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Detail */}
      <section className="section service-section-bg" aria-labelledby={`${slugId}-detail`}>
        {/* Animated background elements below the hero */}
        <div className="orb orb--1" style={{ top: '15%', left: '-5%', opacity: 0.3 }} aria-hidden="true" />
        <div className="orb orb--2" style={{ top: '45%', right: '-5%', opacity: 0.2 }} aria-hidden="true" />
        <div className="orb orb--3" style={{ bottom: '10%', left: '10%', opacity: 0.25 }} aria-hidden="true" />
        <div className="container">
          <div className="service-detail">
            {/* Main */}
            <div>
              <h2 id={`${slugId}-detail`} className="heading-md" style={{ marginBottom: '1rem' }}>
                About Our {title}
              </h2>
              <p className="body-md text-muted">{intro}</p>

              {/* Signs */}
              <div style={{ marginTop: '2rem' }}>
                <h3 className="signs-title" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--clr-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} style={{ color: 'var(--clr-primary)' }} aria-hidden="true" />
                  Signs You Need This Treatment
                </h3>
                <ul
                  className="signs-list"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '0.65rem' }}
                  aria-label="Signs that indicate you need this pest treatment"
                >
                  {signs.map((s) => (
                    <li key={s} className="signs-item" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>
                      <CheckCircle2 size={15} style={{ color: 'var(--clr-primary)', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Process */}
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--clr-text)' }}>
                  Our Treatment Process
                </h3>
                <div className="service-detail__process">
                  {process.map((step, i) => (
                    <div
                      key={step.title}
                      className="service-detail__process-item"
                      aria-label={`Step ${i + 1}: ${step.title}`}
                    >
                      <div className="service-detail__process-num" aria-hidden="true">{i + 1}</div>
                      <div className="service-detail__process-content">
                        <h4>{step.title}</h4>
                        <p>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="service-sidebar" aria-label="Booking and additional information">
              {/* Book Now */}
              <div
                className="service-sidebar__card"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,210,140,0.1), rgba(0,240,192,0.05))',
                  borderColor: 'var(--clr-border-2)',
                }}
              >
                <h3>Book {title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>
                  Get expert help today — free inspection, no hidden charges, eco-friendly treatment.
                </p>
                <a
                  href="tel:+919845559710"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}
                  aria-label="Call to book pest control treatment"
                >
                  <Phone size={15} aria-hidden="true" /> 9845559710
                </a>
                <a
                  href={`https://wa.me/919845559710?text=Hi%2C%20I%20need%20${encodeURIComponent(title)}%20in%20Bangalore.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                  aria-label="WhatsApp to book treatment"
                >
                  💬 WhatsApp Us
                </a>
              </div>

              {/* Benefits */}
              <div className="service-sidebar__card">
                <h3>Why Choose A to Z</h3>
                <ul className="service-sidebar__list" aria-label="Benefits of choosing our treatment">
                  {benefits.map((b) => (
                    <li key={b}>
                      <CheckCircle2 size={14} aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Other Services */}
              <div className="service-sidebar__card">
                <h3>Our Other Services</h3>
                <ul className="service-sidebar__list" aria-label="Other pest control services we offer">
                  {OTHER_SERVICES.filter((s) => !title || !s.label.toLowerCase().includes(title.toLowerCase().split(' ')[0])).map((s) => (
                    <li key={s.to}>
                      <Link
                        href={s.to}
                        style={{ color: 'var(--clr-text-muted)', fontSize: '0.85rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        aria-label={`View ${s.label} service`}
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="section" aria-labelledby={`${slugId}-faq`}>
          <div className="container">
            <div className="section-header">
              <h2 id={`${slugId}-faq`} className="display-lg">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
            </div>
            <div className="faq-list">
              {faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ReviewsSection serviceTitle={title} />

      <CTABanner />
    </article>
  )
}
