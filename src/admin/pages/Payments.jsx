import { useState } from 'react'
import { getPayments, savePayment, deletePayment } from '../adminData'
import ModalPortal from '../ModalPortal'

const METHODS  = ['cash', 'upi', 'card', 'online']
const STATUSES = ['pending', 'paid', 'refunded', 'failed']
const STATUS_COLOR = { paid: 'green', pending: 'yellow', refunded: 'blue', failed: 'red' }
const EMPTY = { id: '', orderId: '', customer: '', amount: '', method: 'upi', status: 'pending', reference: '', date: '', notes: '' }

export default function Payments() {
  const [payments, setPayments] = useState(getPayments)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [del, setDel]           = useState(null)

  const filtered = payments.filter(p => {
    const q = search.toLowerCase()
    const matchQ = !q || p.customer?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q) || p.orderId?.toLowerCase().includes(q) || p.reference?.toLowerCase().includes(q)
    return matchQ && (filter === 'all' || p.status === filter)
  })

  const totalPaid    = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0)

  function openNew()   { setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 10) }); setModal(true) }
  function openEdit(p) { setForm({ ...p }); setModal(true) }
  function set(k, v)   { setForm(f => ({ ...f, [k]: v })) }

  function handleSave() {
    const updated = savePayment({ ...form, amount: Number(form.amount) || 0 })
    setPayments(updated); setModal(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="adm-section-header">
        <div>
          <h1 className="adm-section-title" style={{ fontSize: 'var(--font-size-h2)' }}>💳 Payment Records</h1>
          <p style={{ fontSize: 'var(--font-size-h3)', color: 'var(--a-muted)', marginTop: '.15rem' }}>
            Track collections, transaction IDs, and settlement status.
          </p>
        </div>
        <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={openNew} style={{ minHeight: '38px' }}>
          + Log Payment
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="adm-stats-grid" style={{ marginTop: '.75rem', marginBottom: '1rem' }}>
        {[
          { label: 'Total Collected', val: `₹${totalPaid.toLocaleString('en-IN')}`, color: 'green', icon: '💰' },
          { label: 'Pending Amount',  val: `₹${totalPending.toLocaleString('en-IN')}`, color: 'warn', icon: '⏳' },
          { label: 'Total Payments',  val: payments.length, color: 'blue', icon: '💳' },
          { label: 'Paid Count',      val: payments.filter(p => p.status === 'paid').length, color: 'green', icon: '✅' },
        ].map(s => (
          <div key={s.label} className="adm-stat">
            <div className={`adm-stat__icon adm-stat__icon--${s.color}`}>{s.icon}</div>
            <div className="adm-stat__val">{s.val}</div>
            <div className="adm-stat__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="adm-filter-bar">
        <div className="adm-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--a-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search by customer, ID, reference…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--a-muted)', cursor: 'pointer', fontSize: 'var(--font-size-h3)' }}>✕</button>
          )}
        </div>

        {/* Scrollable filter chips */}
        <div className="adm-filter-chips">
          <button className={`adm-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            All ({payments.length})
          </button>
          {STATUSES.map(s => {
            const count = payments.filter(p => p.status === s).length
            return (
              <button key={s} className={`adm-chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                <span style={{ textTransform: 'capitalize' }}>{s}</span>
                {count > 0 && <span style={{ opacity: 0.8, fontSize: 'var(--font-size-h3)' }}>({count})</span>}
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
                <tr><th>Pay ID</th><th>Order Ref</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Reference</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={9}><div className="adm-empty"><div className="adm-empty__icon">💳</div><div className="adm-empty__text">No payments found</div></div></td></tr>
                  : filtered.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-h2)', color: 'var(--a-green2)', fontWeight: 700 }}>{p.id}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-h2)' }}>{p.orderId}</td>
                      <td style={{ fontWeight: 600, fontSize: 'var(--font-size-h3)' }}>{p.customer}</td>
                      <td style={{ fontWeight: 700 }}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                      <td><span className="adm-badge adm-badge--gray" style={{ textTransform: 'uppercase' }}>{p.method}</span></td>
                      <td><span className={`adm-badge adm-badge--${STATUS_COLOR[p.status] || 'gray'}`}>{p.status}</span></td>
                      <td style={{ fontSize: 'var(--font-size-h2)', fontFamily: 'monospace', color: 'var(--a-muted)' }}>{p.reference || '—'}</td>
                      <td style={{ fontSize: 'var(--font-size-h2)', color: 'var(--a-muted)' }}>{p.date ? new Date(p.date).toLocaleDateString('en-IN') : '—'}</td>
                      <td>
                        <div className="adm-table-actions">
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(p)}>Edit</button>
                          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDel(p.id)}>Del</button>
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
            <div className="adm-empty__icon">💳</div>
            <div className="adm-empty__text">No payments found</div>
          </div>
        ) : (
          <div className="adm-mobile-list">
            {filtered.map(p => (
              <div key={p.id} className="adm-mobile-card">
                <div className="adm-mobile-card__header">
                  <div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--a-green2)', fontSize: 'var(--font-size-h3)' }}>{p.id}</span>
                    <div className="adm-mobile-card__title" style={{ marginTop: '.2rem' }}>{p.customer}</div>
                  </div>
                  <span className={`adm-badge adm-badge--${STATUS_COLOR[p.status] || 'gray'}`}>{p.status}</span>
                </div>

                <div className="adm-mobile-card__grid">
                  <div className="adm-mobile-card__row">
                    <span className="adm-mobile-card__label">Amount</span>
                    <span className="adm-mobile-card__val adm-mobile-card__val--highlight">₹{Number(p.amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="adm-mobile-card__row">
                    <span className="adm-mobile-card__label">Method</span>
                    <span className="adm-badge adm-badge--gray" style={{ textTransform: 'uppercase', fontSize: 'var(--font-size-h2)' }}>{p.method}</span>
                  </div>
                  <div className="adm-mobile-card__row">
                    <span className="adm-mobile-card__label">Order</span>
                    <span className="adm-mobile-card__val" style={{ fontFamily: 'monospace' }}>{p.orderId || '—'}</span>
                  </div>
                  <div className="adm-mobile-card__row">
                    <span className="adm-mobile-card__label">Date</span>
                    <span className="adm-mobile-card__val">{p.date ? new Date(p.date).toLocaleDateString('en-IN') : '—'}</span>
                  </div>
                </div>

                {p.reference && (
                  <div style={{ fontSize: 'var(--font-size-h3)', fontFamily: 'monospace', color: 'var(--a-muted)', background: 'var(--a-card2)', padding: '.35rem .6rem', borderRadius: '6px', border: '1px solid var(--a-border)' }}>
                    Ref: {p.reference}
                  </div>
                )}

                <div className="adm-mobile-card__actions">
                  <button className="adm-btn adm-btn--outline adm-btn--sm" style={{ flex: 1 }} onClick={() => openEdit(p)}>
                    ✏️ Edit
                  </button>
                  <button className="adm-btn adm-btn--danger adm-btn--sm" style={{ flex: 0.6 }} onClick={() => setDel(p.id)}>
                    🗑 Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal (Slide-up Sheet for Mobile) */}
      {modal && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
            <div className="adm-modal">
              <div className="adm-modal__header">
                <span className="adm-modal__title">{form.id ? 'Edit Payment' : 'Log Payment'}</span>
                <button className="adm-modal__close" onClick={() => setModal(false)} aria-label="Close modal">✕</button>
              </div>
              <div className="adm-modal__body">
                <div className="adm-form-grid">
                  <div className="adm-form-group"><label className="adm-label">Customer Name</label><input className="adm-input" value={form.customer} onChange={e=>set('customer',e.target.value)} placeholder="Name" /></div>
                  <div className="adm-form-group"><label className="adm-label">Amount (₹)</label><input className="adm-input" type="number" value={form.amount} onChange={e=>set('amount',e.target.value)} placeholder="0" /></div>
                  <div className="adm-form-group"><label className="adm-label">Order ID Ref</label><input className="adm-input" value={form.orderId} onChange={e=>set('orderId',e.target.value)} placeholder="AZ-001" /></div>
                  <div className="adm-form-group"><label className="adm-label">Transaction Ref</label><input className="adm-input" value={form.reference} onChange={e=>set('reference',e.target.value)} placeholder="TXN123456" /></div>
                  <div className="adm-form-group"><label className="adm-label">Method</label>
                    <select className="adm-select-full" value={form.method} onChange={e=>set('method',e.target.value)}>
                      {METHODS.map(m=><option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="adm-form-group"><label className="adm-label">Status</label>
                    <select className="adm-select-full" value={form.status} onChange={e=>set('status',e.target.value)}>
                      {STATUSES.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="adm-form-group"><label className="adm-label">Date</label><input className="adm-input" type="date" value={form.date?form.date.slice(0,10):''} onChange={e=>set('date',e.target.value)} /></div>
                  <div className="adm-form-group adm-form-group--full"><label className="adm-label">Notes</label><textarea className="adm-textarea" value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Optional notes…" /></div>
                </div>
              </div>
              <div className="adm-modal__footer">
                <button className="adm-btn adm-btn--ghost" onClick={() => setModal(false)}>Cancel</button>
                <button className="adm-btn adm-btn--primary" onClick={handleSave}>Save Payment</button>
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
              <div className="adm-modal__title" style={{ marginBottom: '.75rem' }}>Delete Payment?</div>
              <p style={{ fontSize: 'var(--font-size-h2)', color: 'var(--a-muted)', marginBottom: '1.25rem' }}>This cannot be undone.</p>
              <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
                <button className="adm-btn adm-btn--ghost" onClick={() => setDel(null)}>Cancel</button>
                <button className="adm-btn adm-btn--danger" onClick={() => { setPayments(deletePayment(del)); setDel(null) }}>Delete</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
