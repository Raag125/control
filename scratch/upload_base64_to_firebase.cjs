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
  
  // Find blogs where image starts with data:image/
  const toProcess = allBlogs.filter(blog => blog.image && blog.image.startsWith('data:image/'));
  
  console.log(`Found ${toProcess.length} blogs with base64 images to extract and save locally...`);
  
  let updatedCount = 0;
  for (const blog of toProcess) {
    console.log(`Extracting image for: ${blog.slug}`);
    try {
      // The image includes the prefix "data:image/png;base64," which we must strip
      const base64Data = blog.image.replace(/^data:image\/\w+;base64,/, "");
      
      const buffer = Buffer.from(base64Data, 'base64');
      const safeFileName = (blog.slug || 'image').replace(/[^a-z0-9.-]/gi, '');
      const uniqueFileName = `${Date.now()}-${safeFileName}.png`;
      const writePath = path.join(process.cwd(), 'public', 'images', 'blogs', uniqueFileName);
      
      fs.writeFileSync(writePath, buffer);
      
      const url = `/images/blogs/${uniqueFileName}`;
      
      await db.collection('blogs').updateOne(
        { _id: blog._id },
        { $set: { image: url } }
      );
      console.log(`✅ Success: saved to ${url}`);
      updatedCount++;
    } catch (err) {
      console.error(`❌ Failed for ${blog.slug}: ${err.message}`);
    }
  }
  
  console.log(`Successfully extracted and updated ${updatedCount} images.`);
  client.close();
}
run().catch(console.error);
