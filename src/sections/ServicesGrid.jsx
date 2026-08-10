import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import './ServicesGrid.css'

const SERVICES = [
  {
    emoji: '🪵',
    image: '/images/pests/termite.png',
    title: 'Termite Treatment',
    tagline: 'Stop Costly Structural Damage',
    desc: 'Advanced anti-termite drill-fill-seal soil treatment and timber impregnations for complete subterranean termite eradication.',
    to: '/termite-treatment',
    tag: '5-Year Warranty',
  },
  {
    emoji: '🛏️',
    image: '/images/pests/bedbug.png',
    title: 'Bed Bugs Treatment',
    tagline: 'Deep Steam & Chemical Defense',
    desc: 'Targeted high-heat steaming and dual-stage micro-chemical mist to destroy bed bugs and their eggs from mattresses and furniture.',
    to: '/bed-bugs-treatment',
    tag: '100% Guaranteed',
  },
  {
    emoji: '🪳',
    image: '/images/pests/cockroach.png',
    title: 'Cockroach Treatment',
    tagline: 'Odorless Gel Baiting System',
    desc: 'Bayer Maxforce gel-baiting and crevice spray that targets cockroach nests in kitchens and bathrooms with zero smell.',
    to: '/cockroach-treatment',
    tag: 'Most Popular',
  },
  {
    emoji: '🐀',
    image: '/images/pests/rodent.png',
    title: 'Rodent Treatment',
    tagline: 'Humane Trapping & Exclusion',
    desc: 'Smart multi-catch bait stations and entry point sealing to eliminate rats and mice while keeping pets safe.',
    to: '/rodent-treatment',
    tag: 'Fast Removal',
  },
  {
    emoji: '🦟',
    image: '/images/pests/mosquito.png',
    title: 'Mosquito Treatment',
    tagline: 'Fogging & Larvicide Protection',
    desc: 'Thermal outdoor fogging and eco larvicidal surface mist to protect your family from dengue and malaria risks.',
    to: '/mosquito-treatment',
    tag: 'Outdoor & Indoor',
  },
  {
    emoji: '🐝',
    image: '/images/pests/termite.png', // Fallback or eco relocator
    title: 'Honey Bee Relocation',
    tagline: 'Ethical Hive Removal',
    desc: 'Safe, eco-conscious honey bee removal and hive relocation without harming these vital pollinators.',
    to: '/honey-bee-treatment',
    tag: 'Eco-Friendly',
  },
  {
    emoji: '🦗',
    image: '/images/pests/bedbug.png',
    title: 'Ticks & Fleas Treatment',
    tagline: 'Family & Pet Safe Formulations',
    desc: 'Specialized herbal and WHO-approved pet-safe treatments that eradicate ticks and fleas from carpets and corners.',
    to: '/ticks-fleas-treatment',
    tag: 'Pet Safe',
  },
  {
    emoji: '🪲',
    image: '/images/pests/termite.png',
    title: 'Wood Borer Treatment',
    tagline: 'Preserve Wooden Furniture',
    desc: 'Specialized chemical injection and surface coats to eradicate powder post beetles and wood borers permanently.',
    to: '/wood-borer-treatment',
    tag: 'Long Lasting',
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
            Specialized Pest <span className="gradient-text">Extermination Services</span>
          </h2>
          <p>
            Certified, science-backed treatments using authentic WHO-approved formulations across all areas in Bangalore.
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
                  <h3 className="service-card__title">{s.title}</h3>
                </div>
                <p className="service-card__tagline">{s.tagline}</p>
                <p className="service-card__desc">{s.desc}</p>
                
                <div className="service-card__actions">
                  <Link to={s.to} className="service-card__link" aria-label={`Learn more about ${s.title}`}>
                    <span>Treatment Details</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                  <a
                    href={`https://wa.me/919845559710?text=Hi%2C%20I%20need%20${encodeURIComponent(s.title)}%20in%20Bangalore.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-card__whatsapp"
                    aria-label={`Chat on WhatsApp about ${s.title}`}
                  >
                    <MessageCircle size={14} aria-hidden="true" />
                    <span>Quick Quote</span>
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
          <Link to="/services" className="btn btn-outline" aria-label="View all pest control services">
            View All 8 Services <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
