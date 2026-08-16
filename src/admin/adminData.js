import initialBlogs from './blogsData.json'
import { SERVICES_DATA } from '../data/servicesData'

// ── Admin Data Layer — localStorage persistence + seed (Server-Safe for Next.js) ──

const KEYS = { orders:'azt_orders', payments:'azt_payments', services:'azt_services', visitors:'azt_visitors', blogs:'azt_blogs', settings:'azt_settings', reviews:'azt_reviews' }
const read  = k => { 
  if (typeof window === 'undefined') {
    if (k === KEYS.blogs) return initialBlogs || []
    if (k === KEYS.services) return SERVICES_DATA || []
    return []
  }
  try { return JSON.parse(localStorage.getItem(k)) || [] } catch { return [] } 
}
const readObj = k => { 
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(k)) || {} } catch { return {} } 
}
const write = (k,v) => {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(k, JSON.stringify(v)) } catch {}
}
const uid   = () => Math.random().toString(36).slice(2,9).toUpperCase()
const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

export function seedIfEmpty() {
  if (typeof window === 'undefined') return

  const currentBlogs = read(KEYS.blogs);
  const hasEmptyContent = currentBlogs.length > 0 && currentBlogs.some(b => !b.content || b.content.trim() === '');
  const hasPlaceholderImages = currentBlogs.length > 0 && currentBlogs.some(b => b.image && b.image.includes('/images/pests/'));
  const needsYoutubeRefresh = currentBlogs.length > 0 && !JSON.stringify(currentBlogs).includes('youtube.com/embed');
  
  if ((currentBlogs.length < 50 || hasEmptyContent || hasPlaceholderImages || needsYoutubeRefresh) && initialBlogs && initialBlogs.length > 0) {
    write(KEYS.blogs, initialBlogs);
  }

  // Seed services from master servicesData
  const currentServices = read(KEYS.services);
  if (!currentServices || currentServices.length < 15) {
    const formattedServices = SERVICES_DATA.map((s, i) => ({
      id: s.id || `SVC-00${i + 1}`,
      name: s.hero?.title || s.id,
      category: s.category || 'General',
      startingPrice: s.specs?.startingPrice || 1500,
      duration: s.specs?.duration || '2-3 hrs',
      warranty: s.specs?.warranty || '60 Days',
      isActive: true,
      emoji: s.emoji || '🐛',
      path: s.path || `/${s.slug}`,
      description: s.hero?.tagline || '',
      intro: s.hero?.intro || '',
      metaTitle: s.meta?.title || '',
      metaDesc: s.meta?.desc || '',
      image: s.hero?.image || '',
      imageAlt: s.hero?.imageAlt || '',
      bgImage: s.hero?.bgImage || '',
      bgImageAlt: s.hero?.bgImageAlt || '',
    }))
    write(KEYS.services, formattedServices);
  }

  if (read(KEYS.orders).length > 0) return
  const orders = [
    { id:'AZ-001', customer:'Rajesh Kumar',   phone:'9876543210', service:'Termite Treatment',   area:'Koramangala',  date:'2026-08-08', time:'10:00 AM', status:'completed',   amount:3500, notes:'',               createdAt:'2026-08-08T05:00:00Z' },
    { id:'AZ-002', customer:'Priya Sharma',   phone:'8765432109', service:'Bed Bug Treatment',   area:'Indiranagar',  date:'2026-08-09', time:'02:00 PM', status:'confirmed',   amount:2800, notes:'2BHK apartment',  createdAt:'2026-08-09T09:00:00Z' },
    { id:'AZ-003', customer:'Amit Patel',     phone:'7654321098', service:'Cockroach Treatment', area:'Whitefield',   date:'2026-08-10', time:'11:00 AM', status:'in-progress', amount:1800, notes:'Kitchen focus',   createdAt:'2026-08-10T06:00:00Z' },
    { id:'AZ-004', customer:'Sunita Reddy',   phone:'6543210987', service:'Rodent Treatment',    area:'JP Nagar',     date:'2026-08-11', time:'09:00 AM', status:'pending',     amount:2200, notes:'',               createdAt:'2026-08-11T04:00:00Z' },
    { id:'AZ-005', customer:'Vijay Menon',    phone:'9988776655', service:'Mosquito Treatment',  area:'HSR Layout',   date:'2026-08-11', time:'04:00 PM', status:'pending',     amount:1500, notes:'Garden area',     createdAt:'2026-08-11T07:00:00Z' },
    { id:'AZ-006', customer:'Kavitha Nair',   phone:'8877665544', service:'General Pest Control',area:'Marathahalli', date:'2026-08-07', time:'01:00 PM', status:'completed',   amount:2000, notes:'',               createdAt:'2026-08-07T08:00:00Z' },
    { id:'AZ-007', customer:'Suresh Babu',    phone:'7766554433', service:'Wood Borer Treatment',area:'Malleshwaram', date:'2026-08-06', time:'10:00 AM', status:'cancelled',   amount:3200, notes:'Rescheduled',     createdAt:'2026-08-06T05:00:00Z' },
    { id:'AZ-008', customer:'Deepa Krishnan', phone:'9911223344', service:'Termite Treatment',   area:'BTM Layout',   date:'2026-08-05', time:'03:00 PM', status:'completed',   amount:4000, notes:'Large house',     createdAt:'2026-08-05T10:00:00Z' },
  ]
  write(KEYS.orders, orders)
  const payments = orders.map((o,i) => ({
    id:'PAY-00'+(i+1), orderId:o.id, customer:o.customer, amount:o.amount,
    method:['cash','upi','card','online'][i%4],
    status: o.status==='completed'?'paid':o.status==='cancelled'?'refunded':'pending',
    reference:'TXN'+Math.floor(Math.random()*9000000+1000000),
    date:o.createdAt, notes:''
  }))
  write(KEYS.payments, payments)
  write(KEYS.reviews, [
    { id:'REV-001', service:'Termite Treatment', name:'Rajesh Kumar', rating:5, text:'Excellent termite treatment. Highly recommend!', status:'approved', date:'2026-08-01T10:00:00Z' },
    { id:'REV-002', service:'Bed Bugs Treatment', name:'Priya Sharma', rating:4, text:'Very effective bed bug removal. Team was professional.', status:'approved', date:'2026-08-02T10:00:00Z' },
    { id:'REV-003', service:'Cockroach Treatment', name:'Amit Patel', rating:5, text:'Professional and clean service.', status:'pending', date:'2026-08-03T10:00:00Z' },
  ])
}

