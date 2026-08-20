import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

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

let cachedClient = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;
  const MONGODB_URI = getMongoUri()
  const client = await MongoClient.connect(MONGODB_URI, { connectTimeoutMS: 3000 });
  cachedClient = client;
  return client;
}

export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db('pest_control');
    
    // Fetch all month plans
    const docs = await db.collection('calendar_plans').find({}).toArray();
    
    // Convert array of docs back to { "2026-08": {...plan}, "2026-09": {...plan} }
    const calendarData = {};
    for (const doc of docs) {
      calendarData[doc.month] = doc.planData;
    }
    
    return NextResponse.json(calendarData);
  } catch (err) {
    console.error('MongoDB GET calendar error:', err);
    return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { month, planData } = await req.json();
    if (!month) return NextResponse.json({ error: 'Month required' }, { status: 400 });

    const client = await getMongoClient();
    const db = client.db('pest_control');

    // Upsert the month plan
    await db.collection('calendar_plans').updateOne(
      { month },
      { $set: { planData, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('MongoDB POST calendar error:', err);
    return NextResponse.json({ error: 'Failed to save calendar plan' }, { status: 500 });
  }
}
