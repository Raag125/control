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
        <span dangerouslySetInnerHTML={{ __html: q }} />
        <ChevronDown size={18} className="faq-item__icon" aria-hidden="true" />
      </button>
      {open && (
        <motion.div
          id={id}
          className="faq-item__body"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
          dangerouslySetInnerHTML={{ __html: a }}
        />
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
      <span key={i} style={{ color: i < rating ? '#F59E0B' : '#E5E7EB', fontSize: 'var(--font-size-h2)' }}>★</span>
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
                    <div style={{ fontWeight: 700, color: 'var(--clr-text)', fontSize: 'var(--font-size-h3)' }}>{r.name}</div>
                    <div>{renderStars(r.rating)}</div>
                  </div>
                  <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--font-size-h3)', lineHeight: 1.6 }}>{r.text}</p>
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
                <div style={{ marginBottom: '1.5rem', fontSize: 'var(--font-size-h3)', fontWeight: 700, color: 'var(--clr-text)' }}>Write a Review</div>

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
  { to: '/cockroach-treatment', label: '🪳 Cockroach Pest Control' },
  { to: '/bed-bugs-treatment', label: '🛏️ Bed Bug Pest Control' },
  { to: '/termite-treatment', label: '🪵 Termite Pest Control' },
  { to: '/rodent-treatment', label: '🐀 Rodent Pest Control' },
  { to: '/mosquito-treatment', label: '🦟 Mosquito Pest Control' },
  { to: '/honey-bee-treatment', label: '🐝 Honey Bee Pest Control' },
  { to: '/ant-pest-control', label: '🐜 Ant Pest Control' },
  { to: '/flea-pest-control', label: '🦗 Flea Pest Control' },
  { to: '/tick-pest-control', label: '🕷️ Tick Pest Control' },
  { to: '/wood-borer-treatment', label: '🪲 Wood Borer Pest Control' },
  { to: '/general-pest-control', label: '🛡️ General Pest Control' },
  { to: '/pre-construction-termite-treatment', label: '🏗️ Pre-Construction Termite' },
  { to: '/post-construction-termite-treatment', label: '🏠 Post-Construction Termite' },
  { to: '/residential-pest-control', label: '🏡 Residential Pest Control' },
  { to: '/commercial-pest-control', label: '🏢 Commercial Pest Control' },
]

gsap.registerPlugin(ScrollTrigger)

