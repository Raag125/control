'use client'
import { useState, useEffect, useRef } from 'react'
import { getServices, saveService } from '../adminData'
import { SERVICES_DATA } from '../../data/servicesData'
import ModalPortal from '../ModalPortal'
import { CheckCircle2, AlertCircle, ChevronDown, Camera, Sparkles, Check, Globe, ExternalLink, Monitor, Smartphone } from 'lucide-react'
import '../../views/PageStyles.css'

const PRESET_ICONS = [
  { label: 'Termite', path: '/images/pests/termite.webp' },
  { label: 'Bed Bug', path: '/images/pests/bed_bug.webp' },
  { label: 'Cockroach', path: '/images/pests/cockroach.webp' },
  { label: 'Rodents', path: '/images/pests/rodent.webp' },
  { label: 'Mosquito', path: '/images/pests/mosquito.webp' },
  { label: 'Honey Bee', path: '/images/pests/honey_bee.webp' },
  { label: 'Ticks & Fleas', path: '/images/pests/flea.webp' },
  { label: 'Tick', path: '/images/pests/tick.webp' },
  { label: 'Wood Borer', path: '/images/pests/wood_borer.webp' },
  { label: 'Ants', path: '/images/pests/ant.webp' },
  { label: 'Residential', path: '/images/pests/residential.webp' },
  { label: 'Commercial', path: '/images/pests/commercial.webp' },
  { label: 'General', path: '/images/pests/general.webp' },
  { label: 'Pre-Construction', path: '/images/pests/pre_construction.webp' },
  { label: 'Post-Construction', path: '/images/pests/post_construction.webp' },
]

const PRESET_BACKGROUNDS = [
  { label: 'Termite Background', path: '/images/services/bg/termite.webp' },
  { label: 'Bed Bug Background', path: '/images/services/bg/bedbug.webp' },
  { label: 'Cockroach Background', path: '/images/services/bg/cockroach.webp' },
  { label: 'Rodent Background', path: '/images/services/bg/rodent.webp' },
  { label: 'Mosquito Background', path: '/images/services/bg/mosquito.webp' },
  { label: 'Honey Bee Background', path: '/images/services/bg/honeybee.webp' },
  { label: 'Ticks & Fleas Background', path: '/images/services/bg/ticks_fleas.webp' },
  { label: 'Wood Borer Background', path: '/images/services/bg/wood_borer.webp' },
  { label: 'Residential Background', path: '/images/services/bg/residential.webp' },
]

