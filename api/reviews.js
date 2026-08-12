import { put, list } from '@vercel/blob'

const BLOB_FILENAME = 'azt-reviews.json'
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_2iDMFpYeFLXr1PcM_uZIf5crS1UBjA8Ego7ydwXA2ibiOMZ'

async function getReviews() {
  try {
    const { blobs } = await list({ prefix: BLOB_FILENAME, token: BLOB_TOKEN })
    if (!blobs || blobs.length === 0) {
      const seed = [
        { id: 'REV-001', service: 'Termite Treatment', name: 'Rajesh Kumar', rating: 5, text: 'Excellent termite treatment. Highly recommend!', status: 'approved', date: '2026-08-01T10:00:00Z' },
        { id: 'REV-002', service: 'Bed Bugs Treatment', name: 'Priya Sharma', rating: 4, text: 'Very effective bed bug removal. Team was professional.', status: 'approved', date: '2026-08-02T10:00:00Z' },
        { id: 'REV-003', service: 'Cockroach Treatment', name: 'Amit Patel', rating: 5, text: 'Professional and clean service.', status: 'pending', date: '2026-08-03T10:00:00Z' },
      ]
      await saveReviews(seed)
      return seed
    }
    const sorted = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    const response = await fetch(sorted[0].url + '?t=' + Date.now())
    return await response.json()
  } catch (e) {
    console.error('Error fetching reviews from blob:', e)
    return [
      { id: 'REV-001', service: 'Termite Treatment', name: 'Rajesh Kumar', rating: 5, text: 'Excellent termite treatment. Highly recommend!', status: 'approved', date: '2026-08-01T10:00:00Z' },
      { id: 'REV-002', service: 'Bed Bugs Treatment', name: 'Priya Sharma', rating: 4, text: 'Very effective bed bug removal. Team was professional.', status: 'approved', date: '2026-08-02T10:00:00Z' },
    ]
  }
}

async function saveReviews(reviews) {
  await put(BLOB_FILENAME, JSON.stringify(reviews, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    token: BLOB_TOKEN,
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      const reviews = await getReviews()
      return res.status(200).json(reviews)
    }

    if (req.method === 'POST') {
      let payload = req.body
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload) } catch {}
      }

      if (!payload) {
        return res.status(400).json({ success: false, error: 'Empty body' })
      }

      let reviews = await getReviews()

      if (payload.action === 'delete') {
        reviews = reviews.filter(r => r.id !== payload.id)
      } else if (payload.id) {
        const idx = reviews.findIndex(r => r.id === payload.id)
        if (idx > -1) {
          reviews[idx] = { ...reviews[idx], ...payload }
        } else {
          reviews.unshift(payload)
        }
      } else {
        const newRev = {
          ...payload,
          id: 'REV-' + Math.random().toString(36).slice(2, 9).toUpperCase(),
          date: new Date().toISOString(),
          status: 'pending',
        }
        reviews.unshift(newRev)
      }

      await saveReviews(reviews)
      return res.status(200).json({ success: true, reviews })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('API Handler Error:', err)
    return res.status(500).json({ success: false, error: err.message })
  }
}
