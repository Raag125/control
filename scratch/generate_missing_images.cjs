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

function generateImageApi(prompt, slug) {
  return new Promise((resolve, reject) => {
    // Generate a good prompt based on the title
    const fullPrompt = prompt + " professional pest control service, high quality photograph, 4k, no text";
    const postData = JSON.stringify({ type: 'image', prompt: fullPrompt });
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/openai',
      method: 'POST',
      timeout: 180000,
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
  
  // Find blogs with the default placeholder image
  const toProcess = allBlogs.filter(blog => 
    blog.image === '/images/hero-banner.webp' || 
    blog.image === '' || 
    !blog.image ||
    blog.image.includes('unsplash.com')
  );
  
  console.log(`Found ${toProcess.length} blogs with placeholder images to update...`);
  
  let updatedCount = 0;
  // Process them sequentially to avoid rate limits
  for (const blog of toProcess) {
    console.log(`Generating unique image for: ${blog.slug}`);
    try {
      const url = await generateImageApi(blog.title, blog.slug);
      if (url) {
        await db.collection('blogs').updateOne(
          { _id: blog._id },
          { $set: { image: url } }
        );
        console.log(`✅ Success: ${blog.slug} -> ${url}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Failed to generate URL for: ${blog.slug}`);
      }
    } catch (err) {
      console.error(`❌ Failed for ${blog.slug}: ${err.message}`);
    }
  }
  
  console.log(`Successfully generated and updated ${updatedCount} images.`);
  client.close();
}
run().catch(console.error);
