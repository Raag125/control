import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import fs from 'node:fs'
import path from 'node:path'

function getMongoUri() {
  let uri = process.env.MONGODB_URI
  try {
    const envPath = path.join(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      const match = content.match(/^MONGODB_URI=["']?([^"'\n]+)["']?/m)
      if (match) uri = match[1]
    }
  } catch(e) {}
  return uri
}
const REVIEWS_FILE = path.resolve(process.cwd(), 'data/reviews.json')

let cachedClient = null
let cachedDb = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    const MONGODB_URI = getMongoUri()
    const client = await MongoClient.connect(MONGODB_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    })
    const db = client.db('pest_control')
    cachedClient = client
    cachedDb = db
    return { client, db }
  } catch (err) {
    console.warn('MongoDB connection failed, falling back to local storage:', err.message)
    return null
  }
}

function getLocalReviews() {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      return JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8'))
    }
  } catch (e) {
    console.error('Error reading local reviews file:', e)
  }
  return [
    { id: 'REV-001', service: 'Termite Treatment', name: 'Rajesh Kumar', rating: 5, text: 'Excellent termite treatment. Highly recommend!', status: 'approved', date: '2026-08-01T10:00:00Z' },
    { id: 'REV-002', service: 'Bed Bugs Treatment', name: 'Priya Sharma', rating: 4, text: 'Very effective bed bug removal. Team was professional.', status: 'approved', date: '2026-08-02T10:00:00Z' },
    { id: 'REV-003', service: 'Cockroach Treatment', name: 'Amit Patel', rating: 5, text: 'Professional and clean service.', status: 'pending', date: '2026-08-03T10:00:00Z' },
  ]
}

function saveLocalReviews(data) {
  try {
    const dir = path.dirname(REVIEWS_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (e) {
    console.error('Error writing local reviews file:', e)
  }
}

export async function GET() {
  const dbConn = await connectToDatabase()
  if (dbConn) {
    try {
      const collection = dbConn.db.collection('reviews')
      const count = await collection.countDocuments()
      if (count === 0) {
        const seed = getLocalReviews()
        await collection.insertMany(seed)
      }
      const reviews = await collection.find({}).sort({ date: -1 }).toArray()
      const sanitized = reviews.map(({ _id, ...rest }) => rest)
      return NextResponse.json(sanitized)
    } catch (err) {
      console.error('MongoDB GET error:', err)
    }
  }

  // Fallback to local JSON
  const reviews = getLocalReviews()
  return NextResponse.json(reviews)
}

export async function POST(request) {
  try {
    let payload = await request.json()
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload) } catch {}
    }

    if (!payload) {
      return NextResponse.json({ success: false, error: 'Empty body' }, { status: 400 })
    }

    const dbConn = await connectToDatabase()
    if (dbConn) {
      try {
        const collection = dbConn.db.collection('reviews')
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
            service: payload.service || 'General Service',
            name: payload.name || 'Anonymous',
            rating: Number(payload.rating) || 5,
            text: payload.text || '',
            status: 'pending',
            date: new Date().toISOString(),
          }
          await collection.insertOne(newRev)
        }

        const all = await collection.find({}).sort({ date: -1 }).toArray()
        const sanitized = all.map(({ _id, ...rest }) => rest)
        return NextResponse.json({ success: true, reviews: sanitized })
      } catch (err) {
        console.error('MongoDB POST error:', err)
      }
    }

    // Fallback to local JSON saving
    let reviews = getLocalReviews()
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
        id: 'REV-' + Math.random().toString(36).slice(2, 9).toUpperCase(),
        service: payload.service || 'General Service',
        name: payload.name || 'Anonymous',
        rating: Number(payload.rating) || 5,
        text: payload.text || '',
        status: 'pending',
        date: new Date().toISOString(),
      }
      reviews.unshift(newRev)
    }
    saveLocalReviews(reviews)

    return NextResponse.json({ success: true, reviews })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
