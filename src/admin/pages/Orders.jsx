import { useState, useEffect } from 'react'
import { getOrders, saveOrder, deleteOrder } from '../adminData'
import ModalPortal from '../ModalPortal'

const STATUSES = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']
const STATUS_COLOR = { completed: 'green', confirmed: 'blue', 'in-progress': 'yellow', pending: 'yellow', cancelled: 'red' }
const SERVICES = ['Termite Treatment', 'Bed Bug Treatment', 'Cockroach Treatment', 'Rodent Treatment', 'Mosquito Treatment', 'General Pest Control', 'Wood Borer Treatment', 'Honey Bee Treatment', 'Residential Pest Control', 'Commercial Pest Control', 'Pre-Construction Termite', 'Post-Construction Termite']
const EMPTY = { id: '', customer: '', phone: '', email: '', service: 'Termite Treatment', area: '', address: '', date: '', time: '', status: 'pending', amount: '', notes: '' }

export default function Orders({ onStatsChange }) {
  const [orders, setOrders] = useState(getOrders)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(EMPTY)
  const [del, setDel]       = useState(null)

  useEffect(() => { if (onStatsChange) onStatsChange() }, [orders, onStatsChange])

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    const matchQ = !q || o.customer?.toLowerCase().includes(q) || o.phone?.includes(q) || o.id?.toLowerCase().includes(q) || o.service?.toLowerCase().includes(q) || o.area?.toLowerCase().includes(q)
    const matchF = filter === 'all' || o.status === filter
    return matchQ && matchF
  })

  function openNew()   { setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 10) }); setModal(true) }
  function openEdit(o) { setForm({ ...o }); setModal(true) }
  function closeModal(){ setModal(false) }

  function handleSave() {
    if (!form.customer || !form.phone || !form.service) return
    const updated = saveOrder({ ...form, amount: Number(form.amount) || 0 })
    setOrders(updated); closeModal()
  }

  function handleDelete(id) {
    setOrders(deleteOrder(id)); setDel(null)
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div>
      {/* Header & New Order Action */}
      <div className="adm-section-header">
        <div>
          <h1 className="adm-section-title" style={{ fontSize: '1.2rem' }}>📋 Customer Orders</h1>
          <p style={{ fontSize: '.75rem', color: 'var(--a-muted)', marginTop: '.15rem' }}>
            Manage bookings, schedule dates, and payment status.
          </p>
        </div>
        <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={openNew} style={{ minHeight: '38px' }}>
          + New Order
        </button>
      </div>

      {/* Filter bar */}
      <div className="adm-filter-bar" style={{ marginTop: '.75rem' }}>
        <div className="adm-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--a-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search by name, phone, ID, area…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--a-muted)', cursor: 'pointer', fontSize: '.9rem' }}>✕</button>
          )}
        </div>

        {/* Horizontally scrollable status chips */}
        <div className="adm-filter-chips">
          <button
            className={`adm-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({orders.length})
          </button>
          {STATUSES.map(s => {
            const count = orders.filter(o => o.status === s).length
            return (
              <button
                key={s}
                className={`adm-chip ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
              >
                <span style={{ textTransform: 'capitalize' }}>{s}</span>
                {count > 0 && <span style={{ opacity: 0.8, fontSize: '.65rem' }}>({count})</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="adm-desktop-only">
        <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>ID</th><th>Customer</th><th>Service</th><th>Area</th><th>Date & Time</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={8}><div className="adm-empty"><div className="adm-empty__icon">📋</div><div className="adm-empty__text">No orders found</div></div></td></tr>
                  : filtered.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 700, color: 'var(--a-green2)', fontFamily: 'monospace', fontSize: '.76rem' }}>{o.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '.84rem' }}>{o.customer}</div>
                        <div style={{ fontSize: '.7rem', color: 'var(--a-muted)' }}>{o.phone}</div>
                      </td>
                      <td style={{ fontSize: '.8rem' }}>{o.service}</td>
                      <td style={{ fontSize: '.8rem' }}>{o.area || '—'}</td>
                      <td style={{ fontSize: '.74rem', color: 'var(--a-muted)' }}>{o.date}<br/>{o.time}</td>
                      <td style={{ fontWeight: 700 }}>₹{Number(o.amount).toLocaleString('en-IN')}</td>
                      <td><span className={`adm-badge adm-badge--${STATUS_COLOR[o.status] || 'gray'}`}>{o.status}</span></td>
                      <td>
                        <div className="adm-table-actions">
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(o)}>Edit</button>
                          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDel(o.id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dedicated Mobile Cards View */}
      <div className="adm-mobile-only">
        {filtered.length === 0 ? (
          <div className="adm-card adm-empty">
            <div className="adm-empty__icon">📋</div>
            <div className="adm-empty__text">No orders found</div>
          </div>
        ) : (
          <div className="adm-mobile-list">
            {filtered.map(o => (
              <div key={o.id} className="adm-mobile-card">
                <div className="adm-mobile-card__header">
                  <div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--a-green2)', fontSize: '.8rem' }}>{o.id}</span>
                    <div className="adm-mobile-card__title" style={{ marginTop: '.2rem' }}>{o.customer}</div>
                  </div>
                  <span className={`adm-badge adm-badge--${STATUS_COLOR[o.status] || 'gray'}`}>{o.status}</span>
                </div>

                <div className="adm-mobile-card__grid">
                  <div className="adm-mobile-card__row">
                    <span className="adm-mobile-card__label">Service</span>
                    <span className="adm-mobile-card__val" style={{ maxWidth: '120px' }}>{o.service}</span>
                  </div>
                  <div className="adm-mobile-card__row">
                    <span className="adm-mobile-card__label">Amount</span>
                    <span className="adm-mobile-card__val adm-mobile-card__val--highlight">₹{Number(o.amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="adm-mobile-card__row">
                    <span className="adm-mobile-card__label">Area</span>
                    <span className="adm-mobile-card__val">{o.area || '—'}</span>
                  </div>
                  <div className="adm-mobile-card__row">
                    <span className="adm-mobile-card__label">Date</span>
                    <span className="adm-mobile-card__val">{o.date || '—'}</span>
                  </div>
                </div>

                {o.address && (
                  <div style={{ fontSize: '.72rem', color: 'var(--a-muted)', background: 'var(--a-card2)', padding: '.35rem .6rem', borderRadius: '6px', border: '1px solid var(--a-border)' }}>
                    📍 {o.address}
                  </div>
                )}

                <div className="adm-mobile-card__actions">
                  <a href={`tel:${o.phone}`} className="adm-btn adm-btn--green adm-btn--sm" style={{ flex: 1 }}>
                    📞 Call
                  </a>
                  <button className="adm-btn adm-btn--outline adm-btn--sm" style={{ flex: 1 }} onClick={() => openEdit(o)}>
                    ✏️ Edit
                  </button>
                  <button className="adm-btn adm-btn--danger adm-btn--sm" style={{ flex: 0.6 }} onClick={() => setDel(o.id)}>
                    🗑 Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Modal (Desktop & Mobile Slide-up Sheet) */}
      {modal && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className="adm-modal">
              <div className="adm-modal__header">
                <span className="adm-modal__title">{form.id ? 'Edit Order' : 'New Order'}</span>
                <button className="adm-modal__close" onClick={closeModal} aria-label="Close modal">✕</button>
              </div>
              <div className="adm-modal__body">
                <div className="adm-form-grid">
                  <div className="adm-form-group"><label className="adm-label">Customer Name *</label><input className="adm-input" value={form.customer} onChange={e=>set('customer',e.target.value)} placeholder="Full name" /></div>
                  <div className="adm-form-group"><label className="adm-label">Phone *</label><input className="adm-input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="10-digit number" /></div>
                  <div className="adm-form-group"><label className="adm-label">Email</label><input className="adm-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="email@example.com" /></div>
                  <div className="adm-form-group"><label className="adm-label">Amount (₹)</label><input className="adm-input" type="number" value={form.amount} onChange={e=>set('amount',e.target.value)} placeholder="0" /></div>
                  <div className="adm-form-group adm-form-group--full"><label className="adm-label">Service *</label>
                    <select className="adm-select-full" value={form.service} onChange={e=>set('service',e.target.value)}>
                      {SERVICES.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="adm-form-group"><label className="adm-label">Area</label><input className="adm-input" value={form.area} onChange={e=>set('area',e.target.value)} placeholder="Koramangala" /></div>
                  <div className="adm-form-group"><label className="adm-label">Status</label>
                    <select className="adm-select-full" value={form.status} onChange={e=>set('status',e.target.value)}>
                      {STATUSES.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="adm-form-group"><label className="adm-label">Date</label><input className="adm-input" type="date" value={form.date} onChange={e=>set('date',e.target.value)} /></div>
                  <div className="adm-form-group"><label className="adm-label">Time</label><input className="adm-input" type="time" value={form.time} onChange={e=>set('time',e.target.value)} /></div>
                  <div className="adm-form-group adm-form-group--full"><label className="adm-label">Address</label><input className="adm-input" value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Full address" /></div>
                  <div className="adm-form-group adm-form-group--full"><label className="adm-label">Notes</label><textarea className="adm-textarea" value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Additional notes…" /></div>
                </div>
              </div>
              <div className="adm-modal__footer">
                <button className="adm-btn adm-btn--ghost" onClick={closeModal}>Cancel</button>
                <button className="adm-btn adm-btn--primary" onClick={handleSave}>Save Order</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Delete confirm */}
      {del && (
        <ModalPortal>
          <div className="adm-modal-overlay">
            <div className="adm-modal" style={{ maxWidth: 360 }}>
              <div className="adm-modal__title" style={{ marginBottom: '.75rem' }}>Delete Order?</div>
              <p style={{ fontSize: '.82rem', color: 'var(--a-muted)', marginBottom: '1.25rem' }}>This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
                <button className="adm-btn adm-btn--ghost" onClick={() => setDel(null)}>Cancel</button>
                <button className="adm-btn adm-btn--danger" onClick={() => handleDelete(del)}>Delete</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
