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
  const [editModal, setEditModal] = useState(null) // image object currently being edited
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
    setEditModal(img)
    setForm({ alt: img.alt || '', title: img.title || '' })
  }

  const handleSave = () => {
    if (!editModal) return
    if (!form.alt.trim()) {
      toast.error('Alt text cannot be empty')
      return
    }
    updateImage(editModal.id, { alt: form.alt, title: form.title })
    setImages(getImages())
    setEditModal(null)
    toast.success('Image SEO metadata updated!')
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
          <h1 className="adm-section-title" style={{ fontSize: 'var(--font-size-h2)' }}>🖼️ Image Assets &amp; SEO</h1>
          <p style={{ fontSize: 'var(--font-size-h3)', color: 'var(--a-muted)', marginTop: '.15rem' }}>
            Optimize image alt tags, title attributes, and CDN routes for search engines.
          </p>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '.6rem', marginTop: '.75rem', marginBottom: '1rem' }}>
        <div className="adm-card" style={{ padding: '.75rem .85rem', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 800, color: 'var(--a-text)', lineHeight: 1 }}>{images.length}</div>
          <div style={{ fontSize: 'var(--font-size-h3)', color: 'var(--a-muted)', marginTop: '.2rem', fontWeight: 600 }}>Total Images</div>
        </div>
        <div className="adm-card" style={{ padding: '.75rem .85rem', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 800, color: 'var(--a-green2)', lineHeight: 1 }}>
            {images.filter(i => i.storageType.includes('Local')).length}
          </div>
          <div style={{ fontSize: 'var(--font-size-h3)', color: 'var(--a-muted)', marginTop: '.2rem', fontWeight: 600 }}>Project Files</div>
        </div>
        <div className="adm-card" style={{ padding: '.75rem .85rem', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 800, color: 'var(--a-info)', lineHeight: 1 }}>
            {images.filter(i => i.storageType.includes('Unsplash')).length}
          </div>
          <div style={{ fontSize: 'var(--font-size-h3)', color: 'var(--a-muted)', marginTop: '.2rem', fontWeight: 600 }}>CDN Linked</div>
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
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--a-muted)', cursor: 'pointer', fontSize: 'var(--font-size-h3)' }}>✕</button>
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
                <span style={{ opacity: 0.8, fontSize: 'var(--font-size-h3)' }}>({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Image Grid (Fluid Responsive Cards) */}
      <div className="adm-services-grid" style={{ marginTop: '.5rem' }}>
        {filtered.length === 0 ? (
          <div className="adm-empty adm-card" style={{ gridColumn: '1 / -1' }}>
            <div className="adm-empty__icon">🖼️</div>
            <div className="adm-empty__text">No images found</div>
          </div>
        ) : (
          filtered.map(img => (
            <div key={img.id} className="adm-card adm-card--hover" style={{ display: 'flex', flexDirection: 'column', gap: '.65rem', padding: '.95rem' }}>
              
              {/* Image Preview Container */}
              <div 
                style={{ 
                  position: 'relative', 
                  height: '160px', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  background: '#151d17',
                  cursor: 'pointer',
                  border: '1px solid var(--a-border)'
                }}
                onClick={() => setPreviewModal(img)}
                title="Tap to view full image"
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
                    background: 'rgba(0, 0, 0, 0.72)', 
                    padding: '.25rem .5rem', 
                    borderRadius: '6px',
                    backdropFilter: 'blur(4px)' 
                  }}
                >
                  <span style={{ fontSize: 'var(--font-size-h3)', color: '#fff', fontWeight: 700 }}>{img.dimensions}</span>
                  <span className={`adm-badge ${img.storageType.includes('Local') ? 'adm-badge--green' : 'adm-badge--yellow'}`} style={{ fontSize: 'var(--font-size-h3)', padding: '.1rem .45rem' }}>
                    {img.storageType.includes('Local') ? '📁 Local' : '🌐 CDN'}
                  </span>
                </div>
              </div>

              {/* Header Details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: 800, color: 'var(--a-text)', lineHeight: 1.2 }}>{img.name}</h3>
                  <div style={{ fontSize: 'var(--font-size-h3)', color: 'var(--a-green2)', fontWeight: 700, marginTop: '.2rem' }}>
                    📍 {img.pageLocation}
                  </div>
                </div>
                <span className="adm-badge adm-badge--gray" style={{ fontSize: 'var(--font-size-h3)', flexShrink: 0 }}>{img.category}</span>
              </div>

              {/* Alt Text & Metadata Pill */}
              <div style={{ background: 'var(--a-card2)', border: '1px solid var(--a-border)', borderRadius: '8px', padding: '.45rem .65rem', fontSize: 'var(--font-size-h3)' }}>
                <div style={{ fontSize: 'var(--font-size-h2)', color: 'var(--a-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.15rem' }}>
                  SEO Alt Tag
                </div>
                <div style={{ color: 'var(--a-text)', fontStyle: 'italic', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  "{img.alt || 'No alt text set'}"
                </div>
              </div>

              {/* Action Buttons Strip */}
              <div style={{ display: 'flex', gap: '.45rem', marginTop: 'auto', paddingTop: '.4rem', borderTop: '1px solid rgba(22, 163, 74, 0.1)' }}>
                <button 
                  className="adm-btn adm-btn--ghost adm-btn--sm" 
                  onClick={() => copyPath(img.path)} 
                  style={{ flex: 0.8, minHeight: '38px', fontSize: 'var(--font-size-h2)' }}
                  title="Copy file path to clipboard"
                >
                  📋 Copy Path
                </button>
                <button 
                  className="adm-btn adm-btn--outline adm-btn--sm" 
                  onClick={() => startEdit(img)}
                  style={{ flex: 1.2, minHeight: '38px', fontSize: 'var(--font-size-h2)' }}
                >
                  ✏️ Edit Alt &amp; SEO
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Edit SEO Metadata Slide-up Sheet Modal */}
      {editModal && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setEditModal(null)}>
            <div className="adm-modal">
              <div className="adm-modal__header">
                <span className="adm-modal__title">Edit Image SEO &amp; Alt Tag</span>
                <button className="adm-modal__close" onClick={() => setEditModal(null)} aria-label="Close modal">✕</button>
              </div>
              <div className="adm-modal__body">
                
                {/* Image info preview */}
                <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center', background: 'var(--a-card2)', padding: '.65rem .85rem', borderRadius: '10px', border: '1px solid var(--a-border)', marginBottom: '.85rem' }}>
                  <img src={editModal.path} alt={editModal.alt} style={{ width: '54px', height: '54px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--a-border)', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 'var(--font-size-h3)', color: 'var(--a-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{editModal.name}</div>
                    <div style={{ fontSize: 'var(--font-size-h3)', color: 'var(--a-green2)', fontWeight: 600 }}>📍 {editModal.pageLocation}</div>
                    <div style={{ fontSize: 'var(--font-size-h3)', color: 'var(--a-muted)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{editModal.dimensions} · {editModal.path}</div>
                  </div>
                </div>

                <div className="adm-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="adm-form-group">
                    <label className="adm-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Alt Text (SEO &amp; Accessibility) *</span>
                      <span style={{ textTransform: 'none', fontWeight: 500, color: 'var(--a-muted)' }}>{form.alt.length} chars</span>
                    </label>
                    <textarea 
                      className="adm-textarea" 
                      style={{ minHeight: '80px', lineHeight: 1.4 }}
                      value={form.alt} 
                      onChange={e => setForm({ ...form, alt: e.target.value })} 
                      placeholder="Descriptive alt text for search engines and screen readers (e.g. Eco-friendly termite treatment spray in Bangalore home)..."
                    />
                    <span style={{ fontSize: 'var(--font-size-h3)', color: 'var(--a-muted)', marginTop: '.15rem' }}>
                      💡 Tip: Include relevant keywords like pest name and Bangalore location naturally.
                    </span>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">Image Title Attribute</label>
                    <input 
                      type="text" 
                      className="adm-input" 
                      value={form.title} 
                      onChange={e => setForm({ ...form, title: e.target.value })} 
                      placeholder="Tooltip text shown on hover..."
                    />
                  </div>
                </div>

              </div>
              <div className="adm-modal__footer">
                <button className="adm-btn adm-btn--ghost" onClick={() => setEditModal(null)}>Cancel</button>
                <button className="adm-btn adm-btn--primary" onClick={handleSave}>Save Metadata</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Full Image Preview Zoom Modal */}
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
                <div style={{ fontSize: 'var(--font-size-h3)', display: 'flex', flexDirection: 'column', gap: '.4rem', background: 'var(--a-card2)', padding: '.75rem .9rem', borderRadius: '10px', border: '1px solid var(--a-border)' }}>
                  <div><strong>Location:</strong> {previewModal.pageLocation}</div>
                  <div><strong>Storage:</strong> <code style={{ fontFamily: 'monospace' }}>{previewModal.path}</code></div>
                  <div><strong>Alt Tag:</strong> <em>"{previewModal.alt}"</em></div>
                  <div><strong>Dimensions:</strong> {previewModal.dimensions} ({previewModal.fileSize || 'Standard'})</div>
                </div>
              </div>
              <div className="adm-modal__footer">
                <button className="adm-btn adm-btn--ghost" onClick={() => setPreviewModal(null)}>Close</button>
                <button className="adm-btn adm-btn--primary" onClick={() => { const target = previewModal; setPreviewModal(null); startEdit(target); }}>
                  ✏️ Edit Alt Text
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
