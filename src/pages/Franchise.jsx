import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle2, TrendingUp, Users, Award, Phone, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import CTABanner from '../sections/CTABanner'
import './PageStyles.css'


const WHY_FRANCHISE = [
  { icon: TrendingUp, title: 'Proven Business Model', desc: '30+ years of operational success that you can replicate in your area.' },
  { icon: Users,      title: 'Training & Support',     desc: 'Comprehensive training, ongoing mentorship, and 24/7 technical support.' },
  { icon: Award,      title: 'Trusted Brand',           desc: 'Leverage A to Z\'s established reputation and 15,000+ client base.' },
  { icon: CheckCircle2, title: 'Growing Market',       desc: 'Pest control is a recession-proof industry with year-round demand in Bangalore.' },
]

export default function Franchise() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) { toast.error('Please fill in all required fields.'); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Application received! Our franchise team will contact you within 24 hours.')
      setForm({ name: '', phone: '', email: '', city: '', message: '' })
    }, 1800)
  }

  return (
    <>
      <Helmet>
        <title>Pest Control Franchise in Bangalore | A to Z Pest Solutions</title>
        <meta name="description" content="Join the A to Z Pest Solutions franchise network. Start your own pest control business in Bangalore with our proven model, training, and support. Apply now!" />
        <link rel="canonical" href="https://pestcontrolbengaluru.in/franchise" />
      </Helmet>
      <div className="page-enter">
        <section className="page-hero" aria-label="Franchise page header">
          <div className="page-hero__bg" aria-hidden="true" />
          <div className="container page-hero__content">
            <div className="eyebrow">🤝 Franchise Opportunity</div>
            <h1 className="display-xl">Own a <span className="gradient-text">Pest Control</span> Business</h1>
            <p className="body-lg text-muted" style={{ maxWidth: 580, margin: '1rem auto 0' }}>
              Partner with Bangalore's most trusted pest control brand since 1993.
              Start your own profitable pest control franchise with full training and support.
            </p>
            <a href="tel:+919845559710" className="btn btn-primary" style={{ marginTop: '2rem' }} aria-label="Call to discuss franchise">
              <Phone size={16} aria-hidden="true" /> Discuss Franchise: 9845559710
            </a>
          </div>
        </section>

        {/* Why Franchise */}
        <section className="section" aria-labelledby="why-franchise-heading">
          <div className="container">
            <div className="section-header">
              <div className="eyebrow">Why Partner With Us</div>
              <h2 id="why-franchise-heading" className="display-lg">
                A Business Built for <span className="gradient-text">Success</span>
              </h2>
            </div>
            <div className="why-grid">
              {WHY_FRANCHISE.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  className="why-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="why-card__icon" aria-hidden="true"><Icon size={22} /></div>
                  <h3 className="why-card__title">{title}</h3>
                  <p className="why-card__desc">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>



        {/* Application Form */}
        <section className="section" aria-labelledby="apply-heading">
          <div className="container" style={{ maxWidth: 720 }}>
            <div className="section-header">
              <div className="eyebrow">Apply Now</div>
              <h2 id="apply-heading" className="display-lg">
                Start Your <span className="gradient-text">Application</span>
              </h2>
            </div>
            <motion.div
              className="form-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} noValidate aria-label="Franchise application form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fr-name" className="form-label">Full Name *</label>
                    <input id="fr-name" name="name" type="text" className="form-input" placeholder="Your name" value={form.name} onChange={handleChange} required aria-required="true" maxLength={100} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fr-phone" className="form-label">Phone Number *</label>
                    <input id="fr-phone" name="phone" type="tel" className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} required aria-required="true" maxLength={15} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fr-email" className="form-label">Email Address</label>
                    <input id="fr-email" name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} maxLength={254} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fr-city" className="form-label">City / Area</label>
                    <input id="fr-city" name="city" type="text" className="form-input" placeholder="e.g. Whitefield, Bangalore" value={form.city} onChange={handleChange} maxLength={100} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="fr-message" className="form-label">Tell Us About Yourself</label>
                  <textarea id="fr-message" name="message" className="form-textarea" placeholder="Brief background, business experience, why you want to partner with us…" value={form.message} onChange={handleChange} maxLength={1000} rows={4} />
                </div>
                <button type="submit" className="btn btn-primary form-submit" disabled={loading} aria-label="Submit franchise application">
                  {loading ? 'Submitting…' : <><Send size={16} aria-hidden="true" /> Submit Application</>}
                </button>
              </form>
            </motion.div>
          </div>
        </section>
        <CTABanner />
      </div>
    </>
  )
}
