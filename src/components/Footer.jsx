import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Shield, ChevronRight, Clock } from 'lucide-react'
import './Footer.css'

const services = [
  { to: '/termite-treatment',    label: 'Termite Treatment' },
  { to: '/bed-bugs-treatment',   label: 'Bed Bugs Treatment' },
  { to: '/cockroach-treatment',  label: 'Cockroach Treatment' },
  { to: '/rodent-treatment',     label: 'Rodent Treatment' },
  { to: '/mosquito-treatment',   label: 'Mosquito Treatment' },
  { to: '/honey-bee-treatment',  label: 'Honey Bee Treatment' },
  { to: '/ticks-fleas-treatment','label': 'Ticks & Fleas Treatment' },
  { to: '/wood-borer-treatment', label: 'Wood Borer Treatment' },
]

const quickLinks = [
  { to: '/',          label: 'Home' },
  { to: '/about-us',  label: 'About Us' },
  { to: '/services',  label: 'Our Services' },
  { to: '/franchise', label: 'Franchise' },
  { to: '/faq',       label: "FAQ's" },
  { to: '/contact',   label: 'Contact Us' },
]

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      {/* Decorative glow */}
      <div className="footer__glow" aria-hidden="true" />

      <div className="footer__top">
        <div className="container footer__grid">

          {/* Brand Column */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo" aria-label="A to Z Pest Solutions — Home">
              <div className="footer__logo-icon" aria-hidden="true">
                <Shield size={22} />
              </div>
              <div>
                <span className="footer__logo-name">A to Z</span>
                <span className="footer__logo-tagline">Pest Solutions</span>
              </div>
            </Link>
            <p className="footer__desc">
              Bangalore's most trusted pest control company since 1993. Eco-friendly, safe,
              and highly effective treatments for homes and businesses — 365 days a year.
            </p>
            <div className="footer__contact-list">
              <a href="tel:+919845559710" className="footer__contact-item" aria-label="Call us at 9845559710">
                <Phone size={15} aria-hidden="true" />
                <span>9845559710</span>
              </a>
              <a href="mailto:info@pestcontrolbengaluru.in" className="footer__contact-item" aria-label="Email info@pestcontrolbengaluru.in">
                <Mail size={15} aria-hidden="true" />
                <span>info@pestcontrolbengaluru.in</span>
              </a>
              <div className="footer__contact-item">
                <MapPin size={15} aria-hidden="true" />
                <address style={{ fontStyle: 'normal' }}>
                  No. 64, 6th Main, Hanumanthappa Layout,<br />
                  Sultanpalya, RT Nagar, Bengaluru – 560032
                </address>
              </div>
              <div className="footer__contact-item">
                <Clock size={15} aria-hidden="true" />
                <span>Open 24/7 — 365 Days a Year</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="footer__col" aria-label="Quick links">
            <h3 className="footer__col-title">Quick Links</h3>
            <ul role="list">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="footer__link">
                    <ChevronRight size={13} aria-hidden="true" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav className="footer__col" aria-label="Our services">
            <h3 className="footer__col-title">Our Services</h3>
            <ul role="list">
              {services.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="footer__link">
                    <ChevronRight size={13} aria-hidden="true" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA Column */}
          <div className="footer__col footer__cta-col">
            <h3 className="footer__col-title">Get a Free Inspection</h3>
            <p className="footer__cta-desc">
              Struggling with pests? Our experts are ready to help. Book a free inspection today.
            </p>
            <a
              href="tel:+919845559710"
              className="btn btn-primary footer__cta-btn"
              aria-label="Call now for free pest inspection"
            >
              <Phone size={15} aria-hidden="true" />
              Call Now — Free Inspection
            </a>
            <a
              href="https://wa.me/919845559710?text=Hi%2C%20I%20need%20pest%20control%20in%20Bangalore."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline footer__cta-btn"
              aria-label="WhatsApp us for pest control"
            >
              💬 Chat on WhatsApp
            </a>
            <div className="footer__badges" aria-label="Trust badges">
              <span className="badge">✅ Since 1993</span>
              <span className="badge">🌿 Eco-Friendly</span>
              <span className="badge">⚡ Same-Day</span>
            </div>
          </div>

        </div>
      </div>

      <div className="divider" />

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © 2011–2026 <strong>A to Z Pest Solutions</strong>. All Rights Reserved.
          </p>
          <p className="footer__legal">
            Pest Control in Bangalore | Termite, Bed Bugs, Cockroach, Rodent & Mosquito Control
          </p>
        </div>
      </div>
    </footer>
  )
}
