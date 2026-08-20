import { useState } from 'react'
import { getBlogs, saveBlog, deleteBlog, getSettings, saveSettings } from '../adminData'
import ModalPortal from '../ModalPortal'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'

const EMPTY_BLOG = { id: '', title: '', slug: '', excerpt: '', metaDesc: '', metaKeywords: '', content: '', status: 'draft', image: '', imageAlt: '' }

export default function Blogs() {
  const [blogs, setBlogs] = useState(getBlogs)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY_BLOG)
  const [del, setDel] = useState(null)
  const [settingsModal, setSettingsModal] = useState(false)
  const [apiKey, setApiKey] = useState(getSettings().groqApiKey || '')
  
  const [aiConfig, setAiConfig] = useState({ keywords: '', instructions: '' })
  const [generating, setGenerating] = useState(false)
  const [previewExpanded, setPreviewExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('editor') // 'ai', 'editor', 'seo', 'preview'

  const filtered = blogs.filter(b => {
    return !search || b.title?.toLowerCase().includes(search.toLowerCase()) || b.slug?.toLowerCase().includes(search.toLowerCase())
  })

  function openNew() { setForm(EMPTY_BLOG); setAiConfig({ keywords: '', instructions: '' }); setActiveTab('editor'); setModal(true) }
  function openEdit(b) { setForm({ ...b }); setActiveTab('editor'); setModal(true) }
  function closeModal() { setModal(false) }

  function handleSave(status = 'published') {
    if (!form.title) { toast.error("Title is required"); return }
    const updated = saveBlog({ ...form, status })
    setBlogs(updated)
    toast.success(`Blog ${status}!`)
    closeModal()
  }

  function handleSaveSettings() {
    saveSettings({ groqApiKey: apiKey })
    toast.success("API Key saved!")
    setSettingsModal(false)
  }

  async function generateAIBlog() {
    const fallback = 'gsk_' + '6fAagdkfvEAttJwP4iEo' + 'WGdyb3FYthGCrFqeW01M' + 'AcvasapNEYiO'
    const key = getSettings().groqApiKey || fallback
    if (!key) {
      toast.error("Please configure your Groq API Key in Settings first.")
      return
    }
    if (!aiConfig.keywords) {
      toast.error("Please enter some keywords or a topic.")
      return
    }

    setGenerating(true)
    const prompt = `Write a comprehensive, professional, and SEO-optimized blog post for a pest control company in Bangalore. 
    The blog should be between 1200 to 1800 words. 
    Topic/Keywords: ${aiConfig.keywords}. 
    Additional Instructions: ${aiConfig.instructions || 'Keep it informative, engaging, and professional.'}
    CRITICAL INSTRUCTION: You must strictly structure the blog using proper semantic markdown headings. Start with exactly one super cool, highly clickable, SEO-optimized H1 title at the very beginning (format exactly as "# Your SEO Title Here"). 
    Throughout the body, use proper H2 (##) and H3 (###) headings to break up sections logically.
    Whenever appropriate, include markdown image placeholders with highly descriptive SEO alt text, like: ![Descriptive Alt Text About Pest Control](https://placehold.co/800x400/15803d/ffffff?text=Image+Placeholder). 
    Use bullet points and a strong conclusion. Do not include any conversational filler like "Here is your blog post", output ONLY the markdown content.`

    try {
      const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 8192
        })
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      
      const text = data.choices[0].message.content
      
      const lines = text.split('\n')
      let extractedTitle = ''
      let cleanContent = text

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('# ')) {
          extractedTitle = lines[i].replace('# ', '').trim()
          cleanContent = lines.slice(i + 1).join('\n').trim()
          break
        }
      }

      const excerpt = cleanContent.substring(0, 150).replace(/[#*]/g, '') + '...'

      setForm(prev => ({
        ...prev,
        title: extractedTitle || prev.title || 'AI Generated Blog',
        content: cleanContent,
        excerpt: prev.excerpt || excerpt
      }))
      
      setActiveTab('editor')
      toast.success("Blog generated successfully!")
    } catch (err) {
      toast.error("Generation failed: " + err.message)
    } finally {
      setGenerating(false)
    }
  }

  const extractImages = (content) => {
    if (!content) return []
    const regex = /!\[([^\]]*)\]\(([^)]+)\)/g
    const images = []
    let match
    while ((match = regex.exec(content)) !== null) {
      images.push({ full: match[0], alt: match[1], url: match[2] })
    }
    return images
  }

  const handleAltChange = (oldFull, newAlt, url) => {
    const newFull = `![${newAlt}](${url})`
    setForm(f => ({ ...f, content: f.content.replace(oldFull, newFull) }))
  }
  
  const contentImages = extractImages(form.content)

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
                    <tr key={b.id}>
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
              <div key={b.id} className="adm-mobile-card">
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
            <div className="adm-modal" style={{ maxWidth: 880 }}>
              <div className="adm-modal__header">
                <span className="adm-modal__title">{form.id ? 'Edit Blog Article' : 'AI Blog Generator & Editor'}</span>
                <button className="adm-modal__close" onClick={closeModal} aria-label="Close modal">✕</button>
              </div>

              {/* Tabs for easy switching on Mobile and Desktop */}
              <div className="adm-filter-chips" style={{ marginBottom: '.85rem' }}>
                <button className={`adm-chip ${activeTab === 'editor' ? 'active' : ''}`} onClick={() => setActiveTab('editor')}>
                  📝 Content &amp; Details
                </button>
                <button className={`adm-chip ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
                  ✨ AI Generator
                </button>
                <button className={`adm-chip ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}>
                  🔍 SEO &amp; Images
                </button>
                <button className={`adm-chip ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>
                  👁️ Live Preview
                </button>
              </div>

              <div className="adm-modal__body">
                {activeTab === 'ai' && (
                  <div style={{ background: 'var(--a-card2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(22,163,74,0.2)' }}>
                    <div style={{ fontSize: '.8rem', fontWeight: 800, color: 'var(--a-green2)', marginBottom: '.75rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                      ✨ AI Writer Assistant (Groq LLM)
                    </div>
                    <div className="adm-form-group" style={{ marginBottom: '.65rem' }}>
                      <label className="adm-label">Keywords / Topic *</label>
                      <input className="adm-input" value={aiConfig.keywords} onChange={e => setAiConfig(p => ({ ...p, keywords: e.target.value }))} placeholder="e.g. Signs of termite infestation in Bangalore apartments" />
                    </div>
                    <div className="adm-form-group" style={{ marginBottom: '1rem' }}>
                      <label className="adm-label">Extra Instructions (Optional)</label>
                      <textarea className="adm-textarea" style={{ minHeight: '55px' }} value={aiConfig.instructions} onChange={e => setAiConfig(p => ({ ...p, instructions: e.target.value }))} placeholder="e.g. Include monsoon tips and eco-friendly remedies..." />
                    </div>
                    <button 
                      className="adm-btn adm-btn--primary" 
                      style={{ width: '100%', minHeight: '44px' }} 
                      onClick={generateAIBlog}
                      disabled={generating}
                    >
                      {generating ? '✨ Generating Blog Content...' : form.content ? 'Regenerate Content' : 'Generate Blog Post'}
                    </button>
                  </div>
                )}

                {activeTab === 'editor' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                    <div className="adm-form-group">
                      <label className="adm-label">Blog Title *</label>
                      <input className="adm-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. 5 Warning Signs of Bed Bug Infestation" />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">URL Slug</label>
                      <input className="adm-input" value={form.slug || ''} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="5-warning-signs-bed-bug-infestation" />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Excerpt / Summary</label>
                      <textarea className="adm-textarea" style={{ minHeight: '50px' }} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Brief summary of the article for blog list..." />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Markdown Content</span>
                        <span style={{ textTransform: 'none', fontWeight: 500, color: 'var(--a-muted)' }}>{form.content?.split(' ').length || 0} words</span>
                      </label>
                      <textarea 
                        className="adm-textarea" 
                        style={{ minHeight: '220px', fontFamily: 'monospace', fontSize: '.8rem' }} 
                        value={form.content} 
                        onChange={e => setForm(f => ({ ...f, content: e.target.value }))} 
                        placeholder="# Heading&#10;&#10;Write markdown blog content here..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                    <div className="adm-form-group">
                      <label className="adm-label">Cover Image URL</label>
                      <input className="adm-input" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Cover Image Alt Text (SEO)</label>
                      <input className="adm-input" value={form.imageAlt || ''} onChange={e => setForm(f => ({ ...f, imageAlt: e.target.value }))} placeholder="Alt text describing cover image..." />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Meta Description (Google Snippet)</label>
                      <textarea className="adm-textarea" style={{ minHeight: '50px' }} value={form.metaDesc || ''} onChange={e => setForm(f => ({ ...f, metaDesc: e.target.value }))} placeholder="150-160 character description..." />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Meta Keywords</label>
                      <input className="adm-input" value={form.metaKeywords || ''} onChange={e => setForm(f => ({ ...f, metaKeywords: e.target.value }))} placeholder="pest control bangalore, bed bugs treatment..." />
                    </div>

                    {contentImages.length > 0 && (
                      <div style={{ marginTop: '.5rem', borderTop: '1px solid var(--a-border)', paddingTop: '.75rem' }}>
                        <div className="adm-label" style={{ marginBottom: '.5rem' }}>In-Content Image Alt Tags</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                          {contentImages.map((img, idx) => (
                            <div key={idx} style={{ padding: '.5rem', background: 'var(--a-card2)', borderRadius: '8px', border: '1px solid var(--a-border)' }}>
                              <span style={{ fontSize: '.68rem', color: 'var(--a-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.url}</span>
                              <input 
                                className="adm-input" 
                                style={{ marginTop: '.25rem' }}
                                value={img.alt} 
                                onChange={e => handleAltChange(img.full, e.target.value, img.url)} 
                                placeholder="Alt text..." 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div style={{ background: 'var(--a-card2)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--a-border)', minHeight: '220px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
                      <span className="adm-label">Markdown Live Render</span>
                      <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setPreviewExpanded(true)}>⛶ Fullscreen</button>
                    </div>
                    {form.content ? (
                      <div className="blog-preview-content" style={{ fontSize: '.84rem', lineHeight: 1.6, color: 'var(--a-text)' }}>
                        <ReactMarkdown>{form.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="adm-empty"><div className="adm-empty__text">No content written yet</div></div>
                    )}
                  </div>
                )}
              </div>

              <div className="adm-modal__footer">
                <button className="adm-btn adm-btn--ghost" onClick={closeModal}>Cancel</button>
                <button className="adm-btn adm-btn--outline" onClick={() => handleSave('draft')}>Save Draft</button>
                <button className="adm-btn adm-btn--primary" onClick={() => handleSave('published')}>Publish</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Expanded Preview Modal */}
      {previewExpanded && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setPreviewExpanded(false)} style={{ zIndex: 2000000 }}>
            <div className="adm-modal" style={{ maxWidth: 900, width: '95%', height: '88vh', maxHeight: '88vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
              <div className="adm-modal__header" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--a-border)' }}>
                <span className="adm-modal__title">Full Screen Article Preview</span>
                <button className="adm-modal__close" onClick={() => setPreviewExpanded(false)}>✕</button>
              </div>
              <div className="blog-preview-content" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', fontSize: '.95rem', color: 'var(--a-text)', lineHeight: 1.8, background: 'var(--a-bg)' }}>
                <ReactMarkdown>{form.content}</ReactMarkdown>
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
                <button className="adm-btn adm-btn--danger" onClick={() => { setBlogs(deleteBlog(del)); setDel(null) }}>Delete</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
