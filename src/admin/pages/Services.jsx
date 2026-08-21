'use client'
import { useState, useEffect } from 'react'
import { getServices, saveService, deleteService } from '../adminData'
import { SERVICES_DATA } from '../../data/servicesData'
import ModalPortal from '../ModalPortal'

const CATEGORIES = ['All Categories', 'Our Services', 'Specialized Services']

const EMPTY_SERVICE = {
  id: '',
  slug: '',
  path: '',
  category: 'Our Services',
  emoji: '🐛',
  badge: 'Certified Safe',
  meta: {
    title: '',
    desc: '',
    keywords: '',
    canonical: '',
  },
  hero: {
    title: '',
    tagline: '',
    intro: '',
    eyebrow: '🛡️ Expert Treatment',
    image: '/images/pests/general.webp',
    imageAlt: '',
    bgImage: '/images/services/bg/residential.webp',
    bgImageAlt: '',
    startingPrice: '₹1,500',
    duration: '2-3 Hours',
    warranty: '60 Days',
    primaryCtaText: 'Call for Free Inspection',
    secondaryCtaText: 'WhatsApp for Service',
  },
  specs: {
    startingPrice: 1500,
    duration: '2-3 Hours',
    warranty: '60 Days',
    safety: 'Child & Pet Safe',
    chemicals: 'Eco-Friendly Formulations',
    coverage: 'All Bangalore Areas',
  },
  signs: [],
  benefits: [],
  process: [
    { step: 1, title: 'Property Inspection', desc: 'Comprehensive inspection of infested areas.' },
    { step: 2, title: 'Treatment Plan', desc: 'Customized application method.' },
    { step: 3, title: 'Targeted Execution', desc: 'Safe, certified application.' },
    { step: 4, title: 'Sanitization & Sealing', desc: 'Preventative measures.' },
    { step: 5, title: 'Follow-Up & Certification', desc: 'Warranty report issued.' },
  ],
  faqs: [
    { q: 'Is this treatment safe for children and pets?', a: 'Yes, we use odorless, government-approved formulations.' },
    { q: 'How long does the treatment take?', a: 'Typically 2 to 4 hours depending on property size.' },
  ],
  isActive: true,
}

