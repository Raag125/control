const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function getMongoUri() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^MONGODB_URI=["']?([^"'\n]+)["']?/m);
    return match ? match[1] : null;
  }
  return null;
}

// Download image and return the local path
async function downloadImage(url, localDir) {
  if (!url) return null;
  
  // Create filename from URL
  const urlObj = new URL(url);
  const ext = path.extname(urlObj.pathname) || '.jpg';
  const basename = path.basename(urlObj.pathname, ext).replace(/[^a-z0-9-]/gi, '');
  const filename = `${basename}${ext}`;
  const localPath = path.join(localDir, filename);
  const publicPath = `/images/blogs/${filename}`;

  // Check if file already exists
  if (fs.existsSync(localPath)) {
    return publicPath;
  }

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(localPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(publicPath);
        });
      } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        downloadImage(res.headers.location, localDir).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
      }
    });
    req.on('error', reject);
  });
}

// Extract and download all inline images from HTML content
async function processHtmlImages(html, localDir) {
  if (!html) return '';
  let processedHtml = html;
  
  // Match src="..." or src='...'
  const imgRegex = /src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|gif|webp)[^"']*)["']/gi;
  let match;
  const urlMap = {}; // original -> local
  
  while ((match = imgRegex.exec(html)) !== null) {
    const originalUrl = match[1];
    if (!urlMap[originalUrl]) {
      try {
        console.log(`  Downloading inline image: ${originalUrl}`);
        const localUrl = await downloadImage(originalUrl, localDir);
        if (localUrl) {
          urlMap[originalUrl] = localUrl;
        }
      } catch (err) {
        console.error(`  Failed to download ${originalUrl}:`, err.message);
      }
    }
  }
  
  // Replace all occurrences in HTML
  for (const [original, local] of Object.entries(urlMap)) {
    processedHtml = processedHtml.split(original).join(local);
  }
  
  // Also clean up srcset attributes which might have old URLs
  processedHtml = processedHtml.replace(/srcset=["'][^"']*["']/gi, '');
  
  return processedHtml;
}

// Fetch posts from WP API
async function fetchWPPosts(page = 1) {
  return new Promise((resolve, reject) => {
    https.get(`https://pestcontrolbengaluru.in/wp-json/wp/v2/posts?_embed&per_page=100&page=${page}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const localImgDir = path.join(process.cwd(), 'public', 'images', 'blogs');
  if (!fs.existsSync(localImgDir)) {
    fs.mkdirSync(localImgDir, { recursive: true });
  }

  console.log('Fetching posts from WordPress API...');
  
  let allPosts = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const posts = await fetchWPPosts(page);
    if (posts.length > 0) {
      allPosts = allPosts.concat(posts);
      console.log(`Fetched ${posts.length} posts from page ${page}...`);
      page++;
    } else {
      hasMore = false;
    }
    // Safety break if it loops forever (max 1000 posts)
    if (page > 10) hasMore = false; 
  }
  
  console.log(`Total posts fetched: ${allPosts.length}`);
  
  const parsedBlogs = [];
  
  for (let i = 0; i < allPosts.length; i++) {
    const post = allPosts[i];
    console.log(`Processing [${i+1}/${allPosts.length}]: ${post.title.rendered}`);
    
    // 1. Title & Slug & Date
    const title = post.title.rendered.replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").replace(/&amp;/g, '&');
    const slug = post.slug;
    const date = post.date;
    
    // 2. Excerpt (Meta Desc)
    let excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').trim().replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").replace(/&amp;/g, '&');
    
    // 3. Featured Image
    let imageUrl = '';
    let imageAlt = title;
    
    if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
      const media = post._embedded['wp:featuredmedia'][0];
      const sourceUrl = media.source_url;
      imageAlt = media.alt_text || title;
      
      try {
        console.log(`  Downloading featured image: ${sourceUrl}`);
        const localUrl = await downloadImage(sourceUrl, localImgDir);
        if (localUrl) imageUrl = localUrl;
      } catch (err) {
        console.error(`  Failed to download featured image: ${err.message}`);
      }
    }
    
    // 4. Content & Inline Images
    let rawContent = post.content.rendered;
    const finalContent = await processHtmlImages(rawContent, localImgDir);
    
    const blogDoc = {
      title,
      slug,
      date,
      excerpt,
      metaDesc: excerpt.substring(0, 160),
      content: finalContent,
      image: imageUrl,
      imageAlt,
      status: 'published',
      category: 'General',
      tags: [],
      author: 'A to Z Pest Control'
    };
    
    parsedBlogs.push(blogDoc);
  }
  
  // Save backup
  fs.writeFileSync('scratch/scraped_blogs.json', JSON.stringify(parsedBlogs, null, 2));
  console.log('Saved scraped_blogs.json locally.');
  
  // Insert into DB
  const uri = getMongoUri();
  if (uri) {
    const client = await MongoClient.connect(uri);
    const db = client.db('pest_control');
    
    // The db was already cleared, so we can just insert them
    if (parsedBlogs.length > 0) {
      const res = await db.collection('blogs').insertMany(parsedBlogs);
      console.log(`Successfully inserted ${res.insertedCount} blogs into MongoDB!`);
    } else {
      console.log('No blogs to insert.');
    }
    
    client.close();
  } else {
    console.error('No MONGODB_URI found, skipping DB insert.');
  }
}

run().catch(console.error);
