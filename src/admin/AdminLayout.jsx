'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from './adminAuth'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { to: '/admin/services-content', label: 'Services Page Content', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg> },
  { to: '/admin/orders',    label: 'Orders',    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { to: '/admin/payments',  label: 'Payments',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { to: '/admin/clients',   label: 'Clients & Leads', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { to: '/admin/services',  label: 'Services List',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg> },
  { to: '/admin/blogs',     label: 'Blogs & AI', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
  { to: '/admin/reviews',   label: 'Reviews',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
  { to: '/admin/images',    label: 'Images & SEO', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { to: '/admin/visitors',  label: 'Visitors',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
]

const MOBILE_BOTTOM_TABS = [
  { to: '/admin/dashboard', label: 'Home',     icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { to: '/admin/services-content', label: 'Live Editor', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg> },
  { to: '/admin/orders',    label: 'Orders',   badgeKey: 'pending', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { to: '/admin/clients',   label: 'Leads',    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
]

function PageTitle() {
  const pathname = usePathname()
  const found = NAV.find(n => pathname.startsWith(n.to))
  return found?.label ?? 'Admin'
}

export default function AdminLayout({ children, pendingCount }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  function handleLogout() {
    logout()
    window.location.href = '/admin'
  }

  return (
    <div className="adm">
      {/* Sidebar Drawer */}
      <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="adm-sidebar__logo">
          <div className="adm-sidebar__logo-icon">🐛</div>
          <div style={{ flex: 1 }}>
            <div className="adm-sidebar__logo-text">A to Z Pest</div>
            <div className="adm-sidebar__logo-sub">Admin Portal</div>
          </div>
          <button className="adm-sidebar__close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">✕</button>
        </div>

        <nav className="adm-sidebar__nav">
          <div className="adm-sidebar__label">Main Menu</div>
          {NAV.map(n => {
            const isActive = pathname.startsWith(n.to)
            return (
              <Link
                key={n.to}
                href={n.to}
                className={`adm-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                {n.icon} {n.label}
                {n.label === 'Orders' && pendingCount > 0 && (
                  <span className="adm-nav-badge">{pendingCount}</span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="adm-sidebar__footer">
          <button className="adm-logout-btn" onClick={handleLogout}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {sidebarOpen && <div className="adm-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="adm-main">
        {/* Top Header Bar */}
        <header className="adm-topbar">
          <div className="adm-topbar__left">
            <button className="adm-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open navigation menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="adm-topbar__title"><PageTitle /></div>
          </div>
          <div className="adm-topbar__right">
            <span className="adm-topbar-badge">Admin</span>
            <div className="adm-avatar" title="Administrator">A</div>
            <button className="adm-logout-btn--topbar" onClick={handleLogout} title="Sign Out">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="adm-content adm-animate">
          {children}
        </div>
      </main>

      {/* Streamlined 5-Tab Mobile Bottom Nav */}
      <nav className="adm-bottom-nav">
        {MOBILE_BOTTOM_TABS.map(tab => {
          const isActive = pathname.startsWith(tab.to)
          return (
            <Link key={tab.to} href={tab.to} className={`adm-bottom-nav__item ${isActive ? 'active' : ''}`}>
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badgeKey === 'pending' && pendingCount > 0 && (
                <span className="adm-bottom-nav__badge">{pendingCount}</span>
              )}
            </Link>
          )
        })}
        <button
          className={`adm-bottom-nav__item ${sidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open full menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <span>More</span>
        </button>
      </nav>
    </div>
  )
}
