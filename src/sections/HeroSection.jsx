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
  Zap
} from 'lucide-react'
import './HeroSection.css'

const PEST_SHOWCASE = [
  {
    id: 'termite',
    name: 'Subterranean Termites',
    shortName: 'Termite',
    image: '/images/pests/termite.png',
    threat: 'Severe Structural & Furniture Damage',
    threatLevel: 'High Risk',
    solution: 'Drill-Fill-Seal Barrier & Timber Protection',
    path: '/termite-treatment',
    assurance: 'CIB Certified',
    emoji: '🪵'
  },
  {
    id: 'bedbug',
    name: 'Bed Bug Infestation',
    shortName: 'Bed Bug',
    image: '/images/pests/bedbug.png',
    threat: 'Bites, Skin Allergies & Insomnia',
    threatLevel: 'High Risk',
    solution: 'Dual Odorless Mist & Residual Insecticide Defense',
    path: '/bed-bugs-treatment',
    assurance: '90-Day Follow-up',
    emoji: '🛏️'
  },
  {
    id: 'cockroach',
    name: 'German Cockroaches',
    shortName: 'Cockroach',
    image: '/images/pests/cockroach.png',
    threat: 'Food Contamination & Asthma',
    threatLevel: 'Medium Risk',
    solution: 'Advanced Odorless Gel Baiting & Flushing',
    path: '/cockroach-treatment',
    assurance: '100% Eradication',
    emoji: '🪳'
  },
  {
    id: 'rodent',
    name: 'Rats & House Mice',
    shortName: 'Rodents',
    image: '/images/pests/rodent.png',
    threat: 'Wire Chewing & Bacterial Spread',
    threatLevel: 'High Risk',
    solution: 'Multi-Catch Trapping & Bait Stations',
    path: '/rodent-treatment',
    assurance: 'Complete Removal',
    emoji: '🐀'
  },
  {
    id: 'mosquito',
    name: 'Dengue Mosquitoes',
    shortName: 'Mosquito',
    image: '/images/pests/mosquito.png',
    threat: 'Dengue, Malaria & Chikungunya',
    threatLevel: 'Seasonal Alert',
    solution: 'Thermal Fogging & Larvicidal Surface Mist',
    path: '/mosquito-treatment',
    assurance: 'Rapid Knockdown',
    emoji: '🦟'
  },
  {
    id: 'honeybee',
    name: 'Honey Bee Hives',
    shortName: 'Honey Bee',
    image: '/images/pests/honeybee.png',
    threat: 'Stings & Wall Cavity Damage',
    threatLevel: 'High Risk',
    solution: 'Safe Hive Removal & Ethical Relocation',
    path: '/honey-bee-treatment',
    assurance: 'Safe & Ethical',
    emoji: '🐝'
  },
  {
    id: 'ticks-fleas',
    name: 'Ticks & Fleas',
    shortName: 'Ticks/Fleas',
    image: '/images/pests/tick.png',
    threat: 'Lyme Disease, Typhus & Pet Anemia',
    threatLevel: 'High Risk',
    solution: '3-Stage IGR & Adulticide Lifecycle Treatment',
    path: '/ticks-fleas-treatment',
    assurance: 'Pet & Child Safe',
    emoji: '🦗'
  },
  {
    id: 'woodborer',
    name: 'Wood Borer Beetles',
    shortName: 'Wood Borer',
    image: '/images/pests/woodborer.png',
    threat: 'Destruction of Wooden Furniture & Beams',
    threatLevel: 'High Risk',
    solution: 'Precision Injection & Borate Preservation',
    path: '/wood-borer-treatment',
    assurance: 'Long-Lasting Defense',
    emoji: '🪲'
  },
  {
    id: 'ant',
    name: 'Ant Infestations',
    shortName: 'Ants',
    image: '/images/pests/ant.png',
    threat: 'Food Contamination & Wood Damage',
    threatLevel: 'Medium Risk',
    solution: 'Colony-Targeting Gel Bait System',
    path: '/ant-pest-control',
    assurance: 'Total Eradication',
    emoji: '🐜'
  },
  {
    id: 'pre-construction',
    name: 'Pre-Construction Termite',
    shortName: 'Pre-Const Termite',
    image: '/images/pests/pre_construction.png',
    threat: 'Future Structural Termite Damage',
    threatLevel: 'High Risk',
    solution: '5-Stage IS 6313 Soil Treatment Barrier',
    path: '/pre-construction-termite-treatment',
    assurance: 'Long-Term Protection',
    emoji: '🏗️'
  },
  {
    id: 'post-construction',
    name: 'Post-Construction Termite',
    shortName: 'Post-Const Termite',
    image: '/images/pests/post_construction.png',
    threat: 'Active Termite Infestation',
    threatLevel: 'High Risk',
    solution: 'Drill-Fill-Seal Barrier Method',
    path: '/post-construction-termite-treatment',
    assurance: 'CIB Certified',
    emoji: '🏠'
  }
]

