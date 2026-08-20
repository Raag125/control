'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Star, 
  ArrowRight,
  AlertTriangle,
  Zap,
  Bug,
  User
} from 'lucide-react'
import './HeroSection.css'

const CATEGORIZED_PESTS = {
  'our-services': [
    {
      id: 'cockroach',
      name: 'Cockroach Pest Control',
      shortName: 'Cockroach',
      image: '/images/pests/cockroach.webp',
      threat: 'A targeted combination of professional spray and gel application to control cockroaches and reach common hiding and breeding areas.',
      threatLevel: 'Medium Risk',
      solution: 'TARGETED COCKROACH CONTROL',
      path: '/cockroach-treatment',
      assurance: 'SPRAY & GEL TREATMENT',
      emoji: '🪳'
    },
    {
      id: 'bedbug',
      name: 'Bed Bug Pest Control',
      shortName: 'Bed Bug',
      image: '/images/pests/bed_bug.webp',
      threat: 'Our odorless bed bug spray service targets bed bugs in mattresses, furniture, and hiding areas for fast and effective treatment.',
      threatLevel: 'High Risk',
      solution: 'ODORLESS BED BUG SPRAY TREATMENT',
      path: '/bed-bugs-treatment',
      assurance: 'KILL BED BUGS IN 30 MINUTES',
      emoji: '🛏️'
    },
    {
      id: 'termite',
      name: 'Termite Pest Control',
      shortName: 'Termite',
      image: '/images/pests/termite.webp',
      threat: 'Professional Drill-Fill-Seal termite treatment designed to protect foundations, walls, and wooden structures from subterranean termites.',
      threatLevel: 'High Risk',
      solution: 'DRILL-FILL-SEAL SUBTERRANEAN TERMITE PROTECTION',
      path: '/termite-treatment',
      assurance: '5-YEAR WARRANTY',
      emoji: '🪵'
    },
    {
      id: 'rodent',
      name: 'Rodent Pest Control',
      shortName: 'Rodents',
      image: '/images/pests/rodent.webp',
      threat: 'Professional rodent treatment designed to control rats and mice, address active infestations, and help prevent their return around your property.',
      threatLevel: 'High Risk',
      solution: 'RODENT CONTROL & PREVENTION',
      path: '/rodent-treatment',
      assurance: 'TARGETED RODENT CONTROL',
      emoji: '🐀'
    },
    {
      id: 'mosquito',
      name: 'Mosquito Pest Control',
      shortName: 'Mosquito',
      image: '/images/pests/mosquito.webp',
      threat: 'Targeted mosquito treatment for homes and commercial spaces, helping reduce mosquito activity and protect your property from recurring infestations.',
      threatLevel: 'Seasonal Alert',
      solution: 'MOSQUITO CONTROL & PREVENTION',
      path: '/mosquito-treatment',
      assurance: 'FAST MOSQUITO CONTROL',
      emoji: '🦟'
    },
    {
      id: 'honeybee',
      name: 'Honey Bee Service',
      shortName: 'Honey Bee',
      image: '/images/pests/honey_bee.webp',
      threat: 'We do not kill honey bees. Our eco-friendly approach focuses on safely relocating colonies while protecting the bees and your property.',
      threatLevel: 'High Risk',
      solution: 'HONEY BEE RESCUE & RELOCATION',
      path: '/honey-bee-treatment',
      assurance: 'ECO-FRIENDLY BEE RELOCATION',
      emoji: '🐝'
    },
    {
      id: 'ant',
      name: 'Ant Pest Control',
      shortName: 'Ants',
      image: '/images/pests/ant.webp',
      threat: 'Professional ant treatment designed to target active infestations, reach common nesting areas, and help prevent ants from returning to your property.',
      threatLevel: 'Medium Risk',
      solution: 'ANT CONTROL & PREVENTION',
      path: '/ant-pest-control',
      assurance: 'TARGETED ANT CONTROL',
      emoji: '🐜'
    },
    {
      id: 'flea',
      name: 'Flea Pest Control',
      shortName: 'Fleas',
      image: '/images/pests/flea.webp',
      threat: 'Our odorless flea treatment targets flea infestations in homes and surrounding areas, helping eliminate active fleas and reduce recurring problems.',
      threatLevel: 'High Risk',
      solution: 'ODORLESS FLEA CONTROL',
      path: '/flea-pest-control',
      assurance: 'ODORLESS FLEA TREATMENT',
      emoji: '🦗'
    },
    {
      id: 'tick',
      name: 'Tick Pest Control',
      shortName: 'Ticks',
      image: '/images/pests/tick.webp',
      threat: 'Our odorless tick treatment targets ticks in indoor and outdoor areas, helping reduce infestations and provide longer-lasting protection for your property.',
      threatLevel: 'High Risk',
      solution: 'ODORLESS TICK CONTROL',
      path: '/tick-pest-control',
      assurance: 'ODORLESS TICK TREATMENT',
      emoji: '🕷️'
    },
    {
      id: 'woodborer',
      name: 'Wood Borer Pest Control',
      shortName: 'Wood Borer',
      image: '/images/pests/wood_borer.webp',
      threat: 'Targeted wood borer treatment to control active infestations and protect wooden furniture, doors, frames, and other structures from further damage.',
      threatLevel: 'High Risk',
      solution: 'WOOD BORER CONTROL & PROTECTION',
      path: '/wood-borer-treatment',
      assurance: 'WOOD PROTECTION TREATMENT',
      emoji: '🪲'
    },
    {
      id: 'general',
      name: 'General Pest Control',
      shortName: 'General',
      image: '/images/pests/general.webp',
      threat: 'Odorless pest treatment for common household and property pests, providing targeted protection for homes, offices, and other spaces.',
      threatLevel: 'Multi-Pest',
      solution: 'GENERAL PEST CONTROL',
      path: '/general-pest-control',
      assurance: 'ODORLESS PEST PROTECTION',
      emoji: '🛡️'
    }
  ],
  'specialized': [
    {
      id: 'pre-construction',
      name: 'Pre-Construction Termite',
      shortName: 'Pre-Const',
      image: '/images/pests/pre_construction.webp',
      threat: 'Preventive termite protection planned during construction to create a protective barrier before the building is completed and occupied.',
      threatLevel: 'High Risk',
      solution: 'PRE-CONSTRUCTION TERMITE CONTROL',
      path: '/pre-construction-termite-treatment',
      assurance: 'BUILT-IN TERMITE PROTECTION',
      emoji: '🏗️'
    },
    {
      id: 'post-construction',
      name: 'Post-Construction Termite',
      shortName: 'Post-Const',
      image: '/images/pests/post_construction.webp',
      threat: 'Professional termite treatment for existing buildings, designed to address active infestations and protect foundations, walls, and wooden structures.',
      threatLevel: 'High Risk',
      solution: 'POST-CONSTRUCTION TERMITE CONTROL',
      path: '/post-construction-termite-treatment',
      assurance: 'EXISTING PROPERTY PROTECTION',
      emoji: '🏠'
    },
    {
      id: 'residential',
      name: 'Residential Pest Control',
      shortName: 'Residential',
      image: '/images/pests/residential.webp',
      threat: 'Odorless pest treatment for homes, targeting common household pests while helping keep your living spaces protected, comfortable, and pest-free.',
      threatLevel: 'Family Safe',
      solution: 'RESIDENTIAL PEST CONTROL',
      path: '/residential-pest-control',
      assurance: 'ODORLESS HOME PROTECTION',
      emoji: '🏡'
    },
    {
      id: 'commercial',
      name: 'Commercial Pest Control',
      shortName: 'Commercial',
      image: '/images/pests/commercial.webp',
      threat: 'Odorless pest treatment for offices, shops, restaurants, and commercial properties, designed to control infestations with minimal disruption.',
      threatLevel: 'Compliance',
      solution: 'COMMERCIAL PEST CONTROL',
      path: '/commercial-pest-control',
      assurance: 'ODORLESS BUSINESS PROTECTION',
      emoji: '🏢'
    }
  ]
}


