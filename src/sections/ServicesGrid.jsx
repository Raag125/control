'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { ArrowRight, Bug, ShieldCheck, Layers } from 'lucide-react'
import './ServicesGrid.css'

const ALL_SERVICES = [
  // ── Our Services (11) ──
  {
    category: 'Our Services',
    emoji: '🪳',
    image: '/images/pests/cockroach.webp',
    title: 'Cockroach Pest Control',
    tagline: 'Fipronil Gel Baiting Cascade',
    desc: 'Integrated Pest Management (IPM) using odorless gel baits & residual sprays. 100% elimination within 24-72 hours.',
    to: '/cockroach-treatment',
    tag: 'Odorless / Safe',
  },
  {
    category: 'Our Services',
    emoji: '🛏️',
    image: '/images/pests/bed_bug.webp',
    title: 'Bed Bug Pest Control',
    tagline: 'Dual Odorless Mist & Residual Defense',
    desc: 'Targeted knockdown mist combined with residual defense. Eradicates eggs, nymphs, and adults with same-day re-entry.',
    to: '/bed-bugs-treatment',
    tag: 'Odorless / Safe',
  },
  {
    category: 'Our Services',
    emoji: '🪵',
    image: '/images/pests/termite.webp',
    title: 'Termite Pest Control',
    tagline: 'Drill-Fill-Seal Subterranean Protection',
    desc: 'Advanced termiticide barrier treatments using the industry-standard DFS method. Protects timber & foundations for up to 5 years.',
    to: '/termite-treatment',
    tag: '5-Yr Warranty',
  },
  {
    category: 'Our Services',
    emoji: '🐀',
    image: '/images/pests/rodent.webp',
    title: 'Rodent Pest Control',
    tagline: 'Integrated Rodent Management (IRM)',
    desc: 'Tamper-proof bait stations, humane trapping, and structural entry-point sealing to permanently keep rats and mice out.',
    to: '/rodent-treatment',
    tag: 'Exclusion + Trapping',
  },
  {
    category: 'Our Services',
    emoji: '🦟',
    image: '/images/pests/mosquito.webp',
    title: 'Mosquito Pest Control',
    tagline: 'Dengue & Malaria Vector Control',
    desc: 'Bti larvicidal breeding-site treatment combined with ULV cold fogging for rapid indoor and outdoor knockdown.',
    to: '/mosquito-treatment',
    tag: 'Indoor & Outdoor',
  },
  {
    category: 'Our Services',
    emoji: '🐝',
    image: '/images/pests/honey_bee.webp',
    title: 'Honey Bee Pest Control',
    tagline: 'Ethical Hive Removal & Relocation',
    desc: 'Beekeeper-grade safe removal of honey bee hives from walls and balconies, preserving vital pollinators responsibly.',
    to: '/honey-bee-treatment',
    tag: 'Eco-Conscious',
  },
  {
    category: 'Our Services',
    emoji: '🐜',
    image: '/images/pests/ant.webp',
    title: 'Ant Pest Control',
    tagline: 'Colony Elimination & Defense',
    desc: 'Targeted slow-acting gel baits that worker ants carry to the queen, destroying subterranean and indoor nests permanently.',
    to: '/ant-pest-control',
    tag: 'Colony Eradication',
  },
  {
    category: 'Our Services',
    emoji: '🦗',
    image: '/images/pests/flea.webp',
    title: 'Flea Pest Control',
    tagline: 'Pet-Safe Lifecycle Disruption',
    desc: 'Specialized Insect Growth Regulators (IGRs) that break the flea breeding cycle in carpets, pet bedding, and upholstery.',
    to: '/flea-pest-control',
    tag: 'Pet & Child Safe',
  },
  {
    category: 'Our Services',
    emoji: '🕷️',
    image: '/images/pests/tick.webp',
    title: 'Tick Pest Control',
    tagline: 'Complete Indoor & Garden Defense',
    desc: 'Full-property residual spray targeting tick hiding spots in lawns, baseboards, and pet areas to prevent Lyme and tick fevers.',
    to: '/tick-pest-control',
    tag: 'Lawn & Indoor',
  },
  {
    category: 'Our Services',
    emoji: '🪲',
    image: '/images/pests/wood_borer.webp',
    title: 'Wood Borer Pest Control',
    tagline: 'Deep Injection & Borate Preservation',
    desc: 'Precision chemical syringe injection into pinholes with borate wood preservation to safeguard expensive wooden furniture.',
    to: '/wood-borer-treatment',
    tag: 'Preserves Furniture',
  },
  {
    category: 'Our Services',
    emoji: '🛡️',
    image: '/images/pests/general.webp',
    title: 'General Pest Control',
    tagline: 'Comprehensive Multi-Pest Defense',
    desc: 'All-in-one routine shield protecting your home or office against cockroaches, ants, spiders, silverfish, and seasonal pests.',
    to: '/general-pest-control',
    tag: 'All-In-One Protection',
  },

  // ── Specialized Services (4) ──
  {
    category: 'Specialized Services',
    emoji: '🏗️',
    image: '/images/pests/pre_construction.webp',
    title: 'Pre-Construction Termite',
    tagline: '5-Stage Soil Barrier Treatment',
    desc: 'Comprehensive anti-termite chemical barrier treated at foundation trenches, masonry walls, and floor beds before construction.',
    to: '/pre-construction-termite-treatment',
    tag: '10-Yr Warranty',
  },
  {
    category: 'Specialized Services',
    emoji: '🏠',
    image: '/images/pests/post_construction.webp',
    title: 'Post-Construction Termite',
    tagline: 'Drill-Fill-Seal Structural Treatment',
    desc: 'Precision drilling along perimeter walls and skirting, pressurized termiticide injection, and color-matched sealing.',
    to: '/post-construction-termite-treatment',
    tag: '5-Yr Warranty',
  },
  {
    category: 'Specialized Services',
    emoji: '🏡',
    image: '/images/pests/residential.webp',
    title: 'Residential Pest Control',
    tagline: 'Complete Eco-Friendly Home Defense',
    desc: 'Customized pest management plans for flats, villas, and independent houses with odorless, child & pet-safe formulations.',
    to: '/residential-pest-control',
    tag: 'Family Safe',
  },
  {
    category: 'Specialized Services',
    emoji: '🏢',
    image: '/images/pests/commercial.webp',
    title: 'Commercial Pest Control',
    tagline: 'Audit-Ready Business Pest Management',
    desc: 'Certified pest compliance and Annual Maintenance Contracts (AMC) for IT parks, restaurants, warehouses, and hospitals.',
    to: '/commercial-pest-control',
    tag: 'AMC & Audit Ready',
  },
]

