import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { logout } from './adminAuth'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { to: '/admin/orders',    label: 'Orders',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { to: '/admin/payments',  label: 'Payments',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { to: '/admin/visitors',  label: 'Visitors',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { to: '/admin/services',  label: 'Services',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg> },
  { to: '/admin/blogs',     label: 'Blogs',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
  { to: '/admin/reviews',   label: 'Reviews',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
]

function PageTitle() {
  const { pathname } = useLocation()
  const found = NAV.find(n => pathname.startsWith(n.to))
  return found?.label ?? 'Admin'
}

export default function AdminLayout({ children, pendingCount }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    window.location.href = '/admin'
  }

  return (
    <div className="adm">
      {/* Sidebar */}
      <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="adm-sidebar__logo">
          <div className="adm-sidebar__logo-icon">🐛</div>
          <div>
            <div className="adm-sidebar__logo-text">A to Z Pest</div>
            <div className="adm-sidebar__logo-sub">Admin Portal</div>
          </div>
        </div>

        <nav className="adm-sidebar__nav">
          <div className="adm-sidebar__label">Main Menu</div>
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => `adm-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {n.icon} {n.label}
              {n.label === 'Orders' && pendingCount > 0 && (
                <span className="adm-nav-badge">{pendingCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="adm-sidebar__footer">
          <button className="adm-logout-btn" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 99, backdropFilter: 'blur(2px)' }} />}

      {/* Main */}
      <main className="adm-main">
        {/* Topbar */}
        <header className="adm-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <button className="adm-btn adm-btn--ghost adm-btn--sm adm-menu-btn" onClick={() => setSidebarOpen(o => !o)} style={{ padding: '.4rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span className="adm-topbar__title"><PageTitle /></span>
          </div>
          <div className="adm-topbar__right">
            <span style={{ fontSize: '.72rem', color: 'var(--a-muted)' }} className="adm-topbar-date">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <div className="adm-avatar" title="Admin">A</div>
            <button 
              className="adm-btn adm-btn--danger adm-btn--sm" 
              onClick={handleLogout} 
              style={{ padding: '.35rem .6rem', fontSize: '.72rem', gap: '.3rem' }}
              title="Sign Out"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="adm-content adm-animate">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="adm-bottom-nav">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} className={({ isActive }) => `adm-bottom-nav__item ${isActive ? 'active' : ''}`}>
            {n.icon}
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
