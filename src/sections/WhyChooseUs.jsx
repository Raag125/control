'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, Clock, Leaf, Award, Users, BadgeCheck, Zap, HeartHandshake } from 'lucide-react'
import './WhyChooseUs.css'

const REASONS = [
  { icon: Shield,        title: '30+ Years of Expertise',     desc: 'Established in 1993, A to Z Pest Solutions is one of Bangalore\'s oldest and most trusted pest management companies — with over 18,000 properties protected.' },
  { icon: Leaf,          title: 'Eco-Friendly & Safe Only',   desc: 'We exclusively use certified, low-toxicity, and odorless formulations — ensuring maximum safety for children, pets, and pregnant women.' },
  { icon: Clock,         title: '60-Min Emergency Dispatch',   desc: 'Our rapid-response fleet covers all Bangalore zones — Whitefield to Jayanagar, Marathahalli to Rajajinagar. Emergency treatments dispatched within 60 minutes of your call.' },
  { icon: BadgeCheck,    title: 'Certified Expert Technicians', desc: 'Every technician undergoes rigorous professional field training (200+ hours) and is background-verified before deployment.' },
  { icon: Award,         title: 'Service Completion Assurance', desc: 'We stand behind every treatment with free follow-up visits if pests return. Our service completion certificate ensures your peace of mind at zero extra cost.' },
  { icon: Users,         title: '18,000+ Protected Homes',     desc: 'From individual studio apartments to 5-star hotels and leading restaurant chains — over 18,000 Bangalore properties trust A to Z for their pest management needs.' },
  { icon: Zap,           title: 'Science-Backed IPM Approach', desc: 'We follow the Integrated Pest Management (IPM) protocol — using biological, physical, and chemical controls in the right combination for maximum efficacy with minimum chemical use.' },
  { icon: HeartHandshake, title: 'Zero Hidden Charges',        desc: 'Every quote is itemized and fixed. No post-treatment surprise additions. What we quote after the free inspection is exactly what you pay — fixed in writing.' },
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
            Why 50,000+ Bengaluru Families Choose <span className="gradient-text">A to Z pest Solutions</span>
          </h2>
          <p>
            Effective pest control requires experience, the right approach, and reliable service. With 30+ years of experience, trained professionals, customer-focused treatments, and warranty-backed support, A to Z Pest Solutions provides dependable pest protection across Bengaluru.
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
              <strong className="why-card__title">{title}</strong>
              <p className="why-card__desc">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
