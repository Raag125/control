import { useState, useEffect } from 'react'
import { getOrders, saveOrder, deleteOrder } from '../adminData'
import ModalPortal from '../ModalPortal'

const STATUSES = ['pending','confirmed','in-progress','completed','cancelled']
const STATUS_COLOR = { completed:'green', confirmed:'blue', 'in-progress':'yellow', pending:'yellow', cancelled:'red' }
const SERVICES = ['Termite Treatment','Bed Bug Treatment','Cockroach Treatment','Rodent Treatment','Mosquito Treatment','General Pest Control','Wood Borer Treatment','Honey Bee Treatment','Residential Pest Control','Commercial Pest Control','Pre-Construction Termite','Post-Construction Termite']
const EMPTY = { id:'', customer:'', phone:'', email:'', service:'Termite Treatment', area:'', address:'', date:'', time:'', status:'pending', amount:'', notes:'' }

export default function Orders({ onStatsChange }) {
  const [orders, setOrders]   = useState(getOrders)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const [del, setDel]         = useState(null)

  useEffect(() => { if (onStatsChange) onStatsChange() }, [orders])

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    const matchQ = !q || o.customer?.toLowerCase().includes(q) || o.phone?.includes(q) || o.id?.toLowerCase().includes(q) || o.service?.toLowerCase().includes(q)
    const matchF = filter === 'all' || o.status === filter
    return matchQ && matchF
  })

  function openNew()  { setForm(EMPTY); setModal(true) }
  function openEdit(o){ setForm({...o}); setModal(true) }
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
      {/* Filter bar */}
      <div className="adm-filter-bar">
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--a-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search by name, phone, ID…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adm-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={openNew}>+ New Order</button>
      </div>

      {/* Summary chips */}
      <div style={{ display:'flex', gap:'.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
        {STATUSES.map(s => {
          const c = orders.filter(o => o.status === s).length
          return c > 0 ? <span key={s} className={`adm-badge adm-badge--${STATUS_COLOR[s]}`}>{s}: {c}</span> : null
        })}
      </div>

      {/* Table */}
      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>ID</th><th>Customer</th><th>Service</th><th>Area</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={8}><div className="adm-empty"><div className="adm-empty__icon">📋</div><div className="adm-empty__text">No orders found</div></div></td></tr>
                : filtered.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight:700, color:'var(--a-green2)', fontFamily:'monospace', fontSize:'.72rem' }}>{o.id}</td>
                    <td>
                      <div style={{ fontWeight:600, fontSize:'.82rem' }}>{o.customer}</div>
                      <div style={{ fontSize:'.68rem', color:'var(--a-muted)' }}>{o.phone}</div>
                    </td>
                    <td style={{ fontSize:'.78rem' }}>{o.service}</td>
                    <td style={{ fontSize:'.78rem' }}>{o.area}</td>
                    <td style={{ fontSize:'.72rem', color:'var(--a-muted)' }}>{o.date}<br/>{o.time}</td>
                    <td style={{ fontWeight:700 }}>₹{Number(o.amount).toLocaleString('en-IN')}</td>
                    <td><span className={`adm-badge adm-badge--${STATUS_COLOR[o.status]||'gray'}`}>{o.status}</span></td>
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

      {/* Order Modal */}
      {modal && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className="adm-modal">
              <div className="adm-modal__header">
                <span className="adm-modal__title">{form.id ? 'Edit Order' : 'New Order'}</span>
                <button className="adm-modal__close" onClick={closeModal}>✕</button>
              </div>
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
              <div style={{ display:'flex', gap:'.75rem', marginTop:'1.25rem', justifyContent:'flex-end' }}>
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
              <div className="adm-modal__title" style={{ marginBottom:'.75rem' }}>Delete Order?</div>
              <p style={{ fontSize:'.82rem', color:'var(--a-muted)', marginBottom:'1.25rem' }}>This action cannot be undone.</p>
              <div style={{ display:'flex', gap:'.75rem', justifyContent:'flex-end' }}>
                <button className="adm-btn adm-btn--ghost" onClick={()=>setDel(null)}>Cancel</button>
                <button className="adm-btn adm-btn--danger" onClick={()=>handleDelete(del)}>Delete</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
