const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const http = require('http');

function getMongoUri() {
  const envPath = path.join(process.cwd(), '.env');
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/^MONGODB_URI=["']?([^"'\n]+)["']?/m);
  return match ? match[1] : null;
}

function generateImageApi(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ type: 'image', prompt: prompt + " photorealistic, 4k, professional pest control" });
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/openai',
      method: 'POST',
      timeout: 180000, // 3 minutes timeout
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) reject(new Error(parsed.error.message || JSON.stringify(parsed.error)));
          else resolve(parsed.url);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  const uri = getMongoUri();
  const client = await MongoClient.connect(uri);
  const db = client.db('pest_control');
  
  const allBlogs = await db.collection('blogs').find({}).toArray();
  
  const toProcess = allBlogs.filter(blog => 
    blog.image === '/images/hero-banner.webp' || 
    blog.image === '/images/blogs/how-to-get-rid-of-mosquitoes-inside-house-infographic.webp' ||
    blog.image.includes('images.unsplash.com')
  );
  
  console.log(`Found ${toProcess.length} blogs to update...`);
  
  let updatedCount = 0;
  // Process in chunks of 5
  for (let i = 0; i < toProcess.length; i += 5) {
    const chunk = toProcess.slice(i, i + 5);
    const promises = chunk.map(async (blog) => {
      console.log(`Generating unique image for: ${blog.slug}`);
      try {
        const url = await generateImageApi(blog.title);
        if (url) {
          await db.collection('blogs').updateOne(
            { _id: blog._id },
            { $set: { image: url, imageAlt: blog.title } }
          );
          console.log(`✅ Success: ${blog.slug}`);
          updatedCount++;
        }
      } catch (err) {
        console.error(`❌ Failed for ${blog.slug}: ${err.message}`);
      }
    });
    
    await Promise.all(promises);
    // Sleep a tiny bit between chunks just to be safe
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log(`Successfully generated and updated ${updatedCount} images.`);
  client.close();
}
run().catch(console.error);
