'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Bug } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import CTABanner from '../sections/CTABanner'
import './PageStyles.css'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = [
  {
    id: 'our-services',
    title: 'Our Services',
    description: 'Targeted pest elimination and comprehensive defense for common household & outdoor pests.',
    icon: <Bug className="text-primary" size={24} />,
    services: [
      { image: '/images/pests/cockroach.webp', title: 'Cockroach Pest Control', sub: 'Odorless Gel Baiting & Eradication', to: '/cockroach-treatment' },
      { image: '/images/pests/bed_bug.webp', title: 'Bed Bug Pest Control', sub: 'Dual Mist & Residual Elimination', to: '/bed-bugs-treatment' },
      { image: '/images/pests/termite.webp', title: 'Termite Pest Control', sub: 'Drill-Fill-Seal 5-Year Protection', to: '/termite-treatment' },
      { image: '/images/pests/rodent.webp', title: 'Rodent Pest Control', sub: 'Trapping, Baiting & Total Exclusion', to: '/rodent-treatment' },
      { image: '/images/pests/mosquito.webp', title: 'Mosquito Pest Control', sub: 'Larvicidal & Cold Fogging Vector Control', to: '/mosquito-treatment' },
      { image: '/images/pests/honey_bee.webp', title: 'Honey Bee Pest Control', sub: 'Ethical Hive Removal & Relocation', to: '/honey-bee-treatment' },
      { image: '/images/pests/ant.webp', title: 'Ant Pest Control', sub: 'Colony Elimination & Defense', to: '/ant-pest-control' },
      { image: '/images/pests/flea.webp', title: 'Flea Pest Control', sub: 'Pet-Safe Lifecycle Disruption', to: '/flea-pest-control' },
      { image: '/images/pests/tick.webp', title: 'Tick Pest Control', sub: 'Complete Indoor & Garden Treatment', to: '/tick-pest-control' },
      { image: '/images/pests/wood_borer.webp', title: 'Wood Borer Pest Control', sub: 'Deep Injection & Borate Preservation', to: '/wood-borer-treatment' },
      { image: '/images/pests/general.webp', title: 'General Pest Control', sub: 'Comprehensive Multi-Pest Protection', to: '/general-pest-control' },
    ]
  },
  {
    id: 'specialized',
    title: 'Specialized Services',
    description: 'Advanced structural protection, pre/post construction barriers, and dedicated premises management.',
    icon: <ShieldCheck className="text-primary" size={24} />,
    services: [
      { image: '/images/pests/pre_construction.webp', title: 'Pre-Construction Termite', sub: 'Preventive Soil Barrier for New Builds', to: '/pre-construction-termite-treatment' },
      { image: '/images/pests/post_construction.webp', title: 'Post-Construction Termite', sub: 'Drill-Fill-Seal Structural Treatment', to: '/post-construction-termite-treatment' },
      { image: '/images/pests/residential.webp', title: 'Residential Pest Control', sub: 'Complete Eco-Friendly Home Defense', to: '/residential-pest-control' },
      { image: '/images/pests/commercial.webp', title: 'Commercial Pest Control', sub: 'Audit-Ready Business Pest Management', to: '/commercial-pest-control' },
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
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--clr-border)', paddingBottom: '1rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--clr-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {category.icon}
                    </div>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--clr-text)', margin: 0 }}>
                        {category.title}
                      </h2>
                      {category.description && (
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--clr-text-muted)' }}>
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', background: 'var(--clr-accent-light)', color: 'var(--clr-primary)' }}>
                    {category.services.length} Services
                  </span>
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
                        <strong style={{ fontWeight: 800, color: 'var(--clr-text)' }}>
                          {s.title}
                        </strong>
                        <p style={{ color: 'var(--clr-primary)', fontWeight: 600, letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
                          {s.sub}
                        </p>
                        <Link
                          href={s.to}
                          className="btn btn-outline"
                          style={{ marginTop: 'auto', justifyContent: 'center', padding: '0.75rem 1rem', width: '100%', borderWidth: '1.5px' }}
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
