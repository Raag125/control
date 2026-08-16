'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Home, Building2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import './ResidentialCommercial.css'

const RESIDENTIAL = [
  'Eco-friendly, odorless & child/pet-safe formulations',
  'Specialized treatments for termites, bed bugs & cockroaches',
  'Child, pet & elderly-safe protocols (odorless options)',
  'Flexible scheduling including weekends and holidays',
  'Certified, background-verified expert technicians',
  'Long-term warranties with free follow-up inspections',
]

const COMMERCIAL = [
  'Audit-ready commercial pest management protocols',
  'Tailored for hotels, restaurants, hospitals & IT parks',
  'Zero-disruption treatments (gel baiting & after-hours)',
  'Quarterly & Annual Maintenance Contracts (AMC)',
  'Dedicated account managers and priority emergency response',
  'Digital service reports and full quality documentation',
]

export default function ResidentialCommercial() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="rc-section section" aria-labelledby="rc-heading" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow" aria-hidden="true">🏠 Our Expertise</div>
          <h2 id="rc-heading" className="display-lg">
            Residential &amp; <span className="gradient-text">Commercial</span>
          </h2>
          <p>Tailored pest control solutions for both homes and businesses — because every space deserves protection.</p>
        </div>

        <div className="rc-grid">
          {/* Residential */}
          <motion.div
            className="rc-card"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="rc-card__header">
              <div className="rc-card__icon" aria-hidden="true">
                <Home size={28} />
              </div>
              <div>
                <h3 className="rc-card__title">Residential Pest Control</h3>
                <p className="rc-card__sub">Safe &amp; Effective Home Pest Management</p>
              </div>
            </div>
            <p className="rc-card__desc">
              At A to Z Pest Solutions, we understand that a pest-free home is essential for your family's health and peace of mind. Our residential treatments use targeted, low-toxicity methodologies — creating a safe haven from disease-carrying vectors and property-damaging insects without disrupting your daily life.
            </p>
            <ul className="rc-card__list" aria-label="Residential pest control features">
              {RESIDENTIAL.map((item) => (
                <li key={item} className="rc-card__list-item">
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn btn-primary rc-card__cta" aria-label="Book residential pest control">
              Book Home Inspection
            </Link>
          </motion.div>

          {/* Commercial */}
          <motion.div
            className="rc-card rc-card--commercial"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="rc-card__header">
              <div className="rc-card__icon rc-card__icon--gold" aria-hidden="true">
                <Building2 size={28} />
              </div>
              <div>
                <h3 className="rc-card__title">Commercial Pest Control</h3>
                <p className="rc-card__sub">Professional Business Pest Management</p>
              </div>
            </div>
            <p className="rc-card__desc">
              A pest-free environment is critical for business continuity, brand reputation, and regulatory compliance in Bangalore. We provide audit-ready, proactive pest management programs tailored for the hospitality, healthcare, IT, and food processing sectors — ensuring zero operational downtime.
            </p>
            <ul className="rc-card__list" aria-label="Commercial pest control features">
              {COMMERCIAL.map((item) => (
                <li key={item} className="rc-card__list-item">
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn btn-primary rc-card__cta" aria-label="Book commercial pest control">
              Book Business Inspection
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
