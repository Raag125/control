'use client'

import { useState } from 'react'
import { getImages, updateImage } from '../imageData'
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
    const updated = updateImage(id, { alt: form.alt, title: form.title })
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
          <h1 className="adm-section-title" style={{ fontSize: '1.25rem' }}>🖼️ Image Assets & SEO Manager</h1>
          <p style={{ fontSize: '.78rem', color: 'var(--a-muted)', marginTop: '.2rem' }}>
            Manage image alt text, title tags, page locations, and local storage paths across all pages.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="adm-filter-bar" style={{ marginTop: '1rem', gap: '.65rem' }}>
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
        </div>

        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`adm-btn ${selectedCategory === cat ? 'adm-btn--primary' : 'adm-btn--ghost'} adm-btn--sm`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="adm-card" style={{ padding: '.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '.72rem', color: 'var(--a-muted)' }}>Total Tracked Images: </span>
          <strong style={{ color: 'var(--a-text)', fontSize: '.9rem' }}>{images.length}</strong>
        </div>
        <div>
          <span style={{ fontSize: '.72rem', color: 'var(--a-muted)' }}>Local Project Files: </span>
          <span className="adm-badge adm-badge--green">
            {images.filter(i => i.storageType.includes('Local')).length} Saved in /public
          </span>
        </div>
        <div>
          <span style={{ fontSize: '.72rem', color: 'var(--a-muted)' }}>Linked CDN Assets: </span>
          <span className="adm-badge adm-badge--blue">
            {images.filter(i => i.storageType.includes('Unsplash')).length} External Linked
          </span>
        </div>
      </div>

      {/* Image Grid */}
      <div className="adm-images-grid">
        {filtered.map(img => (
          <div key={img.id} className="adm-card adm-card--hover" style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            
            {/* Image Preview Container */}
            <div 
              style={{ 
                position: 'relative', 
                height: '180px', 
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
              />
              <div 
                style={{ 
                  position: 'absolute', 
                  bottom: '8px', 
                  left: '8px', 
                  right: '8px', 
                  display: 'flex', 
                  justify: 'space-between', 
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.65)', 
                  padding: '.3rem .6rem', 
                  borderRadius: '6px',
                  backdropFilter: 'blur(4px)' 
                }}
              >
                <span style={{ fontSize: '.68rem', color: '#fff', fontWeight: 600 }}>{img.dimensions}</span>
                <span className={`adm-badge ${img.storageType.includes('Local') ? 'adm-badge--green' : 'adm-badge--yellow'}`}>
                  {img.storageType.includes('Local') ? '📁 Project File' : '🌐 CDN Linked'}
                </span>
              </div>
            </div>

            {/* Info & Location Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem', marginBottom: '.3rem' }}>
                <h3 style={{ fontSize: '.95rem', fontWeight: 800, color: 'var(--a-text)' }}>{img.name}</h3>
                <span className="adm-badge adm-badge--gray" style={{ fontSize: '.6rem' }}>{img.category}</span>
              </div>

              {/* Location Badge */}
              <div style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid var(--a-border)', borderRadius: '8px', padding: '.4rem .6rem', marginBottom: '.6rem' }}>
                <div style={{ fontSize: '.65rem', color: 'var(--a-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.05em' }}>
                  Website Location
                </div>
                <div style={{ fontSize: '.78rem', color: 'var(--a-green2)', fontWeight: 700, marginTop: '2px' }}>
                  📍 {img.pageLocation}
                </div>
                <div style={{ fontSize: '.68rem', color: 'var(--a-muted)', marginTop: '2px' }}>
                  Code context: <code>{img.componentContext}</code>
                </div>
              </div>

              {/* File Storage Path */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '.7rem', color: 'var(--a-muted)', marginBottom: '.65rem' }}>
                <span style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>{img.storagePath}</span>
                <button 
                  className="adm-btn adm-btn--ghost adm-btn--sm" 
                  onClick={() => copyPath(img.path)} 
                  style={{ padding: '.2rem .4rem', fontSize: '.62rem' }}
                >
                  Copy URL
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
                      placeholder="Descriptive alt text for screen readers & Google image search..."
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
                    <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={() => handleSave(img.id)} style={{ flex: 1, justifyContent: 'center' }}>
                      Save Metadata
                    </button>
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '.75rem', color: 'var(--a-text)', marginBottom: '.4rem' }}>
                    <strong style={{ color: 'var(--a-muted)' }}>Alt Text: </strong> 
                    <span style={{ fontStyle: 'italic' }}>"{img.alt}"</span>
                  </div>
                  <div style={{ fontSize: '.72rem', color: 'var(--a-muted)', marginBottom: '.65rem' }}>
                    <strong>Title: </strong> {img.title}
                  </div>
                  <button 
                    className="adm-btn adm-btn--outline adm-btn--sm" 
                    onClick={() => startEdit(img)}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    ✏️ Edit Alt Text & Metadata
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Full Image Preview Modal */}
      {previewModal && (
        <div className="adm-modal-overlay" onClick={() => setPreviewModal(null)}>
          <div className="adm-modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title">{previewModal.name}</span>
              <button className="adm-modal__close" onClick={() => setPreviewModal(null)}>✕</button>
            </div>
            <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#0f1712', border: '1px solid var(--a-border)', marginBottom: '1rem' }}>
              <img src={previewModal.path} alt={previewModal.alt} style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', display: 'block' }} />
            </div>
            <div style={{ fontSize: '.8rem', display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              <div><strong>Website Location:</strong> {previewModal.pageLocation}</div>
              <div><strong>Storage Path:</strong> {previewModal.storagePath}</div>
              <div><strong>Alt Text:</strong> <em>"{previewModal.alt}"</em></div>
              <div><strong>Dimensions:</strong> {previewModal.dimensions} ({previewModal.fileSize})</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