// CRUD
export const getOrders   = ()  => read(KEYS.orders)
export const saveOrder   = o   => { const all=read(KEYS.orders); const i=all.findIndex(x=>x.id===o.id); if(i>-1)all[i]=o; else all.unshift({...o,id:'AZ-'+uid(),createdAt:new Date().toISOString()}); write(KEYS.orders,all); return all }
export const deleteOrder = id  => { const all=read(KEYS.orders).filter(o=>o.id!==id); write(KEYS.orders,all); return all }

export const getPayments   = ()  => read(KEYS.payments)
export const savePayment   = p   => { const all=read(KEYS.payments); const i=all.findIndex(x=>x.id===p.id); if(i>-1)all[i]=p; else all.unshift({...p,id:'PAY-'+uid(),date:new Date().toISOString()}); write(KEYS.payments,all); return all }
export const deletePayment = id  => { const all=read(KEYS.payments).filter(p=>p.id!==id); write(KEYS.payments,all); return all }

export const getServices = async () => {
  if (typeof window === 'undefined') return read(KEYS.services)
  try {
    const res = await fetch('/api/services')
    if (res.ok) {
      const data = await res.json()
      write(KEYS.services, data)
      return data
    }
  } catch (e) {
    console.warn('Backend API unreachable, falling back to localStorage', e)
  }
  const svcs = read(KEYS.services)
  return (svcs && svcs.length > 0) ? svcs : SERVICES_DATA
}
export const saveService = async (s) => { 
  const all = read(KEYS.services) || []
  const i = all.findIndex(x => x.id === s.id || (s.slug && (x.slug === s.slug || x.path === s.path)))
  let serviceToSave = s;
  if (i > -1) {
    serviceToSave = { ...all[i], ...s }
    all[i] = serviceToSave
  } else {
    serviceToSave = { ...s, id: s.id || 'SVC-' + uid(), createdAt: new Date().toISOString() }
    all.unshift(serviceToSave)
  }
  write(KEYS.services, all)
  
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('azt_service_updated', { detail: serviceToSave }))
      
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', service: serviceToSave })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.services) {
          write(KEYS.services, data.services)
          return data.services
        }
      }
    } catch (e) {
      console.warn('Backend API unreachable', e)
    }
  }
  return all 
}
export const deleteService = async (id) => { 
  const all = read(KEYS.services).filter(s => s.id !== id && s.slug !== id)
  write(KEYS.services, all)
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('azt_service_updated', { detail: { id, deleted: true } }))
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.services) {
          write(KEYS.services, data.services)
          return data.services
        }
      }
    } catch (e) {
      console.warn('Backend API unreachable', e)
    }
  }
  return all 
}

export const getBlogs      = ()  => {
  const blogs = read(KEYS.blogs)
  return (blogs && blogs.length > 0) ? blogs : (initialBlogs || [])
}

export const getBlogBySlug = slug => {
  const all = getBlogs()
  return all.find(b => b.slug === slug)
}

