'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Mail, MapPin, Shield, ChevronDown, Clock, MessageCircle } from 'lucide-react'
import './Footer.css'

const ourServices = [
  { to: '/cockroach-treatment',              label: 'Cockroach Pest Control' },
  { to: '/bed-bugs-treatment',               label: 'Bed Bug Pest Control' },
  { to: '/termite-treatment',                label: 'Termite Pest Control' },
  { to: '/rodent-treatment',                 label: 'Rodent Pest Control' },
  { to: '/mosquito-treatment',               label: 'Mosquito Pest Control' },
  { to: '/honey-bee-treatment',              label: 'Honey Bee Pest Control' },
  { to: '/ant-pest-control',                 label: 'Ant Pest Control' },
  { to: '/flea-pest-control',                label: 'Flea Pest Control' },
  { to: '/tick-pest-control',                label: 'Tick Pest Control' },
  { to: '/wood-borer-treatment',             label: 'Wood Borer Pest Control' },
  { to: '/general-pest-control',             label: 'General Pest Control' },
]

const specializedServices = [
  { to: '/pre-construction-termite-treatment',  label: 'Pre-Construction Termite' },
  { to: '/post-construction-termite-treatment', label: 'Post-Construction Termite' },
  { to: '/residential-pest-control',            label: 'Residential Pest Control' },
  { to: '/commercial-pest-control',             label: 'Commercial Pest Control' },
]

const quickLinks = [
  { to: '/',          label: 'Home' },
  { to: '/about-us',  label: 'About Us' },
  { to: '/services',  label: 'Services' },
  { to: '/blogs',     label: 'Blogs & Guides' },
  { to: '/franchise', label: 'Franchise' },
  { to: '/faq',       label: 'FAQ' },
  { to: '/contact',   label: 'Contact Us' },
]

export default function Footer() {
  const pathname = usePathname()
  const [openSection, setOpenSection] = useState(null)

  if (pathname?.startsWith('/admin')) return null

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      {/* Decorative glow */}
      <div className="footer__glow" aria-hidden="true" />

      <div className="footer__top">
        <div className="container footer__grid">

          {/* Brand Column */}
          <div className="footer__brand">
            <Link href="/" className="footer__logo" aria-label="A to Z Pest Solutions — Home">
              <div className="footer__logo-icon" aria-hidden="true">
                <Shield size={22} />
              </div>
              <div>
                <span className="footer__logo-name">A to Z</span>
                <span className="footer__logo-tagline">Pest Solutions</span>
              </div>
            </Link>
            <p className="footer__desc">
              Bangalore's most trusted pest control company since 1993. Eco-friendly, child & pet safe treatments across Bengaluru.
            </p>

            <div className="footer__mobile-actions" aria-label="Quick mobile contact options">
              <a href="tel:+919845559710" className="btn btn-primary footer__mob-btn" aria-label="Call 9845559710">
                <Phone size={15} aria-hidden="true" />
                Call 9845559710
              </a>
              <a 
                href="https://wa.me/919845559710?text=Hi%2C%20I%20need%20pest%20control%20in%20Bangalore." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline footer__mob-btn"
                aria-label="WhatsApp Us"
              >
                <MessageCircle size={15} aria-hidden="true" />
                Chat on WhatsApp
              </a>
            </div>

            <div className="footer__contact-list">
              <a href="tel:+919845559710" className="footer__contact-item" aria-label="Call us at 9845559710">
                <Phone size={14} aria-hidden="true" />
                <span>+91 98455 59710</span>
              </a>
              <a href="mailto:info@pestcontrolbengaluru.in" className="footer__contact-item" aria-label="Email info@pestcontrolbengaluru.in">
                <Mail size={14} aria-hidden="true" />
                <span>info@pestcontrolbengaluru.in</span>
              </a>
              <div className="footer__contact-item">
                <MapPin size={14} aria-hidden="true" />
                <address style={{ fontStyle: 'normal' }}>
                  No. 64, 6th Main, Sultanpalya, RT Nagar, Bengaluru 560032
                </address>
              </div>
              <div className="footer__contact-item">
                <Clock size={14} aria-hidden="true" />
                <span>Available 24/7 — 365 Days</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column (Accordion on mobile) */}
          <nav className={`footer__col ${openSection === 'quick' ? 'is-open' : ''}`} aria-label="Quick navigation links">
            <button 
              className="footer__col-title-btn" 
              onClick={() => toggleSection('quick')}
              aria-expanded={openSection === 'quick'}
            >
              <span>Quick Links</span>
              <ChevronDown size={16} className="footer__accordion-icon" aria-hidden="true" />
            </button>
            <ul role="list" className="footer__link-list">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link href={l.to} className="footer__link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Our Services Column (Accordion on mobile) */}
          <nav className={`footer__col ${openSection === 'our-services' ? 'is-open' : ''}`} aria-label="Our Services">
            <button 
              className="footer__col-title-btn footer__col-title-btn--center" 
              onClick={() => toggleSection('our-services')}
              aria-expanded={openSection === 'our-services'}
            >
              <span>Our Services</span>
              <ChevronDown size={16} className="footer__accordion-icon" aria-hidden="true" />
            </button>
            <ul role="list" className="footer__link-list footer__link-list--2cols">
              {ourServices.map((s) => (
                <li key={s.to}>
                  <Link href={s.to} className="footer__link">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Specialized Services Column (Accordion on mobile) */}
          <nav className={`footer__col ${openSection === 'specialized-services' ? 'is-open' : ''}`} aria-label="Specialized Services">
            <button 
              className="footer__col-title-btn" 
              onClick={() => toggleSection('specialized-services')}
              aria-expanded={openSection === 'specialized-services'}
            >
              <span>Specialized</span>
              <ChevronDown size={16} className="footer__accordion-icon" aria-hidden="true" />
            </button>
            <ul role="list" className="footer__link-list">
              {specializedServices.map((s) => (
                <li key={s.to}>
                  <Link href={s.to} className="footer__link">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA / Trust Column */}
          <div className="footer__col footer__cta-col">
            <div className="footer__col-title">Pest Free Living</div>
            <p className="footer__cta-desc">
              Book a free inspection today. Expert pest control for homes & businesses, 24/7 service across Bengaluru.
            </p>
            <div className="footer__badges" aria-label="Trust highlights">
              <span className="badge">🏆 Since 1993</span>
              <span className="badge">🌿 Eco-Friendly</span>
              <span className="badge">⚡ 60-Min Response</span>
              <span className="badge">🛡️ 100% Safe</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Minimal Bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © 1993–2026 <strong>A to Z Pest Solutions</strong>. All Rights Reserved.
          </p>
          <p className="footer__legal">
            Serving Koramangala, Indiranagar, Whitefield, HSR Layout, Jayanagar, Rajajinagar & all Bengaluru zones.
          </p>
        </div>
      </div>
    </footer>
  )
}
