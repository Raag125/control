import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, X, Menu, ChevronDown, Shield, MessageCircle } from 'lucide-react'
import './Navbar.css'

const serviceLinks = [
  { to: '/termite-treatment',    label: 'Termite Treatment',     image: '/images/pests/termite.png' },
  { to: '/bed-bugs-treatment',   label: 'Bed Bugs Treatment',    image: '/images/pests/bed_bug.png' },
  { to: '/cockroach-treatment',  label: 'Cockroach Treatment',   image: '/images/pests/cockroach.png' },
  { to: '/rodent-treatment',     label: 'Rodent Treatment',      image: '/images/pests/rodent.png' },
  { to: '/mosquito-treatment',   label: 'Mosquito Treatment',    image: '/images/pests/mosquito.png' },
  { to: '/honey-bee-treatment',  label: 'Honey Bee Treatment',   image: '/images/pests/honey_bee.png' },
  { to: '/wood-borer-treatment', label: 'Wood Borer Treatment',  image: '/images/pests/wood_borer.png' },
  { to: '/ant-pest-control',     label: 'Ant Pest Control',      image: '/images/pests/ant.png' },
  { to: '/tick-pest-control',    label: 'Tick Pest Control',     image: '/images/pests/tick.png' },
  { to: '/flea-pest-control',    label: 'Flea Pest Control',     image: '/images/pests/flea.png' },
  { to: '/pre-construction-termite-treatment', label: 'Pre-Construction Termite', image: '/images/pests/pre_construction.png' },
  { to: '/post-construction-termite-treatment', label: 'Post-Construction Termite', image: '/images/pests/post_construction.png' },
  { to: '/residential-pest-control', label: 'Residential Pest Control', image: '/images/pests/residential.png' },
  { to: '/commercial-pest-control', label: 'Commercial Pest Control', image: '/images/pests/commercial.png' },
  { to: '/general-pest-control', label: 'General Pest Control',  image: '/images/pests/general.png' },
]

const navLinks = [
  { to: '/',          label: 'Home' },
  { to: '/about-us',  label: 'About Us' },
  { to: '/services',  label: 'Services', hasDropdown: true },
  { to: '/franchise', label: 'Franchise' },
  { to: '/blogs',     label: 'Blogs' },
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
  const headerRef = useRef(null)

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

  // Close dropdown and mobile menu on click outside
  useEffect(() => {
    const handler = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setDropOpen(false)
        setMenuOpen(false)
      } else if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler) // Added for mobile devices
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [])

  return (
    <header ref={headerRef} className={`unique-header-wrap ${scrolled ? 'wrap--scrolled' : ''}`}>
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
                <li 
                  key={link.to} 
                  className="unique-menu-item dropdown-item" 
                  ref={dropRef}
                  onMouseEnter={() => setDropOpen(true)}
                  onMouseLeave={() => setDropOpen(false)}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `unique-menu-btn ${isActive || dropOpen ? 'btn-active' : ''}`}
                    onClick={() => setDropOpen(false)}
                  >
                    <span>{link.label}</span>
                    <ChevronDown size={14} className={`chevron-icon ${dropOpen ? 'rotated' : ''}`} />
                  </NavLink>
                  
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
                              <div style={{ width: '24px', height: '24px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                <img src={s.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <NavLink
                          to={link.to}
                          className={({ isActive }) => `unique-mobile-link ${isActive ? 'mobile-active' : ''}`}
                          onClick={() => setMenuOpen(false)}
                          style={{ flex: 1 }}
                        >
                          {link.label}
                        </NavLink>
                        <button 
                          className="mobile-dropdown-trigger-btn"
                          onClick={() => setMobileServOpen(!mobileServOpen)}
                          style={{ padding: '0.85rem', background: 'transparent', border: 'none', color: 'var(--clr-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <ChevronDown size={18} className={mobileServOpen ? 'rotated' : ''} />
                        </button>
                      </div>
                      
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
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                                >
                                  <div style={{ width: '20px', height: '20px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={s.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
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
