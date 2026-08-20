import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import initialBlogs from '../../../src/admin/blogsData.json'

import fs from 'fs'
import path from 'path'

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
    console.warn('MongoDB connection failed:', err.message)
    return null
  }
}

export async function GET() {
  const conn = await connectToDatabase()
  if (!conn) {
    return NextResponse.json(initialBlogs || [], { status: 200 }) // Fallback to static if no DB
  }
  
  try {
    const { db } = conn
    let blogs = await db.collection('blogs').find({}).sort({ date: -1 }).toArray()
    
    // Seed database if empty
    if (blogs.length === 0 && initialBlogs && initialBlogs.length > 0) {
      console.log('Seeding blogs collection with initialBlogs...')
      const formattedBlogs = initialBlogs.map(b => ({
        ...b,
        date: b.date || new Date().toISOString()
      }))
      await db.collection('blogs').insertMany(formattedBlogs)
      blogs = await db.collection('blogs').find({}).sort({ date: -1 }).toArray()
    }
    
    // Remove _id from response for cleaner client handling
    blogs = blogs.map(b => {
      const { _id, ...rest } = b
      return rest
    })
    
    return NextResponse.json(blogs, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store', // Avoid caching dynamic edits on the API layer
      }
    })
  } catch (err) {
    console.error('Error fetching blogs:', err)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(req) {
  const conn = await connectToDatabase()
  if (!conn) return NextResponse.json({ error: 'DB connection failed' }, { status: 500 })
  
  try {
    const body = await req.json()
    const { action, id, blog } = body
    const { db } = conn
    
    if (action === 'delete' && id) {
      await db.collection('blogs').deleteOne({ id })
      const updated = await db.collection('blogs').find({}).sort({ date: -1 }).toArray()
      return NextResponse.json({ success: true, blogs: updated.map(b => { const { _id, ...rest } = b; return rest }) }, { status: 200 })
    }
    
    if (blog) {
      const existing = await db.collection('blogs').findOne({ id: blog.id })
      if (existing) {
        await db.collection('blogs').updateOne(
          { id: blog.id },
          { $set: { ...blog, updatedAt: new Date().toISOString() } }
        )
      } else {
        await db.collection('blogs').insertOne({
          ...blog,
          date: blog.date || new Date().toISOString()
        })
      }
      const updated = await db.collection('blogs').find({}).sort({ date: -1 }).toArray()
      return NextResponse.json({ success: true, blogs: updated.map(b => { const { _id, ...rest } = b; return rest }) }, { status: 200 })
    }
    
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  } catch (err) {
    console.error('Error saving blog:', err)
    return NextResponse.json({ error: 'Failed to save blog' }, { status: 500 })
  }
}