export default function ServicePageLiveEditor() {
  const [services, setServices] = useState([])
  const [selectedSlug, setSelectedSlug] = useState('termite-treatment')
  const [svcData, setSvcData] = useState(null)
  const [previewDevice, setPreviewDevice] = useState('desktop') // 'desktop' | 'mobile'
  const [isDirty, setIsDirty] = useState(false)
  const [savedToast, setSavedToast] = useState(false)

  // Image replace modal state
  const [imageModal, setImageModal] = useState({ open: false, type: 'icon', currentUrl: '', currentAlt: '' })
  
  // SEO Meta modal state
  const [seoModal, setSeoModal] = useState(false)

  // Custom Color Panel state
  const [colorPanel, setColorPanel] = useState(false)
  const [newColor, setNewColor] = useState('#22c55e')
  const savedSelectionRef = useRef(null)
  const colorPanelRef = useRef(null)

  // Custom Size Panel state
  const [sizePanel, setSizePanel] = useState(false)
  const sizePanelRef = useRef(null)

  // Formatting toolbar state
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false, h1: false, h2: false, h3: false, p: false })

  const checkFormats = () => {
    const activeEl = document.activeElement;
    if (activeEl && activeEl.isContentEditable) {
      const formatBlock = (document.queryCommandValue('formatBlock') || '').toLowerCase();
      
      let activeHeading = null;
      let node = window.getSelection().anchorNode;
      while (node && node.isContentEditable) {
        if (node.nodeType === 1 && node.classList) {
          if (node.classList.contains('inline-h1') || node.tagName === 'H1') { activeHeading = 'h1'; break; }
          if (node.classList.contains('inline-h2') || node.tagName === 'H2') { activeHeading = 'h2'; break; }
          if (node.classList.contains('inline-h3') || node.tagName === 'H3') { activeHeading = 'h3'; break; }
        }
        node = node.parentNode;
      }

      if (!activeHeading && (formatBlock === 'h1' || formatBlock === 'h2' || formatBlock === 'h3')) {
        activeHeading = formatBlock;
      }

      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        h1: activeHeading === 'h1',
        h2: activeHeading === 'h2',
        h3: activeHeading === 'h3',
        p: !activeHeading && (formatBlock === 'p' || formatBlock === 'div' || formatBlock === '')
      });
    }
  };

  const toggleHeading = (level) => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    
    // First, revert any old formatBlock headings
    const formatBlock = (document.queryCommandValue('formatBlock') || '').toLowerCase();
    if (['h1', 'h2', 'h3'].includes(formatBlock)) {
      document.execCommand('formatBlock', false, 'P');
      if (formatBlock === level.toLowerCase()) {
        setTimeout(checkFormats, 10);
        return;
      }
    }
    
    if (sel.isCollapsed) return; // Need a selection for inline wrap
    
    const targetClass = `inline-${level.toLowerCase()}`;
    const allHeadingClasses = ['inline-h1', 'inline-h2', 'inline-h3'];
    
    let node = sel.anchorNode;
    let parentSpan = null;
    let existingHeadingClass = null;
    
    while (node && node.isContentEditable) {
      if (node.nodeType === 1 && node.classList) {
        const found = allHeadingClasses.find(c => node.classList.contains(c));
        if (found) {
          parentSpan = node;
          existingHeadingClass = found;
          break;
        }
      }
      node = node.parentNode;
    }

    if (parentSpan) {
      if (existingHeadingClass === targetClass) {
        // Same heading clicked -> Toggle OFF (unwrap)
        const parent = parentSpan.parentNode;
        while (parentSpan.firstChild) {
          parent.insertBefore(parentSpan.firstChild, parentSpan);
        }
        parent.removeChild(parentSpan);
      } else {
        // Different heading clicked -> Switch class directly (e.g. inline-h1 -> inline-h2)
        allHeadingClasses.forEach(c => parentSpan.classList.remove(c));
        parentSpan.classList.add(targetClass);
      }
    } else {
      // Wrap selected content
      const range = sel.getRangeAt(0);
      const content = range.extractContents();
      
      // Clean any existing inner heading spans inside extracted content to prevent nesting
      if (content.querySelectorAll) {
        const innerHeadings = content.querySelectorAll('.inline-h1, .inline-h2, .inline-h3');
        innerHeadings.forEach(h => {
          allHeadingClasses.forEach(c => h.classList.remove(c));
          if (h.classList.length === 0 && !h.getAttribute('style')) {
            const parent = h.parentNode;
            while (h.firstChild) parent.insertBefore(h.firstChild, h);
            parent.removeChild(h);
          }
        });
      }
      
      const span = document.createElement('span');
      span.className = targetClass;
      span.appendChild(content);
      range.insertNode(span);
      sel.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.addRange(newRange);
    }
    setTimeout(checkFormats, 10);
  };

  useEffect(() => {
    document.addEventListener('selectionchange', checkFormats);
    function handleClickOutside(e) {
      if (sizePanelRef.current && !sizePanelRef.current.contains(e.target)) {
        setSizePanel(false);
      }
      if (colorPanelRef.current && !colorPanelRef.current.contains(e.target)) {
        setColorPanel(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('selectionchange', checkFormats);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load services list and active service
  useEffect(() => {
    getServices().then(loaded => {
      const list = (loaded && loaded.length > 0) ? loaded : SERVICES_DATA
      setServices(list)
      
      const initial = list.find(s => s.slug === 'termite-treatment' || s.id === 'termite-treatment') || list[0]
      if (initial) {
        loadService(initial)
      }
    })
  }, [])

  function loadService(svc) {
    const full = {
      id: svc.id || svc.slug,
      slug: svc.slug || svc.id,
      path: svc.path || `/${svc.slug || svc.id}`,
      category: svc.category || 'Targeted Pest Solutions',
      emoji: svc.emoji || '🐛',
      badge: svc.badge || 'Certified Safe',
      meta: {
        title: svc.meta?.title || `${svc.hero?.title || svc.name} in Bangalore | A to Z Pest Solutions`,
        desc: svc.meta?.desc || svc.hero?.tagline || '',
        keywords: svc.meta?.keywords || `${(svc.hero?.title || svc.name || '').toLowerCase()} bangalore`,
        canonical: svc.meta?.canonical || `https://atozpestcontrol.in${svc.path || '/' + svc.slug}`,
      },
      hero: {
        title: svc.hero?.title || svc.name || svc.title || 'Pest Control Treatment',
        tagline: svc.hero?.tagline || svc.description || 'Professional pest management solutions in Bangalore.',
        intro: svc.hero?.intro || svc.intro || 'Comprehensive pest control services using certified and eco-friendly formulations.',
        eyebrow: svc.hero?.eyebrow || '🛡️ Expert Treatment',
        image: svc.hero?.image || svc.image || '/images/pests/termite.webp',
        imageAlt: svc.hero?.imageAlt || svc.imageAlt || 'Pest Treatment Inspection View',
        bgImage: svc.hero?.bgImage || svc.bgImage || '/images/services/bg/termite.webp',
        bgImageAlt: svc.hero?.bgImageAlt || svc.bgImageAlt || 'Professional Service Background Banner',
        startingPrice: svc.hero?.startingPrice || `₹${svc.specs?.startingPrice || svc.startingPrice || 2500}`,
        duration: svc.hero?.duration || svc.specs?.duration || svc.duration || '3-4 Hours',
        warranty: svc.hero?.warranty || svc.specs?.warranty || svc.warranty || '5 Years',
        primaryCtaText: svc.hero?.primaryCtaText || 'Call for Free Inspection',
        secondaryCtaText: svc.hero?.secondaryCtaText || 'WhatsApp for Booking',
      },
      specs: {
        startingPrice: svc.specs?.startingPrice || svc.startingPrice || 2500,
        duration: svc.specs?.duration || svc.duration || '3-4 Hours',
        warranty: svc.specs?.warranty || svc.warranty || '5 Years',
        safety: svc.specs?.safety || 'Child & Pet Safe',
        chemicals: svc.specs?.chemicals || 'Certified Formulations',
        coverage: svc.specs?.coverage || 'All Bangalore Areas (60-Min Dispatch)',
      },
      signs: Array.isArray(svc.signs) && svc.signs.length > 0 ? [...svc.signs] : [
        'Hollow-sounding timber when knocked',
        'Mud tubes running along walls or foundations',
        'Powdery frass or bore dust near wooden furniture',
      ],
      benefits: Array.isArray(svc.benefits) && svc.benefits.length > 0 ? [...svc.benefits] : [
        'Certified safe, highly effective termiticide formulations',
        'Zero disruption — no need to vacate property',
        'Odorless, non-staining treatment safe for pets',
      ],
      process: Array.isArray(svc.process) && svc.process.length > 0 ? [...svc.process] : [
        { step: 1, title: 'Comprehensive Property Inspection', desc: 'Our certified inspector maps all active pest colonies and entry points.' },
        { step: 2, title: 'Customized Treatment Plan', desc: 'Targeted action plan using approved eco-friendly methods.' },
        { step: 3, title: 'Precision Application', desc: 'Deep barrier injection and surface protection.' },
        { step: 4, title: 'Preventative Sealing', desc: 'Sealing vulnerable cracks to prevent recurrence.' },
        { step: 5, title: 'Documentation & Warranty', desc: 'Official service report and warranty certificate issued.' },
      ],
      faqs: Array.isArray(svc.faqs) && svc.faqs.length > 0 ? [...svc.faqs] : [
        { q: 'Is this treatment safe for children and pets?', a: 'Yes. Once dried (approx 4 hours), it is completely non-toxic and safe.' },
        { q: 'How long does the treatment take?', a: 'Typically 3–5 hours depending on property size.' },
      ],
      isActive: svc.isActive !== false,
    }
    setSvcData(full)
    setSelectedSlug(full.slug || full.id)
    setIsDirty(false)
  }

  function handleSwitchService(slug) {
    const found = services.find(s => s.slug === slug || s.id === slug)
    if (found) {
      loadService(found)
    }
  }

  // Inline content updater
  function updateText(path, value) {
    setIsDirty(true)
    setSvcData(prev => {
      const copy = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let curr = copy
      for (let i = 0; i < keys.length - 1; i++) {
        if (!curr[keys[i]]) curr[keys[i]] = {}
        curr = curr[keys[i]]
      }
      curr[keys[keys.length - 1]] = value
      return copy
    })
  }

  // Update Array Item
  function updateArrayItem(arrayName, index, field, value) {
    setIsDirty(true)
    setSvcData(prev => {
      const copy = { ...prev }
      const arr = [...(copy[arrayName] || [])]
      if (field) {
        arr[index] = { ...arr[index], [field]: value }
      } else {
        arr[index] = value
      }
      copy[arrayName] = arr
      return copy
    })
  }

  function addArrayItem(arrayName, defaultItem) {
    setIsDirty(true)
    setSvcData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), defaultItem]
    }))
  }

  function removeArrayItem(arrayName, index) {
    setIsDirty(true)
    setSvcData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }))
  }

  function openImagePicker(type) {
    const isIcon = type === 'icon'
    setImageModal({
      open: true,
      type,
      currentUrl: isIcon ? (svcData.hero?.image || '') : (svcData.hero?.bgImage || ''),
      currentAlt: isIcon ? (svcData.hero?.imageAlt || '') : (svcData.hero?.bgImageAlt || ''),
    })
  }

  function applyImageChange() {
    setIsDirty(true)
    if (imageModal.type === 'icon') {
      setSvcData(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          image: imageModal.currentUrl,
          imageAlt: imageModal.currentAlt,
        }
      }))
    } else {
      setSvcData(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          bgImage: imageModal.currentUrl,
          bgImageAlt: imageModal.currentAlt,
        }
      }))
    }
    setImageModal({ ...imageModal, open: false })
  }

  async function handleSaveAll() {
    if (!svcData) return
    const toSave = {
      ...svcData,
      name: svcData.hero?.title,
      description: svcData.hero?.tagline,
      startingPrice: Number(svcData.specs?.startingPrice) || 2500,
      path: svcData.path || `/${svcData.slug}`,
    }
    const updated = await saveService(toSave)
    setServices(updated)
    setIsDirty(false)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3500)
  }

  if (!svcData) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Live Visual Canvas…</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 105px)', minHeight: '600px', background: '#0a0f0d', borderRadius: '16px', border: '1.5px solid rgba(22,163,74,0.25)', overflow: 'hidden' }}>
      
      {/* Toast Notification */}
      {savedToast && (
        <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 999999, background: 'linear-gradient(135deg, #16a34a, #065f46)', color: '#fff', padding: '.85rem 1.5rem', borderRadius: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <Check size={18} /> All Changes Published to Live Website!
        </div>
      )}

      {/* ──────── TOP LIVE CONTROL BAR (Compact & Aligned) ──────── */}
      <div style={{
        background: '#0d1511',
        borderBottom: '1px solid rgba(34, 197, 94, 0.22)',
        padding: '0.35rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        zIndex: 100,
        flexShrink: 0,
        minHeight: '44px'
      }}>
        {/* Left: Service Switcher & Unsaved Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(22,163,74,0.12)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.3)', height: '30px' }}>
            <span style={{ fontSize: '14px', lineHeight: 1 }}>{svcData.emoji}</span>
            <select
              value={selectedSlug}
              onChange={(e) => handleSwitchService(e.target.value)}
              style={{
                background: 'transparent',
                color: '#ffffff',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                maxWidth: '190px',
                textOverflow: 'ellipsis',
              }}
            >
              {services.map(s => {
                const name = s.hero?.title || s.name || s.id
                return (
                  <option key={s.slug || s.id} value={s.slug || s.id} style={{ background: '#111a14', color: '#fff' }}>
                    {s.emoji || '🐛'} {name} ({s.path || `/${s.slug || s.id}`})
                  </option>
                )
              })}
            </select>
          </div>

          {isDirty && (
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#fbbf24', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24' }} />
              Unsaved
            </span>
          )}
        </div>

        {/* Center: Clean Formatting & Device Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          {/* Device Switcher */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              type="button"
              title="Desktop Preview (Full Width)"
              style={{
                height: '24px',
                padding: '0 6px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: previewDevice === 'desktop' ? '#16a34a' : 'transparent',
                color: previewDevice === 'desktop' ? '#fff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease',
              }}
              onClick={() => setPreviewDevice('desktop')}
            >
              <Monitor size={12} />
              <span>Desk</span>
            </button>
            <button
              type="button"
              title="Mobile Preview (Phone Frame)"
              style={{
                height: '24px',
                padding: '0 6px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: previewDevice === 'mobile' ? '#16a34a' : 'transparent',
                color: previewDevice === 'mobile' ? '#fff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease',
              }}
              onClick={() => setPreviewDevice('mobile')}
            >
              <Smartphone size={12} />
              <span>Mob</span>
            </button>
          </div>

          <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />

          {/* Text Style: Bold / Italic / Underline */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', gap: '1px' }}>
            <button
              type="button"
              title="Bold (Ctrl+B)"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold', false, null); setTimeout(checkFormats, 10); }}
              style={{
                width: '24px',
                height: '24px',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
                background: activeFormats.bold ? '#16a34a' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                transition: 'background 0.15s ease',
              }}
            >
              B
            </button>
            <button
              type="button"
              title="Italic (Ctrl+I)"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic', false, null); setTimeout(checkFormats, 10); }}
              style={{
                width: '24px',
                height: '24px',
                fontStyle: 'italic',
                fontFamily: 'serif',
                fontSize: '12px',
                cursor: 'pointer',
                background: activeFormats.italic ? '#16a34a' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                transition: 'background 0.15s ease',
              }}
            >
              I
            </button>
            <button
              type="button"
              title="Underline (Ctrl+U)"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline', false, null); setTimeout(checkFormats, 10); }}
              style={{
                width: '24px',
                height: '24px',
                textDecoration: 'underline',
                fontSize: '12px',
                cursor: 'pointer',
                background: activeFormats.underline ? '#16a34a' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                transition: 'background 0.15s ease',
              }}
            >
              U
            </button>
          </div>

          {/* Headings: H1, H2, H3, P */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', gap: '1px' }}>
            <button
              type="button"
              title="Heading 1"
              onMouseDown={(e) => { e.preventDefault(); toggleHeading('H1'); }}
              style={{
                width: '26px',
                height: '24px',
                cursor: 'pointer',
                background: activeFormats.h1 ? '#16a34a' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 800,
                transition: 'background 0.15s ease',
              }}
            >
              H1
            </button>
            <button
              type="button"
              title="Heading 2"
              onMouseDown={(e) => { e.preventDefault(); toggleHeading('H2'); }}
              style={{
                width: '26px',
                height: '24px',
                cursor: 'pointer',
                background: activeFormats.h2 ? '#16a34a' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 800,
                transition: 'background 0.15s ease',
              }}
            >
              H2
            </button>
            <button
              type="button"
              title="Heading 3"
              onMouseDown={(e) => { e.preventDefault(); toggleHeading('H3'); }}
              style={{
                width: '26px',
                height: '24px',
                cursor: 'pointer',
                background: activeFormats.h3 ? '#16a34a' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 800,
                transition: 'background 0.15s ease',
              }}
            >
              H3
            </button>
            <button
              type="button"
              title="Paragraph Normal Text"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('formatBlock', false, 'P'); setTimeout(checkFormats, 10); }}
              style={{
                width: '22px',
                height: '24px',
                cursor: 'pointer',
                background: activeFormats.p ? '#16a34a' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 800,
                transition: 'background 0.15s ease',
              }}
            >
              P
            </button>
          </div>

          {/* Font Size Popover */}
          <div style={{ position: 'relative' }} ref={sizePanelRef}>
            <button
              type="button"
              title="Font Size"
              onMouseDown={(e) => {
                e.preventDefault();
                const sel = window.getSelection();
                if (sel.rangeCount > 0) savedSelectionRef.current = sel.getRangeAt(0);
                setSizePanel(!sizePanel);
                setColorPanel(false);
              }}
              style={{
                height: '28px',
                padding: '0 6px',
                borderRadius: '5px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: sizePanel ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <span>Size</span>
              <ChevronDown size={11} />
            </button>

            {sizePanel && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                background: '#152019',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '8px',
                zIndex: 9999,
                width: '110px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: '4px',
              }}>
                {[
                  { label: 'Small', value: '1' },
                  { label: 'Normal', value: '3' },
                  { label: 'Large', value: '5' },
                  { label: 'Huge', value: '7' }
                ].map(sz => (
                  <button
                    key={sz.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (savedSelectionRef.current) {
                        const sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(savedSelectionRef.current);
                      }
                      document.execCommand('styleWithCSS', false, true);
                      document.execCommand('fontSize', false, sz.value);
                      setSizePanel(false);
                      setTimeout(checkFormats, 10);
                    }}
                    style={{
                      padding: '0.35rem 0.6rem',
                      background: 'transparent',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(34,197,94,0.18)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Picker Popover */}
          <div style={{ position: 'relative' }} ref={colorPanelRef}>
            <button
              type="button"
              title="Text Color"
              onMouseDown={(e) => {
                e.preventDefault();
                const sel = window.getSelection();
                if (sel.rangeCount > 0) savedSelectionRef.current = sel.getRangeAt(0);
                setColorPanel(!colorPanel);
                setSizePanel(false);
              }}
              style={{
                height: '28px',
                padding: '0 6px',
                borderRadius: '5px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: colorPanel ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: newColor, border: '1px solid rgba(255,255,255,0.4)', display: 'inline-block' }} />
              <span>Color</span>
            </button>

            {colorPanel && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                background: '#152019',
                padding: '0.65rem',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '8px',
                zIndex: 9999,
                width: '160px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>Quick Colors</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '0.6rem' }}>
                  {['#22c55e', '#10b981', '#3b82f6', '#eab308', '#ef4444', '#ec4899', '#ffffff', '#0f172a'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setNewColor(c);
                        if (savedSelectionRef.current) {
                          const sel = window.getSelection();
                          sel.removeAllRanges();
                          sel.addRange(savedSelectionRef.current);
                        }
                        document.execCommand('styleWithCSS', false, true);
                        document.execCommand('foreColor', false, c);
                        setColorPanel(false);
                      }}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        background: c,
                        border: newColor === c ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                      }}
                      title={c}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '3px 6px', borderRadius: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600 }}>Custom:</span>
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    style={{ cursor: 'pointer', padding: '0', border: 'none', background: 'transparent', width: '22px', height: '22px' }}
                  />
                </div>

                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (savedSelectionRef.current) {
                      const sel = window.getSelection();
                      sel.removeAllRanges();
                      sel.addRange(savedSelectionRef.current);
                    }
                    document.execCommand('styleWithCSS', false, true);
                    document.execCommand('foreColor', false, newColor);
                    setColorPanel(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.35rem',
                    background: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Apply Color
                </button>
              </div>
            )}
          </div>

          {/* Clear Format */}
          <button
            type="button"
            title="Clear text formatting"
            onMouseDown={(e) => {
              e.preventDefault();
              document.execCommand('removeFormat', false, null);
              setTimeout(checkFormats, 10);
            }}
            style={{
              height: '28px',
              padding: '0 6px',
              cursor: 'pointer',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '5px',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            Clear
          </button>

          <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />

          {/* SEO & Meta Button */}
          <button
            type="button"
            title="Configure SEO & Metadata"
            style={{
              height: '28px',
              padding: '0 8px',
              fontSize: '11px',
              fontWeight: 700,
              background: 'rgba(22,163,74,0.12)',
              border: '1px solid rgba(22,163,74,0.3)',
              color: '#86efac',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onClick={() => setSeoModal(true)}
          >
            <Globe size={12} />
            <span>SEO</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: svcData.meta?.title ? '#22c55e' : '#f59e0b' }} />
          </button>
        </div>

        {/* Right: Inline Edit Hint, Live Link & Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
          {/* Compact Inline Edit Hint */}
          <div
            title="Click any text on the page below to edit inline. Click images to replace them."
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#86efac',
              padding: '2px 7px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'help',
              whiteSpace: 'nowrap',
            }}
          >
            <Sparkles size={11} />
            <span>Inline Edit</span>
          </div>

          {/* View Live URL */}
          <a
            href={svcData.path || `/${svcData.slug}`}
            target="_blank"
            rel="noreferrer"
            title="Open live service page in new tab"
            style={{
              height: '28px',
              padding: '0 8px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#94a3b8',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Live</span>
            <ExternalLink size={11} />
          </a>

          {/* Save & Publish Live Button */}
          <button
            type="button"
            style={{
              height: '30px',
              padding: '0 12px',
              fontWeight: 800,
              fontSize: '12px',
              background: isDirty ? 'linear-gradient(135deg, #22c55e, #15803d)' : 'linear-gradient(135deg, #16a34a, #15803d)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: isDirty ? '0 0 14px rgba(34, 197, 94, 0.55)' : '0 2px 6px rgba(0,0,0,0.3)',
              animation: isDirty ? 'pulse 2s infinite' : 'none',
              whiteSpace: 'nowrap',
            }}
            onClick={handleSaveAll}
          >
            <Check size={13} strokeWidth={3} />
            <span>{isDirty ? 'Publish ●' : 'Saved'}</span>
          </button>
        </div>
      </div>


      <style>{`
        /* Make headers actually look like headers inside any editable area */
        [contenteditable="true"] h1 { font-size: 2.25rem !important; font-weight: 800 !important; margin: 0.2rem 0 !important; line-height: 1.2 !important; display: block; }
        [contenteditable="true"] h2 { font-size: 1.75rem !important; font-weight: 700 !important; margin: 0.2rem 0 !important; line-height: 1.3 !important; display: block; }
        [contenteditable="true"] h3 { font-size: 1.4rem !important; font-weight: 600 !important; margin: 0.2rem 0 !important; line-height: 1.4 !important; display: block; }
        [contenteditable="true"] p { font-size: 1.1rem !important; margin: 0.2rem 0 !important; line-height: 1.6 !important; display: block; }

        /* Inline variants of headers that ONLY apply to selected text without breaking paragraphs */
        .inline-h1 { font-size: 2.25rem !important; font-weight: 800 !important; line-height: 1.2 !important; }
        .inline-h2 { font-size: 1.75rem !important; font-weight: 700 !important; line-height: 1.3 !important; }
        .inline-h3 { font-size: 1.4rem !important; font-weight: 600 !important; line-height: 1.4 !important; }

        /* Force any nested elements (like font or span) to inherit the header size to prevent them from staying small */
        [contenteditable="true"] h1 *, [contenteditable="true"] h2 *, [contenteditable="true"] h3 *, .inline-h1 *, .inline-h2 *, .inline-h3 * {
          font-size: inherit !important;
          line-height: inherit !important;
          font-weight: inherit !important;
        }

        [contenteditable="true"] h1, [contenteditable="true"] h2, [contenteditable="true"] h3, [contenteditable="true"] h4, [contenteditable="true"] p {
          position: relative;
        }
        /* Desktop Hover */
        @media (hover: hover) {
          [contenteditable="true"] h1:hover::before,
          [contenteditable="true"] h2:hover::before,
          [contenteditable="true"] h3:hover::before,
          [contenteditable="true"] h4:hover::before,
          [contenteditable="true"] p:hover::before {
            position: absolute;
            top: -12px;
            left: -5px;
            font-size: 0.65rem;
            background: #334155;
            color: #f8fafc;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
            opacity: 0.9;
            pointer-events: none;
            z-index: 10;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          [contenteditable="true"] h1:hover::before { content: 'H1'; }
          [contenteditable="true"] h2:hover::before { content: 'H2'; }
          [contenteditable="true"] h3:hover::before { content: 'H3'; }
          [contenteditable="true"] h4:hover::before { content: 'H4'; }
          [contenteditable="true"] p:hover::before { content: 'Paragraph'; }
        }
        /* Touch Devices (Persistent subtle label) */
        @media (hover: none) {
          [contenteditable="true"] h1::before,
          [contenteditable="true"] h2::before,
          [contenteditable="true"] h3::before,
          [contenteditable="true"] h4::before,
          [contenteditable="true"] p::before {
            position: absolute;
            top: -10px;
            left: -2px;
            font-size: 0.55rem;
            background: rgba(241, 245, 249, 0.9);
            color: #64748b;
            padding: 1px 4px;
            border-radius: 3px;
            font-weight: 600;
            pointer-events: none;
          }
          [contenteditable="true"] h1::before { content: 'H1'; }
          [contenteditable="true"] h2::before { content: 'H2'; }
          [contenteditable="true"] h3::before { content: 'H3'; }
          [contenteditable="true"] h4::before { content: 'H4'; }
          [contenteditable="true"] p::before { content: 'Paragraph'; }
        }
      `}</style>

      {/* ──────── LIVE VISUAL IN-PLACE CANVAS ──────── */}
      <div 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          WebkitOverflowScrolling: 'touch', 
          display: 'flex', 
          justifyContent: 'center', 
          padding: previewDevice === 'mobile' ? '1.5rem 1rem 3rem' : '0', 
          background: '#070b09',
          scrollBehavior: 'smooth',
        }}
      >
        <div
          style={{
            width: previewDevice === 'mobile' ? '410px' : '100%',
            maxWidth: previewDevice === 'mobile' ? '410px' : '100%',
            height: 'fit-content',
            minHeight: previewDevice === 'mobile' ? '820px' : '100%',
            background: '#ffffff',
            borderRadius: previewDevice === 'mobile' ? '36px' : '0',
            boxShadow: previewDevice === 'mobile' ? '0 30px 70px rgba(0,0,0,0.8), 0 0 0 12px #1e293b' : 'none',
            position: 'relative',
            transition: 'width 0.3s ease',
          }}
        >
          {/* Simulated Browser URL bar on mobile view */}
          {previewDevice === 'mobile' && (
            <div style={{ background: '#0f172a', padding: '.6rem 1rem', display: 'flex', alignItems: 'center', gap: '.5rem', color: '#94a3b8', fontSize: 'var(--font-size-h3)', fontFamily: 'monospace' }}>
              <span>🔒 https://atozpestcontrol.in{svcData.path || `/${svcData.slug}`}</span>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════
             1. HERO SECTION (INLINE EDITABLE WITH IMAGE REPLACE)
             ══════════════════════════════════════════════════════ */}
          <section className={`page-hero ${svcData.hero?.bgImage ? 'page-hero--dark' : ''}`} style={{ position: 'relative' }}>
            
            {/* Background Banner with Click-to-Replace Overlay */}
            <div className="page-hero__bg-wrapper" style={{ position: 'absolute', inset: 0 }}>
              {svcData.hero?.bgImage && (
                <img
                  src={svcData.hero.bgImage}
                  alt={svcData.hero.bgImageAlt || 'Hero Banner'}
                  className="page-hero__bg-img"
                  style={{ opacity: 1 }}
                />
              )}
              <div className="page-hero__bg-overlay" />
              
              {/* Floating Button to replace Background Banner */}
              <button
                type="button"
                onClick={() => openImagePicker('background')}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  zIndex: 20,
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '20px',
                  padding: '.4rem .85rem',
                  fontSize: 'var(--font-size-h3)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '.4rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                <Camera size={14} /> Change Banner Image &amp; Alt
              </button>
            </div>

            {/* Floating Orbs */}
            <div className="orb orb--1" aria-hidden="true" />
            <div className="orb orb--2" aria-hidden="true" />
            <div className="orb orb--3" aria-hidden="true" />

            {/* Hero Main Content */}
            <div className="container page-hero__content" style={{ position: 'relative', zIndex: 10 }}>
              
              {/* Eyebrow Badge (Click to Edit) */}
              <div
                contentEditable={true}
                suppressContentEditableWarning
                onBlur={(e) => updateText('hero.eyebrow', e.currentTarget.innerHTML)}
                className="eyebrow"
                style={{
                  outline: '1.5px dashed rgba(255,255,255,0.4)',
                  cursor: 'text',
                  padding: '.3rem .85rem',
                  marginBottom: '1rem',
                  display: 'inline-block',
                }}
                title="Click to edit eyebrow text"
               dangerouslySetInnerHTML={{ __html: svcData.hero?.eyebrow || "🛡️ Expert Treatment" }} />

              {/* Circular Pest Icon (Click to Replace) */}
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                <div
                  onClick={() => openImagePicker('icon')}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid var(--clr-bg)',
                    boxShadow: 'var(--shadow-lg)',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  title="Click to change Pest Icon and Alt Text"
                >
                  <img
                    src={svcData.hero?.image}
                    alt={svcData.hero?.imageAlt || 'Pest Icon'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.45)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      opacity: 0.9,
                      fontSize: 'var(--font-size-h3)',
                      fontWeight: 700,
                      gap: '.2rem',
                    }}
                  >
                    <Camera size={18} />
                    <span>Change Icon</span>
                  </div>
                </div>
              </div>

              {/* Service H1 Title (Click to Edit) */}
              <h1
                contentEditable={true}
                suppressContentEditableWarning
                onBlur={(e) => updateText('hero.title', e.currentTarget.innerHTML)}
                className="display-xl"
                style={{
                  outline: '1.5px dashed rgba(255,255,255,0.4)',
                  cursor: 'text',
                  padding: '.2rem .5rem',
                  borderRadius: '6px',
                  display: 'inline-block',
                }}
                title="Click to edit H1 Title directly"
               dangerouslySetInnerHTML={{ __html: svcData.hero?.title || "Service Title" }} />

              {/* Hero Tagline / Subtitle (Click to Edit) */}
              <p
                contentEditable={true}
                suppressContentEditableWarning
                onBlur={(e) => updateText('hero.tagline', e.currentTarget.innerHTML)}
                className="body-lg text-muted"
                style={{
                  maxWidth: 640,
                  margin: '1rem auto 0',
                  outline: '1.5px dashed rgba(255,255,255,0.4)',
                  cursor: 'text',
                  padding: '.35rem .6rem',
                  borderRadius: '6px',
                }}
                title="Click to edit Tagline text"
               dangerouslySetInnerHTML={{ __html: svcData.hero?.tagline || "Get expert pest control services in Bangalore." }} />

              {/* Action Buttons Mockup */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
                <div 
                  className="btn btn-primary"
                  contentEditable={true}
                  suppressContentEditableWarning
                  onBlur={(e) => updateText('hero.primaryCtaText', e.currentTarget.innerHTML)}
                  style={{ outline: 'none', cursor: 'text', border: '1.5px dashed rgba(255,255,255,0.5)' }}
                  title="Click to edit Button Text"
                >
                  <span dangerouslySetInnerHTML={{ __html: svcData.hero?.primaryCtaText || 'Call for Free Inspection' }} />
                </div>
                <div 
                  className="btn btn-outline"
                  contentEditable={true}
                  suppressContentEditableWarning
                  onBlur={(e) => updateText('hero.secondaryCtaText', e.currentTarget.innerHTML)}
                  style={{ outline: 'none', cursor: 'text', border: '1.5px dashed rgba(255,255,255,0.5)' }}
                  title="Click to edit Button Text"
                >
                  <span dangerouslySetInnerHTML={{ __html: svcData.hero?.secondaryCtaText || 'WhatsApp for Booking' }} />
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
             2. SERVICE DETAIL & ABOUT SECTION (INLINE EDITABLE)
             ══════════════════════════════════════════════════════ */}
          <section className="section service-section-bg" style={{ position: 'relative', background: '#f8faf9', padding: '3rem 1.5rem' }}>
            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: previewDevice === 'mobile' ? '1fr' : '1.7fr 1fr', gap: '2.5rem' }}>
                
                {/* ── LEFT MAIN COLUMN ── */}
                <div>
                  <h2
                    className="heading-md"
                    contentEditable={true}
                    suppressContentEditableWarning
                    onBlur={(e) => updateText('sectionTitles.about', e.currentTarget.innerHTML)}
                    style={{ marginBottom: '1rem', color: 'var(--clr-text)', outline: 'none', cursor: 'text', borderBottom: '1px dashed #16a34a' }}
                    title="Click to edit About Title"
                    dangerouslySetInnerHTML={{ __html: svcData.sectionTitles?.about || `About Our ${svcData.hero?.title || 'Service'}` }}
                  />

                  {/* Detailed Intro Paragraph (Click to Edit) */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div
                      contentEditable={true}
                      suppressContentEditableWarning
                      onBlur={(e) => updateText('hero.intro', e.currentTarget.innerHTML)}
                      className="body-md text-muted rich-text-editor"
                      style={{
                        outline: '1.5px dashed rgba(22,163,74,0.4)',
                        cursor: 'text',
                        padding: '.75rem',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.7,
                        minHeight: '100px',
                      }}
                      title="Click to edit full Introduction text"
                      dangerouslySetInnerHTML={{ __html: svcData.hero?.intro || "" }} />
                  </div>

                  {/* ── WARNING SIGNS (INLINE EDITABLE LIST) ── */}
                  <div style={{ marginTop: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: 800, color: 'var(--clr-text)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        <AlertCircle size={18} style={{ color: 'var(--clr-primary)' }} />
                        <span
                          contentEditable={true}
                          suppressContentEditableWarning
                          onBlur={(e) => updateText('sectionTitles.signs', e.currentTarget.innerHTML)}
                          style={{ outline: 'none', cursor: 'text', borderBottom: '1px dashed #16a34a' }}
                          title="Click to edit Signs Title"
                          dangerouslySetInnerHTML={{ __html: svcData.sectionTitles?.signs || 'Signs You Need This Treatment' }}
                        />
                      </h3>
                      <button
                        type="button"
                        onClick={() => addArrayItem('signs', 'New warning sign observed in property...')}
                        className="adm-btn adm-btn--primary adm-btn--sm"
                        style={{ fontSize: 'var(--font-size-h2)', padding: '.25rem .65rem' }}
                      >
                        + Add Sign
                      </button>
                    </div>

                    <div style={{ display: 'grid', gap: '.65rem' }}>
                      {(svcData.signs || []).map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', background: '#fff', padding: '.55rem .85rem', borderRadius: '8px', border: '1px solid rgba(22,163,74,0.15)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                          <CheckCircle2 size={16} style={{ color: 'var(--clr-primary)', flexShrink: 0 }} />
                          <span
                            contentEditable={true}
                            suppressContentEditableWarning
                            onBlur={(e) => updateArrayItem('signs', i, null, e.currentTarget.innerHTML)}
                            style={{ flex: 1, outline: 'none', cursor: 'text', fontSize: 'var(--font-size-h3)', color: 'var(--clr-text)' }}
                            title="Click to edit sign text"
                           dangerouslySetInnerHTML={{ __html: s }} />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('signs', i)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 'var(--font-size-h3)', fontWeight: 800, opacity: 0.7 }}
                            title="Delete this sign"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── 5-STEP PROCESS (INLINE EDITABLE) ── */}
                  <div style={{ marginTop: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: 800, color: 'var(--clr-text)' }}>
                        <span
                          contentEditable={true}
                          suppressContentEditableWarning
                          onBlur={(e) => updateText('sectionTitles.process', e.currentTarget.innerHTML)}
                          style={{ outline: 'none', cursor: 'text', borderBottom: '1px dashed #16a34a' }}
                          title="Click to edit Process Title"
                          dangerouslySetInnerHTML={{ __html: svcData.sectionTitles?.process || 'Our Treatment Process' }}
                        />
                      </h3>
                      <button
                        type="button"
                        onClick={() => addArrayItem('process', { step: (svcData.process?.length || 0) + 1, title: 'New Process Phase', desc: 'Detailed description of this treatment step.' })}
                        className="adm-btn adm-btn--primary adm-btn--sm"
                        style={{ fontSize: 'var(--font-size-h2)', padding: '.25rem .65rem' }}
                      >
                        + Add Step
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {(svcData.process || []).map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(22,163,74,0.15)', position: 'relative' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--clr-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                            {i + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <strong
                              contentEditable={true}
                              suppressContentEditableWarning
                              onBlur={(e) => updateArrayItem('process', i, 'title', e.currentTarget.innerHTML)}
                              style={{ display: 'block', fontSize: 'var(--font-size-h3)', fontWeight: 800, color: 'var(--clr-text)', outline: 'none', cursor: 'text', marginBottom: '.25rem' }}
                              title="Click to edit step title"
                             dangerouslySetInnerHTML={{ __html: step.title }} />
                            <p
                              contentEditable={true}
                              suppressContentEditableWarning
                              onBlur={(e) => updateArrayItem('process', i, 'desc', e.currentTarget.innerHTML)}
                              style={{ fontSize: 'var(--font-size-h3)', color: 'var(--clr-text-muted)', lineHeight: 1.6, outline: 'none', cursor: 'text' }}
                              title="Click to edit step description"
                             dangerouslySetInnerHTML={{ __html: step.desc }} />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('process', i)}
                            style={{ position: 'absolute', top: '.6rem', right: '.6rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 'var(--font-size-h3)', fontWeight: 800, opacity: 0.6 }}
                            title="Delete this step"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── FREQUENTLY ASKED QUESTIONS (FAQS) ── */}
                  <div style={{ marginTop: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: 800, color: 'var(--clr-text)' }}>
                        <span
                          contentEditable={true}
                          suppressContentEditableWarning
                          onBlur={(e) => updateText('sectionTitles.faq', e.currentTarget.innerHTML)}
                          style={{ outline: 'none', cursor: 'text', borderBottom: '1px dashed #16a34a' }}
                          title="Click to edit FAQ Title"
                          dangerouslySetInnerHTML={{ __html: svcData.sectionTitles?.faq || 'Frequently Asked Questions' }}
                        /> (FAQs)
                      </h3>
                      <button
                        type="button"
                        onClick={() => addArrayItem('faqs', { q: 'New Customer Question?', a: 'Detailed informative answer for clients.' })}
                        className="adm-btn adm-btn--primary adm-btn--sm"
                        style={{ fontSize: 'var(--font-size-h2)', padding: '.25rem .65rem' }}
                      >
                        + Add FAQ
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                      {(svcData.faqs || []).map((faq, i) => (
                        <div key={i} style={{ background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(22,163,74,0.15)', position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '.5rem', marginBottom: '.4rem' }}>
                            <strong
                              contentEditable={true}
                              suppressContentEditableWarning
                              onBlur={(e) => updateArrayItem('faqs', i, 'q', e.currentTarget.innerHTML)}
                              style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, color: 'var(--clr-text)', outline: 'none', cursor: 'text', flex: 1 }}
                              title="Click to edit Question"
                             dangerouslySetInnerHTML={{ __html: faq.q }} />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('faqs', i)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 'var(--font-size-h3)', fontWeight: 800, opacity: 0.6 }}
                              title="Delete this FAQ"
                            >
                              ✕
                            </button>
                          </div>
                          <p
                            contentEditable={true}
                            suppressContentEditableWarning
                            onBlur={(e) => updateArrayItem('faqs', i, 'a', e.currentTarget.innerHTML)}
                            style={{ fontSize: 'var(--font-size-h3)', color: 'var(--clr-text-muted)', lineHeight: 1.6, outline: 'none', cursor: 'text' }}
                            title="Click to edit Answer"
                           dangerouslySetInnerHTML={{ __html: faq.a }} />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* ── RIGHT SIDEBAR COLUMN ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Quick Booking & Pricing Card */}
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1.5px solid rgba(22,163,74,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 800, color: 'var(--clr-primary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      Pricing &amp; Specs
                    </div>
                    
                    <div style={{ marginTop: '.75rem', display: 'flex', alignItems: 'baseline', gap: '.4rem' }}>
                      <span style={{ fontSize: 'var(--font-size-h2)', fontWeight: 900, color: 'var(--clr-text)' }}>
                        ₹
                        <span
                          contentEditable={true}
                          suppressContentEditableWarning
                          onBlur={(e) => updateText('specs.startingPrice', e.currentTarget.textContent.replace(/[^0-9]/g, ''))}
                          style={{ outline: 'none', cursor: 'text', borderBottom: '1px dashed #16a34a' }}
                          title="Click to edit Starting Price"
                        >
                          {svcData.specs?.startingPrice || 2500}
                        </span>
                      </span>
                      <span style={{ fontSize: 'var(--font-size-h3)', color: 'var(--clr-text-muted)' }}>starting price</span>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'grid', gap: '.6rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-h2)' }}>
                        <span 
                          contentEditable={true}
                          suppressContentEditableWarning
                          onBlur={(e) => updateText('specLabels.duration', e.currentTarget.innerHTML)}
                          style={{ color: 'var(--clr-text-muted)', outline: 'none', cursor: 'text', borderBottom: '1px dashed #16a34a' }}
                          title="Click to edit Label"
                          dangerouslySetInnerHTML={{ __html: svcData.specLabels?.duration || 'Duration:' }}
                        />
                        <strong
                          contentEditable={true}
                          suppressContentEditableWarning
                          onBlur={(e) => updateText('specs.duration', e.currentTarget.innerHTML)}
                          style={{ outline: 'none', cursor: 'text', borderBottom: '1px dashed #16a34a' }}
                          title="Click to edit Duration"
                        >
                          {svcData.specs?.duration || '3-4 Hours'}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-h2)' }}>
                        <span 
                          contentEditable={true}
                          suppressContentEditableWarning
                          onBlur={(e) => updateText('specLabels.warranty', e.currentTarget.innerHTML)}
                          style={{ color: 'var(--clr-text-muted)', outline: 'none', cursor: 'text', borderBottom: '1px dashed #16a34a' }}
                          title="Click to edit Label"
                          dangerouslySetInnerHTML={{ __html: svcData.specLabels?.warranty || 'Warranty:' }}
                        />
                        <strong
                          contentEditable={true}
                          suppressContentEditableWarning
                          onBlur={(e) => updateText('specs.warranty', e.currentTarget.innerHTML)}
                          style={{ outline: 'none', cursor: 'text', borderBottom: '1px dashed #16a34a' }}
                          title="Click to edit Warranty"
                        >
                          {svcData.specs?.warranty || '5 Years'}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-h2)' }}>
                        <span style={{ color: 'var(--clr-text-muted)' }}>Safety:</span>
                        <span style={{ color: '#16a34a', fontWeight: 700 }}>100% Eco-Safe</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits Card (Inline Editable) */}
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(22,163,74,0.15)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: 'var(--font-size-h3)', fontWeight: 800, color: 'var(--clr-text)' }}>
                        <span
                          contentEditable={true}
                          suppressContentEditableWarning
                          onBlur={(e) => updateText('sectionTitles.benefits', e.currentTarget.innerHTML)}
                          style={{ outline: 'none', cursor: 'text', borderBottom: '1px dashed #16a34a' }}
                          title="Click to edit Benefits Title"
                          dangerouslySetInnerHTML={{ __html: svcData.sectionTitles?.benefits || '✨ Service Benefits' }}
                        />
                      </h4>
                      <button
                        type="button"
                        onClick={() => addArrayItem('benefits', 'New proven benefit...')}
                        className="adm-btn adm-btn--primary adm-btn--sm"
                        style={{ fontSize: 'var(--font-size-h3)', padding: '.2rem .55rem' }}
                      >
                        + Add
                      </button>
                    </div>

                    <div style={{ display: 'grid', gap: '.65rem' }}>
                      {(svcData.benefits || []).map((b, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: 'var(--font-size-h3)' }}>
                          <CheckCircle2 size={14} style={{ color: 'var(--clr-primary)', flexShrink: 0 }} />
                          <span
                            contentEditable={true}
                            suppressContentEditableWarning
                            onBlur={(e) => updateArrayItem('benefits', idx, null, e.currentTarget.innerHTML)}
                            style={{ flex: 1, outline: 'none', cursor: 'text', color: 'var(--clr-text)' }}
                            title="Click to edit benefit"
                           dangerouslySetInnerHTML={{ __html: b }} />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('benefits', idx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 'var(--font-size-h3)', fontWeight: 800, opacity: 0.6 }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </section>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
         IMAGE REPLACE & ALT MODAL
         ══════════════════════════════════════════════════════ */}
      {imageModal.open && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={() => setImageModal({ ...imageModal, open: false })}>
            <div className="adm-modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
              <div className="adm-modal__header">
                <span className="adm-modal__title">
                  📷 Replace {imageModal.type === 'icon' ? 'Pest Icon' : 'Background Banner'}
                </span>
                <button className="adm-modal__close" onClick={() => setImageModal({ ...imageModal, open: false })}>✕</button>
              </div>

              <div className="adm-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Live Preview of Selected Image */}
                <div style={{ width: '100%', height: '140px', background: '#0b130e', borderRadius: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--a-border)' }}>
                  <img
                    src={imageModal.currentUrl}
                    alt={imageModal.currentAlt || 'Preview'}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Image Path / URL / Local Upload</label>
                  <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                    <input
                      className="adm-input"
                      value={imageModal.currentUrl}
                      onChange={(e) => setImageModal({ ...imageModal, currentUrl: e.target.value })}
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
                              setImageModal({ ...imageModal, currentUrl: event.target.result });
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
                  <label className="adm-label">Image Alt Description (Crucial for SEO &amp; Google Images)</label>
                  <input
                    className="adm-input"
                    value={imageModal.currentAlt}
                    onChange={(e) => setImageModal({ ...imageModal, currentAlt: e.target.value })}
                    placeholder="Inspection view of Termite Treatment in Bangalore"
                  />
                </div>

                {/* Quick Presets Picker */}
                <div>
                  <label className="adm-label" style={{ marginBottom: '.4rem' }}>Quick Preset Selection:</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem' }}>
                    {(imageModal.type === 'icon' ? PRESET_ICONS : PRESET_BACKGROUNDS).map(p => (
                      <button
                        key={p.path}
                        type="button"
                        className={`adm-chip ${imageModal.currentUrl === p.path ? 'active' : ''}`}
                        style={{ fontSize: 'var(--font-size-h3)', padding: '.25rem .6rem' }}
                        onClick={() => setImageModal({ ...imageModal, currentUrl: p.path, currentAlt: `${p.label} in Bangalore` })}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="adm-modal__footer">
                <button className="adm-btn adm-btn--ghost" onClick={() => setImageModal({ ...imageModal, open: false })}>Cancel</button>
                <button className="adm-btn adm-btn--primary" onClick={applyImageChange}>Apply &amp; Replace Image</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ══════════════════════════════════════════════════════
         SEO & META DRAWER MODAL
         ══════════════════════════════════════════════════════ */}
      {seoModal && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={() => setSeoModal(false)}>
            <div className="adm-modal" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
              <div className="adm-modal__header">
                <span className="adm-modal__title">🔍 SEO &amp; Meta Settings</span>
                <button className="adm-modal__close" onClick={() => setSeoModal(false)}>✕</button>
              </div>

              <div className="adm-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="adm-form-group">
                  <label className="adm-label">Page Meta Title (&lt;title&gt; tag)</label>
                  <input
                    className="adm-input"
                    value={svcData.meta?.title || ''}
                    onChange={(e) => updateText('meta.title', e.target.value)}
                    placeholder="e.g. Termite Treatment in Bangalore | A to Z Pest Solutions"
                  />
                  <span style={{ fontSize: 'var(--font-size-h3)', color: 'var(--a-muted)', marginTop: '.2rem' }}>
                    {svcData.meta?.title?.length || 0} / 60 recommended characters
                  </span>
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">SEO Meta Description</label>
                  <textarea
                    className="adm-textarea"
                    rows="3"
                    value={svcData.meta?.desc || ''}
                    onChange={(e) => updateText('meta.desc', e.target.value)}
                    placeholder="Search engine snippet description (150–160 characters)..."
                  />
                  <span style={{ fontSize: 'var(--font-size-h3)', color: 'var(--a-muted)', marginTop: '.2rem' }}>
                    {svcData.meta?.desc?.length || 0} / 160 recommended characters
                  </span>
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Target SEO Keywords</label>
                  <input
                    className="adm-input"
                    value={svcData.meta?.keywords || ''}
                    onChange={(e) => updateText('meta.keywords', e.target.value)}
                    placeholder="termite treatment bangalore, drill fill seal termite"
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Canonical URL</label>
                  <input
                    className="adm-input"
                    value={svcData.meta?.canonical || `https://atozpestcontrol.in${svcData.path || '/' + svcData.slug}`}
                    onChange={(e) => updateText('meta.canonical', e.target.value)}
                  />
                </div>
              </div>

              <div className="adm-modal__footer">
                <button className="adm-btn adm-btn--primary" onClick={() => setSeoModal(false)}>Done</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

    </div>
  )
}
