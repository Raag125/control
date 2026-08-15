'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Phone } from 'lucide-react'
import './PageStyles.css'

export default function NotFound() {
  return (
    <div className="not-found page-enter" role="main" aria-label="404 Page Not Found">
      <div className="container not-found__content">
        <motion.div
          className="not-found__code"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          aria-hidden="true"
        >
          404
        </motion.div>
        <motion.h1
          className="display-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Page Not Found
        </motion.h1>
        <motion.p
          className="body-lg text-muted"
          style={{ maxWidth: 460 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Looks like this page got away from us — but our pest experts never do!
          Head back home or contact us for assistance.
        </motion.p>
        <motion.div
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/" className="btn btn-primary" aria-label="Go back to homepage">
            <Home size={16} aria-hidden="true" /> Back to Home
          </Link>
          <a href="tel:+919845559710" className="btn btn-outline" aria-label="Call us at 9845559710">
            <Phone size={16} aria-hidden="true" /> Call Us
          </a>
        </motion.div>
      </div>
    </div>
  )
}
