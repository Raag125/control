import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://navneetnamdev191_db_user:mZMtHM1NNvQdfos9@cluster0.5s6gngc.mongodb.net/pest_control?retryWrites=true&w=majority'

let cachedClient = null
let cachedDb = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = await MongoClient.connect(MONGODB_URI)
  const db = client.db('pest_control')

  cachedClient = client
  cachedDb = db
  return { client, db }
}

async function getReviewsCollection() {
  const { db } = await connectToDatabase()
  const collection = db.collection('reviews')
  const count = await collection.countDocuments()
  
  if (count === 0) {
    const seed = [
      { id: 'REV-001', service: 'Termite Treatment', name: 'Rajesh Kumar', rating: 5, text: 'Excellent termite treatment. Highly recommend!', status: 'approved', date: '2026-08-01T10:00:00Z' },
      { id: 'REV-002', service: 'Bed Bugs Treatment', name: 'Priya Sharma', rating: 4, text: 'Very effective bed bug removal. Team was professional.', status: 'approved', date: '2026-08-02T10:00:00Z' },
      { id: 'REV-003', service: 'Cockroach Treatment', name: 'Amit Patel', rating: 5, text: 'Professional and clean service.', status: 'pending', date: '2026-08-03T10:00:00Z' },
    ]
    await collection.insertMany(seed)
  }
  return collection
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
    const collection = await getReviewsCollection()

    if (req.method === 'GET') {
      const reviews = await collection.find({}).sort({ date: -1 }).toArray()
      const sanitized = reviews.map(({ _id, ...rest }) => rest)
      return res.status(200).json(sanitized)
    }

    if (req.method === 'POST') {
      let payload = req.body
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload) } catch {}
      }

      if (!payload) {
        return res.status(400).json({ success: false, error: 'Empty body' })
      }

      if (payload.action === 'delete') {
        await collection.deleteOne({ id: payload.id })
      } else if (payload.id) {
        const { _id, ...updateData } = payload
        await collection.updateOne(
          { id: payload.id },
          { $set: updateData },
          { upsert: true }
        )
      } else {
        const newRev = {
          id: 'REV-' + Math.random().toString(36).slice(2, 9).toUpperCase(),
          service: payload.service,
          name: payload.name,
          rating: Number(payload.rating) || 5,
          text: payload.text,
          status: 'pending',
          date: new Date().toISOString(),
        }
        await collection.insertOne(newRev)
      }

      const all = await collection.find({}).sort({ date: -1 }).toArray()
      const sanitized = all.map(({ _id, ...rest }) => rest)
      return res.status(200).json({ success: true, reviews: sanitized })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('MongoDB API Error:', err)
    return res.status(500).json({ success: false, error: err.message })
  }
}
