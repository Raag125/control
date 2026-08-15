'use client'

import { useState, useCallback } from 'react'
import { getClients, updateClientStatus, deleteClient } from '../clientsData'
import toast from 'react-hot-toast'

const STATUS_OPTS = ['all', 'new', 'contacted', 'booked', 'closed']

const STATUS_BADGE = {
  new:       { label: 'New Lead',   cls: 'adm-badge--yellow' },
  contacted: { label: 'Contacted',  cls: 'adm-badge--blue'   },
  booked:    { label: 'Booked',     cls: 'adm-badge--green'  },
  closed:    { label: 'Closed',     cls: 'adm-badge--gray'   },
}

const SOURCE_BADGE = {
  'Popup Form':   '🔔 Popup',
  'Contact Form': '📩 Contact',
  'Website':      '🌐 Website',
}

function formatTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function Clients() {
  const [clients, setClients] = useState(() => getClients())
  const [filter,  setFilter]  = useState('all')
  const [search,  setSearch]  = useState('')

  const refresh = useCallback(() => setClients(getClients()), [])

  const handleStatus = (id, status) => {
    updateClientStatus(id, status)
    refresh()
    toast.success('Lead status updated')
  }

  const handleDelete = (id, name) => {
    if (!confirm(`Delete lead "${name}"?`)) return
    deleteClient(id)
    refresh()
    toast.success('Lead deleted')
  }

  const filtered = clients.filter(c => {
    const matchStatus = filter === 'all' || c.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email || '').toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const counts = STATUS_OPTS.reduce((acc, s) => {
    acc[s] = s === 'all' ? clients.length : clients.filter(c => c.status === s).length
    return acc
  }, {})

  return (
    <div>
      {/* Page header */}
      <div className="adm-section-header">
        <div>
          <h1 className="adm-section-title" style={{ fontSize: '1.2rem' }}>👥 Customer Leads &amp; Inquiries</h1>
          <p style={{ fontSize: '.75rem', color: 'var(--a-muted)', marginTop: '.15rem' }}>
            Lead submissions captured from website popups and contact forms.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '.6rem', marginTop: '.75rem', marginBottom: '1rem' }}>
        {[
          { label: 'Total Leads',  value: counts.all,       color: 'var(--a-text)' },
          { label: 'New',          value: counts.new,       color: '#d97706' },
          { label: 'Contacted',    value: counts.contacted, color: '#2563eb' },
          { label: 'Booked',       value: counts.booked,    color: '#16a34a' },
          { label: 'Closed',       value: counts.closed,    color: 'var(--a-muted)' },
        ].map(s => (
          <div key={s.label} className="adm-card" style={{ padding: '.75rem .85rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '.68rem', color: 'var(--a-muted)', marginTop: '.2rem', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="adm-filter-bar">
        <div className="adm-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, phone or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--a-muted)', cursor: 'pointer', fontSize: '.9rem' }}>✕</button>
          )}
        </div>

        {/* Scrollable Status Chips */}
        <div className="adm-filter-chips">
          {STATUS_OPTS.map(s => (
            <button
              key={s}
              className={`adm-chip ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              <span style={{ textTransform: 'capitalize' }}>{s}</span>
              <span style={{ opacity: 0.8, fontSize: '.65rem' }}>({counts[s]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lead Cards List */}
      {filtered.length === 0 ? (
        <div className="adm-card adm-empty">
          <div className="adm-empty__icon">👥</div>
          <div className="adm-empty__text">No leads found. Submissions from the website will appear here in real time.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {filtered.map(client => {
            const badge = STATUS_BADGE[client.status] || STATUS_BADGE.new
            const srcLabel = SOURCE_BADGE[client.source] || client.source
            const cleanPhone = client.phone ? client.phone.replace(/\D/g, '') : ''

            return (
              <div key={client.id} className="adm-card adm-card--hover" style={{ padding: '.95rem 1.1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
                  
                  {/* Top info header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                      <div className="adm-avatar" style={{ width: '38px', height: '38px', fontSize: '.85rem', flexShrink: 0 }}>
                        {client.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '.92rem', color: 'var(--a-text)', lineHeight: 1.2 }}>
                          {client.name || 'Anonymous Lead'}
                        </div>
                        <div style={{ fontSize: '.68rem', color: 'var(--a-muted)', marginTop: '.15rem' }}>
                          🕐 {formatTime(client.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span className={`adm-badge ${badge.cls}`}>{badge.label}</span>
                      <span className="adm-badge adm-badge--gray" style={{ fontSize: '.62rem' }}>{srcLabel}</span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="adm-mobile-card__grid" style={{ background: 'var(--a-card2)', padding: '.5rem .65rem', borderRadius: '8px', border: '1px solid var(--a-border)' }}>
                    <div className="adm-mobile-card__row">
                      <span className="adm-mobile-card__label">Phone</span>
                      <a href={`tel:${client.phone}`} className="adm-mobile-card__val" style={{ color: 'var(--a-green2)', textDecoration: 'none' }}>
                        📞 {client.phone}
                      </a>
                    </div>
                    <div className="adm-mobile-card__row">
                      <span className="adm-mobile-card__label">Service</span>
                      <span className="adm-mobile-card__val">{client.service || 'General Inq.'}</span>
                    </div>
                    {client.email && (
                      <div className="adm-mobile-card__row" style={{ gridColumn: '1 / -1' }}>
                        <span className="adm-mobile-card__label">Email</span>
                        <a href={`mailto:${client.email}`} className="adm-mobile-card__val" style={{ color: 'var(--a-info)', textDecoration: 'none' }}>
                          ✉️ {client.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Message Quote */}
                  {client.message && (
                    <p style={{ fontSize: '.76rem', color: 'var(--a-muted)', fontStyle: 'italic', lineHeight: 1.4, padding: '.35rem .5rem', background: 'rgba(22,163,74,0.04)', borderRadius: '6px', borderLeft: '3px solid var(--a-green2)' }}>
                      "{client.message}"
                    </p>
                  )}

                  {/* Quick Action Controls */}
                  <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', paddingTop: '.5rem', borderTop: '1px solid rgba(22,163,74,0.1)' }}>
                    <a
                      href={`tel:${client.phone}`}
                      className="adm-btn adm-btn--green adm-btn--sm"
                      style={{ flex: 1, minHeight: '38px' }}
                      title="Call this lead"
                    >
                      📞 Call
                    </a>
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/91${cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="adm-btn adm-btn--outline adm-btn--sm"
                        style={{ flex: 1, minHeight: '38px', borderColor: '#22c55e', color: '#15803d' }}
                        title="WhatsApp this lead"
                      >
                        💬 WhatsApp
                      </a>
                    )}
                    <select
                      className="adm-select"
                      value={client.status}
                      onChange={e => handleStatus(client.id, e.target.value)}
                      style={{ flex: 1.2, minHeight: '38px', padding: '.2rem .5rem', fontSize: '.75rem' }}
                      aria-label="Change lead status"
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="booked">Booked</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      className="adm-btn adm-btn--danger adm-btn--sm"
                      onClick={() => handleDelete(client.id, client.name)}
                      style={{ minHeight: '38px', padding: '.4rem .7rem' }}
                      title="Delete lead"
                      aria-label="Delete lead"
                    >
                      🗑
                    </button>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
