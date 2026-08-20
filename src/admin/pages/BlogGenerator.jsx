'use client'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { saveBlog, getMonthPlan, saveMonthPlan, hydrateCalendar } from '../adminData'
import toast from 'react-hot-toast'
import '../admin.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const CATEGORY_COLORS = {
  'How-To Guide': '#3b82f6', 'Comparison': '#8b5cf6', 'Cost Guide': '#f59e0b',
  'Seasonal': '#06b6d4', 'Local SEO': '#10b981', 'FAQ Article': '#ec4899', 'Prevention Tips': '#6366f1',
}

function CalendarModal({ open, onClose, onGenerateBlog }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [plan, setPlan] = useState(null)
  const [planning, setPlanning] = useState(false)
  const [autoPublish, setAutoPublish] = useState(false)
  const [editDay, setEditDay] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [generating, setGenerating] = useState(null)
  const yearMonth = `${viewYear}-${String(viewMonth).padStart(2,'0')}`

  useEffect(() => {
    hydrateCalendar().then(() => {
      const stored = getMonthPlan(yearMonth)
      if (stored) { setPlan(stored); setAutoPublish(stored.autoPublish || false) }
      else setPlan(null)
    })
  }, [])

  useEffect(() => {
    const stored = getMonthPlan(yearMonth)
    if (stored) { setPlan(stored); setAutoPublish(stored.autoPublish || false) }
    else setPlan(null)
  }, [yearMonth])

  async function generatePlan() {
    setPlanning(true)
    try {
      const res = await fetch('/api/openai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'calendar_plan', year: viewYear, month: viewMonth, frequency: 7 }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Failed')
      const newPlan = { ...data.plan, autoPublish, frequency: 7, generated: new Date().toISOString() }
      setPlan(newPlan); saveMonthPlan(yearMonth, newPlan)
      toast.success(`${MONTHS[viewMonth-1]} plan generated with ${Object.keys(data.plan.days || {}).length} posts!`)
    } catch(e) { toast.error(e.message) } finally { setPlanning(false) }
  }

  function toggleAutoPublish(val) {
    setAutoPublish(val)
    if (plan) { const u = { ...plan, autoPublish: val }; setPlan(u); saveMonthPlan(yearMonth, u) }
  }

  function startEdit(date, data) { setEditDay(date); setEditForm({ ...data }) }
  function saveEdit() {
    if (!editDay) return
    const u = { ...plan, days: { ...plan.days, [editDay]: editForm } }
    setPlan(u); saveMonthPlan(yearMonth, u); setEditDay(null); toast.success('Day updated')
  }

  async function generateSingleBlog(date, dayData) {
    setGenerating(date)
    try { await onGenerateBlog(dayData.keyword, dayData.notes) } finally { setGenerating(null) }
  }

  const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate()
  const daysLeft = new Date(viewYear, viewMonth, 0).getDate() - today.getDate()
  const nextMonthYM = viewMonth === 12 ? `${viewYear+1}-01` : `${viewYear}-${String(viewMonth+1).padStart(2,'0')}`
  const showNextMonthBanner = daysLeft <= 5 && !getMonthPlan(nextMonthYM) && viewYear === today.getFullYear() && viewMonth === today.getMonth() + 1

  if (!open) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
      <div style={{ background: 'var(--a-card)', borderRadius: '18px', border: '1px solid var(--a-border)', width: '92vw', maxWidth: 1100, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--a-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--a-card)', zIndex: 10 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--a-text)' }}>📅 Content Calendar</h2>
            <p style={{ margin: '0.2rem 0 0', color: 'var(--a-muted)', fontSize: '0.84rem' }}>AI-powered monthly blog planning</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div onClick={() => toggleAutoPublish(!autoPublish)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 20, background: autoPublish ? '#10b981' : '#d1d5db', borderRadius: '100px', position: 'relative', transition: 'background 0.25s' }}>
                <div style={{ position: 'absolute', top: 2, left: autoPublish ? 18 : 2, width: 16, height: 16, background: 'white', borderRadius: '50%', transition: 'left 0.2s' }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--a-muted)', fontWeight: 600 }}>Auto-Publish</span>
            </div>
            <button onClick={() => {
              if (plan && !window.confirm('Are you sure you want to regenerate? This will overwrite the existing plan for this month.')) return;
              generatePlan();
            }} disabled={planning} style={{ padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: planning ? 'not-allowed' : 'pointer', opacity: planning ? 0.7 : 1, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {planning ? '⏳ Planning...' : (plan ? '🔄 Regenerate Plan' : '✨ Generate Plan')}
            </button>
            <button onClick={onClose} style={{ width: 36, height: 36, background: 'var(--a-bg)', border: '1px solid var(--a-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--a-muted)', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
        </div>
        <div style={{ padding: '1.5rem 2rem' }}>
          {showNextMonthBanner && <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#d97706', fontSize: '0.85rem' }}>⚠️ {daysLeft} days left — <strong>{MONTHS[viewMonth===12?0:viewMonth]} plan not yet generated!</strong></div>}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <button onClick={() => { if(viewMonth===1){setViewMonth(12);setViewYear(y=>y-1)}else setViewMonth(m=>m-1) }} style={{ background: 'var(--a-bg)', border: '1px solid var(--a-border)', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', color: 'var(--a-text)', fontWeight: 600 }}>‹ Prev</button>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem', color: 'var(--a-text)' }}>{MONTHS[viewMonth-1]} {viewYear}</h3>
            <button onClick={() => { if(viewMonth===12){setViewMonth(1);setViewYear(y=>y+1)}else setViewMonth(m=>m+1) }} style={{ background: 'var(--a-bg)', border: '1px solid var(--a-border)', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', color: 'var(--a-text)', fontWeight: 600 }}>Next ›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', marginBottom: '0.4rem' }}>
            {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--a-muted)', padding: '0.35rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
            {Array(firstDay).fill(null).map((_,i)=><div key={`e-${i}`}/>)}
            {Array(daysInMonth).fill(null).map((_,i) => {
              const d=i+1, dateStr=`${viewYear}-${String(viewMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`, dayData=plan?.days?.[dateStr], isToday=dateStr===new Date().toISOString().split('T')[0], catColor=dayData?CATEGORY_COLORS[dayData.category]||'#6366f1':null
              return (
                <div key={d} onClick={()=>dayData&&startEdit(dateStr,dayData)} style={{ minHeight: 90, background: isToday?'rgba(99,102,241,0.08)':'var(--a-bg)', border: `1px solid ${isToday?'#6366f1':'var(--a-border)'}`, borderRadius: '8px', padding: '0.5rem', position: 'relative', cursor: dayData?'pointer':'default', transition: 'background 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: isToday?'#6366f1':'var(--a-text)' }}>{d}</div>
                    {dayData && (
                      <div onClick={(e)=>{e.stopPropagation(); startEdit(dateStr,dayData)}} style={{ fontSize: '0.65rem', background: 'var(--a-border)', color: 'var(--a-text)', padding: '0.1rem 0.3rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>✏️ Edit</div>
                    )}
                  </div>
                  {dayData && <>
                    <div style={{ fontSize: '0.65rem', color: 'white', background: catColor, borderRadius: '4px', padding: '0.15rem 0.35rem', marginBottom: '0.25rem', fontWeight: 600 }}>{dayData.category}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--a-muted)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{dayData.keyword}</div>
                    <button onClick={e=>{e.stopPropagation();generateSingleBlog(dateStr,dayData)}} disabled={generating===dateStr} style={{ position: 'absolute', bottom: 4, right: 4, background: '#3b82f6', border: 'none', borderRadius: '4px', color: 'white', fontSize: '0.6rem', padding: '0.15rem 0.4rem', cursor: 'pointer', opacity: generating===dateStr?0.6:1 }}>{generating===dateStr?'...':'▶'}</button>
                  </>}
                </div>
              )
            })}
          </div>
          {editDay && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '12px', padding: '1.5rem', width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <h3 style={{ margin: '0 0 1rem', fontWeight: 800, color: 'var(--a-text)' }}>Edit — {editDay}</h3>
                <label className="adm-label">Keyword</label>
                <input className="adm-input" value={editForm.keyword||''} onChange={e=>setEditForm(f=>({...f,keyword:e.target.value}))} style={{marginBottom:'0.75rem'}} />
                <label className="adm-label">Category</label>
                <select className="adm-input" value={editForm.category||''} onChange={e=>setEditForm(f=>({...f,category:e.target.value}))} style={{marginBottom:'0.75rem'}}>
                  {Object.keys(CATEGORY_COLORS).map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <label className="adm-label">Notes</label>
                <textarea className="adm-textarea" value={editForm.notes||''} onChange={e=>setEditForm(f=>({...f,notes:e.target.value}))} style={{marginBottom:'1rem',minHeight:80}} />
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button onClick={()=>setEditDay(null)} style={{ padding:'0.6rem 1.25rem', background:'var(--a-bg)', border:'1px solid var(--a-border)', borderRadius:'8px', cursor:'pointer', color:'var(--a-text)', fontWeight:600 }}>Cancel</button>
                  <button onClick={saveEdit} style={{ padding:'0.6rem 1.25rem', background:'linear-gradient(135deg,#10b981,#059669)', border:'none', borderRadius:'8px', cursor:'pointer', color:'white', fontWeight:700 }}>Save</button>
                  <button onClick={()=>{generateSingleBlog(editDay,editForm);setEditDay(null)}} style={{ padding:'0.6rem 1.25rem', background:'linear-gradient(135deg,#3b82f6,#2563eb)', border:'none', borderRadius:'8px', cursor:'pointer', color:'white', fontWeight:700 }}>Generate Blog</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

function ScoreRing({ score, max, label }) {
  const pct = Math.min((score||0) / max, 1), r = 28, circ = 2 * Math.PI * r, dash = pct * circ
  const color = pct >= 0.8 ? '#10b981' : pct >= 0.6 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
      <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--a-border)" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        <text x="36" y="36" textAnchor="middle" dominantBaseline="middle" style={{ fill: 'var(--a-text)', fontSize: '13px', fontWeight: 800, transform: 'rotate(90deg)', transformOrigin: '36px 36px' }}>{score}</text>
      </svg>
      <div style={{ fontSize: '0.65rem', color: 'var(--a-muted)', textAlign: 'center', fontWeight: 600 }}>{label}</div>
    </div>
  )
}

function ScoreBadge({ score, max }) {
  const pct = (score||0) / max, color = pct >= 0.85 ? '#10b981' : pct >= 0.7 ? '#f59e0b' : '#ef4444'
  return <div style={{ fontWeight: 900, fontSize: '1.8rem', color }}>{score}<span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--a-muted)' }}>/{max}</span></div>
}

function ImageGeneratingAnimation() {
  return (
    <div style={{ width: '100%', height: 260, background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes imgScan { 0%{top:-4px} 100%{top:100%} }
        @keyframes imgFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes imgBar { 0%,100%{opacity:0.3;transform:scaleY(0.6)} 50%{opacity:1;transform:scaleY(1)} }
      `}</style>
      <div style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #a78bfa, #818cf8, transparent)', animation: 'imgScan 2s linear infinite', boxShadow: '0 0 14px rgba(167,139,250,0.9)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', opacity: 0.12 }}>
        {Array(32).fill(null).map((_,i)=><div key={i} style={{ border: '1px solid #a78bfa' }}/>)}
      </div>
      <div style={{ animation: 'imgFloat 2.5s ease-in-out infinite', zIndex: 1 }}>
        <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      </div>
      <div style={{ zIndex: 1, textAlign: 'center' }}>
        <div style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.02em' }}>Rendering Cover Image</div>
        <div style={{ color: 'rgba(167,139,250,0.55)', fontSize: '0.78rem', marginTop: '0.25rem' }}>gpt-image-2 · generating pixels...</div>
      </div>
      <div style={{ display: 'flex', gap: '5px', zIndex: 1, alignItems: 'center' }}>
        {[0.1,0.3,0.5,0.7,0.9,0.7,0.5,0.3].map((d,i)=>(
          <div key={i} style={{ width: 4, height: 22, background: '#a78bfa', borderRadius: 3, animation: `imgBar 1.4s ease-in-out ${d}s infinite` }}/>
        ))}
      </div>
    </div>
  )
}

const STEP_LABELS = ['SERP Research', 'Outline', 'Section Drafting', 'Image Generation', 'SEO Audit']
const STEP_ICONS = ['🔍', '📐', '✍️', '🖼️', '📊']

export default function BlogGenerator() {
  const [config, setConfig] = useState({ includeImage: true })
  const [keyword, setKeyword] = useState('')
  const [selectedKeyword, setSelectedKeyword] = useState('')
  const [running, setRunning] = useState(false)
  
  // Custom image gen state
  const [generatingImage, setGeneratingImage] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageType, setImageType] = useState('cover') // 'cover' or 'inline'
  
  const [steps, setSteps] = useState(Array(5).fill({ status: 'idle' }))
  const [log, setLog] = useState([])
  const [sections, setSections] = useState([])
  const [coverImage, setCoverImage] = useState(null)
  const [outline, setOutline] = useState(null)
  const [seoScores, setSeoScores] = useState(null)
  const [usage, setUsage] = useState(null)
  const [serpData, setSerpData] = useState(null)
  const [activeTab, setActiveTab] = useState('scores')
  const [gscKeywords, setGscKeywords] = useState('')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const logRef = useRef(null)

  function addLog(msg, type = 'info') {
    setLog(l => [...l, { msg, type, ts: new Date().toLocaleTimeString() }])
    setTimeout(() => logRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }), 50)
  }

  function updateStep(i, status) {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status } : s))
  }

  async function launch(overrideKeyword) {
    setRunning(true); setSections([]); setCoverImage(null); setOutline(null); setSeoScores(null); setUsage(null); setSerpData(null); setLog([]); setSelectedKeyword('')
    setSteps(Array(5).fill({ status: 'idle' }))
    const kw = overrideKeyword || keyword || ''
    addLog(`🚀 Launching${kw ? ` for "${kw}"` : ' — AI selects keyword'}...`, 'start')
    try {
      const res = await fetch('/api/openai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'pipeline', primary_keyword: kw, lsi_keywords: '', instructions: '', includeImage: config.includeImage }) })
      if (!res.ok) throw new Error(await res.text())
      const reader = res.body.getReader(), decoder = new TextDecoder()
      let buf = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const parts = buf.split('\n\n'); buf = parts.pop()
        for (const part of parts) {
          const line = part.replace(/^data: /, '').trim()
          if (!line) continue
          try {
            const ev = JSON.parse(line)
            if (ev.type === 'keyword_selected') { setSelectedKeyword(ev.keyword); addLog(`🎯 Keyword: "${ev.keyword}" — ${ev.reason}`, 'start') }
            if (ev.type === 'progress') {
              const idx = ev.step - 1; updateStep(idx, ev.status)
              if (ev.status === 'running') addLog(`⚡ ${ev.message}`, 'running')
              if (ev.status === 'done') addLog(`✅ ${ev.message}`, 'done')
              if (ev.status === 'skipped') addLog(`⏭️ ${ev.message}`, 'muted')
              if (ev.data && ev.step === 1) setSerpData(ev.data)
            }
            if (ev.type === 'section') {
              setSections(prev => { const next=[...prev]; next[ev.index]={heading:ev.heading,level:ev.level,html:ev.content}; return next })
              addLog(`  📝 "${ev.heading}"`, 'section')
            }
            if (ev.type === 'image') { setCoverImage(ev); addLog('  🖼️ Cover image ready', 'image') }
            if (ev.type === 'complete') {
              setOutline(ev.outline); setSeoScores(ev.seoScores)
              setUsage({ tokens: ev.totalTokens, images: ev.imageTokenCost, cost: ev.estimatedCostUsd })
              addLog(`🏁 Done! ~${ev.totalTokens} tokens ($${ev.estimatedCostUsd})`, 'done')
              toast.success('Blog generated!'); setActiveTab('scores')
            }
            if (ev.type === 'error') { addLog(`❌ ${ev.message}`, 'error'); toast.error(ev.message) }
          } catch(e) {}
        }
      }
    } catch (err) { addLog(`❌ Fatal: ${err.message}`, 'error'); toast.error('Pipeline failed: ' + err.message) }
    finally { setRunning(false) }
  }

  async function generateCustomImage() {
    const prompt = imagePrompt || outline?.h1_title || selectedKeyword || keyword || 'professional pest control service in Bangalore India'
    setGeneratingImage(true); addLog(`🖼️ Generating ${imageType} image for: "${prompt.slice(0,40)}..."`, 'running')
    try {
      const res = await fetch('/api/openai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'image', prompt }) })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error?.message || 'Image failed')
      
      if (imageType === 'cover') {
        setCoverImage({ url: data.url, alt: prompt })
        addLog('✅ Cover image generated!', 'done'); toast.success('Cover image generated!')
      } else {
        setSections(prev => [...prev, {
          heading: '',
          level: 'h3',
          html: `<figure style="margin:2rem 0; text-align:center"><img src="${data.url}" alt="${prompt}" style="max-width:100%; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.12);" /><figcaption style="font-size:0.8rem; color:gray; margin-top:0.5rem; font-style:italic">Generated via gpt-image-2</figcaption></figure>`
        }])
        addLog('✅ Inline image added to blog!', 'done'); toast.success('Inline image added!')
      }
    } catch (err) { addLog(`❌ Image failed: ${err.message}`, 'error'); toast.error(err.message) }
    finally { setGeneratingImage(false) }
  }

  function saveToDrafts() {
    if (!sections.length) return
    const title = outline?.h1_title || 'AI Generated Blog'
    const fullHtml = sections.filter(Boolean).map(s => `<${s.level}>${s.heading}</${s.level}>\n${s.html}`).join('\n')
    saveBlog({ title, content: fullHtml, excerpt: outline?.bluf_answer||'', image: coverImage?.url||'', imageAlt: coverImage?.alt||'', metaDesc: outline?.meta_description||'', status: 'draft' })
    toast.success('Saved to drafts!'); setTimeout(() => { window.location.href = '/admin/blogs' }, 1500)
  }

  const hasContent = sections.filter(Boolean).length > 0 || !!coverImage

  useEffect(() => {
    hydrateCalendar().then(() => {
      const today = new Date().toISOString().split('T')[0], [y, m] = today.split('-')
      const plan = getMonthPlan(`${y}-${m}`)
      if (!plan?.autoPublish) return
      const todayEntry = plan?.days?.[today]
      if (todayEntry && !todayEntry.status) { toast(`🤖 Auto-publishing: "${todayEntry.keyword}"`, { duration: 4000 }); setTimeout(() => launch(todayEntry.keyword), 1500) }
    })
  }, [])

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .blog-log-line { font-family: 'JetBrains Mono','Courier New',monospace; font-size: 0.76rem; padding: 0.4rem 0; line-height: 1.4; border-bottom: 1px solid var(--a-border); opacity: 0; animation: fadeSlide 0.25s ease forwards; display: block; word-wrap: break-word; }
        .gen-tab { padding: 0.55rem 0.75rem; border: none; background: none; cursor: pointer; font-size: 0.78rem; font-weight: 700; color: var(--a-muted); border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap; }
        .gen-tab.active { color: #6366f1; border-bottom-color: #6366f1; }
        .score-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--a-border); }
        .gen-step { display: flex; align-items: center; gap: 0.65rem; padding: 0.55rem 0.7rem; border-radius: 8px; transition: all 0.2s; }
        .gen-step.idle { opacity: 0.4; }
        .gen-step.running { background: rgba(59,130,246,0.06); opacity: 1; }
        .gen-step.done { opacity: 1; }
        .blog-section-card { animation: fadeSlide 0.4s ease forwards; }
        .kw-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); outline: none; }
        .gen-step.running.img-step { background: rgba(167,139,250,0.07); }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 900, background: 'linear-gradient(135deg, #6366f1, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Blog Studio</h1>
          <p style={{ margin: '0.2rem 0 0', color: 'var(--a-muted)', fontSize: '0.84rem' }}>5-Stage AI pipeline · SERP grounded · gpt-image-2 visuals</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => setCalendarOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', background: 'rgba(139,92,246,0.08)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Calendar
          </button>
          {hasContent && (
            <button onClick={saveToDrafts} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
              Save Draft
            </button>
          )}
        </div>
      </div>

      {/* ── Pipeline Status Bar ── */}
      <div style={{ background: 'var(--a-card)', borderRadius: '12px', border: '1px solid var(--a-border)', padding: '1rem 1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center' }}>
        {STEP_LABELS.map((label, i) => {
          const st = steps[i]?.status || 'idle', isImg = i === 3
          const color = st==='done'?'#10b981':st==='running'?(isImg?'#a78bfa':'#3b82f6'):st==='error'?'#ef4444':'var(--a-border)'
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 4 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', minWidth: 55 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${color}`, background: st==='done'?`${color}15`:st==='running'?`${color}10`:'var(--a-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', transition: 'all 0.3s', position: 'relative' }}>
                  {st==='running'&&<div style={{ position:'absolute', inset:-4, borderRadius:'50%', border:`2px solid ${color}`, opacity:0.3, animation:'pulse 1.5s ease-in-out infinite' }}/>}
                  {st==='done'?'✓':STEP_ICONS[i]}
                </div>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: st==='idle'?'var(--a-muted)':color, textAlign: 'center', whiteSpace: 'nowrap' }}>{label}</div>
              </div>
              {i < 4 && <div style={{ flex: 1, height: 2, background: st==='done'?'#10b98150':'var(--a-border)', margin: '0 0.5rem 1.1rem', transition: 'background 0.4s' }}/>}
            </div>
          )
        })}
      </div>

      {/* ── 2-Column Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* LEFT PANEL: Controls, Log, Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Controls */}
          <div style={{ background: 'var(--a-card)', borderRadius: '16px', border: '1px solid var(--a-border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--a-border)', background: 'linear-gradient(135deg,rgba(99,102,241,0.07),rgba(167,139,250,0.04))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>✨</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--a-text)' }}>Auto Blog Studio</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--a-muted)' }}>AI selects keyword · Fully automated</div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '1.25rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--a-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '0.5rem' }}>Primary Keyword</label>
                <input className="kw-input" placeholder="Leave empty for AI auto-pick..." value={keyword} onChange={e=>setKeyword(e.target.value)}
                  style={{ width:'100%', padding:'0.7rem 0.9rem', background:'var(--a-bg)', border:'1px solid var(--a-border)', borderRadius:'8px', color:'var(--a-text)', fontSize:'0.88rem', boxSizing:'border-box', transition:'border-color 0.2s, box-shadow 0.2s' }} />
                {selectedKeyword && (
                  <div style={{ marginTop:'0.5rem', padding:'0.5rem 0.75rem', background:'rgba(99,102,241,0.06)', border:'1px dashed #6366f155', borderRadius:'6px', fontSize:'0.75rem', color:'#6366f1', fontWeight:600 }}>
                    🎯 AI picked: <strong>{selectedKeyword}</strong>
                  </div>
                )}
              </div>

              {/* Automatic Cover Toggle */}
              <div onClick={()=>setConfig(c=>({...c,includeImage:!c.includeImage}))} style={{ display:'flex', alignItems:'center', gap:'0.6rem', cursor:'pointer', userSelect:'none', marginBottom:'1.25rem', padding:'0.6rem', background:'var(--a-bg)', borderRadius:'8px', border:'1px solid var(--a-border)' }}>
                <div style={{ width:34, height:19, background:config.includeImage?'#6366f1':'#d1d5db', borderRadius:'100px', position:'relative', flexShrink:0, transition:'background 0.25s' }}>
                  <div style={{ position:'absolute', top:2, left:config.includeImage?17:2, width:15, height:15, background:'white', borderRadius:'50%', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                </div>
                <div>
                  <div style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--a-text)' }}>Auto-generate Cover Image</div>
                  <div style={{ fontSize:'0.66rem', color:'var(--a-muted)' }}>gpt-image-2 · +~15s</div>
                </div>
              </div>

              {/* Launch Full Pipeline */}
              <button onClick={()=>launch()} disabled={running}
                style={{ width:'100%', padding:'0.9rem', borderRadius:'10px', border:'none', background:running?'var(--a-border)':'linear-gradient(135deg,#6366f1,#8b5cf6)', color:running?'var(--a-muted)':'white', fontWeight:800, fontSize:'0.95rem', cursor:running?'not-allowed':'pointer', boxShadow:running?'none':'0 6px 20px rgba(99,102,241,0.33)', transition:'all 0.2s', display:'flex', justifyContent:'center', alignItems:'center', gap:'0.5rem', marginBottom:'1.5rem' }}>
                {running ? (<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Generating Blog...</>) : (<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Generate Blog Pipeline</>)}
              </button>

              <div style={{ height: '1px', background: 'var(--a-border)', margin: '0 -1.25rem 1.25rem' }} />

              {/* Custom Image Generator Box */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--a-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems:'center', gap:'0.4rem', marginBottom: '0.6rem' }}>
                  <span style={{ color:'#a78bfa' }}>🖼️</span> Generate Custom Image
                </label>
                
                <textarea className="kw-input" placeholder="Custom image prompt (optional)..." value={imagePrompt} onChange={e=>setImagePrompt(e.target.value)}
                  style={{ width:'100%', padding:'0.6rem 0.8rem', background:'var(--a-bg)', border:'1px solid var(--a-border)', borderRadius:'8px', color:'var(--a-text)', fontSize:'0.82rem', boxSizing:'border-box', transition:'border-color 0.2s', resize:'vertical', minHeight:60, marginBottom:'0.5rem' }} />
                
                <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.75rem' }}>
                  <button onClick={()=>setImageType('cover')} style={{ flex:1, padding:'0.4rem', fontSize:'0.75rem', fontWeight:600, background:imageType==='cover'?'rgba(99,102,241,0.1)':'var(--a-bg)', border:`1px solid ${imageType==='cover'?'#6366f1':'var(--a-border)'}`, color:imageType==='cover'?'#6366f1':'var(--a-text)', borderRadius:'6px', cursor:'pointer' }}>Cover Image</button>
                  <button onClick={()=>setImageType('inline')} style={{ flex:1, padding:'0.4rem', fontSize:'0.75rem', fontWeight:600, background:imageType==='inline'?'rgba(99,102,241,0.1)':'var(--a-bg)', border:`1px solid ${imageType==='inline'?'#6366f1':'var(--a-border)'}`, color:imageType==='inline'?'#6366f1':'var(--a-text)', borderRadius:'6px', cursor:'pointer' }}>Inline Image</button>
                </div>

                <button onClick={generateCustomImage} disabled={running||generatingImage}
                  style={{ width:'100%', padding:'0.6rem', borderRadius:'8px', border:'1px solid rgba(167,139,250,0.35)', background:generatingImage?'rgba(167,139,250,0.05)':'rgba(167,139,250,0.09)', color:(running||generatingImage)?'var(--a-muted)':'#a78bfa', fontWeight:700, fontSize:'0.8rem', cursor:(running||generatingImage)?'not-allowed':'pointer', display:'flex', justifyContent:'center', alignItems:'center', gap:'0.4rem', transition:'all 0.2s' }}>
                  {generatingImage ? (<><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Generating...</>) : (<><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> Generate Image</>)}
                </button>
              </div>
            </div>
          </div>

          {/* Live Log */}
          <div style={{ background: 'var(--a-card)', borderRadius: '16px', border: '1px solid var(--a-border)', overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1.15rem', borderBottom: '1px solid var(--a-border)', background: 'var(--a-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--a-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Live Log</div>
              {log.length>0&&<button onClick={()=>setLog([])} style={{ fontSize:'0.7rem', background:'none', border:'none', color:'var(--a-muted)', cursor:'pointer', fontWeight:600 }}>Clear</button>}
            </div>
            <div ref={logRef} style={{ height: 200, overflowY: 'auto', padding: '0.75rem 1rem' }}>
              {log.length===0&&<div style={{ color:'var(--a-muted)', fontSize:'0.78rem', fontFamily:'monospace', padding:'0.5rem 0' }}>Waiting for launch...</div>}
              {log.map((l,i)=>(
                <div key={i} className="blog-log-line" style={{ color: l.type==='error'?'#ef4444':l.type==='done'?'#10b981':l.type==='running'?'#60a5fa':l.type==='start'?'#a78bfa':l.type==='image'?'#f59e0b':'var(--a-text)' }}>
                  <span style={{ opacity:0.4, marginRight:'0.4rem' }}>{l.ts}</span>{l.msg}
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Tabs (Moved to Left Sidebar) */}
          <div style={{ background: 'var(--a-card)', borderRadius: '16px', border: '1px solid var(--a-border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--a-border)', background: 'var(--a-bg)' }}>
              {[['scores','📊 Scores'],['serp','🔍 SERP'],['refresh','🔄 Refresh']].map(([t,label])=>(
                <button key={t} className={`gen-tab ${activeTab===t?'active':''}`} onClick={()=>setActiveTab(t)} style={{ flex:1, fontSize:'0.75rem', padding:'0.7rem 0.5rem' }}>{label}</button>
              ))}
            </div>

            {activeTab === 'scores' && (
              <div style={{ padding: '1.25rem' }}>
                {usage && (
                  <div style={{ background:'var(--a-bg)',borderRadius:'10px',padding:'1rem',marginBottom:'1.25rem',border:'1px solid var(--a-border)' }}>
                    <div style={{ fontSize:'0.7rem',fontWeight:700,color:'var(--a-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.7rem' }}>API Usage</div>
                    <div className="score-row"><span style={{fontSize:'0.85rem',color:'var(--a-text)'}}>Text Tokens</span><span style={{fontWeight:700,color:'var(--a-text)',fontSize:'0.9rem'}}>{usage.tokens?.toLocaleString()}</span></div>
                    <div className="score-row" style={{borderBottom:'none'}}><span style={{fontSize:'0.85rem',color:'var(--a-text)'}}>Images</span><span style={{fontWeight:700,color:'var(--a-text)',fontSize:'0.9rem'}}>{usage.images}</span></div>
                  </div>
                )}
                {seoScores && <>
                  <div style={{ fontSize:'0.7rem',fontWeight:700,color:'var(--a-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.7rem' }}>SEO Quality</div>
                  <div style={{ background:`linear-gradient(135deg,${seoScores.seo_overall_score>=85?'#10b98108':'#f59e0b08'},transparent)`,border:`1px solid ${seoScores.seo_overall_score>=85?'#10b98133':'#f59e0b33'}`,borderRadius:'10px',padding:'1rem',marginBottom:'1.25rem',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    <div>
                      <div style={{fontWeight:800,color:'var(--a-text)',fontSize:'0.95rem'}}>Overall</div>
                      <div style={{fontSize:'0.75rem',color:'var(--a-muted)'}}>{seoScores.publishing_verdict?.replace(/_/g,' ')}</div>
                    </div>
                    <ScoreBadge score={seoScores.seo_overall_score||0} max={100}/>
                  </div>
                  {seoScores.category_scores && (
                    <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.8rem',marginBottom:'1.25rem' }}>
                      <ScoreRing score={seoScores.category_scores.keyword_optimization_score} max={30} label="Keyword"/>
                      <ScoreRing score={seoScores.category_scores.structure_and_media_score} max={25} label="Structure"/>
                      <ScoreRing score={seoScores.category_scores.intent_and_eeat_score} max={25} label="Intent"/>
                      <ScoreRing score={seoScores.category_scores.readability_score} max={20} label="Reading"/>
                    </div>
                  )}
                  {seoScores.calculated_metrics && (
                    <div style={{ background:'var(--a-bg)',borderRadius:'10px',padding:'1rem',border:'1px solid var(--a-border)',marginBottom:'1rem' }}>
                      <div style={{ fontSize:'0.7rem',fontWeight:700,color:'var(--a-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.6rem' }}>Metrics</div>
                      <div className="score-row"><span style={{fontSize:'0.82rem',color:'var(--a-text)'}}>Words</span><span style={{fontWeight:700,fontSize:'0.86rem',color:'var(--a-text)'}}>{seoScores.calculated_metrics.estimated_word_count?.toLocaleString()||'—'}</span></div>
                      <div className="score-row"><span style={{fontSize:'0.82rem',color:'var(--a-text)'}}>Keyword %</span><span style={{fontWeight:700,fontSize:'0.86rem',color:'var(--a-text)'}}>{seoScores.calculated_metrics.keyword_density_percent}%</span></div>
                      <div className="score-row" style={{borderBottom:'none'}}><span style={{fontSize:'0.82rem',color:'var(--a-text)'}}>Grade</span><span style={{fontWeight:700,fontSize:'0.86rem',color:'var(--a-text)'}}>{seoScores.calculated_metrics.reading_grade_level}</span></div>
                    </div>
                  )}
                  {seoScores.checklist_booleans && (
                    <div style={{ marginBottom:'1rem' }}>
                      <div style={{ fontSize:'0.7rem',fontWeight:700,color:'var(--a-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.6rem' }}>Audit Checklist</div>
                      <div style={{ display:'flex',flexDirection:'column',gap:'0.4rem' }}>
                        {Object.entries(seoScores.checklist_booleans).map(([key,val])=>(
                          <div key={key} style={{ display:'flex',alignItems:'center',gap:'0.4rem',fontSize:'0.75rem',color:val?'var(--a-text)':'var(--a-muted)' }}>
                            <span style={{color:val?'#10b981':'#ef444477',fontWeight:700,fontSize:'0.9rem'}}>{val?'✓':'✗'}</span>
                            {key.replace(/_/g,' ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {seoScores.critical_flaws?.length > 0 && (
                    <div style={{ background:'#ef444410',border:'1px solid #ef444428',borderRadius:'10px',padding:'1rem' }}>
                      <div style={{ fontSize:'0.7rem',fontWeight:700,color:'#ef4444',marginBottom:'0.5rem' }}>⚠️ Critical Flaws</div>
                      <ul style={{ margin:0,paddingLeft:'1.2rem',fontSize:'0.75rem',color:'#ef4444',lineHeight:1.6 }}>
                        {seoScores.critical_flaws.map((f,i)=><li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                </>}
                {!seoScores && !running && <div style={{ color:'var(--a-muted)',textAlign:'center',padding:'2rem 0',fontSize:'0.88rem' }}>Scores appear after generation.</div>}
                {running && <div style={{ textAlign:'center',padding:'2.5rem 0',display:'flex',flexDirection:'column',gap:'0.75rem',alignItems:'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  <span style={{fontSize:'0.85rem',color:'var(--a-muted)'}}>Calculating scores...</span>
                </div>}
              </div>
            )}

            {activeTab === 'serp' && (
              <div style={{ padding: '1.25rem' }}>
                {serpData ? <>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize:'0.7rem',fontWeight:700,color:'var(--a-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.5rem' }}>Search Intent</div>
                    <div style={{ display:'inline-block',padding:'0.35rem 0.85rem',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.25)',borderRadius:'100px',fontSize:'0.82rem',fontWeight:700,color:'#3b82f6',textTransform:'capitalize' }}>{serpData.search_intent}</div>
                  </div>
                  {serpData.paa_questions?.length > 0 && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize:'0.7rem',fontWeight:700,color:'var(--a-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.5rem' }}>People Also Ask</div>
                      {serpData.paa_questions.map((q,i)=>(
                        <div key={i} style={{ fontSize:'0.8rem',color:'var(--a-text)',padding:'0.5rem 0',borderBottom:i<serpData.paa_questions.length-1?'1px solid var(--a-border)':'none', lineHeight:1.4 }}>💬 {q}</div>
                      ))}
                    </div>
                  )}
                  {serpData.lsi_keywords?.length > 0 && (
                    <div>
                      <div style={{ fontSize:'0.7rem',fontWeight:700,color:'var(--a-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.5rem' }}>LSI Keywords</div>
                      <div style={{ display:'flex',flexWrap:'wrap',gap:'0.4rem' }}>
                        {serpData.lsi_keywords.map((k,i)=>(
                          <span key={i} style={{ fontSize:'0.75rem',padding:'0.25rem 0.6rem',borderRadius:'100px',background:'var(--a-bg)',border:'1px solid var(--a-border)',color:'var(--a-muted)' }}>{k}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </> : <div style={{ color:'var(--a-muted)',textAlign:'center',padding:'2.5rem 0',fontSize:'0.88rem' }}>SERP data appears after Step 1.</div>}
              </div>
            )}

            {activeTab === 'refresh' && (
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize:'0.7rem',fontWeight:700,color:'var(--a-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.5rem' }}>GSC Content Refresh</div>
                <p style={{ fontSize:'0.82rem',color:'var(--a-muted)',lineHeight:1.55,marginBottom:'1rem' }}>Paste search queries from Google Search Console to generate an optimized H2 section.</p>
                <textarea className="adm-textarea" value={gscKeywords} onChange={e=>setGscKeywords(e.target.value)} placeholder="e.g. how long does termite treatment last, termite damage repair cost..." style={{ minHeight:100,resize:'vertical',fontSize:'0.85rem',marginBottom:'1rem' }}/>
                <button onClick={()=>toast.info('Run the full pipeline with your GSC keyword to refresh!')} style={{ width:'100%',padding:'0.8rem',background:'linear-gradient(135deg,#8b5cf6,#7c3aed)',color:'white',border:'none',borderRadius:'10px',fontWeight:700,cursor:'pointer',display:'flex',justifyContent:'center',gap:'0.5rem',alignItems:'center',fontSize:'0.88rem', boxShadow:'0 4px 12px rgba(139,92,246,0.3)' }}>
                  🔄 Generate H2 Refresh
                </button>
              </div>
            )}
          </div>
          
          {/* Keyword coverage */}
          {seoScores?.calculated_metrics?.lsi_keywords_found?.length > 0 && (
            <div style={{ background:'var(--a-card)',borderRadius:'16px',border:'1px solid var(--a-border)',padding:'1.25rem' }}>
              <div style={{ fontSize:'0.7rem',fontWeight:700,color:'var(--a-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.6rem' }}>Keywords Found ✓</div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:'0.4rem',marginBottom:seoScores.calculated_metrics.lsi_keywords_missing?.length>0?'1rem':0 }}>
                {seoScores.calculated_metrics.lsi_keywords_found.map((kw,i)=>(
                  <span key={i} style={{ background:'#10b98114',color:'#059669',fontSize:'0.75rem',padding:'0.2rem 0.6rem',borderRadius:'100px',border:'1px solid #10b98128' }}>{kw}</span>
                ))}
              </div>
              {seoScores.calculated_metrics.lsi_keywords_missing?.length > 0 && <>
                <div style={{ fontSize:'0.7rem',fontWeight:700,color:'var(--a-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.6rem' }}>Missing ✗</div>
                <div style={{ display:'flex',flexWrap:'wrap',gap:'0.4rem' }}>
                  {seoScores.calculated_metrics.lsi_keywords_missing.map((kw,i)=>(
                    <span key={i} style={{ background:'#ef444413',color:'#ef4444',fontSize:'0.75rem',padding:'0.2rem 0.6rem',borderRadius:'100px',border:'1px solid #ef444428' }}>{kw}</span>
                  ))}
                </div>
              </>}
            </div>
          )}

        </div>

        {/* RIGHT PANEL: Blog Preview */}
        <div style={{ background: 'var(--a-card)', borderRadius: '16px', border: '1px solid var(--a-border)', overflow: 'hidden', minHeight: 800, display:'flex', flexDirection:'column', boxShadow:'0 8px 30px rgba(0,0,0,0.04)' }}>
          {/* Browser chrome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.25rem', borderBottom: '1px solid var(--a-border)', background: 'var(--a-bg)' }}>
            <span style={{ width:12,height:12,borderRadius:'50%',background:'#ef4444',display:'inline-block' }}/>
            <span style={{ width:12,height:12,borderRadius:'50%',background:'#f59e0b',display:'inline-block' }}/>
            <span style={{ width:12,height:12,borderRadius:'50%',background:'#10b981',display:'inline-block' }}/>
            <div style={{ flex:1, background:'var(--a-bg)', border:'1px solid var(--a-border)', borderRadius:'6px', padding:'0.3rem 0.8rem', fontSize:'0.78rem', color:'var(--a-muted)', fontFamily:'monospace', marginLeft:'0.75rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', boxShadow:'inset 0 1px 3px rgba(0,0,0,0.02)' }}>
              {outline?.h1_title ? `pestcontrolbangaluru.in/blog/${outline.h1_title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}` : 'pestcontrolbangaluru.in/blog/preview'}
            </div>
          </div>

          {/* Empty state */}
          {!hasContent && !running && !generatingImage && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.5rem', padding:'2rem' }}>
              <div style={{ width:88,height:88,borderRadius:'22px',background:'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(167,139,250,0.06))',border:'1px solid rgba(99,102,241,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem', boxShadow:'0 8px 24px rgba(99,102,241,0.1)' }}>✍️</div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontWeight:800,fontSize:'1.3rem',color:'var(--a-text)',marginBottom:'0.5rem' }}>Canvas is empty</div>
                <div style={{ color:'var(--a-muted)',fontSize:'0.95rem' }}>Configure a keyword and click Generate Blog</div>
              </div>
              <div style={{ display:'flex',gap:'0.6rem',flexWrap:'wrap',justifyContent:'center',maxWidth:420, marginTop:'0.5rem' }}>
                {['🔍 SERP Research','📐 Smart Outline','✍️ Section Drafting','🖼️ AI Image','📊 SEO Audit'].map((s,i)=>(
                  <span key={i} style={{ fontSize:'0.78rem',padding:'0.3rem 0.8rem',borderRadius:'100px',background:'var(--a-bg)',border:'1px solid var(--a-border)',color:'var(--a-muted)',fontWeight:600 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Running placeholder (Only if not image gen step) */}
          {running && !hasContent && !(steps[3]?.status === 'running') && (
            <div style={{ flex:1, display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1.25rem' }}>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              <div style={{ textAlign:'center' }}>
                <div style={{ color:'#6366f1',fontWeight:800,fontSize:'1.1rem', marginBottom:'0.3rem' }}>Pipeline running...</div>
                <div style={{ color:'var(--a-muted)',fontSize:'0.9rem' }}>Sections appear as they're written</div>
              </div>
            </div>
          )}

          {/* Article content */}
          {(hasContent || generatingImage || (running && steps[3]?.status === 'running')) && (
            <div style={{ flex:1, overflowY: 'auto', paddingBottom:'3rem' }}>
              {/* Cover Image */}
              {coverImage?.url && (
                <div style={{ width:'100%',height:320,backgroundImage:`url(${coverImage.url})`,backgroundSize:'cover',backgroundPosition:'center',position:'relative' }}>
                </div>
              )}

              {/* Image generation animation — ONLY during image step */}
              {(generatingImage || (running && steps[3]?.status === 'running' && !coverImage?.url)) && !coverImage?.url && (
                <ImageGeneratingAnimation />
              )}

              {/* BLUF */}
              {outline?.bluf_answer && (
                <div style={{ margin:'2rem 3rem 0',padding:'1.1rem 1.4rem',background:'rgba(99,102,241,0.04)',border:'1px solid rgba(99,102,241,0.15)',borderLeft:'5px solid #6366f1',borderRadius:'0 10px 10px 0' }}>
                  <div style={{ fontSize:'0.75rem',fontWeight:800,color:'#6366f1',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.5rem' }}>Quick Answer</div>
                  <p style={{ color:'var(--a-text)',fontSize:'1.05rem',lineHeight:1.65,margin:0 }}>{outline.bluf_answer}</p>
                </div>
              )}

              {/* Sections */}
              <div className="blog-post-page" style={{ padding: '2rem 3rem' }}>
                {outline?.h1_title && <h1 className="blog-post-page__title" style={{ marginTop: '0', fontSize:'2.2rem' }}>{outline.h1_title}</h1>}
                <div className="blog-markdown-content" style={{ fontSize:'1.05rem', lineHeight:1.75 }}>
                  {sections.filter(Boolean).map((s,i)=>(
                    <div key={i} className="blog-section-card" style={{ marginBottom:'2rem' }}>
                      <div dangerouslySetInnerHTML={{ __html: (s.level === 'h2' || s.level === 'h3' ? `<${s.level} style="margin-top:2.5rem; margin-bottom:1rem; font-size:${s.level==='h2'?'1.6rem':'1.3rem'}">${s.heading}</${s.level}>` : '') + s.html }}/>
                    </div>
                  ))}
                  {running && sections.filter(Boolean).length > 0 && steps[2]?.status === 'running' && (
                    <div style={{ display:'flex',alignItems:'center',gap:'0.6rem',color:'var(--a-muted)',margin:'2.5rem 0',fontSize:'0.95rem', background:'var(--a-bg)', padding:'1rem', borderRadius:'8px', border:'1px dashed var(--a-border)' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      <em>AI is writing the next section...</em>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      <CalendarModal open={calendarOpen} onClose={()=>setCalendarOpen(false)} onGenerateBlog={async(kw)=>{setCalendarOpen(false);await new Promise(r=>setTimeout(r,200));await launch(kw)}}/>
    </div>
  )
}