export const saveBlog      = b   => { 
  const all=read(KEYS.blogs); 
  const i=all.findIndex(x=>x.id===b.id); 
  const slug = b.slug || generateSlug(b.title)
  if(i>-1) { all[i]={...all[i], ...b, slug}; } 
  else { all.unshift({...b, id:'BLG-'+uid(), slug, date:new Date().toISOString()}); } 
  write(KEYS.blogs,all); return all 
}
export const deleteBlog    = id  => { const all=read(KEYS.blogs).filter(b=>b.id!==id); write(KEYS.blogs,all); return all }

export const getReviews = async () => {
  if (typeof window === 'undefined') return read(KEYS.reviews)
  try {
    const res = await fetch('/api/reviews')
    if (res.ok) {
      const data = await res.json()
      write(KEYS.reviews, data)
      return data
    }
  } catch (e) {
    console.warn('Backend API unreachable, falling back to localStorage', e)
  }
  return read(KEYS.reviews)
}

export const saveReview = async (r) => {
  if (typeof window === 'undefined') return read(KEYS.reviews)
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r)
    })
    if (res.ok) {
      const data = await res.json()
      if (data.reviews) {
        write(KEYS.reviews, data.reviews)
        return data.reviews
      }
    }
  } catch (e) {
    console.warn('Backend API unreachable, falling back to localStorage', e)
  }
  const all = read(KEYS.reviews)
  const i = all.findIndex(x=>x.id===r.id)
  if(i>-1) { all[i] = {...all[i], ...r} }
  else { all.unshift({...r, id:'REV-'+uid(), date:new Date().toISOString()}) }
  write(KEYS.reviews, all)
  return all
}

export const deleteReview = async (id) => {
  if (typeof window === 'undefined') return read(KEYS.reviews)
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    })
    if (res.ok) {
      const data = await res.json()
      if (data.reviews) {
        write(KEYS.reviews, data.reviews)
        return data.reviews
      }
    }
  } catch (e) {
    console.warn('Backend API unreachable, falling back to localStorage', e)
  }
  const all = read(KEYS.reviews).filter(r=>r.id!==id)
  write(KEYS.reviews, all)
  return all
}

export const getSettings   = ()  => readObj(KEYS.settings)
export const saveSettings  = s   => { const all = getSettings(); const updated = {...all, ...s}; write(KEYS.settings, updated); return updated }

export const getVisitors = () => read(KEYS.visitors)

export function parseUA(ua) {
  if (typeof window === 'undefined' && !ua) return { type: 'Desktop', browser: 'Server', os: 'Linux' }
  const userAgent = ua || (typeof navigator !== 'undefined' ? navigator.userAgent : '')
  const mobile=(/Mobi|Android|iPhone|iPod/i.test(userAgent))&&!(/iPad/i.test(userAgent))
  const tablet=/iPad|Tablet/i.test(userAgent)
  const type=tablet?'Tablet':mobile?'Mobile':'Desktop'
  let browser='Unknown'
  if(/Edg/i.test(userAgent))browser='Edge'
  else if(/Chrome/i.test(userAgent))browser='Chrome'
  else if(/Firefox/i.test(userAgent))browser='Firefox'
  else if(/Safari/i.test(userAgent))browser='Safari'
  let os='Unknown'
  if(/Windows/i.test(userAgent))os='Windows'
  else if(/Android/i.test(userAgent))os='Android'
  else if(/iPhone|iPad/i.test(userAgent))os='iOS'
  else if(/Mac/i.test(userAgent))os='macOS'
  else if(/Linux/i.test(userAgent))os='Linux'
  return {type,browser,os}
}

export function logVisit(page) {
  if (typeof window === 'undefined') return
  const all=read(KEYS.visitors)
  const {type,browser,os}=parseUA()
  all.unshift({id:Date.now(),page,timestamp:new Date().toISOString(),type,browser,os,ip:sessionStorage.getItem('azt_ip')||'…'})
  write(KEYS.visitors,all.slice(0,1000))
}

export async function fetchAndCacheIP() {
  if (typeof window === 'undefined') return
  if(sessionStorage.getItem('azt_ip'))return
  try{const r=await fetch('https://api.ipify.org?format=json');const d=await r.json();sessionStorage.setItem('azt_ip',d.ip)}
  catch{sessionStorage.setItem('azt_ip','Private')}
}

export function getStats() {
  const orders=getOrders(),payments=getPayments(),visitors=getVisitors()
  const today=new Date().toDateString()
  const thisMonth=new Date().toISOString().slice(0,7)
  const revenue=payments.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0)
  return {
    totalOrders:orders.length,
    revenue,
    monthOrders:orders.filter(o=>o.createdAt?.startsWith(thisMonth)).length,
    todayVisits:visitors.filter(v=>new Date(v.timestamp).toDateString()===today).length,
    pending:orders.filter(o=>o.status==='pending').length,
    totalVisitors:visitors.length,
    activeServices:getServices().filter(s=>s.isActive).length,
    recentOrders:orders.slice(0,5)
  }
}

// Auto-seed on load in browser
if (typeof window !== 'undefined') {
  seedIfEmpty();
}
