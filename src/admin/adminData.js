import initialBlogs from './blogsData.json'

// ── Admin Data Layer — localStorage persistence + seed ──

const KEYS = { orders:'azt_orders', payments:'azt_payments', services:'azt_services', visitors:'azt_visitors', blogs:'azt_blogs', settings:'azt_settings', reviews:'azt_reviews' }
const read  = k => { try { return JSON.parse(localStorage.getItem(k)) || [] } catch { return [] } }
const readObj = k => { try { return JSON.parse(localStorage.getItem(k)) || {} } catch { return {} } }
const write = (k,v) => localStorage.setItem(k, JSON.stringify(v))
const uid   = () => Math.random().toString(36).slice(2,9).toUpperCase()
const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

export function seedIfEmpty() {
  const currentBlogs = read(KEYS.blogs);
  if (currentBlogs.length < 50 && initialBlogs && initialBlogs.length > 0) {
    write(KEYS.blogs, initialBlogs)
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
  write(KEYS.services, [
    { id:'SVC-001', name:'Termite Treatment',         category:'Termite',  startingPrice:2500, duration:'3-4 hrs', warranty:'5 Years',  isActive:true, emoji:'🪵', path:'/termite-treatment',            description:'Drill-fill-seal barrier with WHO-approved chemicals.' },
    { id:'SVC-002', name:'Bed Bug Treatment',         category:'Bugs',     startingPrice:2000, duration:'2-3 hrs', warranty:'90 Days',  isActive:true, emoji:'🛏️', path:'/bed-bugs-treatment',           description:'Thermal steam and dual odorless mist for full eradication.' },
    { id:'SVC-003', name:'Cockroach Treatment',       category:'Insects',  startingPrice:1200, duration:'1-2 hrs', warranty:'60 Days',  isActive:true, emoji:'🪳', path:'/cockroach-treatment',          description:'Advanced gel baiting with 100% eradication guarantee.' },
    { id:'SVC-004', name:'Rodent Treatment',          category:'Rodents',  startingPrice:1800, duration:'2-3 hrs', warranty:'Complete', isActive:true, emoji:'🐀', path:'/rodent-treatment',             description:'Multi-catch trapping and bait stations for rats and mice.' },
    { id:'SVC-005', name:'Mosquito Treatment',        category:'Insects',  startingPrice:1500, duration:'1-2 hrs', warranty:'30 Days',  isActive:true, emoji:'🦟', path:'/mosquito-treatment',           description:'Thermal fogging and larvicidal surface mist.' },
    { id:'SVC-006', name:'General Pest Control',      category:'General',  startingPrice:1000, duration:'1-2 hrs', warranty:'45 Days',  isActive:true, emoji:'🐛', path:'/general-pest-control',         description:'Comprehensive treatment for all common household pests.' },
    { id:'SVC-007', name:'Wood Borer Treatment',      category:'Wood',     startingPrice:2200, duration:'2-3 hrs', warranty:'1 Year',   isActive:true, emoji:'🪲', path:'/wood-borer-treatment',         description:'Injection and surface spray for wood-boring beetles.' },
    { id:'SVC-008', name:'Honey Bee Treatment',       category:'Insects',  startingPrice:1500, duration:'1-2 hrs', warranty:'One-time', isActive:true, emoji:'🐝', path:'/honey-bee-treatment',          description:'Safe colony removal and relocation.' },
    { id:'SVC-009', name:'Residential Pest Control',  category:'General',  startingPrice:1200, duration:'2-3 hrs', warranty:'60 Days',  isActive:true, emoji:'🏠', path:'/residential-pest-control',     description:'Full home pest protection package.' },
    { id:'SVC-010', name:'Commercial Pest Control',   category:'General',  startingPrice:3000, duration:'3-5 hrs', warranty:'90 Days',  isActive:true, emoji:'🏢', path:'/commercial-pest-control',      description:'Tailored pest management for offices and restaurants.' },
    { id:'SVC-011', name:'Pre-Construction Termite',  category:'Termite',  startingPrice:8000, duration:'4-6 hrs', warranty:'10 Years', isActive:true, emoji:'🏗️', path:'/pre-construction-termite-treatment', description:'Soil treatment before construction.' },
    { id:'SVC-012', name:'Post-Construction Termite', category:'Termite',  startingPrice:3500, duration:'3-5 hrs', warranty:'5 Years',  isActive:true, emoji:'🏚️', path:'/post-construction-termite-treatment', description:'Drill-fill-seal for existing structures.' },
  ])
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

export const getServices   = ()  => read(KEYS.services)
export const saveService   = s   => { const all=read(KEYS.services); const i=all.findIndex(x=>x.id===s.id); if(i>-1)all[i]=s; else all.unshift({...s,id:'SVC-'+uid(),createdAt:new Date().toISOString()}); write(KEYS.services,all); return all }
export const deleteService = id  => { const all=read(KEYS.services).filter(s=>s.id!==id); write(KEYS.services,all); return all }

export const getBlogs      = ()  => read(KEYS.blogs)
export const getBlogBySlug = slug => read(KEYS.blogs).find(b=>b.slug===slug)
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

export function parseUA(ua=navigator.userAgent) {
  const mobile=(/Mobi|Android|iPhone|iPod/i.test(ua))&&!(/iPad/i.test(ua))
  const tablet=/iPad|Tablet/i.test(ua)
  const type=tablet?'Tablet':mobile?'Mobile':'Desktop'
  let browser='Unknown'
  if(/Edg/i.test(ua))browser='Edge'
  else if(/Chrome/i.test(ua))browser='Chrome'
  else if(/Firefox/i.test(ua))browser='Firefox'
  else if(/Safari/i.test(ua))browser='Safari'
  let os='Unknown'
  if(/Windows/i.test(ua))os='Windows'
  else if(/Android/i.test(ua))os='Android'
  else if(/iPhone|iPad/i.test(ua))os='iOS'
  else if(/Mac/i.test(ua))os='macOS'
  else if(/Linux/i.test(ua))os='Linux'
  return {type,browser,os}
}

export function logVisit(page) {
  const all=read(KEYS.visitors)
  const {type,browser,os}=parseUA()
  all.unshift({id:Date.now(),page,timestamp:new Date().toISOString(),type,browser,os,ip:sessionStorage.getItem('azt_ip')||'…'})
  write(KEYS.visitors,all.slice(0,1000))
}

export async function fetchAndCacheIP() {
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

// Auto-seed on load
seedIfEmpty();
