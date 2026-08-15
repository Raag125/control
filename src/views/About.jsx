'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, Award, Users, Leaf, Clock, HeartHandshake, Phone } from 'lucide-react'
import CTABanner from '../sections/CTABanner'
import './PageStyles.css'
import '../sections/WhyChooseUs.css'

const MILESTONES = [
  { year: '1993', event: 'Founded in Bangalore with a mission for eco-safe pest control' },
  { year: '2000', event: 'Expanded services to commercial properties across Bengaluru' },
  { year: '2008', event: 'Achieved 5,000+ satisfied residential clients milestone' },
  { year: '2015', event: 'ISO certification and introduction of advanced treatment methods' },
  { year: '2020', event: 'Surpassed 12,000 clients — launched same-day service standard' },
  { year: '2024', event: '15,000+ happy clients — Bangalore\'s most trusted pest experts' },
]

const VALUES = [
  { icon: Shield,          title: 'Safety First',    desc: 'Every product we use is WHO-approved, child-safe, and pet-friendly.' },
  { icon: Leaf,            title: 'Eco-Friendly',     desc: 'Committed to sustainable pest control that protects the environment.' },
  { icon: Award,           title: 'Excellence',       desc: 'We never cut corners — every job is done to the highest standard.' },
  { icon: HeartHandshake,  title: 'Integrity',        desc: 'Transparent pricing, honest advice, and zero hidden charges — always.' },
  { icon: Users,           title: 'Customer-First',   desc: 'Your satisfaction is our only metric of success.' },
  { icon: Clock,           title: 'Reliability',      desc: 'We show up on time, every time, no excuses.' },
]

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (

      <div className="page-enter">
        {/* Page Hero */}
        <section className="page-hero" aria-label="About Us page header">
          <div className="page-hero__bg" aria-hidden="true" />
          <div className="container page-hero__content">
            <div className="eyebrow">🏆 About Us</div>
            <h1 className="display-xl">
              Bangalore's Most <span className="gradient-text">Trusted</span> Pest Experts
            </h1>
            <p className="body-lg text-muted" style={{ maxWidth: 620, margin: '1rem auto 0' }}>
              Since 1993, A to Z Pest Solutions has been <strong>Bangalore's most trusted pest experts</strong>, protecting homes and businesses across
              Bengaluru with science-backed, eco-friendly, and completely safe pest control.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="section" aria-labelledby="story-heading">
          <div className="container">
            <div className="about-story">
              <motion.div
                className="about-story__content"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
              >
                <div className="eyebrow">Our Story</div>
                <h2 id="story-heading" className="display-lg">
                  30+ Years of <span className="gradient-text">Protecting</span> Bangalore
                </h2>
                <p className="body-lg text-muted" style={{ marginTop: '1rem' }}>
                  A to Z Pest Solutions was founded in 1993 with a single goal — to give Bangalore's
                  residents and businesses a reliable, trustworthy pest control partner. Over three
                  decades, we've grown from a small local operation into one of the city's most
                  recognized and respected pest management companies.
                </p>
                <p className="body-md text-muted" style={{ marginTop: '1rem' }}>
                  We are a professionally managed company offering the highest quality pest control
                  services for both residential and commercial spaces. With more than a decade of
                  deep field experience, we know exactly what it takes to keep your home and office
                  permanently free from every type of pest found in Bengaluru.
                </p>
                <div className="about-story__stats" aria-label="Key statistics">
                  {[
                    { v: '30+',  l: 'Years Experience' },
                    { v: '15K+', l: 'Happy Clients' },
                    { v: '8',    l: 'Pest Services' },
                    { v: '99%',  l: 'Satisfaction Rate' },
                  ].map(({ v, l }) => (
                    <div key={l} className="about-story__stat" aria-label={`${v} ${l}`}>
                      <span className="stat-number">{v}</span>
                      <span className="body-md text-muted">{l}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="tel:+919845559710"
                  className="btn btn-primary"
                  style={{ marginTop: '1.5rem', width: 'fit-content' }}
                  aria-label="Call A to Z Pest Solutions"
                >
                  <Phone size={16} aria-hidden="true" /> Call Us Today
                </a>
              </motion.div>

              <motion.div
                className="about-story__visual"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.15 }}
                aria-hidden="true"
              >
                <div className="about-visual-card">
                  <div className="about-visual-card__icon">🛡️</div>
                  <div className="about-visual-card__title">A to Z Pest Solutions</div>
                  <div className="about-visual-card__sub">Professionally Run &amp; Managed</div>
                  <div className="about-visual-card__line" />
                  <p>
                    Expert pest control for offices &amp; residences. Having served Bengaluru
                    for over three decades, we know what it takes to keep your space pest-free.
                  </p>
                  <div className="about-visual-card__tags">
                    <span className="badge">ISO Certified</span>
                    <span className="badge">Licensed Team</span>
                    <span className="badge">Eco-Friendly</span>
                    <span className="badge">Since 1993</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="section" aria-labelledby="values-heading">
          <div className="container">
            <div className="section-header">
              <div className="eyebrow">Our Values</div>
              <h2 id="values-heading" className="display-lg">
                What We <span className="gradient-text">Stand For</span>
              </h2>
              <p>The principles that guide every decision we make and every job we deliver.</p>
            </div>
            <div className="why-grid" ref={ref}>
              {VALUES.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  className="why-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  aria-label={`${title}: ${desc}`}
                >
                  <div className="why-card__icon" aria-hidden="true"><Icon size={22} /></div>
                  <h3 className="why-card__title">{title}</h3>
                  <p className="why-card__desc">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section" aria-labelledby="timeline-heading">
          <div className="container">
            <div className="section-header">
              <div className="eyebrow">Our Journey</div>
              <h2 id="timeline-heading" className="display-lg">
                Milestones That <span className="gradient-text">Define Us</span>
              </h2>
            </div>
            <div className="timeline" role="list">
              {MILESTONES.map(({ year, event }, i) => (
                <motion.div
                  key={year}
                  className="timeline-item"
                  role="listitem"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  aria-label={`${year}: ${event}`}
                >
                  <div className="timeline-item__dot" aria-hidden="true" />
                  <div className="timeline-item__year">{year}</div>
                  <div className="timeline-item__event">{event}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTABanner />
      </div>
  )
}