export default function Services() {
  const [services, setServices] = useState([])
  const [activeTab, setActiveTab] = useState('individual') // 'individual' | 'main_page'
  const [search, setSearch] = useState('')
  const [catFilter, setCat] = useState('All Categories')
  const [modal, setModal] = useState(false)
  const [editForm, setEditForm] = useState(EMPTY_SERVICE)
  const [formTab, setFormTab] = useState('hero') // 'hero' | 'seo' | 'images' | 'signs_benefits' | 'process' | 'faqs' | 'specs'
  const [del, setDel] = useState(null)
  const [savedToast, setSavedToast] = useState(false)

  // Main /services catalog page header state
  const [catalogSettings, setCatalogSettings] = useState({
    heroTitle: 'Expert Pest Control Services',
    heroTagline: 'From residential homes to massive commercial complexes, we offer certified, eco-friendly pest management tailored perfectly to your needs.',
    eyebrow: '⚡ Comprehensive Solutions',
    badge: '15,000+ Verified Homes in Bangalore',
  })

  useEffect(() => {
    getServices().then(loaded => {
      if (loaded && loaded.length > 0) {
        setServices(loaded)
      } else {
        setServices(SERVICES_DATA)
      }
    })
  }, [])

  const filtered = services.filter((s) => {
    const q = search.toLowerCase()
    const name = s.hero?.title || s.name || s.id || ''
    const cat = s.category || ''
    const matchQ = !q || name.toLowerCase().includes(q) || cat.toLowerCase().includes(q)
    const matchCat = catFilter === 'All Categories' || cat.toLowerCase().includes(catFilter.toLowerCase())
    return matchQ && matchCat
  })

  function openNew() {
    setEditForm({ ...EMPTY_SERVICE, id: `service-${Date.now()}` })
    setFormTab('hero')
    setModal(true)
  }

  function openEdit(svc) {
    // Ensure nested objects exist
    const fullSvc = {
      ...EMPTY_SERVICE,
      ...svc,
      meta: { ...EMPTY_SERVICE.meta, ...(svc.meta || {}) },
      hero: {
        ...EMPTY_SERVICE.hero,
        ...(svc.hero || {}),
        title: svc.hero?.title || svc.name || svc.title || '',
        tagline: svc.hero?.tagline || svc.description || '',
        intro: svc.hero?.intro || svc.intro || '',
      },
      specs: { ...EMPTY_SERVICE.specs, ...(svc.specs || {}) },
      signs: Array.isArray(svc.signs) ? [...svc.signs] : [],
      benefits: Array.isArray(svc.benefits) ? [...svc.benefits] : [],
      process: Array.isArray(svc.process) ? [...svc.process] : [...EMPTY_SERVICE.process],
      faqs: Array.isArray(svc.faqs) ? [...svc.faqs] : [...EMPTY_SERVICE.faqs],
    }
    setEditForm(fullSvc)
    setFormTab('hero')
    setModal(true)
  }

  async function handleSave() {
    if (!editForm.hero?.title && !editForm.name) return
    const updatedService = {
      ...editForm,
      name: editForm.hero?.title || editForm.name,
      description: editForm.hero?.tagline || editForm.description,
      startingPrice: Number(editForm.specs?.startingPrice) || Number(editForm.startingPrice) || 0,
      path: editForm.path || `/${editForm.slug || editForm.id}`,
    }
    const updatedList = await saveService(updatedService)
    setServices(updatedList)
    setModal(false)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
  }

  async function toggleActive(svc) {
    const updated = await saveService({ ...svc, isActive: svc.isActive === false ? true : false })
    setServices(updated)
  }

  return (
    <div>
      {/* Toast Notification */}
      {savedToast && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999, background: 'linear-gradient(135deg, #16a34a, #065f46)', color: '#fff', padding: '.75rem 1.25rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          ✅ Service Page Changes Saved Successfully!
        </div>
      )}

      {/* Main Section Header */}
      <div className="adm-section-header">
        <div>
          <h1 className="adm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            🛠️ Services Pages &amp; Content Studio
          </h1>
          <p style={{ color: 'var(--a-muted)', marginTop: '.2rem' }}>
            Directly customize and update all texts, images, FAQs, process steps, meta tags, and alt descriptions for every service page.
          </p>
        </div>
        <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={openNew} style={{ minHeight: '38px' }}>
          + Add New Service Page
        </button>
      </div>

      {/* Top Main Navigation Switcher */}
      <div style={{ display: 'flex', gap: '.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--a-border)', paddingBottom: '.75rem' }}>
        <button
          className={`adm-chip ${activeTab === 'individual' ? 'active' : ''}`}
          style={{ padding: '.45rem 1rem', fontWeight: 700 }}
          onClick={() => setActiveTab('individual')}
        >
          📄 Individual Service Pages ({services.length})
        </button>
        <button
          className={`adm-chip ${activeTab === 'main_page' ? 'active' : ''}`}
          style={{ padding: '.45rem 1rem', fontWeight: 700 }}
          onClick={() => setActiveTab('main_page')}
        >
          📑 Main Services Page (/services)
        </button>
      </div>

      {activeTab === 'main_page' ? (
        /* ──────── MAIN /services CATALOG PAGE EDITOR ──────── */
        <div className="adm-card" style={{ maxWidth: '800px', padding: '1.5rem' }}>
          <div style={{ fontWeight: 800, color: 'var(--a-text)', marginBottom: '.5rem' }}>
            📑 Main Services Overview Page Settings (`/services`)
          </div>
          <p style={{ color: 'var(--a-muted)', marginBottom: '1.5rem' }}>
            Controls the main header, badges, and introductory copy for the public <a href="/services" target="_blank" style={{ color: 'var(--a-green2)', fontWeight: 700 }}>/services</a> catalog page.
          </p>

          <div className="adm-form-grid">
            <div className="adm-form-group adm-form-group--full">
              <label className="adm-label">Eyebrow Tagline</label>
              <input
                className="adm-input"
                value={catalogSettings.eyebrow}
                onChange={(e) => setCatalogSettings({ ...catalogSettings, eyebrow: e.target.value })}
              />
            </div>
            <div className="adm-form-group adm-form-group--full">
              <label className="adm-label">Main Page H1 Title</label>
              <input
                className="adm-input"
                value={catalogSettings.heroTitle}
                onChange={(e) => setCatalogSettings({ ...catalogSettings, heroTitle: e.target.value })}
              />
            </div>
            <div className="adm-form-group adm-form-group--full">
              <label className="adm-label">Hero Description Paragraph</label>
              <textarea
                className="adm-textarea"
                rows="3"
                value={catalogSettings.heroTagline}
                onChange={(e) => setCatalogSettings({ ...catalogSettings, heroTagline: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button
              className="adm-btn adm-btn--primary"
              onClick={() => {
                setSavedToast(true)
                setTimeout(() => setSavedToast(false), 3000)
              }}
            >
              Save Main Services Page
            </button>
            <a href="/services" target="_blank" rel="noreferrer" className="adm-btn adm-btn--outline">
              Preview /services Page ↗
            </a>
          </div>
        </div>
      ) : (
        /* ──────── INDIVIDUAL SERVICE PAGES LIST ──────── */
        <>
          {/* Summary Chips Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '.6rem', marginBottom: '1rem' }}>
            {[
              { label: 'Total Service Pages', val: services.length, color: 'var(--a-text)' },
              { label: 'Live & Active', val: services.filter((s) => s.isActive !== false).length, color: 'var(--a-green2)' },
              { label: 'Our Services', val: services.filter((s) => (s.category || '').includes('Our')).length, color: '#3b82f6' },
              { label: 'Specialized Services', val: services.filter((s) => (s.category || '').includes('Specialized')).length, color: '#f59e0b' },
            ].map((s) => (
              <div key={s.label} className="adm-card" style={{ padding: '.75rem .9rem', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ color: 'var(--a-muted)', marginTop: '.25rem', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filter and Search Bar */}
          <div className="adm-filter-bar">
            <div className="adm-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--a-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input placeholder="Search service page by name or pest…" value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--a-muted)', cursor: 'pointer' }}>✕</button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="adm-filter-chips">
              {CATEGORIES.map((c) => {
                const count = c === 'All Categories' ? services.length : services.filter((s) => (s.category || '').toLowerCase().includes(c.toLowerCase())).length
                return (
                  <button key={c} className={`adm-chip ${catFilter === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                    <span>{c}</span>
                    <span style={{ opacity: 0.8 }}>({count})</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Service Pages Grid */}
          <div className="adm-services-grid">
            {filtered.length === 0 ? (
              <div className="adm-empty adm-card" style={{ gridColumn: '1 / -1' }}>
                <div className="adm-empty__icon">⚙️</div>
                <div className="adm-empty__text">No service pages found matching your search.</div>
              </div>
            ) : (
              filtered.map((svc) => {
                const title = svc.hero?.title || svc.name || svc.id
                const tagline = svc.hero?.tagline || svc.description || ''
                const price = svc.specs?.startingPrice || svc.startingPrice || 1500
                const duration = svc.specs?.duration || svc.duration || '2-3 Hours'
                const warranty = svc.specs?.warranty || svc.warranty || '60 Days'
                const path = svc.path || `/${svc.slug || svc.id}`

                return (
                  <div key={svc.id} className="adm-card adm-card--hover" style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', position: 'relative' }}>
                    {/* Top Header & Active Toggle */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                        <span style={{ lineHeight: 1 }}>{svc.emoji || '🐛'}</span>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--a-text)' }}>{title}</div>
                          <span className="adm-badge adm-badge--gray" style={{ marginTop: '.2rem' }}>{svc.category || 'General'}</span>
                        </div>
                      </div>
                      <label className="adm-toggle" title={svc.isActive !== false ? 'Deactivate' : 'Activate'}>
                        <input type="checkbox" checked={svc.isActive !== false} onChange={() => toggleActive(svc)} />
                        <div className="adm-toggle__track"><div className="adm-toggle__thumb" /></div>
                      </label>
                    </div>

                    {/* Tagline */}
                    {tagline && (
                      <p style={{ color: 'var(--a-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {tagline}
                      </p>
                    )}

                    {/* Quick Specs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.4rem' }}>
                      <div style={{ background: 'var(--a-card2)', borderRadius: '8px', padding: '.45rem .6rem', border: '1px solid var(--a-border)' }}>
                        <div style={{ color: 'var(--a-dim)', fontWeight: 700, textTransform: 'uppercase' }}>FROM</div>
                        <div style={{ fontWeight: 800, color: 'var(--a-text)', marginTop: '.1rem' }}>₹{Number(price).toLocaleString('en-IN')}</div>
                      </div>
                      <div style={{ background: 'var(--a-card2)', borderRadius: '8px', padding: '.45rem .6rem', border: '1px solid var(--a-border)' }}>
                        <div style={{ color: 'var(--a-dim)', fontWeight: 700, textTransform: 'uppercase' }}>DURATION</div>
                        <div style={{ fontWeight: 800, color: 'var(--a-text)', marginTop: '.1rem' }}>{duration}</div>
                      </div>
                      <div style={{ background: 'var(--a-card2)', borderRadius: '8px', padding: '.45rem .6rem', border: '1px solid var(--a-border)' }}>
                        <div style={{ color: 'var(--a-dim)', fontWeight: 700, textTransform: 'uppercase' }}>WARRANTY</div>
                        <div style={{ fontWeight: 800, color: 'var(--a-text)', marginTop: '.1rem' }}>{warranty}</div>
                      </div>
                    </div>

                    {/* URL Link and Live Preview */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--a-muted)', background: 'var(--a-card2)', padding: '.35rem .6rem', borderRadius: '6px', border: '1px solid var(--a-border)' }}>
                      <span style={{ fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        🔗 {path}
                      </span>
                      <a href={path} target="_blank" rel="noreferrer" style={{ color: 'var(--a-green2)', fontWeight: 700, textDecoration: 'none', marginLeft: '.5rem', flexShrink: 0 }}>
                        Live ↗
                      </a>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '.5rem', marginTop: 'auto', paddingTop: '.5rem', borderTop: '1px solid rgba(22,163,74,0.1)' }}>
                      <button className="adm-btn adm-btn--outline adm-btn--sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openEdit(svc)}>
                        ✏️ Edit Full Page Content
                      </button>
                      <button className="adm-btn adm-btn--danger adm-btn--sm" style={{ flex: 0.35, justifyContent: 'center' }} onClick={() => setDel(svc.id)}>
                        🗑 Del
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </>
      )}

      {/* ──────── FULL SERVICE CONTENT STUDIO MODAL ──────── */}
      {modal && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
            <div className="adm-modal" style={{ maxWidth: 840, width: '95vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              {/* Modal Header */}
              <div className="adm-modal__header" style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--a-border)' }}>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--a-green2)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                    Service Page Content Editor
                  </div>
                  <span className="adm-modal__title">
                    {editForm.emoji} {editForm.hero?.title || editForm.name || 'New Service Page'}
                  </span>
                </div>
                <button className="adm-modal__close" onClick={() => setModal(false)} aria-label="Close modal">✕</button>
              </div>

              {/* Modal Frame Tabs */}
              <div className="adm-hide-scroll" style={{ display: 'flex', overflowX: 'auto', background: 'var(--a-card2)', borderBottom: '1px solid var(--a-border)', padding: '.4rem .8rem', gap: '.35rem' }}>
                {[
                  { id: 'hero', label: '🌟 Hero & Intro' },
                  { id: 'seo', label: '🔍 SEO & Meta' },
                  { id: 'images', label: '🖼️ Images & Alt' },
                  { id: 'signs_benefits', label: '⚠️ Signs & Benefits' },
                  { id: 'process', label: '📋 5-Step Process' },
                  { id: 'faqs', label: '❓ FAQs' },
                  { id: 'specs', label: '⚙️ Specs & Pricing' },
                ].map((t) => (
                  <button
                    key={t.id}
                    className={`adm-chip ${formTab === t.id ? 'active' : ''}`}
                    style={{ padding: '.35rem .75rem', whiteSpace: 'nowrap' }}
                    onClick={() => setFormTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Modal Body */}
              <div className="adm-modal__body" style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                {/* TAB 1: HERO & INTRO */}
                {formTab === 'hero' && (
                  <div className="adm-form-grid">
                    <div className="adm-form-group">
                      <label className="adm-label">Service Title (H1)</label>
                      <input
                        className="adm-input"
                        value={editForm.hero?.title || editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, hero: { ...editForm.hero, title: e.target.value } })}
                        placeholder="e.g. Termite Treatment"
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Eyebrow Tag</label>
                      <input
                        className="adm-input"
                        value={editForm.hero?.eyebrow || '🛡️ Expert Treatment'}
                        onChange={(e) => setEditForm({ ...editForm, hero: { ...editForm.hero, eyebrow: e.target.value } })}
                      />
                    </div>
                    <div className="adm-form-group adm-form-group--full">
                      <label className="adm-label">Hero Subtitle / Tagline</label>
                      <textarea
                        className="adm-textarea"
                        rows="2"
                        value={editForm.hero?.tagline || editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, hero: { ...editForm.hero, tagline: e.target.value } })}
                        placeholder="Compelling hook displayed directly below the H1..."
                      />
                    </div>
                    <div className="adm-form-group adm-form-group--full">
                      <label className="adm-label">Detailed Introduction Paragraph</label>
                      <textarea
                        className="adm-textarea"
                        rows="5"
                        value={editForm.hero?.intro || editForm.intro || ''}
                        onChange={(e) => setEditForm({ ...editForm, hero: { ...editForm.hero, intro: e.target.value } })}
                        placeholder="In-depth scientific and practical overview of the treatment..."
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: SEO & META */}
                {formTab === 'seo' && (
                  <div className="adm-form-grid">
                    <div className="adm-form-group adm-form-group--full">
                      <label className="adm-label">SEO Meta Title (&lt;title&gt; tag)</label>
                      <input
                        className="adm-input"
                        value={editForm.meta?.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, meta: { ...editForm.meta, title: e.target.value } })}
                        placeholder="e.g. Termite Treatment in Bangalore | A to Z Pest Solutions"
                      />
                    </div>
                    <div className="adm-form-group adm-form-group--full">
                      <label className="adm-label">SEO Meta Description</label>
                      <textarea
                        className="adm-textarea"
                        rows="3"
                        value={editForm.meta?.desc || ''}
                        onChange={(e) => setEditForm({ ...editForm, meta: { ...editForm.meta, desc: e.target.value } })}
                        placeholder="Meta description for Google search results (150-160 characters)..."
                      />
                    </div>
                    <div className="adm-form-group adm-form-group--full">
                      <label className="adm-label">Target Keywords (Comma Separated)</label>
                      <input
                        className="adm-input"
                        value={editForm.meta?.keywords || ''}
                        onChange={(e) => setEditForm({ ...editForm, meta: { ...editForm.meta, keywords: e.target.value } })}
                        placeholder="termite treatment bangalore, anti termite drill fill seal..."
                      />
                    </div>
                    <div className="adm-form-group adm-form-group--full">
                      <label className="adm-label">Canonical URL</label>
                      <input
                        className="adm-input"
                        value={editForm.meta?.canonical || `https://atozpestcontrol.in${editForm.path || '/' + (editForm.slug || editForm.id)}`}
                        onChange={(e) => setEditForm({ ...editForm, meta: { ...editForm.meta, canonical: e.target.value } })}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: IMAGES & ALT TAGS */}
                {formTab === 'images' && (
                  <div className="adm-form-grid">
                    <div className="adm-form-group">
                      <label className="adm-label">Pest Icon Image Path / URL / Local Upload</label>
                      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                        <input
                          className="adm-input"
                          value={editForm.hero?.image || ''}
                          onChange={(e) => setEditForm({ ...editForm, hero: { ...editForm.hero, image: e.target.value } })}
                          placeholder="/images/pests/termite.webp"
                          style={{ flex: 1 }}
                        />
                        <label className="adm-btn adm-btn--outline adm-btn--sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap', margin: 0, padding: '.45rem .8rem' }}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setEditForm({ ...editForm, hero: { ...editForm.hero, image: event.target.result } });
                                };
                                reader.readAsDataURL(file);
                              }
                            }} 
                          />
                          📂 Upload
                        </label>
                      </div>
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Pest Icon Image Alt Text</label>
                      <input
                        className="adm-input"
                        value={editForm.hero?.imageAlt || ''}
                        onChange={(e) => setEditForm({ ...editForm, hero: { ...editForm.hero, imageAlt: e.target.value } })}
                        placeholder="Inspection view of Termite Treatment in Bangalore"
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Background Banner Path / URL / Local Upload</label>
                      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                        <input
                          className="adm-input"
                          value={editForm.hero?.bgImage || ''}
                          onChange={(e) => setEditForm({ ...editForm, hero: { ...editForm.hero, bgImage: e.target.value } })}
                          placeholder="/images/services/bg/termite.webp"
                          style={{ flex: 1 }}
                        />
                        <label className="adm-btn adm-btn--outline adm-btn--sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap', margin: 0, padding: '.45rem .8rem' }}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setEditForm({ ...editForm, hero: { ...editForm.hero, bgImage: event.target.result } });
                                };
                                reader.readAsDataURL(file);
                              }
                            }} 
                          />
                          📂 Upload
                        </label>
                      </div>
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Background Banner Alt Text</label>
                      <input
                        className="adm-input"
                        value={editForm.hero?.bgImageAlt || ''}
                        onChange={(e) => setEditForm({ ...editForm, hero: { ...editForm.hero, bgImageAlt: e.target.value } })}
                        placeholder="Termite Treatment Professional Service Background Banner"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 4: SIGNS & BENEFITS */}
                {formTab === 'signs_benefits' && (
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {/* Signs List */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
                        <label className="adm-label" style={{ fontWeight: 800, color: 'var(--a-text)' }}>⚠️ Signs You Need This Treatment</label>
                        <button
                          type="button"
                          className="adm-btn adm-btn--outline adm-btn--sm"
                          onClick={() => setEditForm({ ...editForm, signs: [...(editForm.signs || []), ''] })}
                        >
                          + Add Sign
                        </button>
                      </div>
                      {(editForm.signs || []).map((sign, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '.5rem', marginBottom: '.4rem' }}>
                          <input
                            className="adm-input"
                            value={sign}
                            onChange={(e) => {
                              const newSigns = [...editForm.signs]
                              newSigns[idx] = e.target.value
                              setEditForm({ ...editForm, signs: newSigns })
                            }}
                            placeholder="e.g. Mud tubes along walls..."
                          />
                          <button
                            type="button"
                            className="adm-btn adm-btn--danger adm-btn--sm"
                            onClick={() => {
                              const newSigns = editForm.signs.filter((_, i) => i !== idx)
                              setEditForm({ ...editForm, signs: newSigns })
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Benefits List */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
                        <label className="adm-label" style={{ fontWeight: 800, color: 'var(--a-text)' }}>✨ Treatment Benefits</label>
                        <button
                          type="button"
                          className="adm-btn adm-btn--outline adm-btn--sm"
                          onClick={() => setEditForm({ ...editForm, benefits: [...(editForm.benefits || []), ''] })}
                        >
                          + Add Benefit
                        </button>
                      </div>
                      {(editForm.benefits || []).map((ben, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '.5rem', marginBottom: '.4rem' }}>
                          <input
                            className="adm-input"
                            value={ben}
                            onChange={(e) => {
                              const newBenefits = [...editForm.benefits]
                              newBenefits[idx] = e.target.value
                              setEditForm({ ...editForm, benefits: newBenefits })
                            }}
                            placeholder="e.g. 100% Odorless & Safe formulation..."
                          />
                          <button
                            type="button"
                            className="adm-btn adm-btn--danger adm-btn--sm"
                            onClick={() => {
                              const newBenefits = editForm.benefits.filter((_, i) => i !== idx)
                              setEditForm({ ...editForm, benefits: newBenefits })
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5: 5-STEP PROCESS */}
                {formTab === 'process' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
                      <label className="adm-label" style={{ fontWeight: 800, color: 'var(--a-text)' }}>📋 Treatment Process Steps</label>
                      <button
                        type="button"
                        className="adm-btn adm-btn--outline adm-btn--sm"
                        onClick={() => setEditForm({
                          ...editForm,
                          process: [...(editForm.process || []), { step: (editForm.process?.length || 0) + 1, title: '', desc: '' }]
                        })}
                      >
                        + Add Step
                      </button>
                    </div>
                    {(editForm.process || []).map((p, idx) => (
                      <div key={idx} style={{ background: 'var(--a-card2)', border: '1px solid var(--a-border)', padding: '1rem', borderRadius: '10px', marginBottom: '.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                          <span style={{ fontWeight: 800, color: 'var(--a-green2)' }}>Step {idx + 1}</span>
                          <button
                            type="button"
                            className="adm-btn adm-btn--danger adm-btn--sm"
                            onClick={() => {
                              const newProc = editForm.process.filter((_, i) => i !== idx)
                              setEditForm({ ...editForm, process: newProc })
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          className="adm-input"
                          style={{ marginBottom: '.5rem' }}
                          value={p.title || ''}
                          onChange={(e) => {
                            const newProc = [...editForm.process]
                            newProc[idx] = { ...newProc[idx], title: e.target.value }
                            setEditForm({ ...editForm, process: newProc })
                          }}
                          placeholder="Step Title (e.g. Comprehensive Inspection)"
                        />
                        <textarea
                          className="adm-textarea"
                          rows="2"
                          value={p.desc || ''}
                          onChange={(e) => {
                            const newProc = [...editForm.process]
                            newProc[idx] = { ...newProc[idx], desc: e.target.value }
                            setEditForm({ ...editForm, process: newProc })
                          }}
                          placeholder="Step description..."
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 6: FAQS */}
                {formTab === 'faqs' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
                      <label className="adm-label" style={{ fontWeight: 800, color: 'var(--a-text)' }}>❓ Frequently Asked Questions</label>
                      <button
                        type="button"
                        className="adm-btn adm-btn--outline adm-btn--sm"
                        onClick={() => setEditForm({
                          ...editForm,
                          faqs: [...(editForm.faqs || []), { q: '', a: '' }]
                        })}
                      >
                        + Add FAQ
                      </button>
                    </div>
                    {(editForm.faqs || []).map((faq, idx) => (
                      <div key={idx} style={{ background: 'var(--a-card2)', border: '1px solid var(--a-border)', padding: '1rem', borderRadius: '10px', marginBottom: '.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                          <span style={{ fontWeight: 800, color: 'var(--a-green2)' }}>FAQ #{idx + 1}</span>
                          <button
                            type="button"
                            className="adm-btn adm-btn--danger adm-btn--sm"
                            onClick={() => {
                              const newFaqs = editForm.faqs.filter((_, i) => i !== idx)
                              setEditForm({ ...editForm, faqs: newFaqs })
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          className="adm-input"
                          style={{ marginBottom: '.5rem' }}
                          value={faq.q || ''}
                          onChange={(e) => {
                            const newFaqs = [...editForm.faqs]
                            newFaqs[idx] = { ...newFaqs[idx], q: e.target.value }
                            setEditForm({ ...editForm, faqs: newFaqs })
                          }}
                          placeholder="Question (e.g. What is the cost of termite treatment in Bangalore?)"
                        />
                        <textarea
                          className="adm-textarea"
                          rows="2"
                          value={faq.a || ''}
                          onChange={(e) => {
                            const newFaqs = [...editForm.faqs]
                            newFaqs[idx] = { ...newFaqs[idx], a: e.target.value }
                            setEditForm({ ...editForm, faqs: newFaqs })
                          }}
                          placeholder="Detailed answer..."
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 7: SPECS & PRICING */}
                {formTab === 'specs' && (
                  <div className="adm-form-grid">
                    <div className="adm-form-group">
                      <label className="adm-label">Emoji Icon</label>
                      <input
                        className="adm-input"
                        value={editForm.emoji || '🐛'}
                        onChange={(e) => setEditForm({ ...editForm, emoji: e.target.value })}
                        placeholder="🪵"
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Category</label>
                      <select
                        className="adm-select-full"
                        value={editForm.category || 'Our Services'}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      >
                        {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Starting Price (₹)</label>
                      <input
                        className="adm-input"
                        type="number"
                        value={editForm.specs?.startingPrice || editForm.startingPrice || ''}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          startingPrice: e.target.value,
                          specs: { ...editForm.specs, startingPrice: Number(e.target.value) }
                        })}
                        placeholder="2500"
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Duration</label>
                      <input
                        className="adm-input"
                        value={editForm.specs?.duration || editForm.duration || ''}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          duration: e.target.value,
                          specs: { ...editForm.specs, duration: e.target.value }
                        })}
                        placeholder="3-4 Hours"
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Warranty</label>
                      <input
                        className="adm-input"
                        value={editForm.specs?.warranty || editForm.warranty || ''}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          warranty: e.target.value,
                          specs: { ...editForm.specs, warranty: e.target.value }
                        })}
                        placeholder="5 Years"
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">URL Path</label>
                      <input
                        className="adm-input"
                        value={editForm.path || ''}
                        onChange={(e) => setEditForm({ ...editForm, path: e.target.value })}
                        placeholder="/termite-treatment"
                      />
                    </div>
                    <div className="adm-form-group adm-form-group--full">
                      <label className="adm-toggle">
                        <input
                          type="checkbox"
                          checked={editForm.isActive !== false}
                          onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                        />
                        <div className="adm-toggle__track"><div className="adm-toggle__thumb" /></div>
                        <span className="adm-toggle__label">Service Page is Active &amp; Visible Online</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="adm-modal__footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--a-border)', display: 'flex', justifyContent: 'space-between' }}>
                <button className="adm-btn adm-btn--ghost" onClick={() => setModal(false)}>Cancel</button>
                <button className="adm-btn adm-btn--primary" onClick={handleSave}>💾 Save &amp; Update Service Page</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Delete Confirmation Modal */}
      {del && (
        <ModalPortal>
          <div className="adm-modal-overlay">
            <div className="adm-modal" style={{ maxWidth: 360 }}>
              <div className="adm-modal__title" style={{ marginBottom: '.75rem' }}>Delete Service Page?</div>
              <p style={{ color: 'var(--a-muted)', marginBottom: '1.25rem' }}>Are you sure? This cannot be undone.</p>
              <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
                <button className="adm-btn adm-btn--ghost" onClick={() => setDel(null)}>Cancel</button>
                <button className="adm-btn adm-btn--danger" onClick={async () => { setServices(await deleteService(del)); setDel(null) }}>Delete</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
