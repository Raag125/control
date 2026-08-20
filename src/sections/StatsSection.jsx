'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './StatsSection.css'

const STATS = [
  { value: '30+',   label: 'Years of Pest Control Experience', desc: 'Trusted pest control since 1993' },
  { value: '18K+',  label: 'Homes & Businesses Protected Across Bengaluru', desc: 'Reliable pest protection for every property' },
  { value: '12+',   label: 'Professional Pest Control Services Available', desc: 'Solutions for common pests and infestations' },
  { value: '4.9★',  label: 'Rated Highly By Our Valued Customers', desc: 'Quality service with customer satisfaction' },
  { value: '60 Min', label: 'Fast 60-Minute Emergency Pest Services', desc: 'Same-day pest control service available' },
  { value: '100%',  label: 'Commitment To Quality Pest Protection', desc: 'Dedicated to effective, reliable service' },
]

export default function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section className="stats-section section" aria-label="Our achievements and statistics" ref={ref}>
      <div className="stats-section__bg" aria-hidden="true" />
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              aria-label={`${s.value} ${s.label}: ${s.desc}`}
            >
              <div className="stat-card__value">{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
              <div className="stat-card__desc">{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
