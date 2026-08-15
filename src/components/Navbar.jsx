'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, X, Menu, ChevronDown, ChevronRight, MessageCircle } from 'lucide-react'
import './Navbar.css'

// ── Dropdown columns – matches reference image layout ──────────────────────
const dropdownColumns = [
  {
    title: 'Our Services',
    items: [
      { to: '/cockroach-treatment',              label: 'Cockroach Pest Control',          image: '/images/pests/cockroach.png' },
      { to: '/bed-bugs-treatment',               label: 'Bed Bug Pest Control',             image: '/images/pests/bed_bug.png' },
      { to: '/termite-treatment',                label: 'Termite Pest Control',             image: '/images/pests/termite.png' },
      { to: '/rodent-treatment',                 label: 'Rodent Pest Control',              image: '/images/pests/rodent.png' },
      { to: '/mosquito-treatment',               label: 'Mosquito Pest Control',            image: '/images/pests/mosquito.png' },
      { to: '/honey-bee-treatment',                 label: 'Honey Bee Pest Control',     image: '/images/pests/honey_bee.png' },
      { to: '/ant-pest-control',                 label: 'Ant Pest Control',                 image: '/images/pests/ant.png' },
      { to: '/flea-pest-control',                label: 'Flea Pest Control',                image: '/images/pests/flea.png' },
      { to: '/tick-pest-control',                label: 'Tick Pest Control',                image: '/images/pests/tick.png' },
      { to: '/wood-borer-treatment',             label: 'Wood Borer Pest Control',          image: '/images/pests/wood_borer.png' },
      { to: '/general-pest-control',             label: 'General Pest Control',             image: '/images/pests/general.png' },
    ],
  },
  {
    title: 'Specialized Services',
    items: [
      { to: '/pre-construction-termite-treatment',  label: 'Pre-Construction Termite',   image: '/images/pests/pre_construction.png' },
      { to: '/post-construction-termite-treatment', label: 'Post-Construction Termite',  image: '/images/pests/post_construction.png' },
      { to: '/residential-pest-control',            label: 'Residential Pest Control',   image: '/images/pests/residential.png' },
      { to: '/commercial-pest-control',             label: 'Commercial Pest Control',    image: '/images/pests/commercial.png' },
    ],
  },
]

