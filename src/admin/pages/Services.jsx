import { useState } from 'react'
import { getServices, saveService, deleteService } from '../adminData'
import ModalPortal from '../ModalPortal'

const CATEGORIES = ['Termite', 'Bugs', 'Insects', 'Rodents', 'Wood', 'General']
const EMPTY = { id: '', name: '', category: 'General', description: '', startingPrice: '', duration: '', warranty: '', isActive: true, emoji: '🐛', path: '' }

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

  function openNew()   { setForm(EMPTY); setModal(true) }
  function openEdit(s) { setForm({ ...s }); setModal(true) }
  function set(k, v)   { setForm(f => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.name) return
    const updated = saveService({ ...form, startingPrice: Number(form.startingPrice) || 0 })
    setServices(updated); setModal(false)
  }

  function toggleActive(svc) {
    const updated = saveService({ ...svc, isActive: !svc.isActive })
    setServices(updated)
  }

  return (
    <div>
      {/* Header */}
      <div className="adm-section-header">
        <div>
          <h1 className="adm-section-title" style={{ fontSize: '1.2rem' }}>⚙️ Pest Control Services</h1>
          <p style={{ fontSize: '.75rem', color: 'var(--a-muted)', marginTop: '.15rem' }}>
            Manage pricing, warranties, treatment duration, and service visibility.
          </p>
        </div>
        <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={openNew} style={{ minHeight: '38px' }}>
          + Add Service
        </button>
      </div>

      {/* Summary Chips Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '.6rem', marginTop: '.75rem', marginBottom: '1rem' }}>
        {[
          { label: 'Total Services', val: services.length, color: 'var(--a-text)' },
          { label: 'Active',         val: services.filter(s => s.isActive).length, color: 'var(--a-green2)' },
          { label: 'Inactive',       val: services.filter(s => !s.isActive).length, color: 'var(--a-warn)' },
        ].map(s => (
          <div key={s.label} className="adm-card" style={{ padding: '.75rem .9rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: '.68rem', color: 'var(--a-muted)', marginTop: '.2rem', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="adm-filter-bar">
        <div className="adm-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--a-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search services…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--a-muted)', cursor: 'pointer', fontSize: '.9rem' }}>✕</button>
          )}
        </div>

        {/* Scrollable Category Chips */}
        <div className="adm-filter-chips">
          <button className={`adm-chip ${catFilter === 'all' ? 'active' : ''}`} onClick={() => setCat('all')}>
            All Categories ({services.length})
          </button>
          {CATEGORIES.map(c => {
            const count = services.filter(s => s.category === c).length
            return (
              <button key={c} className={`adm-chip ${catFilter === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                <span>{c}</span>
                {count > 0 && <span style={{ opacity: 0.8, fontSize: '.65rem' }}>({count})</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Services Grid (Responsive cards) */}
      <div className="adm-services-grid">
        {filtered.length === 0 ? (
          <div className="adm-empty adm-card" style={{ gridColumn: '1 / -1' }}>
            <div className="adm-empty__icon">⚙️</div>
            <div className="adm-empty__text">No services found</div>
          </div>
        ) : (
          filtered.map(svc => (
            <div key={svc.id} className="adm-card adm-card--hover" style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                  <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{svc.emoji || '🐛'}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '.9rem', color: 'var(--a-text)' }}>{svc.name}</div>
                    <span className="adm-badge adm-badge--gray" style={{ fontSize: '.62rem', marginTop: '.2rem' }}>{svc.category}</span>
                  </div>
                </div>
                <label className="adm-toggle" title={svc.isActive ? 'Deactivate' : 'Activate'}>
                  <input type="checkbox" checked={svc.isActive} onChange={() => toggleActive(svc)} />
                  <div className="adm-toggle__track"><div className="adm-toggle__thumb"/></div>
                </label>
              </div>

              {svc.description && (
                <p style={{ fontSize: '.76rem', color: 'var(--a-muted)', lineHeight: 1.5 }}>{svc.description}</p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.4rem' }}>
                {[
                  { l: 'From',     v: `₹${Number(svc.startingPrice).toLocaleString('en-IN')}` },
                  { l: 'Duration', v: svc.duration },
                  { l: 'Warranty', v: svc.warranty },
                ].map(f => (
                  <div key={f.l} style={{ background: 'var(--a-card2)', borderRadius: '8px', padding: '.45rem .6rem', border: '1px solid var(--a-border)' }}>
                    <div style={{ fontSize: '.58rem', color: 'var(--a-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>{f.l}</div>
                    <div style={{ fontSize: '.78rem', fontWeight: 800, color: 'var(--a-text)', marginTop: '.1rem' }}>{f.v || '—'}</div>
                  </div>
                ))}
              </div>

              {svc.path && (
                <div style={{ fontSize: '.7rem', color: 'var(--a-muted)', fontFamily: 'monospace', background: 'var(--a-card2)', padding: '.35rem .6rem', borderRadius: '6px', border: '1px solid var(--a-border)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  🔗 {svc.path}
                </div>
              )}

              <div style={{ display: 'flex', gap: '.5rem', marginTop: 'auto', paddingTop: '.5rem', borderTop: '1px solid rgba(22,163,74,0.1)' }}>
                <button className="adm-btn adm-btn--outline adm-btn--sm" style={{ flex: 1 }} onClick={() => openEdit(svc)}>
                  ✏️ Edit
                </button>
                <button className="adm-btn adm-btn--danger adm-btn--sm" style={{ flex: 0.5 }} onClick={() => setDel(svc.id)}>
                  🗑 Del
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Service Modal */}
      {modal && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
            <div className="adm-modal">
              <div className="adm-modal__header">
                <span className="adm-modal__title">{form.id ? 'Edit Service' : 'Add Service'}</span>
                <button className="adm-modal__close" onClick={() => setModal(false)} aria-label="Close modal">✕</button>
              </div>
              <div className="adm-modal__body">
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
              </div>
              <div className="adm-modal__footer">
                <button className="adm-btn adm-btn--ghost" onClick={() => setModal(false)}>Cancel</button>
                <button className="adm-btn adm-btn--primary" onClick={handleSave}>Save Service</button>
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
              <div className="adm-modal__title" style={{ marginBottom: '.75rem' }}>Delete Service?</div>
              <p style={{ fontSize: '.82rem', color: 'var(--a-muted)', marginBottom: '1.25rem' }}>This cannot be undone.</p>
              <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
                <button className="adm-btn adm-btn--ghost" onClick={() => setDel(null)}>Cancel</button>
                <button className="adm-btn adm-btn--danger" onClick={() => { setServices(deleteService(del)); setDel(null) }}>Delete</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
