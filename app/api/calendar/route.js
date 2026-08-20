import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

const MONGODB_URI = process.env.MONGODB_URI

let cachedClient = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;
  const client = await MongoClient.connect(MONGODB_URI, { connectTimeoutMS: 3000 });
  cachedClient = client;
  return client;
}

export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db();
    
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
    const db = client.db();

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