// ── Mobile accordian uses same structure ──────────────────────────────────
const mobileAllCategories = dropdownColumns

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
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  const [scrolled,        setScrolled]        = useState(false)
  const [menuOpen,        setMenuOpen]        = useState(false)
  const [dropOpen,        setDropOpen]        = useState(false)
  const [mobileServOpen,  setMobileServOpen]  = useState(false)
  const [navHeight,       setNavHeight]       = useState(0)
  const dropRef   = useRef(null)
  const headerRef = useRef(null)

  // ── Measure header height so the fixed overlay sits flush below ──
  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setNavHeight(headerRef.current.offsetHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (headerRef.current) ro.observe(headerRef.current)
    return () => ro.disconnect()
  }, [])

  // ── Throttled scroll listener ──
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Close menus on navigation ──
  useEffect(() => {
    setMenuOpen(false)
    setDropOpen(false)
    setMobileServOpen(false)
  }, [pathname])

  // ── Close on outside click ──
  useEffect(() => {
    const handler = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setDropOpen(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [])

  // ── Lock body scroll when mobile menu is open ──
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header ref={headerRef} className={`unique-header-wrap ${scrolled ? 'wrap--scrolled' : ''}`}>
      <div className="unique-header-container">
        <nav className="unique-nav-island" aria-label="Main Navigation">

          {/* LOGO */}
          <Link href="/" className="unique-logo" aria-label="A to Z Pest Solutions — Home">
            <div className="unique-logo-shield">
              <img src="/images/logo.png" alt="A to Z Pest Solutions Emblem" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <div className="unique-logo-text">
              <span className="unique-logo-main">A to Z</span>
              <span className="unique-logo-sub">Pest Solutions</span>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <ul className="unique-desktop-menu">
            {navLinks.map((link) => {
              const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to)
              return link.hasDropdown ? (
                <li
                  key={link.to}
                  className="unique-menu-item dropdown-item"
                  ref={dropRef}
                  onMouseEnter={() => setDropOpen(true)}
                  onMouseLeave={() => setDropOpen(false)}
                >
                  <Link
                    href={link.to}
                    className={`unique-menu-btn ${isActive || dropOpen ? 'btn-active' : ''}`}
                    onClick={() => setDropOpen(false)}
                  >
                    <span>{link.label}</span>
                    <ChevronDown size={14} className={`chevron-icon ${dropOpen ? 'rotated' : ''}`} />
                  </Link>

                  <AnimatePresence>
                    {dropOpen && (
                      <motion.div
                        className="nav-services-panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                      >
                        <div className="nav-services-inner">
                          {/* Left Section: Our Services (2 Sub-columns side-by-side) */}
                          <div className="nav-services-section nav-our-services">
                            <div className="nav-col-header">{dropdownColumns[0].title}</div>
                            <div className="nav-col-subgrid">
                              <ul className="nav-col-list">
                                {dropdownColumns[0].items.slice(0, 6).map((item) => (
                                  <li key={item.to}>
                                    <Link
                                      href={item.to}
                                      className="nav-col-link"
                                      onClick={() => setDropOpen(false)}
                                    >
                                      <div className="nav-col-icon">
                                        <img src={item.image} alt="" aria-hidden="true" />
                                      </div>
                                      <span className="nav-col-label">{item.label}</span>
                                      <ChevronRight size={14} className="nav-col-arrow" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              <ul className="nav-col-list">
                                {dropdownColumns[0].items.slice(6).map((item) => (
                                  <li key={item.to}>
                                    <Link
                                      href={item.to}
                                      className="nav-col-link"
                                      onClick={() => setDropOpen(false)}
                                    >
                                      <div className="nav-col-icon">
                                        <img src={item.image} alt="" aria-hidden="true" />
                                      </div>
                                      <span className="nav-col-label">{item.label}</span>
                                      <ChevronRight size={14} className="nav-col-arrow" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Right Section: Specialized Services */}
                          <div className="nav-services-section nav-specialized-services">
                            <div className="nav-col-header">{dropdownColumns[1].title}</div>
                            <ul className="nav-col-list">
                              {dropdownColumns[1].items.map((item) => (
                                <li key={item.to}>
                                  <Link
                                    href={item.to}
                                    className="nav-col-link"
                                    onClick={() => setDropOpen(false)}
                                  >
                                    <div className="nav-col-icon">
                                      <img src={item.image} alt="" aria-hidden="true" />
                                    </div>
                                    <span className="nav-col-label">{item.label}</span>
                                    <ChevronRight size={14} className="nav-col-arrow" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={link.to} className="unique-menu-item">
                  <Link
                    href={link.to}
                    className={`unique-menu-btn ${isActive ? 'btn-active' : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* CALL TO ACTION */}
          <div className="unique-actions">
            <a
              href="tel:+919845559710"
              className="btn btn-primary unique-cta-btn"
              aria-label="Call A to Z Pest Solutions"
            >
              <Phone size={14} />
              <span>Call Now</span>
            </a>

            {/* HAMBURGER */}
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

      {/* ── MOBILE PANEL — position:fixed so it never shifts the page ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="unique-mobile-overlay"
            style={{ top: navHeight }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="unique-mobile-panel">
              <ul className="unique-mobile-menu">
                {navLinks.map((link) => {
                  const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to)
                  return link.hasDropdown ? (
                    <li key={link.to} className="unique-mobile-item">
                      <div className="mobile-services-row">
                        <Link
                          href={link.to}
                          className={`unique-mobile-link ${isActive ? 'mobile-active' : ''}`}
                          onClick={() => setMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                        <button
                          className="mobile-expand-btn"
                          onClick={() => setMobileServOpen(!mobileServOpen)}
                          aria-expanded={mobileServOpen}
                          aria-label="Toggle services submenu"
                        >
                          <ChevronDown size={18} className={mobileServOpen ? 'rotated' : ''} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {mobileServOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            style={{ overflow: 'hidden' }}
                          >
                            {mobileAllCategories.map((cat) => (
                              <div key={cat.title} className="mobile-cat-section">
                                <div className="mobile-cat-header">{cat.title}</div>
                                <ul className="mobile-cat-list">
                                  {cat.items.map((item) => (
                                    <li key={item.to}>
                                      <Link
                                        href={item.to}
                                        className="mobile-cat-link"
                                        onClick={() => setMenuOpen(false)}
                                      >
                                        <div className="mobile-cat-icon">
                                          <img src={item.image} alt="" aria-hidden="true" />
                                        </div>
                                        <span>{item.label}</span>
                                        <ChevronRight size={13} className="mobile-cat-arrow" />
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  ) : (
                    <li key={link.to} className="unique-mobile-item">
                      <Link
                        href={link.to}
                        className={`unique-mobile-link ${isActive ? 'mobile-active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <div className="unique-mobile-actions">
                <a href="tel:+919845559710" className="btn btn-primary unique-mobile-action-btn">
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
