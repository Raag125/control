import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, Clock, Leaf, Award, Users, BadgeCheck, Zap, HeartHandshake } from 'lucide-react'
import './WhyChooseUs.css'

const REASONS = [
  { icon: Shield,        title: '30+ Years of Trust',       desc: 'Serving Bengaluru since 1993, we bring decades of field expertise to every job.' },
  { icon: Leaf,          title: '100% Eco-Friendly',        desc: 'WHO-approved, child-safe, and pet-friendly chemicals — zero compromise on safety.' },
  { icon: Clock,         title: 'Same-Day Service',         desc: 'Emergency pest control available. We respond fast so you don\'t have to wait.' },
  { icon: BadgeCheck,    title: 'Licensed & Certified',     desc: 'Our team is fully licensed, background-verified, and professionally trained.' },
  { icon: Award,         title: 'Guaranteed Results',       desc: '100% satisfaction guarantee with free follow-up treatment if pests return.' },
  { icon: Users,         title: '15,000+ Happy Clients',    desc: 'Trusted by thousands of homeowners and businesses across Bangalore.' },
  { icon: Zap,           title: 'Advanced Techniques',      desc: 'We use the latest tools and scientifically-proven methods for lasting results.' },
  { icon: HeartHandshake,'title': 'No Hidden Charges',      desc: 'Transparent pricing with detailed quotes — what we quote is what you pay.' },
]

const cardVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function WhyChooseUs() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="why-section section" aria-labelledby="why-heading" ref={ref}>
      <div className="why-section__bg" aria-hidden="true" />
      <div className="container">
        <div className="section-header">
          <div className="eyebrow" aria-hidden="true">🏆 Why Choose Us</div>
          <h2 id="why-heading" className="display-lg">
            Bangalore Trusts <span className="gradient-text">A to Z</span>
          </h2>
          <p>
            We're not just pest controllers — we're your long-term home protection partners.
            Here's what sets us apart from the rest.
          </p>
        </div>

        <div className="why-grid">
          {REASONS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              className="why-card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              aria-label={`${title}: ${desc}`}
            >
              <div className="why-card__icon" aria-hidden="true">
                <Icon size={22} />
              </div>
              <h3 className="why-card__title">{title}</h3>
              <p className="why-card__desc">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