const ALL_PESTS = [
  ...CATEGORIZED_PESTS['our-services'],
  ...CATEGORIZED_PESTS['specialized']
]

export default function HeroSection() {
  const [activePestId, setActivePestId] = useState(ALL_PESTS[0].id)

  const currentPest = ALL_PESTS.find(p => p.id === activePestId) || ALL_PESTS[0]

  return (
    <section className="hero-modern-section" aria-label="A to Z Pest Solutions Bangalore">
      {/* Background with modern interior & subtle defense grid */}
      <div className="hero-modern-bg" aria-hidden="true">
        <img 
          src="/images/hero-banner.webp" 
          alt="Modern pest defense interior background" 
          className="hero-modern-bg-img"
          loading="eager"
          decoding="async"
        />
        <div className="hero-modern-gradient-overlay" />
        <div className="hero-modern-grid-overlay" />
        <div className="hero-modern-ambient-glow" />
      </div>

      <div className="container hero-modern-container">
        
        {/* ── LEFT: Content & Value Proposition ── */}
        <div className="hero-modern-left hero-fade-in-up">
          {/* Live Trust Pill */}
          <div className="hero-live-pill">
            <Zap size={14} className="live-pulse-dot" style={{ background: 'transparent', color: '#eab308', boxShadow: 'none' }} aria-hidden="true" />
            <span className="live-pill-label">
              <strong>PROFESSIONAL PEST SOLUTIONS</strong>
            </span>
          </div>

          {/* Bold Modern Headline */}
          <h1 className="hero-modern-title">
            Smart, Reliable <br className="hero-title-break" />
            <span className="hero-text-gradient">Pest Control & Protection</span> For Your Home.
          </h1>

          {/* Subtitle */}
          <p className="hero-modern-subtitle">
            Our trained technicians use child- and pet-safe treatment methods with rapid 60-minute emergency pest control service in Bangalore.
          </p>

          {/* Action Buttons */}
          <div className="hero-modern-actions">
            <a 
              href="tel:+919845559710" 
              className="btn btn-primary hero-btn-main-action"
              aria-label="Book Free Inspection"
            >
              <CheckCircle2 size={17} className="btn-icon" aria-hidden="true" />
              <span>Book Free Inspection</span>
            </a>
            
            <div className="hero-secondary-actions">
              <a 
                href="tel:+919845559710" 
                className="btn btn-outline hero-btn-call"
                aria-label="Direct Phone Call 9845559710"
              >
                <Phone size={17} className="btn-icon" aria-hidden="true" />
                <span>Direct Call</span>
              </a>
              <a 
                href="https://wa.me/919845559710?text=Hi%2C%20I%20need%20a%20free%20pest%20control%20inspection%20in%20Bangalore."
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline hero-btn-whatsapp"
                aria-label="Chat on WhatsApp with pest control specialist"
              >
                <MessageCircle size={17} className="btn-icon" aria-hidden="true" />
                <span>WhatsApp Booking</span>
              </a>
            </div>
          </div>

          {/* Key Assurance Badges */}
          <div className="hero-modern-assurances">
            <div className="assurance-item">
              <ShieldCheck size={15} className="assurance-icon" aria-hidden="true" />
              <span>Child & Pet Safe</span>
            </div>
            <div className="assurance-item">
              <User size={15} className="assurance-icon" aria-hidden="true" />
              <span>Trained Professionals</span>
            </div>
            <div className="assurance-item">
              <CheckCircle2 size={15} className="assurance-icon" aria-hidden="true" />
              <span>Free Warranty Retreatment</span>
            </div>
            <div className="assurance-item">
              <Clock size={15} className="assurance-icon" aria-hidden="true" />
              <span>60-Minute Emergency Service</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Interactive Realistic Pest & Service Showcase ── */}
        <motion.div 
          className="hero-modern-right"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pest-showcase-card">
            
            {/* Card Header: Live Scanner Tag */}
            <div className="pest-showcase-header">
              <div className="pest-badge-live">
                <Zap size={12} aria-hidden="true" />
                <span>Pest Threat Scanner</span>
              </div>
              <span className="pest-count-label">Select to inspect:</span>
            </div>

            {/* ── Side-by-Side Dual Categories ── */}
            <div className="hero-dual-categories">
              
              {/* Left: Our Services */}
              <div className="hero-cat-column our-services-col">
                <div className="hero-cat-column-title">
                  <Bug size={12} aria-hidden="true" />
                  <span>Our Services</span>
                </div>
                <div className="hero-cat-grid our-services-grid">
                  {CATEGORIZED_PESTS['our-services'].map((pest) => {
                    const isActive = activePestId === pest.id
                    return (
                      <button
                        key={pest.id}
                        type="button"
                        aria-selected={isActive}
                        className={`pest-tab-btn pest-tab-${pest.id} ${isActive ? 'tab-active' : ''}`}
                        onClick={() => setActivePestId(pest.id)}
                      >
                        <span className="tab-emoji">{pest.emoji}</span>
                        <span className="tab-name">{pest.shortName}</span>
                        {isActive && (
                          <motion.div 
                            layoutId="activeTabIndicator"
                            className="tab-active-indicator"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="hero-cat-divider" aria-hidden="true"></div>

              {/* Right: Specialized Services */}
              <div className="hero-cat-column specialized-col">
                <div className="hero-cat-column-title">
                  <ShieldCheck size={12} aria-hidden="true" />
                  <span>Specialized</span>
                </div>
                <div className="hero-cat-grid specialized-grid">
                  {CATEGORIZED_PESTS['specialized'].map((pest) => {
                    const isActive = activePestId === pest.id
                    return (
                      <button
                        key={pest.id}
                        type="button"
                        aria-selected={isActive}
                        className={`pest-tab-btn ${isActive ? 'tab-active' : ''}`}
                        onClick={() => setActivePestId(pest.id)}
                      >
                        <span className="tab-emoji">{pest.emoji}</span>
                        <span className="tab-name">{pest.shortName}</span>
                        {isActive && (
                          <motion.div 
                            layoutId="activeTabIndicator"
                            className="tab-active-indicator"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Animated Pest Detail View */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPest.id}
                className="pest-display-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {/* Realistic Image Viewport */}
                <div className="pest-image-box">
                  <img 
                    src={currentPest.image} 
                    alt={`Realistic inspection view of ${currentPest.name}`}
                    className="pest-real-img"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="pest-img-gradient" />
                  
                  {/* Floating Threat Tag */}
                  <div className="pest-threat-tag">
                    <AlertTriangle size={12} aria-hidden="true" />
                    <span>{currentPest.threatLevel}</span>
                  </div>

                  {/* Floating Assurance Tag */}
                  <div className="pest-assurance-tag">
                    <Sparkles size={12} aria-hidden="true" />
                    <span>{currentPest.assurance}</span>
                  </div>
                </div>

                {/* Pest Info Body */}
                <div className="pest-info-body">
                  <div className="pest-title-row">
                    <div className="pest-current-name">{currentPest.name}</div>
                    <span className="pest-sub-threat">{currentPest.threat}</span>
                  </div>

                  <div className="pest-solution-box">
                    <span className="solution-label">Targeted Treatment:</span>
                    <p className="solution-text">{currentPest.solution}</p>
                  </div>

                  {/* Direct Treatment Link */}
                  <Link 
                    href={currentPest.path} 
                    className="btn btn-primary pest-book-link"
                    aria-label={`Book pest control for ${currentPest.name}`}
                  >
                    <span>Book {currentPest.shortName} Treatment</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Live Social Proof Footer */}
            <div className="pest-card-footer">
              <div className="stars-cluster" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" aria-hidden="true" />
                ))}
              </div>
              <span className="proof-caption">
                <strong>4.9 / 5 Rating</strong> &bull; 15,000+ Verified Homes in Bengaluru
              </span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
