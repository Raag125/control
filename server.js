import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5173
const DIST_DIR = path.resolve(__dirname, 'dist')
const REVIEWS_FILE = path.resolve(__dirname, 'data/reviews.json')

function getReviewsFromFile() {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      return JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8'))
    }
  } catch (e) {
    console.error('Error reading reviews file:', e)
  }
  return []
}

function saveReviewsToFile(data) {
  try {
    const dir = path.dirname(REVIEWS_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (e) {
    console.error('Error writing reviews file:', e)
  }
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  // Handle API reviews endpoint
  if (req.url === '/api/reviews') {
    res.setHeader('Content-Type', 'application/json')
    if (req.method === 'GET') {
      res.statusCode = 200
      res.end(JSON.stringify(getReviewsFromFile()))
      return
    }

    if (req.method === 'POST') {
      let body = ''
      req.on('data', chunk => { body += chunk.toString() })
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}')
          let reviews = getReviewsFromFile()

          if (payload.action === 'delete') {
            reviews = reviews.filter(r => r.id !== payload.id)
          } else if (payload.id) {
            const idx = reviews.findIndex(r => r.id === payload.id)
            if (idx > -1) {
              reviews[idx] = { ...reviews[idx], ...payload }
            } else {
              reviews.unshift(payload)
            }
          } else {
            const newRev = {
              ...payload,
              id: 'REV-' + Math.random().toString(36).slice(2, 9).toUpperCase(),
              date: new Date().toISOString()
            }
            reviews.unshift(newRev)
          }

          saveReviewsToFile(reviews)
          res.statusCode = 200
          res.end(JSON.stringify({ success: true, reviews }))
        } catch (err) {
          res.statusCode = 400
          res.end(JSON.stringify({ success: false, error: err.message }))
        }
      })
      return
    }
  }

  // Static file serving fallback for SPA
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url)
  const ext = path.extname(filePath)

  if (!ext && !fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html')
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(DIST_DIR, 'index.html'), (err2, fallback) => {
        if (err2) {
          res.statusCode = 404
          res.end('Not Found')
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(fallback)
        }
      })
    } else {
      const contentType = MIME_TYPES[ext] || 'application/octet-stream'
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content)
    }
  })
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
