'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MessageCircle } from 'lucide-react'
import './ServicesGrid.css'

const SERVICES = [
  {
    emoji: '🪵',
    image: '/images/pests/termite.webp',
    title: 'Termite Pest Control',
    tagline: 'Drill-Fill-Seal Subterranean Protection',
    desc: 'Advanced termiticide barrier treatments using the industry-standard Drill-Fill-Seal method. Protects foundations and wood for up to 5 years.',
    to: '/termite-treatment',
    tag: '5-Yr Warranty',
  },
  {
    emoji: '🛏️',
    image: '/images/pests/bedbug.webp',
    title: 'Bed Bugs Pest Control',
    tagline: 'Dual Odorless Mist & Residual Defense',
    desc: 'Certified odorless knockdown spray combined with targeted residual insecticide. Kills eggs, nymphs, and adult bed bugs — no strong odors, same-day re-entry.',
    to: '/bed-bugs-treatment',
    tag: 'Odorless / Safe',
  },
  {
    emoji: '🪳',
    image: '/images/pests/cockroach.webp',
    title: 'Cockroach Pest Control',
    tagline: 'Fipronil Gel Baiting Cascade',
    desc: 'Integrated Pest Management (IPM) using Bayer Maxforce gel baits and residual sprays. Odorless elimination of colonies within 24-72 hours.',
    to: '/cockroach-treatment',
    tag: 'Odorless / Safe',
  },
  {
    emoji: '🐀',
    image: '/images/pests/rodent.webp',
    title: 'Rodent Pest Control',
    tagline: 'Integrated Rodent Management (IRM)',
    desc: 'Humane trapping, tamper-resistant bait stations, and physical exclusion (gap sealing) to permanently eliminate rat and mouse intrusions.',
    to: '/rodent-treatment',
    tag: 'Exclusion + Trapping',
  },
  {
    emoji: '🦟',
    image: '/images/pests/mosquito.webp',
    title: 'Mosquito Pest Control',
    tagline: 'Dengue & Malaria Vector Control',
    desc: 'Proven dual approach: Bti larvicidal treatment for breeding sites and ULV cold fogging for adult mosquito population control.',
    to: '/mosquito-treatment',
    tag: 'Indoor & Outdoor',
  },
  {
    emoji: '🐝',
    image: '/images/pests/honey_bee.webp',
    title: 'Honey Bee Relocation',
    tagline: 'Safe & Ethical Hive Removal',
    desc: 'Professional beekeeper-grade removal of hives from walls, trees, and rooftops. We prioritize safe relocation of these essential pollinators.',
    to: '/honey-bee-treatment',
    tag: 'Eco-Conscious',
  },
  {
    emoji: '🦗',
    image: '/images/pests/tick.webp',
    title: 'Ticks & Fleas Pest Control',
    tagline: '3-Stage Lifecycle Disruption',
    desc: 'Targeted application of Insect Growth Regulators (IGRs) and adulticides to break the breeding cycle. Safe for indoor pet environments.',
    to: '/ticks-fleas-treatment',
    tag: 'Pet & Child Safe',
  },
  {
    emoji: '🪲',
    image: '/images/pests/wood_borer.webp',
    title: 'Wood Borer Pest Control',
    tagline: 'Deep Injection & Borate Preservation',
    desc: 'Precision insecticide injection directly into flight holes combined with borate surface treatments. Preserves antique and structural timber.',
    to: '/wood-borer-treatment',
    tag: 'Preserves Furniture',
  },
]

const cardVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function ServicesGrid() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section className="services-section section" aria-labelledby="services-heading" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow" aria-hidden="true">⚡ Targeted Solutions</div>
          <h2 id="services-heading" className="display-lg">
            Specialized Pest <span className="gradient-text">Management Services</span>
          </h2>
          <p>
            Evidence-based treatments utilizing certified eco-safe formulations and industry-standard protocols for lasting eradication across Bangalore.
          </p>
        </div>

        <ul className="services-grid" aria-label="Our pest control services">
          {SERVICES.map((s, i) => (
            <motion.li
              key={s.to}
              className="service-card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              aria-label={`${s.title}: ${s.tagline}`}
            >
              {/* Realistic Pest Image Thumbnail */}
              <div className="service-card__media">
                <img 
                  src={s.image} 
                  alt={s.title} 
                  className="service-card__img" 
                  loading="lazy"
                  decoding="async"
                />
                {s.tag && (
                  <span className="service-card__badge">{s.tag}</span>
                )}
              </div>

              <div className="service-card__body">
                <div className="service-card__head">
                  <span className="service-card__emoji" aria-hidden="true">{s.emoji}</span>
                  <strong className="service-card__title">{s.title}</strong>
                </div>
                <p className="service-card__tagline">{s.tagline}</p>
                <p className="service-card__desc">{s.desc}</p>
                
                <div className="service-card__actions">
                  <Link href={s.to} className="service-card__link" aria-label={`Learn more about ${s.title} in Bangalore`}>
                    <span>Learn More</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                  <a
                    href={`https://wa.me/919845559710?text=Hi%2C%20I%20need%20${encodeURIComponent(s.title)}%20in%20Bangalore.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-card__whatsapp"
                    aria-label={`Chat on WhatsApp about ${s.title}`}
                    title={`Chat on WhatsApp about ${s.title}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      width="18"
                      height="18"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M16 0C7.164 0 0 7.163 0 16c0 2.824.736 5.472 2.027 7.772L0 32l8.46-2.007A15.934 15.934 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.09 22.09c-.34.96-2 1.84-2.74 1.96-.72.12-1.64.17-2.64-.16a24.32 24.32 0 01-2.39-.88c-4.19-1.8-6.93-6.01-7.14-6.29-.21-.28-1.71-2.28-1.71-4.35 0-2.07 1.08-3.09 1.46-3.51.38-.42.82-.52 1.1-.52.27 0 .54.003.78.014.25.012.59-.095.92.7.34.82 1.16 2.84 1.26 3.04.1.2.17.44.03.7-.14.26-.21.42-.41.65-.2.23-.42.51-.6.69-.2.2-.41.41-.18.8.24.4 1.06 1.74 2.28 2.82 1.57 1.39 2.89 1.82 3.3 2.02.41.2.65.17.89-.1.24-.27 1.03-1.2 1.3-1.61.28-.41.55-.34.92-.2.37.14 2.37 1.12 2.78 1.32.41.2.68.3.78.47.1.17.1 1.02-.23 1.96z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.div
          className="services-section__footer"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <Link href="/services" className="btn btn-outline" aria-label="View all pest control services">
            View All 8 Services <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
