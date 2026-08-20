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
  
  // Update .jpg to .webp in all image fields
  const allServices = await db.collection('services').find({}).toArray();
  let updatedCount = 0;
  for (const service of allServices) {
    let changed = false;
    let newImage = service.image;
    let newContent = service.content;
    
    if (newImage && newImage.includes('.jpg')) {
      newImage = newImage.replace(/\.jpg/g, '.webp');
      changed = true;
    }
    
    if (newContent && newContent.includes('.jpg')) {
      newContent = newContent.replace(/\.jpg/g, '.webp');
      changed = true;
    }
    
    if (changed) {
      await db.collection('services').updateOne(
        { _id: service._id },
        { $set: { image: newImage, content: newContent } }
      );
      console.log(`Updated service: ${service.slug}`);
      updatedCount++;
    }
  }
  
  console.log(`Successfully updated ${updatedCount} services.`);
  client.close();
}
run().catch(console.error);
