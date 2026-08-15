'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Search, CheckSquare, CalendarCheck, Sparkles } from 'lucide-react'
import './HowItWorks.css'

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Instant Booking',
    desc: 'Call 9845559710 or message on WhatsApp. Describe your pest issue, and we\'ll schedule a certified technician to your Bangalore location — often within 60 minutes.',
  },
  {
    icon: CheckSquare,
    step: '02',
    title: 'Detailed Inspection',
    desc: 'Our PCAI-trained expert conducts a thorough site survey to identify the pest species, locate breeding sources, and assess infestation severity. We provide a transparent, fixed quote.',
  },
  {
    icon: CalendarCheck,
    step: '03',
    title: 'Targeted Treatment',
    desc: 'We execute the treatment using CIB & WHO-approved formulations. Whether it\'s Drill-Fill-Seal for termites or Gel Baiting for cockroaches, we use the precise scientific method required.',
  },
  {
    icon: Sparkles,
    step: '04',
    title: 'Complete Protection',
    desc: 'We issue an official service completion certificate. If pests return, we revisit and re-treat the affected area completely free of charge.',
  },
]

export default function HowItWorks() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="how-section section" aria-labelledby="how-heading" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow" aria-hidden="true">⚙️ How It Works</div>
          <h2 id="how-heading" className="display-lg">
            Simple 4-Step <span className="gradient-text">Process</span>
          </h2>
          <p>From first call to pest-free living — our streamlined process makes it effortless.</p>
        </div>

        <div className="how-steps" ref={ref}>
          {STEPS.map(({ icon: Icon, step, title, desc }, i) => (
            <motion.div
              key={step}
              className="how-step"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.15 }}
              aria-label={`Step ${step}: ${title}`}
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="how-step__connector" aria-hidden="true">
                  <motion.div
                    className="how-step__connector-fill"
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.15 + 0.4 }}
                  />
                </div>
              )}

              <div className="how-step__number" aria-hidden="true">{step}</div>

              <div className="how-step__icon-wrap" aria-hidden="true">
                <Icon size={26} />
              </div>

              <div className="how-step__content">
                <strong className="how-step__title">{title}</strong>
                <p className="how-step__desc">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
