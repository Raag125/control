import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Home, Building2, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import './ResidentialCommercial.css'

const RESIDENTIAL = [
  'Complete protection against all household pests',
  'Child-safe and pet-friendly formulations',
  'Termite, bed bug, cockroach, mosquito control',
  'Flexible scheduling including evenings & weekends',
  'Discreet, uniformed professional technicians',
  'Guaranteed follow-up service included',
]

const COMMERCIAL = [
  'Compliance with FSSAI and health department norms',
  'Pest control for offices, hotels & restaurants',
  'Hospital-grade, odorless treatment options',
  'Preventive maintenance contracts available',
  'Minimal disruption to business operations',
  'Detailed service reports and documentation',
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
              At A to Z Pest Solutions, we understand the importance of a pest-free home. Our residential
              services are designed to provide complete protection for your family against all household
              pests — using advanced, eco-friendly techniques for lasting results.
            </p>
            <ul className="rc-card__list" aria-label="Residential pest control features">
              {RESIDENTIAL.map((item) => (
                <li key={item} className="rc-card__list-item">
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn btn-primary rc-card__cta" aria-label="Book residential pest control">
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
              A pest-free commercial environment in Bangalore is essential for your business reputation,
              employee safety, and customer satisfaction. Our expert services protect offices, hotels,
              restaurants, warehouses, hospitals, and retail spaces from all pest infestations.
            </p>
            <ul className="rc-card__list" aria-label="Commercial pest control features">
              {COMMERCIAL.map((item) => (
                <li key={item} className="rc-card__list-item">
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn btn-primary rc-card__cta" aria-label="Book commercial pest control">
              Book Business Inspection
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
