// ── Admin Auth — SHA-256 + Rate Limiting + Session Management ──

const SESSION_KEY = 'azt_adm_sess'
const RATE_KEY    = 'azt_adm_rate'
const SESSION_TTL = 2 * 60 * 60 * 1000   // 2 hours
const MAX_TRIES   = 5
const LOCKOUT_TTL = 15 * 60 * 1000        // 15 min

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Hashes computed lazily so raw strings never live as module constants
let _eh = null, _ph = null
async function initHashes() {
  if (!_eh) _eh = await sha256('admin@example.com')
  if (!_ph) _ph = await sha256('pest@21')
}

// ── Rate limiting (sessionStorage clears on tab close) ──
function getRate()     { try { return JSON.parse(sessionStorage.getItem(RATE_KEY)) || { n: 0, until: null } } catch { return { n: 0, until: null } } }
function setRate(d)    { sessionStorage.setItem(RATE_KEY, JSON.stringify(d)) }
export function isLocked()    { const r = getRate(); return r.until && Date.now() < r.until }
export function lockMinsLeft(){ const r = getRate(); return r.until ? Math.max(0, Math.ceil((r.until - Date.now()) / 60000)) : 0 }

// ── Session ──
export function isAuthenticated() {
  try {
    const s = JSON.parse(sessionStorage.getItem(SESSION_KEY))
    if (!s || Date.now() > s.exp) { sessionStorage.removeItem(SESSION_KEY); return false }
    // Rolling expiry
    s.exp = Date.now() + SESSION_TTL
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s))
    return true
  } catch { return false }
}

export async function login(email, password) {
  await initHashes()
  if (isLocked()) return { ok: false, msg: `Locked out for ${lockMinsLeft()} min. Try later.` }

  const [eh, ph] = await Promise.all([sha256(email.trim().toLowerCase()), sha256(password)])
  const rate = getRate()

  if (eh === _eh && ph === _ph) {
    setRate({ n: 0, until: null })
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      token: (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)),
      created: Date.now(),
      exp: Date.now() + SESSION_TTL
    }))
    return { ok: true }
  }

  const n = rate.n + 1
  setRate({ n, until: n >= MAX_TRIES ? Date.now() + LOCKOUT_TTL : null })
  const left = MAX_TRIES - n
  if (left <= 0) return { ok: false, msg: `Too many attempts. Locked for ${lockMinsLeft()} min.` }
  return { ok: false, msg: `Wrong credentials. ${left} attempt${left !== 1 ? 's' : ''} left.` }
}

export function logout() { sessionStorage.removeItem(SESSION_KEY) }
