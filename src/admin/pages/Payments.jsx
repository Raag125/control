import { useState } from 'react'
import { getPayments, savePayment, deletePayment } from '../adminData'
import ModalPortal from '../ModalPortal'

const METHODS  = ['cash','upi','card','online']
const STATUSES = ['pending','paid','refunded','failed']
const STATUS_COLOR = { paid:'green', pending:'yellow', refunded:'blue', failed:'red' }
const EMPTY = { id:'', orderId:'', customer:'', amount:'', method:'upi', status:'pending', reference:'', date:'', notes:'' }

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

  const totalPaid    = payments.filter(p=>p.status==='paid').reduce((s,p)=>s+Number(p.amount),0)
  const totalPending = payments.filter(p=>p.status==='pending').reduce((s,p)=>s+Number(p.amount),0)

  function openNew()  { setForm({...EMPTY, date: new Date().toISOString().slice(0,10)}); setModal(true) }
  function openEdit(p){ setForm({...p}); setModal(true) }
  function set(k,v)   { setForm(f=>({...f,[k]:v})) }

  function handleSave() {
    const updated = savePayment({...form, amount: Number(form.amount)||0})
    setPayments(updated); setModal(false)
  }

  return (
    <div>
      {/* Summary row */}
      <div className="adm-stats-grid" style={{ marginBottom:'1.25rem' }}>
        {[
          { label:'Total Collected', val:`₹${totalPaid.toLocaleString('en-IN')}`, color:'green', icon:'💰' },
          { label:'Pending Amount',  val:`₹${totalPending.toLocaleString('en-IN')}`, color:'warn', icon:'⏳' },
          { label:'Total Payments',  val:payments.length, color:'blue', icon:'💳' },
          { label:'Paid Count',      val:payments.filter(p=>p.status==='paid').length, color:'green', icon:'✅' },
        ].map(s=>(
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--a-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search by customer, ID, reference…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="adm-select" value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">All Status</option>
          {STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={openNew}>+ Log Payment</button>
      </div>

      {/* Table */}
      <div className="adm-card" style={{ padding:0, overflow:'hidden' }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Pay ID</th><th>Order Ref</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Reference</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={9}><div className="adm-empty"><div className="adm-empty__icon">💳</div><div className="adm-empty__text">No payments found</div></div></td></tr>
                : filtered.map(p=>(
                  <tr key={p.id}>
                    <td style={{ fontFamily:'monospace', fontSize:'.7rem', color:'var(--a-green2)', fontWeight:700 }}>{p.id}</td>
                    <td style={{ fontFamily:'monospace', fontSize:'.7rem' }}>{p.orderId}</td>
                    <td style={{ fontWeight:600, fontSize:'.82rem' }}>{p.customer}</td>
                    <td style={{ fontWeight:700 }}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                    <td><span className="adm-badge adm-badge--gray" style={{ textTransform:'uppercase' }}>{p.method}</span></td>
                    <td><span className={`adm-badge adm-badge--${STATUS_COLOR[p.status]||'gray'}`}>{p.status}</span></td>
                    <td style={{ fontSize:'.7rem', fontFamily:'monospace', color:'var(--a-muted)' }}>{p.reference||'—'}</td>
                    <td style={{ fontSize:'.7rem', color:'var(--a-muted)' }}>{p.date?new Date(p.date).toLocaleDateString('en-IN'):''}</td>
                    <td>
                      <div className="adm-table-actions">
                        <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={()=>openEdit(p)}>Edit</button>
                        <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={()=>setDel(p.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
            <div className="adm-modal">
              <div className="adm-modal__header">
                <span className="adm-modal__title">{form.id?'Edit Payment':'Log Payment'}</span>
                <button className="adm-modal__close" onClick={()=>setModal(false)}>✕</button>
              </div>
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
              <div style={{ display:'flex', gap:'.75rem', marginTop:'1.25rem', justifyContent:'flex-end' }}>
                <button className="adm-btn adm-btn--ghost" onClick={()=>setModal(false)}>Cancel</button>
                <button className="adm-btn adm-btn--primary" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {del && (
        <ModalPortal>
          <div className="adm-modal-overlay">
            <div className="adm-modal" style={{ maxWidth:360 }}>
              <div className="adm-modal__title" style={{ marginBottom:'.75rem' }}>Delete Payment?</div>
              <p style={{ fontSize:'.82rem', color:'var(--a-muted)', marginBottom:'1.25rem' }}>This cannot be undone.</p>
              <div style={{ display:'flex', gap:'.75rem', justifyContent:'flex-end' }}>
                <button className="adm-btn adm-btn--ghost" onClick={()=>setDel(null)}>Cancel</button>
                <button className="adm-btn adm-btn--danger" onClick={()=>{setPayments(deletePayment(del));setDel(null)}}>Delete</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