const TABS = [
  { id: 'all', label: 'All Services', count: 15, icon: Layers },
  { id: 'Our Services', label: 'Our Services', count: 11, icon: Bug },
  { id: 'Specialized Services', label: 'Specialized Services', count: 4, icon: ShieldCheck },
]

export default function ServicesGrid() {
  const [selectedTab, setSelectedTab] = useState('all')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  const filteredServices = selectedTab === 'all' 
    ? ALL_SERVICES 
    : ALL_SERVICES.filter(s => s.category === selectedTab)

  return (
    <section className="services-section section" aria-labelledby="services-heading" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow" aria-hidden="true">⚡ Targeted &amp; Specialized Solutions</div>
          <h2 id="services-heading" className="display-lg">
            Complete Pest <span className="gradient-text">Management Services</span>
          </h2>
          <p>
            Evidence-based treatments utilizing certified eco-safe formulations and industry-standard protocols for lasting eradication across Bangalore.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="services-tabs" role="tablist" aria-label="Filter pest control services by category">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = selectedTab === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedTab(tab.id)}
                className={`services-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{tab.label}</span>
                <span className="services-tab-count">{tab.count}</span>
              </button>
            )
          })}
        </div>

        {/* Services Grid */}
        <motion.ul 
          layout
          className="services-grid" 
          aria-label="Our pest control services"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((s, i) => (
              <motion.li
                layout
                key={s.to}
                className="service-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
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
          </AnimatePresence>
        </motion.ul>

        <motion.div
          className="services-section__footer"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <Link href="/services" className="btn btn-outline" aria-label="View all 15 pest control services">
            Explore All 15 Services &amp; Detailed Pricing <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
