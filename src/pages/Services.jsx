import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import CTABanner from '../sections/CTABanner'
import './PageStyles.css'

const SERVICES = [
  { emoji: '🪵', title: 'Termite Treatment',       sub: 'Stop Costly Termite Damage',     to: '/termite-treatment' },
  { emoji: '🛏️', title: 'Bed Bugs Treatment',      sub: 'Sleep Peacefully Again',          to: '/bed-bugs-treatment' },
  { emoji: '🪳', title: 'Cockroach Treatment',      sub: 'Enjoy a Roach-Free Home',         to: '/cockroach-treatment' },
  { emoji: '🐀', title: 'Rodent Treatment',         sub: 'Safe & Effective Rodent Control', to: '/rodent-treatment' },
  { emoji: '🦟', title: 'Mosquito Treatment',       sub: 'Bite-Free Outdoor Living',        to: '/mosquito-treatment' },
  { emoji: '🐝', title: 'Honey Bee Treatment',      sub: 'Safe Bee Relocation Services',    to: '/honey-bee-treatment' },
  { emoji: '🦗', title: 'Ticks & Fleas Treatment',  sub: 'Protect Your Family & Pets',      to: '/ticks-fleas-treatment' },
  { emoji: '🪲', title: 'Wood Borer Treatment',     sub: 'Preserve Your Wooden Assets',     to: '/wood-borer-treatment' },
]

export default function Services() {
  return (
    <>
      <Helmet>
        <title>All Pest Control Services in Bangalore | A to Z Pest Solutions</title>
        <meta name="description" content="Complete pest control services in Bangalore — termite, bed bugs, cockroach, rodent, mosquito, honey bee, ticks & fleas, wood borer. Eco-friendly and guaranteed." />
        <link rel="canonical" href="https://pestcontrolbengaluru.in/services" />
      </Helmet>
      <div className="page-enter">
        <section className="page-hero" aria-label="Services page header">
          <div className="page-hero__bg" aria-hidden="true" />
          <div className="container page-hero__content">
            <div className="eyebrow">⚡ Our Services</div>
            <h1 className="display-xl">All Pest Control <span className="gradient-text">Services</span></h1>
            <p className="body-lg text-muted" style={{ maxWidth: 560, margin: '1rem auto 0' }}>
              Comprehensive, eco-friendly pest management solutions for every home and business need in Bengaluru.
            </p>
          </div>
        </section>
        <section className="section" aria-labelledby="all-services-heading">
          <div className="container">
            <h2 id="all-services-heading" className="sr-only">All Services List</h2>
            <div className="services-all-grid">
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.to}
                  className="card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
                >
                  <div style={{ fontSize: '2.8rem' }} aria-hidden="true">{s.emoji}</div>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--clr-text)' }}>{s.title}</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--clr-primary)', fontWeight: 600 }}>{s.sub}</p>
                  <Link
                    to={s.to}
                    className="btn btn-outline"
                    style={{ marginTop: 'auto', justifyContent: 'center', fontSize: '0.82rem', padding: '0.65rem 1rem' }}
                    aria-label={`Learn more about ${s.title}`}
                  >
                    Learn More <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <CTABanner />
      </div>
    </>
  )
}
