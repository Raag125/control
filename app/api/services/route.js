import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { SERVICES_DATA } from '../../../src/data/servicesData'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://navneetnamdev191_db_user:mZMtHM1NNvQdfos9@cluster0.5s6gngc.mongodb.net/pest_control?retryWrites=true&w=majority'

let cachedClient = null
let cachedDb = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    })
    const db = client.db('pest_control')
    cachedClient = client
    cachedDb = db
    return { client, db }
  } catch (err) {
    console.warn('MongoDB connection failed:', err.message)
    return null
  }
}

export async function GET() {
  const conn = await connectToDatabase()
  if (!conn) {
    return NextResponse.json(SERVICES_DATA, { status: 200 }) // Fallback to static if no DB
  }
  
  try {
    const { db } = conn
    let services = await db.collection('services').find({}).sort({ createdAt: -1 }).toArray()
    
    // Seed database if empty
    if (services.length === 0) {
      console.log('Seeding services collection with SERVICES_DATA...')
      const formattedServices = SERVICES_DATA.map((s, i) => ({
        ...s,
        id: s.id || `SVC-00${i + 1}`,
        isActive: true,
        createdAt: new Date().toISOString()
      }))
      await db.collection('services').insertMany(formattedServices)
      services = await db.collection('services').find({}).sort({ createdAt: -1 }).toArray()
    }
    
    // Remove _id from response for cleaner client handling
    services = services.map(s => {
      const { _id, ...rest } = s
      return rest
    })
    
    return NextResponse.json(services, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store', // Avoid caching dynamic edits on the API layer
      }
    })
  } catch (err) {
    console.error('Error fetching services:', err)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(req) {
  const conn = await connectToDatabase()
  if (!conn) return NextResponse.json({ error: 'DB connection failed' }, { status: 500 })
  
  try {
    const body = await req.json()
    const { action, id, service } = body
    const { db } = conn
    
    if (action === 'delete' && id) {
      await db.collection('services').deleteOne({ id })
      const updated = await db.collection('services').find({}).sort({ createdAt: -1 }).toArray()
      return NextResponse.json({ success: true, services: updated.map(s => { const { _id, ...rest } = s; return rest }) }, { status: 200 })
    }
    
    if (service) {
      const existing = await db.collection('services').findOne({ id: service.id })
      if (existing) {
        await db.collection('services').updateOne(
          { id: service.id },
          { $set: { ...service, updatedAt: new Date().toISOString() } }
        )
      } else {
        await db.collection('services').insertOne({
          ...service,
          createdAt: new Date().toISOString()
        })
      }
      const updated = await db.collection('services').find({}).sort({ createdAt: -1 }).toArray()
      return NextResponse.json({ success: true, services: updated.map(s => { const { _id, ...rest } = s; return rest }) }, { status: 200 })
    }
    
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  } catch (err) {
    console.error('Error saving service:', err)
    return NextResponse.json({ error: 'Failed to save service' }, { status: 500 })
  }
}
