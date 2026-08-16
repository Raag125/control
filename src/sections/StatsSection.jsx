'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './StatsSection.css'

const STATS = [
  { value: '30+',   label: 'Years of Expertise',        desc: 'Established in 1993 — Bangalore\'s trusted name in pest control' },
  { value: '18K+',  label: 'Properties Protected',      desc: 'Homes, offices & commercial spaces across Bengaluru' },
  { value: '12',    label: 'Specialized Services',      desc: 'Covering every common pest found in Bangalore' },
  { value: '4.9★',  label: 'Average Rating',            desc: 'Verified by Google & JustDial customer reviews' },
  { value: '60 Min', label: 'Emergency Response',       desc: 'Same-day dispatch across all Bangalore zones' },
  { value: '100%',  label: 'Safe & Certified Chemicals', desc: 'Eco-friendly, child-safe & pet-friendly formulas only' },
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
