'use client'

import { useState } from 'react'
import { getImages, updateImage } from '../imageData'
import ModalPortal from '../ModalPortal'
import toast from 'react-hot-toast'

export default function Images() {
  const [images, setImages] = useState(() => getImages())
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [previewModal, setPreviewModal] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ alt: '', title: '' })

  const categories = ['All', 'Branding', 'Home Page', 'Services', 'Packages', 'Termite', 'Blogs']

  const filtered = images.filter(img => {
    const matchesCat = selectedCategory === 'All' || img.category === selectedCategory
    const query = search.toLowerCase()
    const matchesSearch = !query || 
      img.name.toLowerCase().includes(query) ||
      img.alt.toLowerCase().includes(query) ||
      img.pageLocation.toLowerCase().includes(query) ||
      img.path.toLowerCase().includes(query)
    return matchesCat && matchesSearch
  })

  const startEdit = (img) => {
    setEditingId(img.id)
    setForm({ alt: img.alt, title: img.title })
  }

  const handleSave = (id) => {
    if (!form.alt.trim()) {
      toast.error('Alt text cannot be empty')
      return
    }
    updateImage(id, { alt: form.alt, title: form.title })
    setImages(getImages())
    setEditingId(null)
    toast.success('Image SEO metadata updated successfully!')
  }

  const copyPath = (path) => {
    navigator.clipboard.writeText(path)
    toast.success(`Copied path: ${path}`)
  }

  return (
    <div>
      {/* Header */}
      <div className="adm-section-header">
        <div>
          <h1 className="adm-section-title" style={{ fontSize: '1.2rem' }}>🖼️ Image Assets &amp; SEO Manager</h1>
          <p style={{ fontSize: '.75rem', color: 'var(--a-muted)', marginTop: '.15rem' }}>
            Manage image alt text, title tags, page locations, and local storage paths.
          </p>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '.6rem', marginTop: '.75rem', marginBottom: '1rem' }}>
        <div className="adm-card" style={{ padding: '.75rem .9rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--a-text)', lineHeight: 1 }}>{images.length}</div>
          <div style={{ fontSize: '.68rem', color: 'var(--a-muted)', marginTop: '.2rem', fontWeight: 600 }}>Total Images</div>
        </div>
        <div className="adm-card" style={{ padding: '.75rem .9rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--a-green2)', lineHeight: 1 }}>
            {images.filter(i => i.storageType.includes('Local')).length}
          </div>
          <div style={{ fontSize: '.68rem', color: 'var(--a-muted)', marginTop: '.2rem', fontWeight: 600 }}>Project Files</div>
        </div>
        <div className="adm-card" style={{ padding: '.75rem .9rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--a-info)', lineHeight: 1 }}>
            {images.filter(i => i.storageType.includes('Unsplash')).length}
          </div>
          <div style={{ fontSize: '.68rem', color: 'var(--a-muted)', marginTop: '.2rem', fontWeight: 600 }}>CDN Linked</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="adm-filter-bar">
        <div className="adm-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by image name, alt text, or page location..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--a-muted)', cursor: 'pointer', fontSize: '.9rem' }}>✕</button>
          )}
        </div>

        {/* Scrollable Category Chips */}
        <div className="adm-filter-chips">
          {categories.map(cat => {
            const count = cat === 'All' ? images.length : images.filter(i => i.category === cat).length
            return (
              <button
                key={cat}
                className={`adm-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                <span style={{ opacity: 0.8, fontSize: '.65rem' }}>({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Image Grid */}
      <div className="adm-images-grid">
        {filtered.length === 0 ? (
          <div className="adm-empty adm-card" style={{ gridColumn: '1 / -1' }}>
            <div className="adm-empty__icon">🖼️</div>
            <div className="adm-empty__text">No images found</div>
          </div>
        ) : (
          filtered.map(img => (
            <div key={img.id} className="adm-card adm-card--hover" style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              
              {/* Image Preview Container */}
              <div 
                style={{ 
                  position: 'relative', 
                  height: '170px', 
                  borderRadius: '10px', 
                  overflow: 'hidden', 
                  background: '#18221a',
                  cursor: 'pointer',
                  border: '1px solid var(--a-border)'
                }}
                onClick={() => setPreviewModal(img)}
                title="Click to view full preview"
              >
                <img 
                  src={img.path} 
                  alt={img.alt} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  loading="lazy"
                />
                <div 
                  style={{ 
                    position: 'absolute', 
                    bottom: '6px', 
                    left: '6px', 
                    right: '6px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.7)', 
                    padding: '.25rem .5rem', 
                    borderRadius: '6px',
                    backdropFilter: 'blur(4px)' 
                  }}
                >
                  <span style={{ fontSize: '.65rem', color: '#fff', fontWeight: 600 }}>{img.dimensions}</span>
                  <span className={`adm-badge ${img.storageType.includes('Local') ? 'adm-badge--green' : 'adm-badge--yellow'}`} style={{ fontSize: '.6rem', padding: '.1rem .4rem' }}>
                    {img.storageType.includes('Local') ? '📁 Local' : '🌐 CDN'}
                  </span>
                </div>
              </div>

              {/* Info & Location Header */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem', marginBottom: '.3rem' }}>
                  <h3 style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--a-text)', lineHeight: 1.3 }}>{img.name}</h3>
                  <span className="adm-badge adm-badge--gray" style={{ fontSize: '.6rem' }}>{img.category}</span>
                </div>

                {/* Location Badge */}
                <div style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid var(--a-border)', borderRadius: '8px', padding: '.4rem .6rem', marginBottom: '.5rem' }}>
                  <div style={{ fontSize: '.62rem', color: 'var(--a-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.05em' }}>
                    Website Location
                  </div>
                  <div style={{ fontSize: '.76rem', color: 'var(--a-green2)', fontWeight: 700, marginTop: '2px' }}>
                    📍 {img.pageLocation}
                  </div>
                </div>

                {/* File Storage Path */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '.68rem', color: 'var(--a-muted)', marginBottom: '.5rem', gap: '.4rem' }}>
                  <span style={{ wordBreak: 'break-all', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.path}</span>
                  <button 
                    className="adm-btn adm-btn--ghost adm-btn--sm" 
                    onClick={() => copyPath(img.path)} 
                    style={{ padding: '.25rem .5rem', fontSize: '.65rem', flexShrink: 0 }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Editable Alt Text & Metadata Form */}
              <div style={{ borderTop: '1px solid var(--a-border)', paddingTop: '.65rem', marginTop: 'auto' }}>
                {editingId === img.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    <div>
                      <label className="adm-label" style={{ marginBottom: '.2rem', display: 'block' }}>Alt Text (SEO)</label>
                      <textarea 
                        className="adm-textarea" 
                        rows={2} 
                        value={form.alt} 
                        onChange={(e) => setForm({ ...form, alt: e.target.value })} 
                        placeholder="Descriptive alt text for SEO..."
                      />
                    </div>
                    <div>
                      <label className="adm-label" style={{ marginBottom: '.2rem', display: 'block' }}>Title Attribute</label>
                      <input 
                        type="text" 
                        className="adm-input" 
                        value={form.title} 
                        onChange={(e) => setForm({ ...form, title: e.target.value })} 
                        placeholder="Title tooltip text..."
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '.4rem', marginTop: '.25rem' }}>
                      <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={() => handleSave(img.id)} style={{ flex: 1, minHeight: '36px' }}>
                        Save
                      </button>
                      <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setEditingId(null)} style={{ flex: 0.6, minHeight: '36px' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '.75rem', color: 'var(--a-text)', marginBottom: '.35rem' }}>
                      <strong style={{ color: 'var(--a-muted)', fontSize: '.7rem' }}>ALT: </strong> 
                      <span style={{ fontStyle: 'italic' }}>"{img.alt}"</span>
                    </div>
                    <button 
                      className="adm-btn adm-btn--outline adm-btn--sm" 
                      onClick={() => startEdit(img)}
                      style={{ width: '100%', minHeight: '38px', marginTop: '.35rem' }}
                    >
                      ✏️ Edit SEO Alt Text
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Full Image Preview Modal */}
      {previewModal && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={() => setPreviewModal(null)}>
            <div className="adm-modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
              <div className="adm-modal__header">
                <span className="adm-modal__title">{previewModal.name}</span>
                <button className="adm-modal__close" onClick={() => setPreviewModal(null)} aria-label="Close modal">✕</button>
              </div>
              <div className="adm-modal__body">
                <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#0f1712', border: '1px solid var(--a-border)', marginBottom: '.85rem' }}>
                  <img src={previewModal.path} alt={previewModal.alt} style={{ width: '100%', maxHeight: '360px', objectFit: 'contain', display: 'block' }} />
                </div>
                <div style={{ fontSize: '.78rem', display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                  <div><strong>Location:</strong> {previewModal.pageLocation}</div>
                  <div><strong>Path:</strong> <code style={{ fontFamily: 'monospace' }}>{previewModal.path}</code></div>
                  <div><strong>Alt Text:</strong> <em>"{previewModal.alt}"</em></div>
                  <div><strong>Dimensions:</strong> {previewModal.dimensions} ({previewModal.fileSize})</div>
                </div>
              </div>
              <div className="adm-modal__footer">
                <button className="adm-btn adm-btn--ghost" onClick={() => setPreviewModal(null)}>Close</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
