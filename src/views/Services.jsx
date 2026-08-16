'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Bug, Building2 } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import CTABanner from '../sections/CTABanner'
import './PageStyles.css'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = [
  {
    id: 'core',
    title: 'Core & Packages',
    icon: <Building2 className="text-primary" size={24} />,
    services: [
      { image: '/images/pests/residential.webp', title: 'Residential Pest Control', sub: 'Complete Home Protection', to: '/residential-pest-control' },
      { image: '/images/pests/commercial.webp', title: 'Commercial Pest Control', sub: 'Protect Your Business', to: '/commercial-pest-control' },
      { image: '/images/pests/general.webp', title: 'General Pest Control', sub: 'Comprehensive Defense', to: '/general-pest-control' },
    ]
  },
  {
    id: 'termite',
    title: 'Termite Specialists',
    icon: <ShieldCheck className="text-primary" size={24} />,
    services: [
      { image: '/images/pests/termite.webp', title: 'Termite Pest Control', sub: 'Stop Structural Damage', to: '/termite-treatment' },
      { image: '/images/pests/pre_construction.webp', title: 'Pre-Construction Termite', sub: 'Preventive Soil Barrier', to: '/pre-construction-termite-treatment' },
      { image: '/images/pests/post_construction.webp', title: 'Post-Construction Termite', sub: 'Drill-Fill-Seal Eradication', to: '/post-construction-termite-treatment' },
    ]
  },
  {
    id: 'targeted',
    title: 'Targeted Pest Solutions',
    icon: <Bug className="text-primary" size={24} />,
    services: [
      { image: '/images/pests/bed_bug.webp', title: 'Bed Bug Pest Control', sub: 'Sleep Peacefully Again', to: '/bed-bugs-treatment' },
      { image: '/images/pests/cockroach.webp', title: 'Cockroach Pest Control', sub: 'Enjoy a Roach-Free Home', to: '/cockroach-treatment' },
      { image: '/images/pests/ant.webp', title: 'Ant Pest Control', sub: 'Eliminate the Colony', to: '/ant-pest-control' },
      { image: '/images/pests/tick.webp', title: 'Tick Pest Control', sub: 'Protect Pets & Family', to: '/tick-pest-control' },
      { image: '/images/pests/flea.webp', title: 'Flea Pest Control', sub: 'Stop Itchy Bites', to: '/flea-pest-control' },
      { image: '/images/pests/mosquito.webp', title: 'Mosquito Pest Control', sub: 'Bite-Free Outdoors', to: '/mosquito-treatment' },
      { image: '/images/pests/rodent.webp', title: 'Rodent Pest Control', sub: 'Safe Rodent Removal', to: '/rodent-treatment' },
      { image: '/images/pests/wood_borer.webp', title: 'Wood Borer Pest Control', sub: 'Save Wooden Assets', to: '/wood-borer-treatment' },
      { image: '/images/pests/honey_bee.webp', title: 'Honey Bee Pest Control', sub: 'Safe Relocation Services', to: '/honey-bee-treatment' },
    ]
  }
]

export default function Services() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Category Headers scroll animation
      gsap.utils.toArray('.category-header').forEach((header) => {
        gsap.from(header, {
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
          },
          x: -30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        })
      })

      // Services Stagger scroll animation
      gsap.utils.toArray('.services-all-grid').forEach((grid) => {
        const cards = grid.querySelectorAll('.service-card')
        gsap.from(cards, {
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out'
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="page-enter" ref={containerRef}>
        <section className="page-hero" aria-label="Services page header">
          <div className="page-hero__bg" aria-hidden="true" />
          <div className="container page-hero__content">
            <motion.div 
              className="eyebrow"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ⚡ Comprehensive Solutions
            </motion.div>
            <motion.h1 
              className="display-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Expert Pest Control <span className="gradient-text">Services</span>
            </motion.h1>
            <motion.p 
              className="body-lg text-muted" 
              style={{ maxWidth: 600, margin: '1rem auto 0' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              From residential homes to massive commercial complexes, we offer certified, eco-friendly pest management tailored perfectly to your needs.
            </motion.p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: '2rem' }}>
          <div className="container">
            {CATEGORIES.map((category) => (
              <div key={category.id} style={{ marginBottom: '4rem' }}>
                <div 
                  className="category-header"
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--clr-border)', paddingBottom: '1rem' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--clr-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {category.icon}
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--clr-text)' }}>
                    {category.title}
                  </h2>
                </div>

                <div className="services-all-grid">
                  {category.services.map((s) => (
                    <motion.div
                      key={s.to}
                      className="card service-card"
                      style={{ 
                        display: 'flex', flexDirection: 'column', gap: '0',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        position: 'relative', overflow: 'hidden', padding: 0
                      }}
                      whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
                    >
                      <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderBottom: '1px solid var(--clr-border)' }}>
                        <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                        <strong style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--clr-text)' }}>
                          {s.title}
                        </strong>
                        <p style={{ fontSize: '0.85rem', color: 'var(--clr-primary)', fontWeight: 600, letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
                          {s.sub}
                        </p>
                        <Link
                          href={s.to}
                          className="btn btn-outline"
                          style={{ marginTop: 'auto', justifyContent: 'center', fontSize: '0.85rem', padding: '0.75rem 1rem', width: '100%', borderWidth: '1.5px' }}
                          aria-label={`Learn more about ${s.title} in Bangalore`}
                        >
                          Learn More <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <CTABanner />
      </div>
  )
}