export default function HeroSection() {
  const [activePestIndex, setActivePestIndex] = useState(0)
  const currentPest = PEST_SHOWCASE[activePestIndex]

  return (
    <section className="hero-modern-section" aria-label="A to Z Pest Solutions Bangalore">
      {/* Background with modern interior & subtle defense grid */}
      <div className="hero-modern-bg" aria-hidden="true">
        <img 
          src="/images/hero-banner.jpg" 
          alt="Modern pest defense interior background" 
          className="hero-modern-bg-img" 
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
            <span className="live-pulse-dot" aria-hidden="true" />
            <span className="live-pill-label">
              Bangalore's Trusted Pest Defense &bull; <strong>Est. 1993</strong>
            </span>
          </div>

          {/* Bold Modern Headline */}
          <h1 className="hero-modern-title">
            Smart, Reliable <br className="hero-title-break" />
            <span className="hero-text-gradient">Pest Control &amp; Protection</span> For Your Home.
          </h1>

          {/* Subtitle */}
          <p className="hero-modern-subtitle">
            Get <strong>smart, reliable pest protection and expert pest control for your home</strong> and commercial premises across Bangalore. Our PCAI-certified specialists deploy <strong>CIB &amp; WHOPES-approved, child and pet-safe</strong> treatments for termites, bed bugs, cockroaches, and rodents with rapid 60-minute dispatch.
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
                aria-label="Call Us"
              >
                <Phone size={17} className="btn-icon" aria-hidden="true" />
                <span>Call Us</span>
              </a>
              <a 
                href="https://wa.me/919845559710?text=Hi%2C%20I%20need%20a%20free%20pest%20control%20inspection%20in%20Bangalore."
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline hero-btn-whatsapp"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle size={17} className="btn-icon" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Key Assurance Badges */}
          <div className="hero-modern-assurances">
            <div className="assurance-item">
              <ShieldCheck size={15} className="assurance-icon" aria-hidden="true" />
              <span>WHOPES & CIB Approved Chemicals</span>
            </div>
            <div className="assurance-item">
              <Clock size={15} className="assurance-icon" aria-hidden="true" />
              <span>60-Min Emergency Dispatch</span>
            </div>
            <div className="assurance-item">
              <CheckCircle2 size={15} className="assurance-icon" aria-hidden="true" />
              <span>Free Follow-Up Retreatment</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Interactive Realistic Pest Showcase ── */}
        <motion.div 
          className="hero-modern-right"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pest-showcase-card">
            
            {/* Card Header & Indicator */}
            <div className="pest-showcase-header">
              <div className="pest-badge-live">
                <Zap size={12} aria-hidden="true" />
                <span>Pest Threat Scanner</span>
              </div>
              <span className="pest-count-label">Tap to inspect:</span>
            </div>

            {/* Quick Pest Tabs */}
            <div className="pest-tabs-row" role="tablist" aria-label="Pest Selection">
              {PEST_SHOWCASE.map((pest, idx) => {
                const isActive = activePestIndex === idx
                return (
                  <button
                    key={pest.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`pest-tab-btn ${isActive ? 'tab-active' : ''}`}
                    onClick={() => setActivePestIndex(idx)}
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
                    <span>Book {currentPest.shortName} Pest Control</span>
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
