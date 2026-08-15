'use client'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import './WhatsAppFloat.css'

export default function WhatsAppFloat() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return (
    <AnimatePresence>
      <div className="contact-float-group" aria-label="Quick contact buttons">

        {/* Phone Call Button */}
        <motion.a
          href="tel:+919845559710"
          aria-label="Call A to Z Pest Solutions"
          className="contact-float-btn call-float"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.8, type: 'spring', stiffness: 220, damping: 18 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.93 }}
        >
          {/* Phone SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.1 6.1l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="call-float__ring" aria-hidden="true" />
        </motion.a>

        {/* WhatsApp Button */}
        <motion.a
          href="https://wa.me/919845559710?text=Hi%20A%20to%20Z%20Pest%20Solutions%2C%20I%20need%20pest%20control%20services%20in%20Bangalore."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp for pest control services"
          className="contact-float-btn whatsapp-float"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 18 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="26"
            height="26"
            fill="white"
            aria-hidden="true"
          >
            <path d="M16 0C7.164 0 0 7.163 0 16c0 2.824.736 5.472 2.027 7.772L0 32l8.46-2.007A15.934 15.934 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.09 22.09c-.34.96-2 1.84-2.74 1.96-.72.12-1.64.17-2.64-.16a24.32 24.32 0 01-2.39-.88c-4.19-1.8-6.93-6.01-7.14-6.29-.21-.28-1.71-2.28-1.71-4.35 0-2.07 1.08-3.09 1.46-3.51.38-.42.82-.52 1.1-.52.27 0 .54.003.78.014.25.012.59-.095.92.7.34.82 1.16 2.84 1.26 3.04.1.2.17.44.03.7-.14.26-.21.42-.41.65-.2.23-.42.51-.6.69-.2.2-.41.41-.18.8.24.4 1.06 1.74 2.28 2.82 1.57 1.39 2.89 1.82 3.3 2.02.41.2.65.17.89-.1.24-.27 1.03-1.2 1.3-1.61.28-.41.55-.34.92-.2.37.14 2.37 1.12 2.78 1.32.41.2.68.3.78.47.1.17.1 1.02-.23 1.96z"/>
          </svg>
          <span className="whatsapp-pulse" aria-hidden="true" />
        </motion.a>

      </div>
    </AnimatePresence>
  )
}
