import { useState, useMemo } from 'react'
import { getVisitors } from '../adminData'

const TYPE_ICON = { Mobile: '📱', Desktop: '💻', Tablet: '📟' }
const TYPE_COLOR = { Mobile: 'blue', Desktop: 'green', Tablet: 'warn' }

export default function Visitors() {
  const [search, setSearch]   = useState('')
  const [typeFilter, setType] = useState('all')
  const [page, setPage]       = useState(1)
  const PER_PAGE = 25

  const all = useMemo(() => getVisitors(), [])

  const filtered = all.filter(v => {
    const q = search.toLowerCase()
    const matchQ = !q || v.page?.includes(q) || v.ip?.includes(q) || v.browser?.toLowerCase().includes(q) || v.os?.toLowerCase().includes(q)
    return matchQ && (typeFilter === 'all' || v.type === typeFilter)
  })

  const pages   = Math.ceil(filtered.length / PER_PAGE)
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Aggregations
  const today      = new Date().toDateString()
  const todayCount = all.filter(v => new Date(v.timestamp).toDateString() === today).length
  const byType     = { Mobile: all.filter(v => v.type === 'Mobile').length, Desktop: all.filter(v => v.type === 'Desktop').length, Tablet: all.filter(v => v.type === 'Tablet').length }
  const topPages   = Object.entries(all.reduce((acc, v) => { acc[v.page] = (acc[v.page] || 0) + 1; return acc }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const topBrowsers = Object.entries(all.reduce((acc, v) => { acc[v.browser] = (acc[v.browser] || 0) + 1; return acc }, {})).sort((a, b) => b[1] - a[1]).slice(0, 4)

  return (
    <div>
      {/* Header */}
      <div className="adm-section-header">
        <div>
          <h1 className="adm-section-title">👁️ Web Traffic & Analytics</h1>
          <p style={{ color: 'var(--a-muted)', marginTop: '.15rem' }}>
            Real-time tracking of visitor devices, page routes, and browsers.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="adm-stats-grid" style={{ marginTop: '.75rem', marginBottom: '1rem' }}>
        <div className="adm-stat"><div className="adm-stat__icon adm-stat__icon--green">👁️</div><div className="adm-stat__val">{all.length}</div><div className="adm-stat__label">Total Visits</div></div>
        <div className="adm-stat"><div className="adm-stat__icon adm-stat__icon--blue">📅</div><div className="adm-stat__val">{todayCount}</div><div className="adm-stat__label">Today's Visits</div></div>
        <div className="adm-stat"><div className="adm-stat__icon adm-stat__icon--warn">📱</div><div className="adm-stat__val">{byType.Mobile}</div><div className="adm-stat__label">Mobile Visits</div></div>
        <div className="adm-stat"><div className="adm-stat__icon adm-stat__icon--green">💻</div><div className="adm-stat__val">{byType.Desktop}</div><div className="adm-stat__label">Desktop Visits</div></div>
      </div>

      {/* Top pages + browsers */}
      <div className="adm-grid-2col" style={{ marginBottom: '1rem' }}>
        <div className="adm-card">
          <h2 className="adm-section-title" style={{ marginBottom: '.75rem' }}>Top Pages Visited</h2>
          {topPages.length === 0 ? (
            <div className="adm-empty" style={{ padding: '1rem' }}><div className="adm-empty__icon">📄</div><div className="adm-empty__text">No page data yet</div></div>
          ) : (
            topPages.map(([p, count]) => (
              <div key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.45rem 0', borderBottom: '1px solid rgba(22,163,74,0.08)' }}>
                <span style={{ color: 'var(--a-text)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>{p}</span>
                <span style={{ color: 'var(--a-green2)', fontWeight: 800 }}>{count}</span>
              </div>
            ))
          )}
        </div>

        <div className="adm-card">
          <h2 className="adm-section-title" style={{ marginBottom: '.75rem' }}>Browsers</h2>
          {topBrowsers.map(([br, count]) => {
            const pct = all.length ? Math.round((count / all.length) * 100) : 0
            return (
              <div key={br} style={{ marginBottom: '.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.25rem' }}>
                  <span style={{ color: 'var(--a-text)', fontWeight: 600 }}>{br}</span>
                  <span style={{ color: 'var(--a-muted)', fontWeight: 700 }}>{pct}% ({count})</span>
                </div>
                <div style={{ height: '5px', background: 'var(--a-card2)', borderRadius: '3px', border: '1px solid var(--a-border)' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--a-green), var(--a-green2))', borderRadius: '3px' }} />
                </div>
              </div>
            )
          })}
          {topBrowsers.length === 0 && <div className="adm-empty" style={{ padding: '1rem' }}><div className="adm-empty__icon">🌐</div><div className="adm-empty__text">No data yet</div></div>}
        </div>
      </div>

      {/* Filter */}
      <div className="adm-filter-bar">
        <div className="adm-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--a-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search by page, IP, browser, OS…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>

        {/* Scrollable device filter chips */}
        <div className="adm-filter-chips">
          {['all', 'Mobile', 'Desktop', 'Tablet'].map(type => (
            <button
              key={type}
              className={`adm-chip ${typeFilter === type ? 'active' : ''}`}
              onClick={() => { setType(type); setPage(1) }}
            >
              {type === 'all' ? `All Devices (${all.length})` : `${TYPE_ICON[type]} ${type}`}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="adm-desktop-only">
        <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>#</th><th>Timestamp</th><th>Page</th><th>IP Address</th><th>Device</th><th>Browser</th><th>OS</th></tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr><td colSpan={7}><div className="adm-empty"><div className="adm-empty__icon">👁️</div><div className="adm-empty__text">No visitor data found</div></div></td></tr>
                ) : (
                  visible.map((v, i) => (
                    <tr key={v.id}>
                      <td style={{ color: 'var(--a-dim)' }}>{(page - 1) * PER_PAGE + i + 1}</td>
                      <td style={{ color: 'var(--a-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(v.timestamp).toLocaleDateString('en-IN')}<br/>
                        <span style={{ color: 'var(--a-dim)' }}>{new Date(v.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--a-green2)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.page}</td>
                      <td style={{ fontFamily: 'monospace' }}>{v.ip}</td>
                      <td><span className={`adm-badge adm-badge--${TYPE_COLOR[v.type] || 'gray'}`}>{TYPE_ICON[v.type]} {v.type}</span></td>
                      <td>{v.browser}</td>
                      <td style={{ color: 'var(--a-muted)' }}>{v.os}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dedicated Mobile Cards */}
      <div className="adm-mobile-only">
        {visible.length === 0 ? (
          <div className="adm-card adm-empty">
            <div className="adm-empty__icon">👁️</div>
            <div className="adm-empty__text">No visitor data found</div>
          </div>
        ) : (
          <div className="adm-mobile-list">
            {visible.map((v, i) => (
              <div key={v.id} className="adm-mobile-card">
                <div className="adm-mobile-card__header">
                  <div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--a-green2)' }}>
                      #{(page - 1) * PER_PAGE + i + 1} · {new Date(v.timestamp).toLocaleDateString('en-IN')} {new Date(v.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="adm-mobile-card__title" style={{ fontFamily: 'monospace', marginTop: '.2rem' }}>
                      {v.page}
                    </div>
                  </div>
                  <span className={`adm-badge adm-badge--${TYPE_COLOR[v.type] || 'gray'}`}>{TYPE_ICON[v.type]} {v.type}</span>
                </div>

                <div className="adm-mobile-card__grid">
                  <div className="adm-mobile-card__row">
                    <span className="adm-mobile-card__label">Browser</span>
                    <span className="adm-mobile-card__val">{v.browser || '—'}</span>
                  </div>
                  <div className="adm-mobile-card__row">
                    <span className="adm-mobile-card__label">OS</span>
                    <span className="adm-mobile-card__val">{v.os || '—'}</span>
                  </div>
                  <div className="adm-mobile-card__row" style={{ gridColumn: '1 / -1' }}>
                    <span className="adm-mobile-card__label">IP Address</span>
                    <span className="adm-mobile-card__val" style={{ fontFamily: 'monospace' }}>{v.ip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '.6rem', marginTop: '1.25rem' }}>
          <button className="adm-btn adm-btn--ghost adm-btn--sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            ← Prev
          </button>
          <span style={{ padding: '.4rem .8rem', color: 'var(--a-muted)', fontWeight: 600 }}>
            Page {page} of {pages}
          </span>
          <button className="adm-btn adm-btn--ghost adm-btn--sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
