import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Search, CheckSquare, CalendarCheck, Sparkles } from 'lucide-react'
import './HowItWorks.css'

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Find Us & Book',
    desc: 'Search for "Pest Control Bangalore", call us on 9845559710, or book instantly on WhatsApp. Tell us your pest problem and location.',
  },
  {
    icon: CheckSquare,
    step: '02',
    title: 'Free Inspection',
    desc: 'Our expert technician visits your property, identifies the infestation type and severity, and recommends the best treatment plan.',
  },
  {
    icon: CalendarCheck,
    step: '03',
    title: 'Treatment Day',
    desc: 'Our certified team arrives on time with professional equipment and applies targeted, eco-friendly treatments to eliminate pests.',
  },
  {
    icon: Sparkles,
    step: '04',
    title: 'Pest-Free Guarantee',
    desc: 'Enjoy your pest-free space! We follow up to ensure complete results. If pests return within the warranty period, we retreat for FREE.',
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
                <h3 className="how-step__title">{title}</h3>
                <p className="how-step__desc">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
