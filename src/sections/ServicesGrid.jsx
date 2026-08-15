'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import './ServicesGrid.css'

const SERVICES = [
  {
    emoji: '🪵',
    image: '/images/pests/termite.png',
    title: 'Termite Pest Control',
    tagline: 'Drill-Fill-Seal Subterranean Protection',
    desc: 'CIB-registered termiticide barrier treatments using the industry-standard Drill-Fill-Seal method. Protects foundations and wood for up to 5 years.',
    to: '/termite-treatment',
    tag: 'CIB Certified',
  },
  {
    emoji: '🛏️',
    image: '/images/pests/bedbug.png',
    title: 'Bed Bugs Pest Control',
    tagline: 'Dual Odorless Mist & Residual Defense',
    desc: 'CIB-approved odorless knockdown spray combined with targeted residual insecticide. Kills eggs, nymphs, and adult bed bugs — no strong odors, same-day re-entry.',
    to: '/bed-bugs-treatment',
    tag: 'Odorless / Safe',
  },
  {
    emoji: '🪳',
    image: '/images/pests/cockroach.png',
    title: 'Cockroach Pest Control',
    tagline: 'Fipronil Gel Baiting Cascade',
    desc: 'Integrated Pest Management (IPM) using Bayer Maxforce gel baits and residual sprays. Odorless elimination of colonies within 24-72 hours.',
    to: '/cockroach-treatment',
    tag: 'Odorless / Safe',
  },
  {
    emoji: '🐀',
    image: '/images/pests/rodent.png',
    title: 'Rodent Pest Control',
    tagline: 'Integrated Rodent Management (IRM)',
    desc: 'Humane trapping, tamper-resistant bait stations, and physical exclusion (gap sealing) to permanently eliminate rat and mouse intrusions.',
    to: '/rodent-treatment',
    tag: 'Exclusion + Trapping',
  },
  {
    emoji: '🦟',
    image: '/images/pests/mosquito.png',
    title: 'Mosquito Pest Control',
    tagline: 'Dengue & Malaria Vector Control',
    desc: 'WHO-recommended dual approach: Bti larvicidal treatment for breeding sites and ULV cold fogging for adult mosquito population control.',
    to: '/mosquito-treatment',
    tag: 'Indoor & Outdoor',
  },
  {
    emoji: '🐝',
    image: '/images/pests/honey_bee.png',
    title: 'Honey Bee Relocation',
    tagline: 'Safe & Ethical Hive Removal',
    desc: 'Professional beekeeper-grade removal of hives from walls, trees, and rooftops. We prioritize safe relocation of these essential pollinators.',
    to: '/honey-bee-treatment',
    tag: 'Eco-Conscious',
  },
  {
    emoji: '🦗',
    image: '/images/pests/tick.png',
    title: 'Ticks & Fleas Pest Control',
    tagline: '3-Stage Lifecycle Disruption',
    desc: 'Targeted application of Insect Growth Regulators (IGRs) and adulticides to break the breeding cycle. Safe for indoor pet environments.',
    to: '/ticks-fleas-treatment',
    tag: 'Pet & Child Safe',
  },
  {
    emoji: '🪲',
    image: '/images/pests/wood_borer.png',
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
            Evidence-based treatments utilizing WHOPES-approved formulations and industry-standard protocols for lasting eradication across Bangalore.
          </p>
        </div>

        <div className="services-grid" role="list">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.to}
              className="service-card"
              role="listitem"
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
                  <Link href={s.to} className="service-card__link" aria-label={`Explore ${s.title} service in Bangalore`}>
                    <span>Explore {s.title}</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                  <a
                    href={`https://wa.me/919845559710?text=Hi%2C%20I%20need%20${encodeURIComponent(s.title)}%20in%20Bangalore.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-card__whatsapp"
                    aria-label={`Get instant quote for ${s.title} on WhatsApp`}
                  >
                    <MessageCircle size={14} aria-hidden="true" />
                    <span>{s.title} Quote</span>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

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
