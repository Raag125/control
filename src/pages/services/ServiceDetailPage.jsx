import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
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

const OTHER_SERVICES = [
  { to: '/termite-treatment',    label: '🪵 Termite Treatment' },
  { to: '/bed-bugs-treatment',   label: '🛏️ Bed Bugs Treatment' },
  { to: '/cockroach-treatment',  label: '🪳 Cockroach Treatment' },
  { to: '/rodent-treatment',     label: '🐀 Rodent Treatment' },
  { to: '/mosquito-treatment',   label: '🦟 Mosquito Treatment' },
  { to: '/honey-bee-treatment',  label: '🐝 Honey Bee Treatment' },
  { to: '/ticks-fleas-treatment','label': '🦗 Ticks & Fleas' },
  { to: '/wood-borer-treatment', label: '🪲 Wood Borer Treatment' },
]

gsap.registerPlugin(ScrollTrigger)

export default function ServiceDetailPage({ meta, image, title, tagline, intro, signs, benefits, process, faqs }) {
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

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.desc} />
        <link rel="canonical" href={meta.canonical} />
      </Helmet>

      <div className="page-enter" ref={containerRef}>
        {/* Hero */}
        <section className="page-hero" aria-label={`${title} page header`}>
          <div className="page-hero__bg" aria-hidden="true" />
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
            <p className="body-lg text-muted" style={{ maxWidth: 580, margin: '1rem auto 0' }}>{tagline}</p>
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
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--clr-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: 'var(--clr-primary)' }} aria-hidden="true" />
                    Signs You Need This Treatment
                  </h3>
                  <ul
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}
                    aria-label="Signs that indicate you need this pest treatment"
                  >
                    {signs.map((s) => (
                      <li key={s} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>
                        <CheckCircle2 size={15} style={{ color: 'var(--clr-primary)', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                        {s}
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
                    {OTHER_SERVICES.filter((s) => !meta.canonical.includes(s.to.replace('/', ''))).slice(0, 5).map((s) => (
                      <li key={s.to}>
                        <Link
                          to={s.to}
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

        <CTABanner />
      </div>
    </>
  )
}
