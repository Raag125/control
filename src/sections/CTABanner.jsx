import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Phone, MessageCircle } from 'lucide-react'
import './CTABanner.css'

export default function CTABanner() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section className="cta-banner section" aria-label="Call to action — book pest control" ref={ref}>
      <div className="container">
        <motion.div
          className="cta-banner__inner"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.65 }}
        >
          <div className="cta-banner__glow" aria-hidden="true" />
          <div className="cta-banner__content">
            <div className="eyebrow" style={{ margin: '0 auto 1rem' }}>
              🚨 Act Now — Don't Let Pests Take Over
            </div>
            <h2 className="display-lg text-center">
              Ready for a <span className="gradient-text">Pest-Free</span> Home?
            </h2>
            <p className="body-lg text-muted text-center" style={{ maxWidth: 560, margin: '1rem auto 0' }}>
              Call us today for a <strong style={{ color: 'var(--clr-primary)' }}>FREE inspection</strong> and expert
              consultation. Available 24/7 — 365 days a year across Bangalore.
            </p>
            <div className="cta-banner__actions">
              <a
                href="tel:+919845559710"
                className="btn btn-primary cta-banner__btn"
                aria-label="Call A to Z Pest Solutions at 9845559710"
              >
                <Phone size={18} aria-hidden="true" />
                Call 9845559710 — Free Inspection
              </a>
              <a
                href="https://wa.me/919845559710?text=Hi%2C%20I%20need%20pest%20control%20in%20Bangalore.%20Please%20help!"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline cta-banner__btn"
                aria-label="WhatsApp A to Z Pest Solutions"
              >
                <MessageCircle size={18} aria-hidden="true" />
                WhatsApp Us Now
              </a>
            </div>
            <p className="cta-banner__note">
              ✅ No hidden charges &nbsp;|&nbsp; 🌿 Eco-friendly &nbsp;|&nbsp; ⚡ Same-day available &nbsp;|&nbsp; 🏆 Since 1993
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
