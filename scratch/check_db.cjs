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
  const blog = await db.collection('blogs').findOne({ slug: 'how-to-get-rid-of-termites' });
  console.log('Termite blog image:', blog ? blog.image : 'Not found');
  const rat = await db.collection('blogs').findOne({ slug: 'how-to-get-rid-of-rats-in-bangalore' });
  console.log('Rat blog image:', rat ? rat.image : 'Not found');
  
  // Let's also check if any blog has `.jpg` in content
  const allBlogs = await db.collection('blogs').find({}).toArray();
  const jpgBlogs = allBlogs.filter(b => b.content && b.content.includes('.jpg'));
  console.log('Blogs with .jpg in content:', jpgBlogs.map(b => b.slug));
  
  // Count how many have .jpg in image field
  const jpgImages = allBlogs.filter(b => b.image && b.image.includes('.jpg'));
  console.log('Blogs with .jpg in image field:', jpgImages.map(b => b.slug));

  client.close();
}
run().catch(console.error);
