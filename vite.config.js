import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

function reviewsApiPlugin() {
  const reviewsFilePath = path.resolve(__dirname, 'data/reviews.json')

  const getReviewsFromFile = () => {
    try {
      if (fs.existsSync(reviewsFilePath)) {
        return JSON.parse(fs.readFileSync(reviewsFilePath, 'utf-8'))
      }
    } catch (e) {
      console.error('Error reading reviews file:', e)
    }
    return []
  }

  const saveReviewsToFile = (data) => {
    try {
      const dir = path.dirname(reviewsFilePath)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(reviewsFilePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (e) {
      console.error('Error writing reviews file:', e)
    }
  }

  return {
    name: 'reviews-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/reviews', (req, res, next) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end()
          return
        }

        if (req.method === 'GET') {
          const reviews = getReviewsFromFile()
          res.statusCode = 200
          res.end(JSON.stringify(reviews))
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

        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), reviewsApiPlugin()],
  build: {
    target: 'es2015',
    cssMinify: true,
  },
  server: {
    port: 5173,
    host: true,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
})
