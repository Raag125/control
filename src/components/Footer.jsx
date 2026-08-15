'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Mail, MapPin, Shield, ChevronDown, Clock, MessageCircle, Sparkles } from 'lucide-react'
import './Footer.css'

const services = [
  { to: '/termite-treatment',    label: 'Termite Control' },
  { to: '/bed-bugs-treatment',   label: 'Bed Bugs Treatment' },
  { to: '/cockroach-treatment',  label: 'Cockroach Eradication' },
  { to: '/rodent-treatment',     label: 'Rodent Management' },
  { to: '/mosquito-treatment',   label: 'Mosquito Control' },
  { to: '/honey-bee-treatment',  label: 'Honey Bee Relocation' },
  { to: '/wood-borer-treatment', label: 'Wood Borer Treatment' },
  { to: '/general-pest-control', label: 'General Pest Control' },
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
              Bangalore's most trusted pest control company since 1993. CIB & WHOPES approved, child & pet safe treatments across Bengaluru.
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
                WhatsApp
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

          {/* Services Column (Accordion on mobile) */}
          <nav className={`footer__col ${openSection === 'services' ? 'is-open' : ''}`} aria-label="Pest control services">
            <button 
              className="footer__col-title-btn" 
              onClick={() => toggleSection('services')}
              aria-expanded={openSection === 'services'}
            >
              <span>Our Services</span>
              <ChevronDown size={16} className="footer__accordion-icon" aria-hidden="true" />
            </button>
            <ul role="list" className="footer__link-list">
              {services.map((s) => (
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
              <span className="badge">🛡️ PCAI Certified</span>
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
