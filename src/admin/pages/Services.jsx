import { useState } from 'react'
import { getServices, saveService, deleteService } from '../adminData'
import ModalPortal from '../ModalPortal'

const CATEGORIES = ['Termite','Bugs','Insects','Rodents','Wood','General']
const EMPTY = { id:'', name:'', category:'General', description:'', startingPrice:'', duration:'', warranty:'', isActive:true, emoji:'🐛', path:'' }

export default function Services() {
  const [services, setServices] = useState(getServices)
  const [search, setSearch]     = useState('')
  const [catFilter, setCat]     = useState('all')
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [del, setDel]           = useState(null)

  const filtered = services.filter(s => {
    const q = search.toLowerCase()
    const matchQ = !q || s.name?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q)
    return matchQ && (catFilter === 'all' || s.category === catFilter)
  })

  function openNew()  { setForm(EMPTY); setModal(true) }
  function openEdit(s){ setForm({...s}); setModal(true) }
  function set(k,v)   { setForm(f=>({...f,[k]:v})) }

  function handleSave() {
    if (!form.name) return
    const updated = saveService({ ...form, startingPrice: Number(form.startingPrice)||0 })
    setServices(updated); setModal(false)
  }

  function toggleActive(svc) {
    const updated = saveService({ ...svc, isActive: !svc.isActive })
    setServices(updated)
  }

  return (
    <div>
      {/* Summary */}
      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        {[
          { label:'Total Services', val:services.length, color:'blue' },
          { label:'Active', val:services.filter(s=>s.isActive).length, color:'green' },
          { label:'Inactive', val:services.filter(s=>!s.isActive).length, color:'warn' },
        ].map(s=>(
          <div key={s.label} className="adm-stat" style={{ flex:'1', minWidth:'140px' }}>
            <div className="adm-stat__val">{s.val}</div>
            <div className="adm-stat__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="adm-filter-bar">
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--a-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search services…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="adm-select" value={catFilter} onChange={e=>setCat(e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
        <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={openNew}>+ Add Service</button>
      </div>

      {/* Cards grid on desktop, list on mobile */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1rem' }}>
        {filtered.length === 0
          ? <div className="adm-empty adm-card" style={{ gridColumn:'1/-1' }}><div className="adm-empty__icon">⚙️</div><div className="adm-empty__text">No services found</div></div>
          : filtered.map(svc => (
            <div key={svc.id} className="adm-card adm-card--hover" style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'.5rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}>
                  <span style={{ fontSize:'1.5rem' }}>{svc.emoji}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'.88rem', color:'var(--a-text)' }}>{svc.name}</div>
                    <span className="adm-badge adm-badge--gray" style={{ fontSize:'.6rem' }}>{svc.category}</span>
                  </div>
                </div>
                <label className="adm-toggle" title={svc.isActive?'Deactivate':'Activate'}>
                  <input type="checkbox" checked={svc.isActive} onChange={()=>toggleActive(svc)} />
                  <div className="adm-toggle__track"><div className="adm-toggle__thumb"/></div>
                </label>
              </div>

              <p style={{ fontSize:'.75rem', color:'var(--a-muted)', lineHeight:1.5 }}>{svc.description}</p>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'.4rem' }}>
                {[
                  { l:'From', v:`₹${Number(svc.startingPrice).toLocaleString('en-IN')}` },
                  { l:'Duration', v:svc.duration },
                  { l:'Warranty', v:svc.warranty },
                ].map(f=>(
                  <div key={f.l} style={{ background:'var(--a-card2)', borderRadius:'8px', padding:'.4rem .6rem', border:'1px solid var(--a-border)' }}>
                    <div style={{ fontSize:'.58rem', color:'var(--a-dim)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em' }}>{f.l}</div>
                    <div style={{ fontSize:'.75rem', fontWeight:700, color:'var(--a-text)', marginTop:'.1rem' }}>{f.v||'—'}</div>
                  </div>
                ))}
              </div>

              {svc.path && (
                <div style={{ fontSize:'.68rem', color:'var(--a-muted)', fontFamily:'monospace', background:'var(--a-card2)', padding:'.3rem .6rem', borderRadius:'6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{svc.path}</div>
              )}

              <div style={{ display:'flex', gap:'.5rem', marginTop:'auto' }}>
                <button className="adm-btn adm-btn--outline adm-btn--sm" style={{ flex:1, justifyContent:'center' }} onClick={()=>openEdit(svc)}>Edit</button>
                <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={()=>setDel(svc.id)}>Del</button>
              </div>
            </div>
          ))
        }
      </div>

      {/* Modal */}
      {modal && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
            <div className="adm-modal">
              <div className="adm-modal__header">
                <span className="adm-modal__title">{form.id?'Edit Service':'Add Service'}</span>
                <button className="adm-modal__close" onClick={()=>setModal(false)}>✕</button>
              </div>
              <div className="adm-form-grid">
                <div className="adm-form-group"><label className="adm-label">Emoji Icon</label><input className="adm-input" value={form.emoji} onChange={e=>set('emoji',e.target.value)} placeholder="🐛" /></div>
                <div className="adm-form-group"><label className="adm-label">Category</label>
                  <select className="adm-select-full" value={form.category} onChange={e=>set('category',e.target.value)}>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="adm-form-group adm-form-group--full"><label className="adm-label">Service Name *</label><input className="adm-input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Termite Treatment" /></div>
                <div className="adm-form-group adm-form-group--full"><label className="adm-label">Description</label><textarea className="adm-textarea" value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Brief description of the service…" /></div>
                <div className="adm-form-group"><label className="adm-label">Starting Price (₹)</label><input className="adm-input" type="number" value={form.startingPrice} onChange={e=>set('startingPrice',e.target.value)} placeholder="2500" /></div>
                <div className="adm-form-group"><label className="adm-label">Duration</label><input className="adm-input" value={form.duration} onChange={e=>set('duration',e.target.value)} placeholder="2-3 hrs" /></div>
                <div className="adm-form-group"><label className="adm-label">Warranty</label><input className="adm-input" value={form.warranty} onChange={e=>set('warranty',e.target.value)} placeholder="5 Years" /></div>
                <div className="adm-form-group"><label className="adm-label">URL Path</label><input className="adm-input" value={form.path} onChange={e=>set('path',e.target.value)} placeholder="/termite-treatment" /></div>
                <div className="adm-form-group adm-form-group--full">
                  <label className="adm-toggle">
                    <input type="checkbox" checked={form.isActive} onChange={e=>set('isActive',e.target.checked)} />
                    <div className="adm-toggle__track"><div className="adm-toggle__thumb"/></div>
                    <span className="adm-toggle__label">Service is Active (visible on website)</span>
                  </label>
                </div>
              </div>
              <div style={{ display:'flex', gap:'.75rem', marginTop:'1.25rem', justifyContent:'flex-end' }}>
                <button className="adm-btn adm-btn--ghost" onClick={()=>setModal(false)}>Cancel</button>
                <button className="adm-btn adm-btn--primary" onClick={handleSave}>Save Service</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {del && (
        <ModalPortal>
          <div className="adm-modal-overlay">
            <div className="adm-modal" style={{ maxWidth:360 }}>
              <div className="adm-modal__title" style={{ marginBottom:'.75rem' }}>Delete Service?</div>
              <p style={{ fontSize:'.82rem', color:'var(--a-muted)', marginBottom:'1.25rem' }}>This cannot be undone.</p>
              <div style={{ display:'flex', gap:'.75rem', justifyContent:'flex-end' }}>
                <button className="adm-btn adm-btn--ghost" onClick={()=>setDel(null)}>Cancel</button>
                <button className="adm-btn adm-btn--danger" onClick={()=>{setServices(deleteService(del));setDel(null)}}>Delete</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
