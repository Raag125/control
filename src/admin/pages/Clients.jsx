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
          <h1 className="adm-section-title" style={{ fontSize: '1.25rem' }}>👥 Clients &amp; Leads</h1>
          <p style={{ fontSize: '.78rem', color: 'var(--a-muted)', marginTop: '.2rem' }}>
            All lead submissions from the website popup and contact form.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '.75rem', margin: '1rem 0 1.25rem' }}>
        {[
          { label: 'Total Leads',  value: counts.all,       color: 'var(--a-text)' },
          { label: 'New',          value: counts.new,        color: '#d97706' },
          { label: 'Contacted',    value: counts.contacted,  color: '#2563eb' },
          { label: 'Booked',       value: counts.booked,     color: '#16a34a' },
          { label: 'Closed',       value: counts.closed,     color: 'var(--a-muted)' },
        ].map(s => (
          <div key={s.label} className="adm-card" style={{ padding: '.85rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '.68rem', color: 'var(--a-muted)', marginTop: '.2rem', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="adm-filter-bar" style={{ gap: '.6rem', marginBottom: '1rem' }}>
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, phone or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
          {STATUS_OPTS.map(s => (
            <button
              key={s}
              className={`adm-btn adm-btn--sm ${filter === s ? 'adm-btn--primary' : 'adm-btn--ghost'}`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span style={{ fontSize: '.65rem', opacity: .7, marginLeft: '.2rem' }}>({counts[s]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="adm-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--a-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>👥</div>
          <p>No leads found. Leads will appear here once visitors submit the contact or popup form.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {filtered.map(client => {
            const badge = STATUS_BADGE[client.status] || STATUS_BADGE.new
            const srcLabel = SOURCE_BADGE[client.source] || client.source
            return (
              <div key={client.id} className="adm-card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1rem' }}>

                  {/* Avatar */}
                  <div className="adm-avatar" style={{ fontSize: '.85rem', flexShrink: 0 }}>
                    {client.name?.[0]?.toUpperCase() || '?'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', alignItems: 'center', marginBottom: '.25rem' }}>
                      <strong style={{ fontSize: '.95rem', color: 'var(--a-text)' }}>{client.name || '—'}</strong>
                      <span className={`adm-badge ${badge.cls}`}>{badge.label}</span>
                      <span style={{ fontSize: '.7rem', color: 'var(--a-muted)', background: 'var(--a-surface-2)', padding: '.1rem .4rem', borderRadius: '4px' }}>{srcLabel}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.85rem', fontSize: '.8rem', color: 'var(--a-muted)' }}>
                      <a href={`tel:${client.phone}`} style={{ color: 'var(--a-green)', fontWeight: 700 }}>📞 {client.phone}</a>
                      {client.email && <span>✉️ {client.email}</span>}
                      {client.service && <span>🦟 {client.service}</span>}
                      <span>🕐 {formatTime(client.createdAt)}</span>
                    </div>
                    {client.message && (
                      <p style={{ fontSize: '.78rem', color: 'var(--a-muted)', marginTop: '.35rem', fontStyle: 'italic' }}>
                        "{client.message}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', flexShrink: 0 }}>
                    <a
                      href={`tel:${client.phone}`}
                      className="adm-btn adm-btn--green adm-btn--sm"
                      style={{ gap: '.3rem' }}
                      title="Call this lead"
                    >
                      📞 Call
                    </a>
                    <a
                      href={`https://wa.me/91${client.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="adm-btn adm-btn--outline adm-btn--sm"
                      style={{ borderColor: '#22c55e', color: '#15803d', gap: '.3rem' }}
                      title="WhatsApp this lead"
                    >
                      💬 WA
                    </a>
                    <select
                      className="adm-btn adm-btn--ghost adm-btn--sm"
                      value={client.status}
                      onChange={e => handleStatus(client.id, e.target.value)}
                      style={{ cursor: 'pointer', minWidth: '100px' }}
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
                      title="Delete lead"
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
