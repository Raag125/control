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

// Helper to make POST request to the local API
function generateImageApi(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ type: 'image', prompt: prompt + " professional pest control" });
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
          if (parsed.error) reject(new Error(parsed.error.message || parsed.error));
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
  
  let updatedCount = 0;
  for (const blog of allBlogs) {
    if (blog.image === '/images/hero-banner.webp' || blog.image === '/images/blogs/how-to-get-rid-of-mosquitoes-inside-house-infographic.webp') {
      console.log(`Generating unique image for: ${blog.slug} (${blog.title})`);
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
      
      // Sleep 5s to avoid rate limits
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  
  console.log(`Successfully generated and updated ${updatedCount} images.`);
  client.close();
}
run().catch(console.error);