export default function ServiceDetailPage(props) {
  
  
  const title = props.title || props.service?.hero?.title || props.service?.title || 'Pest Control Service'
  const tagline = props.tagline || props.service?.hero?.tagline || props.service?.description || ''
  const intro = props.intro || props.service?.hero?.intro || props.service?.intro || ''
  const image = props.image || props.service?.hero?.image || props.service?.image || null
  const imageAlt = props.imageAlt || props.service?.hero?.imageAlt || props.service?.imageAlt || `${title} in Bangalore`
  const bgImage = props.bgImage || props.service?.hero?.bgImage || props.service?.bgImage || null
  const bgImageAlt = props.bgImageAlt || props.service?.hero?.bgImageAlt || props.service?.bgImageAlt || `${title} Professional Service Background`
  const signs = props.signs || props.service?.signs || []
  const benefits = props.benefits || props.service?.benefits || []
  const process = props.process || props.service?.process || []
  const faqs = props.faqs || props.service?.faqs || []

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

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
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

  // Get image src whether string or Next.js imported object
  const imgSrc = image?.src || image
  const bgImgSrc = bgImage?.src || bgImage

  return (
    <article className="page-enter" ref={containerRef}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {/* Hero */}
      <section className={`page-hero ${bgImgSrc ? 'page-hero--dark' : ''}`} aria-label={`${title} page header`}>
        <div className="page-hero__bg-wrapper">
          {bgImgSrc && (
            <img src={bgImgSrc} alt={bgImageAlt} className="page-hero__bg-img" loading="eager" decoding="async" />
          )}
          <div className="page-hero__bg-overlay" />
        </div>
        {/* Animated floating orbs */}
        <div className="orb orb--1" aria-hidden="true" />
        <div className="orb orb--2" aria-hidden="true" />
        <div className="orb orb--3" aria-hidden="true" />
        <div className="container page-hero__content">
          <div className="eyebrow">🛡️ Expert Treatment</div>
          {imgSrc && (
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--clr-bg)', boxShadow: 'var(--shadow-lg)' }}>
              <img src={imgSrc} alt={imageAlt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="eager" decoding="async" />
            </div>
          )}
          <h1 className="display-xl" dangerouslySetInnerHTML={{ __html: title }} />
          <p className="body-lg text-muted" style={{ maxWidth: 640, margin: '1rem auto 0' }}>
            Get expert <strong><span dangerouslySetInnerHTML={{ __html: title }} /></strong> in Bangalore. <span dangerouslySetInnerHTML={{ __html: tagline }} />
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
              <MessageCircle size={16} aria-hidden="true" /> {props.service?.hero?.secondaryCtaText || `WhatsApp for ${title}`}
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
          <style>{`
            .rich-text-content h1 { font-size: 2.25rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 1rem; line-height: 1.2; color: var(--clr-text); display: block; }
            .rich-text-content h2 { font-size: 1.75rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.8rem; line-height: 1.3; color: var(--clr-text); display: block; }
            .rich-text-content h3 { font-size: 1.4rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.6rem; line-height: 1.4; color: var(--clr-text); display: block; }
            .rich-text-content p { font-size: 1.1rem; margin-top: 0; margin-bottom: 1rem; line-height: 1.6; display: block; }
            
            .rich-text-content h1 *, .rich-text-content h2 *, .rich-text-content h3 * {
              font-size: inherit !important;
              line-height: inherit !important;
              font-weight: inherit !important;
            }
          `}</style>
          <div className="service-detail">
            {/* Main */}
            <div>
              <h2 id={`${slugId}-detail`} className="heading-md" style={{ marginBottom: '1rem' }} dangerouslySetInnerHTML={{ __html: props.service?.sectionTitles?.about || `About Our ${title}` }} />
              <div className="body-md text-muted rich-text-content" dangerouslySetInnerHTML={{ __html: intro }} />

              {/* Signs */}
              <div style={{ marginTop: '2rem' }}>
                <h3 className="signs-title" style={{ fontSize: 'var(--font-size-h3)', fontWeight: 700, marginBottom: '1rem', color: 'var(--clr-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} style={{ color: 'var(--clr-primary)' }} aria-hidden="true" />
                  <span dangerouslySetInnerHTML={{ __html: props.service?.sectionTitles?.signs || 'Signs You Need This Treatment' }} />
                </h3>
                <ul
                  className="signs-list"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '0.65rem' }}
                  aria-label="Signs that indicate you need this pest treatment"
                >
                  {signs.map((s) => (
                    <li key={s} className="signs-item" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: 'var(--font-size-h3)', color: 'var(--clr-text-muted)' }}>
                      <CheckCircle2 size={15} style={{ color: 'var(--clr-primary)', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                      <span dangerouslySetInnerHTML={{ __html: s }} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Process */}
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--clr-text)' }}>
                  <span dangerouslySetInnerHTML={{ __html: props.service?.sectionTitles?.process || 'Our Treatment Process' }} />
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
                        <strong style={{ display: 'block', fontSize: 'var(--font-size-h3)', fontWeight: 700, color: 'var(--clr-text)', marginBottom: '0.25rem' }} dangerouslySetInnerHTML={{ __html: step.title }} />
                        <div dangerouslySetInnerHTML={{ __html: step.desc }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="service-sidebar" aria-label="Booking and additional information">
              {/* Pricing & Specs */}
              <div className="service-sidebar__card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1.5px solid rgba(22,163,74,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 800, color: 'var(--clr-primary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Pricing &amp; Specs
                </div>
                
                <div style={{ marginTop: '.75rem', display: 'flex', alignItems: 'baseline', gap: '.4rem' }}>
                  <span style={{ fontSize: 'var(--font-size-h2)', fontWeight: 900, color: 'var(--clr-text)' }}>
                    ₹{props.service?.specs?.startingPrice || props.service?.startingPrice || 2500}
                  </span>
                  <span style={{ fontSize: 'var(--font-size-h3)', color: 'var(--clr-text-muted)' }}>starting price</span>
                </div>

                <div style={{ marginTop: '1.25rem', display: 'grid', gap: '.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-h3)' }}>
                    <span style={{ color: 'var(--clr-text-muted)' }} dangerouslySetInnerHTML={{ __html: props.service?.specLabels?.duration || 'Duration:' }} />
                    <strong style={{ color: 'var(--clr-text)' }} dangerouslySetInnerHTML={{ __html: props.service?.specs?.duration || props.service?.duration || '3-4 Hours' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-h3)' }}>
                    <span style={{ color: 'var(--clr-text-muted)' }} dangerouslySetInnerHTML={{ __html: props.service?.specLabels?.warranty || 'Warranty:' }} />
                    <strong style={{ color: 'var(--clr-text)' }} dangerouslySetInnerHTML={{ __html: props.service?.specs?.warranty || props.service?.warranty || '5 Years' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-h3)' }}>
                    <span style={{ color: 'var(--clr-text-muted)' }}>Safety:</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>100% Eco-Safe</span>
                  </div>
                </div>
              </div>

              {/* Book Now */}
              <div
                className="service-sidebar__card"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,210,140,0.1), rgba(0,240,192,0.05))',
                  borderColor: 'var(--clr-border-2)',
                }}
              >
                <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 700, color: 'var(--clr-text)', marginBottom: '0.5rem' }}>Book {title}</div>
                <p style={{ fontSize: 'var(--font-size-h3)', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>
                  Get expert help today — free inspection, no hidden charges, eco-friendly treatment.
                </p>
                <a
                  href="tel:+919845559710"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}
                  aria-label="Call our pest control team at 9845559710"
                >
                  <Phone size={15} aria-hidden="true" /> {props.service?.hero?.primaryCtaText || 'Call Specialist: 9845559710'}
                </a>
                <a
                  href={`https://wa.me/919845559710?text=Hi%2C%20I%20need%20${encodeURIComponent(title)}%20in%20Bangalore.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                  aria-label="Chat on WhatsApp to book pest treatment"
                >
                  💬 {props.service?.hero?.secondaryCtaText || 'Chat on WhatsApp'}
                </a>
              </div>

              {/* Benefits */}
              <div className="service-sidebar__card">
                <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 700, color: 'var(--clr-text)', marginBottom: '0.5rem' }}>Why Choose A to Z</div>
                <ul className="service-sidebar__list" aria-label="Benefits of choosing our treatment">
                  {benefits.map((b) => (
                    <li key={b}>
                      <CheckCircle2 size={14} aria-hidden="true" />
                      <span dangerouslySetInnerHTML={{ __html: b }} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Other Services */}
              <div className="service-sidebar__card">
                <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 700, color: 'var(--clr-text)', marginBottom: '0.5rem' }}>Our Other Services</div>
                <ul className="service-sidebar__list" aria-label="Other pest control services we offer">
                  {OTHER_SERVICES.filter((s) => !title || !s.label.toLowerCase().includes(title.toLowerCase().split(' ')[0])).map((s) => (
                    <li key={s.to}>
                      <Link
                        href={s.to}
                        style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--font-size-h3)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
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
