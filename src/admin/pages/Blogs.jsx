import { useState, useEffect } from 'react'
import { getBlogs, saveBlog, deleteBlog, getSettings, saveSettings } from '../adminData'
import ModalPortal from '../ModalPortal'
import toast from 'react-hot-toast'
import BlogWYSIWYG from './BlogWYSIWYG'

const EMPTY_BLOG = { id: '', title: '', slug: '', excerpt: '', metaDesc: '', metaKeywords: '', content: '', status: 'draft', image: '', imageAlt: '' }

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [search, setSearch] = useState('')
  useEffect(() => {
    getBlogs().then(data => setBlogs(data))
  }, [])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY_BLOG)
  const [del, setDel] = useState(null)
  const [settingsModal, setSettingsModal] = useState(false)
  const [apiKey, setApiKey] = useState(getSettings().groqApiKey || '')
  


  const filtered = blogs.filter(b => {
    return !search || b.title?.toLowerCase().includes(search.toLowerCase()) || b.slug?.toLowerCase().includes(search.toLowerCase())
  })

  function openNew() { setForm(EMPTY_BLOG); setModal(true) }
  function openEdit(b) { setForm({ ...b }); setModal(true) }
  function closeModal() { setModal(false) }

  async function handleSave(status = 'published') {
    if (!form.title) { toast.error("Title is required"); return }
    const updated = await saveBlog({ ...form, status })
    setBlogs(updated)
    toast.success(`Blog ${status}!`)
    closeModal()
  }

  function handleSaveSettings() {
    saveSettings({ groqApiKey: apiKey })
    toast.success("API Key saved!")
    setSettingsModal(false)
  }

  const extractHtmlImages = (content) => {
    if (!content) return []
    const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
    const images = []
    let match
    while ((match = regex.exec(content)) !== null) {
      const fullTag = match[0]
      const url = match[1]
      let alt = ''
      const altMatch = fullTag.match(/alt=["']([^"']*)["']/)
      if (altMatch) alt = altMatch[1]
      images.push({ full: fullTag, alt, url })
    }
    return images
  }

  const handleHtmlAltChange = (oldFull, newAlt, url) => {
    let newFull = oldFull
    if (oldFull.match(/alt=["'][^"']*["']/)) {
      newFull = oldFull.replace(/alt=["'][^"']*["']/, `alt="${newAlt}"`)
    } else {
      newFull = oldFull.replace('<img', `<img alt="${newAlt}"`)
    }
    setForm(f => ({ ...f, content: f.content.replace(oldFull, newFull) }))
  }

  const contentImages = extractHtmlImages(form.content)

  return (
    <div>
      {/* Header */}
      <div className="adm-section-header">
        <div>
          <h1 className="adm-section-title" style={{ fontSize: '1.2rem' }}>
            ✍️ Blog &amp; Content AI <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--a-muted)' }}>({blogs.length})</span>
          </h1>
          <p style={{ fontSize: '.75rem', color: 'var(--a-muted)', marginTop: '.15rem' }}>
            Create, auto-generate with AI, and publish pest control articles.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setSettingsModal(true)}>
            ⚙️ AI Settings
          </button>
          <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={openNew}>
            + New AI Blog
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="adm-filter-bar" style={{ marginTop: '.75rem' }}>
        <div className="adm-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--a-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search blogs by title or URL slug…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--a-muted)', cursor: 'pointer', fontSize: '.9rem' }}>✕</button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="adm-desktop-only">
        <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Title &amp; URL</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4}><div className="adm-empty"><div className="adm-empty__icon">✍️</div><div className="adm-empty__text">No blogs found</div></div></td></tr>
                ) : (
                  filtered.map(b => (
                    <tr key={b._id || b.slug}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '.86rem' }}>{b.title}</div>
                        <div style={{ fontSize: '.7rem', color: 'var(--a-muted)', fontFamily: 'monospace' }}>/{b.slug}</div>
                      </td>
                      <td>
                        <span className={`adm-badge adm-badge--${b.status === 'published' ? 'green' : 'gray'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '.74rem', color: 'var(--a-muted)' }}>{new Date(b.date).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div className="adm-table-actions">
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(b)}>Edit</button>
                          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDel(b.id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dedicated Mobile Cards */}
      <div className="adm-mobile-only">
        {filtered.length === 0 ? (
          <div className="adm-card adm-empty">
            <div className="adm-empty__icon">✍️</div>
            <div className="adm-empty__text">No blogs found</div>
          </div>
        ) : (
          <div className="adm-mobile-list">
            {filtered.map(b => (
              <div key={b._id || b.slug} className="adm-mobile-card">
                <div className="adm-mobile-card__header">
                  <div>
                    <div className="adm-mobile-card__title" style={{ fontSize: '.88rem' }}>{b.title}</div>
                    <div className="adm-mobile-card__subtitle" style={{ fontFamily: 'monospace' }}>/{b.slug}</div>
                  </div>
                  <span className={`adm-badge adm-badge--${b.status === 'published' ? 'green' : 'gray'}`}>{b.status}</span>
                </div>

                <div className="adm-mobile-card__row">
                  <span className="adm-mobile-card__label">Published Date</span>
                  <span className="adm-mobile-card__val">{new Date(b.date).toLocaleDateString('en-IN')}</span>
                </div>

                {b.excerpt && (
                  <p style={{ fontSize: '.74rem', color: 'var(--a-muted)', lineHeight: 1.4 }}>
                    {b.excerpt.substring(0, 100)}...
                  </p>
                )}

                <div className="adm-mobile-card__actions">
                  <button className="adm-btn adm-btn--outline adm-btn--sm" style={{ flex: 1 }} onClick={() => openEdit(b)}>
                    ✏️ Edit
                  </button>
                  <button className="adm-btn adm-btn--danger adm-btn--sm" style={{ flex: 0.5 }} onClick={() => setDel(b.id)}>
                    🗑 Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {modal && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className="adm-modal" style={{ maxWidth: 1200, width: '95vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div className="adm-modal__header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--a-border)' }}>
                <span className="adm-modal__title">{form.id ? 'Edit Blog Article' : 'Write Blog Article'}</span>
                <button className="adm-modal__close" onClick={closeModal} aria-label="Close modal">✕</button>
              </div>

              <div className="adm-modal__body" style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* 1. Core Details & SEO */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="adm-form-group">
                    <label className="adm-label">Blog Title *</label>
                    <input className="adm-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. 5 Warning Signs of Bed Bug Infestation" />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-label">URL Slug</label>
                    <input className="adm-input" value={form.slug || ''} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="5-warning-signs-bed-bug-infestation" />
                  </div>
                  <div className="adm-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="adm-label">Excerpt / Summary</label>
                    <input className="adm-input" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Brief summary of the article for blog list..." />
                  </div>
                </div>

                {/* Image Previews */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', padding: '1rem', background: 'var(--a-card2)', borderRadius: '10px', border: '1px solid var(--a-border)' }}>
                  <div style={{ padding: '0.75rem', background: 'var(--a-card)', borderRadius: '10px', border: '1px solid var(--a-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '12px', color: 'var(--a-green2)', fontWeight: 600, display: 'block' }}>Cover Image</span>
                    {form.image && <img src={form.image} alt="Cover" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />}
                    <input className="adm-input" style={{ fontSize: '12px', padding: '0.35rem 0.5rem' }} value={form.image || ''} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="Cover Image URL..." />
                    <textarea className="adm-input" style={{ fontSize: '12px', padding: '0.35rem 0.5rem', resize: 'vertical', minHeight: '60px' }} value={form.imageAlt || ''} onChange={e => setForm(f => ({ ...f, imageAlt: e.target.value }))} placeholder="Cover Alt Text..." />
                  </div>
                  {contentImages.map((img, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', background: 'var(--a-card)', borderRadius: '10px', border: '1px solid var(--a-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', color: 'var(--a-muted)', fontWeight: 600, display: 'block' }}>In-Content Image {idx + 1}</span>
                      <img src={img.url} alt="Content" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />
                      <textarea className="adm-input" style={{ fontSize: '12px', padding: '0.35rem 0.5rem', resize: 'vertical', minHeight: '60px' }} value={img.alt} onChange={e => handleHtmlAltChange(img.full, e.target.value, img.url)} placeholder="Image Alt Text..." />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minHeight: '500px' }}>
                  <label className="adm-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
                    <span>Rich Text Editor</span>
                    <span style={{ textTransform: 'none', fontWeight: 500, color: 'var(--a-muted)' }}>
                      {form.content?.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(w => w.length > 0).length || 0} words
                    </span>
                  </label>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <BlogWYSIWYG 
                      initialContent={form.content} 
                      onChange={(html) => setForm(f => ({ ...f, content: html }))} 
                    />
                  </div>
                </div>

              </div>

              <div className="adm-modal__footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--a-border)', background: 'var(--a-card)', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: 0 }}>
                <button className="adm-btn adm-btn--ghost" onClick={closeModal}>Cancel</button>
                <button className="adm-btn adm-btn--outline" onClick={() => handleSave('draft')}>Save Draft</button>
                <button className="adm-btn adm-btn--primary" onClick={() => handleSave('published')}>Publish</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Settings Modal */}
      {settingsModal && (
        <ModalPortal>
          <div className="adm-modal-overlay">
            <div className="adm-modal" style={{ maxWidth: 440 }}>
              <div className="adm-modal__header">
                <span className="adm-modal__title">AI Settings (Groq API Key)</span>
                <button className="adm-modal__close" onClick={() => setSettingsModal(false)}>✕</button>
              </div>
              <div className="adm-modal__body">
                <p style={{ fontSize: '.78rem', color: 'var(--a-muted)', marginBottom: '.85rem' }}>
                  To use the AI Blog Generator, you need a free Groq API Key from <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" style={{ color: 'var(--a-green2)', fontWeight: 700 }}>Groq Cloud Console</a>.
                </p>
                <div className="adm-form-group">
                  <label className="adm-label">Groq API Key</label>
                  <input type="password" className="adm-input" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="gsk_..." />
                </div>
              </div>
              <div className="adm-modal__footer">
                <button className="adm-btn adm-btn--ghost" onClick={() => setSettingsModal(false)}>Cancel</button>
                <button className="adm-btn adm-btn--primary" onClick={handleSaveSettings}>Save Key</button>
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
              <div className="adm-modal__title" style={{ marginBottom: '.75rem' }}>Delete Blog?</div>
              <p style={{ fontSize: '.82rem', color: 'var(--a-muted)', marginBottom: '1.25rem' }}>This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
                <button className="adm-btn adm-btn--ghost" onClick={() => setDel(null)}>Cancel</button>
                <button className="adm-btn adm-btn--danger" onClick={async () => { setBlogs(await deleteBlog(del)); setDel(null) }}>Delete</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
