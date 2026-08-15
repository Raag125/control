import { useState, useMemo } from 'react'
import { getVisitors } from '../adminData'

const TYPE_ICON = { Mobile:'📱', Desktop:'💻', Tablet:'📟' }
const TYPE_COLOR = { Mobile:'blue', Desktop:'green', Tablet:'warn' }

export default function Visitors() {
  const [search, setSearch]   = useState('')
  const [typeFilter, setType] = useState('all')
  const [page, setPage]       = useState(1)
  const PER_PAGE = 30

  const all = useMemo(() => getVisitors(), [])

  const filtered = all.filter(v => {
    const q = search.toLowerCase()
    const matchQ = !q || v.page?.includes(q) || v.ip?.includes(q) || v.browser?.toLowerCase().includes(q) || v.os?.toLowerCase().includes(q)
    return matchQ && (typeFilter === 'all' || v.type === typeFilter)
  })

  const pages   = Math.ceil(filtered.length / PER_PAGE)
  const visible = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)

  // Aggregations
  const today     = new Date().toDateString()
  const todayCount= all.filter(v=>new Date(v.timestamp).toDateString()===today).length
  const byType    = { Mobile: all.filter(v=>v.type==='Mobile').length, Desktop: all.filter(v=>v.type==='Desktop').length, Tablet: all.filter(v=>v.type==='Tablet').length }
  const topPages  = Object.entries(all.reduce((acc,v)=>{ acc[v.page]=(acc[v.page]||0)+1; return acc },{})).sort((a,b)=>b[1]-a[1]).slice(0,5)
  const topBrowsers = Object.entries(all.reduce((acc,v)=>{ acc[v.browser]=(acc[v.browser]||0)+1; return acc },{})).sort((a,b)=>b[1]-a[1]).slice(0,4)

  return (
    <div>
      {/* Stats */}
      <div className="adm-stats-grid" style={{ marginBottom:'1.25rem' }}>
        <div className="adm-stat"><div className="adm-stat__icon adm-stat__icon--green">👁️</div><div className="adm-stat__val">{all.length}</div><div className="adm-stat__label">Total Visits</div></div>
        <div className="adm-stat"><div className="adm-stat__icon adm-stat__icon--blue">📅</div><div className="adm-stat__val">{todayCount}</div><div className="adm-stat__label">Today's Visits</div></div>
        <div className="adm-stat"><div className="adm-stat__icon adm-stat__icon--warn">📱</div><div className="adm-stat__val">{byType.Mobile}</div><div className="adm-stat__label">Mobile Visits</div></div>
        <div className="adm-stat"><div className="adm-stat__icon adm-stat__icon--green">💻</div><div className="adm-stat__val">{byType.Desktop}</div><div className="adm-stat__label">Desktop Visits</div></div>
      </div>

      {/* Top pages + browsers */}
      <div className="adm-grid-2col" style={{ marginBottom:'1.25rem' }}>
        <div className="adm-card">
          <div className="adm-section-title" style={{ marginBottom:'.85rem' }}>Top Pages</div>
          {topPages.length === 0
            ? <div className="adm-empty" style={{ padding:'1rem' }}><div className="adm-empty__icon">📄</div><div className="adm-empty__text">No page data yet</div></div>
            : topPages.map(([page, count]) => (
              <div key={page} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.4rem 0', borderBottom:'1px solid var(--a-border)', fontSize:'.78rem' }}>
                <span style={{ color:'var(--a-text)', fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'70%' }}>{page}</span>
                <span style={{ color:'var(--a-green2)', fontWeight:700 }}>{count}</span>
              </div>
            ))
          }
        </div>
        <div className="adm-card">
          <div className="adm-section-title" style={{ marginBottom:'.85rem' }}>Browsers</div>
          {topBrowsers.map(([br, count]) => {
            const pct = all.length ? Math.round((count/all.length)*100) : 0
            return (
              <div key={br} style={{ marginBottom:'.75rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.78rem', marginBottom:'.25rem' }}>
                  <span style={{ color:'var(--a-text)' }}>{br}</span>
                  <span style={{ color:'var(--a-muted)' }}>{pct}%</span>
                </div>
                <div style={{ height:'4px', background:'var(--a-card2)', borderRadius:'2px' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,var(--a-green),var(--a-green2))', borderRadius:'2px' }} />
                </div>
              </div>
            )
          })}
          {topBrowsers.length === 0 && <div className="adm-empty" style={{ padding:'1rem' }}><div className="adm-empty__icon">🌐</div><div className="adm-empty__text">No data yet</div></div>}
        </div>
      </div>

      {/* Filter */}
      <div className="adm-filter-bar">
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--a-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search by page, IP, browser, OS…" value={search} onChange={e=>{ setSearch(e.target.value); setPage(1) }} />
        </div>
        <select className="adm-select" value={typeFilter} onChange={e=>{ setType(e.target.value); setPage(1) }}>
          <option value="all">All Devices</option>
          <option value="Mobile">Mobile</option>
          <option value="Desktop">Desktop</option>
          <option value="Tablet">Tablet</option>
        </select>
        <span style={{ fontSize:'.75rem', color:'var(--a-muted)' }}>{filtered.length} records</span>
      </div>

      {/* Table */}
      <div className="adm-card" style={{ padding:0, overflow:'hidden' }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>#</th><th>Timestamp</th><th>Page</th><th>IP Address</th><th>Device</th><th>Browser</th><th>OS</th></tr>
            </thead>
            <tbody>
              {visible.length === 0
                ? <tr><td colSpan={7}><div className="adm-empty"><div className="adm-empty__icon">👁️</div><div className="adm-empty__text">No visitor data yet. Visitors will appear as people browse the site.</div></div></td></tr>
                : visible.map((v,i) => (
                  <tr key={v.id}>
                    <td style={{ color:'var(--a-dim)', fontSize:'.7rem' }}>{(page-1)*PER_PAGE+i+1}</td>
                    <td style={{ fontSize:'.7rem', color:'var(--a-muted)', whiteSpace:'nowrap' }}>
                      {new Date(v.timestamp).toLocaleDateString('en-IN')}<br/>
                      <span style={{ color:'var(--a-dim)' }}>{new Date(v.timestamp).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
                    </td>
                    <td style={{ fontFamily:'monospace', fontSize:'.72rem', color:'var(--a-green2)', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.page}</td>
                    <td style={{ fontFamily:'monospace', fontSize:'.72rem' }}>{v.ip}</td>
                    <td><span className={`adm-badge adm-badge--${TYPE_COLOR[v.type]||'gray'}`}>{TYPE_ICON[v.type]} {v.type}</span></td>
                    <td style={{ fontSize:'.78rem' }}>{v.browser}</td>
                    <td style={{ fontSize:'.78rem', color:'var(--a-muted)' }}>{v.os}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:'.5rem', marginTop:'1rem' }}>
          <button className="adm-btn adm-btn--ghost adm-btn--sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
          <span style={{ padding:'.35rem .75rem', fontSize:'.78rem', color:'var(--a-muted)' }}>Page {page} / {pages}</span>
          <button className="adm-btn adm-btn--ghost adm-btn--sm" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>Next →</button>
        </div>
      )}
    </div>
  )
}
