const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

function getMongoUri() {
  const envPath = path.join(process.cwd(), '.env');
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/^MONGODB_URI=["']?([^"'\n]+)["']?/m);
  return match ? match[1] : null;
}

async function run() {
  const uri = getMongoUri();
  const client = await MongoClient.connect(uri);
  const db = client.db('pest_control');
  
  const allBlogs = await db.collection('blogs').find({}).toArray();
  console.log(`Total blogs in DB: ${allBlogs.length}`);
  if (allBlogs.length > 0) {
    const publishedCount = allBlogs.filter(b => b.status === 'published').length;
    console.log(`Published blogs: ${publishedCount}`);
    console.log(`First blog status: ${allBlogs[0].status}`);
  }
  
  client.close();
}
run().catch(console.error);
