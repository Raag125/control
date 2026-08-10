import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, X, Menu, ChevronDown, Shield, MessageCircle } from 'lucide-react'
import './Navbar.css'

const serviceLinks = [
  { to: '/termite-treatment',    label: 'Termite Treatment',     emoji: '🪵' },
  { to: '/bed-bugs-treatment',   label: 'Bed Bugs Treatment',    emoji: '🛏️' },
  { to: '/cockroach-treatment',  label: 'Cockroach Treatment',   emoji: '🪳' },
  { to: '/rodent-treatment',     label: 'Rodent Treatment',      emoji: '🐀' },
  { to: '/mosquito-treatment',   label: 'Mosquito Treatment',    emoji: '🦟' },
  { to: '/honey-bee-treatment',  label: 'Honey Bee Treatment',   emoji: '🐝' },
  { to: '/ticks-fleas-treatment','label': 'Ticks & Fleas',       emoji: '🦗' },
  { to: '/wood-borer-treatment', label: 'Wood Borer Treatment',  emoji: '🪲' },
]

const navLinks = [
  { to: '/',          label: 'Home' },
  { to: '/about-us',  label: 'About Us' },
  { to: '/services',  label: 'Services', hasDropdown: true },
  { to: '/franchise', label: 'Franchise' },
  { to: '/faq',       label: 'FAQs' },
  { to: '/contact',   label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [mobileServOpen, setMobileServOpen] = useState(false)
  const location = useLocation()
  const dropRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close all menus on navigation
  useEffect(() => {
    setMenuOpen(false)
    setDropOpen(false)
    setMobileServOpen(false)
  }, [location.pathname])

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className={`unique-header-wrap ${scrolled ? 'wrap--scrolled' : ''}`}>
      <div className="unique-header-container">
        <nav className="unique-nav-island" aria-label="Main Navigation">
          
          {/* LOGO */}
          <Link to="/" className="unique-logo" aria-label="A to Z Pest Solutions — Home">
            <div className="unique-logo-shield">
              <Shield size={18} strokeWidth={2.5} />
            </div>
            <div className="unique-logo-text">
              <span className="unique-logo-main">A to Z</span>
              <span className="unique-logo-sub">Pest Solutions</span>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <ul className="unique-desktop-menu">
            {navLinks.map((link) => 
              link.hasDropdown ? (
                <li key={link.to} className="unique-menu-item dropdown-item" ref={dropRef}>
                  <button
                    className={`unique-menu-btn ${dropOpen ? 'dropdown-active' : ''}`}
                    onClick={() => setDropOpen(!dropOpen)}
                    aria-expanded={dropOpen}
                    aria-label="Services dropdown menu"
                  >
                    <span>{link.label}</span>
                    <ChevronDown size={14} className={`chevron-icon ${dropOpen ? 'rotated' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {dropOpen && (
                      <motion.div 
                        className="unique-dropdown-panel"
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <div className="unique-dropdown-grid">
                          {serviceLinks.map((s) => (
                            <NavLink 
                              key={s.to} 
                              to={s.to} 
                              className="unique-dropdown-link"
                              onClick={() => setDropOpen(false)}
                            >
                              <span className="drop-emoji">{s.emoji}</span>
                              <span className="drop-label">{s.label}</span>
                            </NavLink>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={link.to} className="unique-menu-item">
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `unique-menu-btn ${isActive ? 'btn-active' : ''}`}
                    end={link.to === '/'}
                  >
                    {link.label}
                  </NavLink>
                </li>
              )
            )}
          </ul>

          {/* CALL TO ACTION BUTTON */}
          <div className="unique-actions">
            <a 
              href="tel:+919845559710" 
              className="btn btn-primary unique-cta-btn"
              aria-label="Call A to Z Pest Solutions"
            >
              <Phone size={14} />
              <span>Call Now</span>
            </a>

            {/* MOBILE HAMBURGER */}
            <button 
              className={`unique-burger ${menuOpen ? 'burger-active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* MOBILE FULL-SCREEN EXPANSION PANEL */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="unique-mobile-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="unique-mobile-panel">
              <ul className="unique-mobile-menu">
                {navLinks.map((link) => 
                  link.hasDropdown ? (
                    <li key={link.to} className="unique-mobile-item">
                      <button 
                        className="unique-mobile-link mobile-dropdown-trigger"
                        onClick={() => setMobileServOpen(!mobileServOpen)}
                      >
                        <span>{link.label}</span>
                        <ChevronDown size={18} className={mobileServOpen ? 'rotated' : ''} />
                      </button>
                      
                      <AnimatePresence>
                        {mobileServOpen && (
                          <motion.ul 
                            className="unique-mobile-sub"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            {serviceLinks.map((s) => (
                              <li key={s.to}>
                                <NavLink 
                                  to={s.to} 
                                  className="unique-mobile-sub-link"
                                  onClick={() => setMenuOpen(false)}
                                >
                                  <span>{s.emoji}</span>
                                  <span>{s.label}</span>
                                </NavLink>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  ) : (
                    <li key={link.to} className="unique-mobile-item">
                      <NavLink
                        to={link.to}
                        className={({ isActive }) => `unique-mobile-link ${isActive ? 'mobile-active' : ''}`}
                        end={link.to === '/'}
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  )
                )}
              </ul>

              <div className="unique-mobile-actions">
                <a 
                  href="tel:+919845559710" 
                  className="btn btn-primary unique-mobile-action-btn"
                >
                  <Phone size={16} />
                  <span>Call 9845559710</span>
                </a>
                <a 
                  href="https://wa.me/919845559710" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline unique-mobile-action-btn-wa"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Expert</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
