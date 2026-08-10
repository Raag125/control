import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './StatsSection.css'

const STATS = [
  { value: '30+',   label: 'Years of Experience',      desc: 'Proudly serving Bangalore since 1993' },
  { value: '15K+',  label: 'Happy Customers',           desc: 'Homes & businesses protected' },
  { value: '8',     label: 'Pest Control Services',     desc: 'Complete solutions under one roof' },
  { value: '99%',   label: 'Customer Satisfaction',     desc: 'Rated excellent by our clients' },
  { value: '24/7',  label: 'Emergency Support',         desc: 'Available every day of the year' },
  { value: '100%',  label: 'Eco-Friendly Solutions',    desc: 'Safe for your family & pets' },
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
