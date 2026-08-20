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
  const imageCounts = {};
  
  for (const blog of allBlogs) {
    const img = blog.image;
    if (img) {
      imageCounts[img] = (imageCounts[img] || 0) + 1;
    }
  }
  
  console.log('Image occurrences:');
  for (const [img, count] of Object.entries(imageCounts)) {
    if (count > 1) {
      console.log(`${count} blogs share: ${img}`);
    }
  }
  
  client.close();
}
run().catch(console.error);
