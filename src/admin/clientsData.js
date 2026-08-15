// ── Client Lead Data Store ─────────────────────────────────────────────────
// SSR-safe: all reads/writes guarded by typeof window check

const KEY = 'atoz_admin_clients'

const demoClients = [
  {
    id: 'cl-demo-1',
    name: 'Priya Sharma',
    phone: '9876543210',
    email: '',
    service: 'Termite Treatment',
    message: '',
    source: 'Contact Form',
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'cl-demo-2',
    name: 'Ramesh Kumar',
    phone: '9988776655',
    email: 'ramesh@gmail.com',
    service: '',
    message: 'Cockroach issue in kitchen',
    source: 'Popup Form',
    status: 'contacted',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
]

export function getClients() {
  if (typeof window === 'undefined') return demoClients
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(demoClients))
      return demoClients
    }
    return JSON.parse(raw)
  } catch {
    return demoClients
  }
}

export function addClient(data) {
  if (typeof window === 'undefined') return
  const clients = getClients()
  const newClient = {
    id: `cl-${Date.now()}`,
    name: data.name || '',
    phone: data.phone || '',
    email: data.email || '',
    service: data.service || '',
    message: data.message || '',
    source: data.source || 'Website',
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  const updated = [newClient, ...clients]
  try {
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch { /* quota full */ }
  return newClient
}

export function updateClientStatus(id, status) {
  if (typeof window === 'undefined') return
  const clients = getClients()
  const updated = clients.map(c => c.id === id ? { ...c, status } : c)
  try {
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch { /* quota full */ }
  return updated
}

export function deleteClient(id) {
  if (typeof window === 'undefined') return
  const clients = getClients()
  const updated = clients.filter(c => c.id !== id)
  try {
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch { /* quota full */ }
  return updated
}
