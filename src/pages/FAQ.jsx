import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import CTABanner from '../sections/CTABanner'
import './PageStyles.css'

const FAQ_DATA = [
  {
    category: 'General',
    items: [
      { q: 'How long has A to Z Pest Solutions been operating?', a: 'A to Z Pest Solutions has been serving Bengaluru since 1993 — over 30 years. We are one of the most experienced and trusted pest control companies in Bangalore.' },
      { q: 'Are your pest control treatments safe for children and pets?', a: 'Yes, absolutely. We use only WHO-approved, eco-friendly chemicals that are completely safe for children and pets once dry — typically within 2–4 hours of application.' },
      { q: 'Do you offer same-day pest control service?', a: 'Yes! We offer same-day service across Bangalore for most pest control requirements. Call us at 9845559710 and we will do our best to dispatch a technician to you the same day.' },
      { q: 'Do you provide service on weekends and public holidays?', a: 'Yes. We operate 24 hours a day, 7 days a week, 365 days a year — including all weekends and public holidays.' },
      { q: 'Are your technicians licensed and certified?', a: 'All our technicians are professionally trained, certified, and background-verified. They carry valid licenses and wear proper uniforms for easy identification.' },
    ],
  },
  {
    category: 'Pricing & Booking',
    items: [
      { q: 'How much does pest control cost in Bangalore?', a: 'Pricing depends on the type of pest, property size, and infestation level. We offer competitive, transparent pricing with no hidden charges. Call 9845559710 for a FREE inspection and exact quote.' },
      { q: 'Is there a free inspection before treatment?', a: 'Yes! We offer a FREE initial inspection. Our expert will visit your property, assess the infestation, and provide a detailed, obligation-free treatment plan and cost estimate.' },
      { q: 'Are there any hidden charges?', a: 'Never. We believe in complete pricing transparency. The quote we give you after inspection is what you pay — with no surprise add-ons or hidden fees.' },
      { q: 'How can I book a service?', a: 'You can book by calling 9845559710, sending a WhatsApp message, emailing info@pestcontrolbengaluru.in, or filling our online contact form. We will respond within 30 minutes.' },
    ],
  },
  {
    category: 'Treatment & Effectiveness',
    items: [
      { q: 'How long does a pest control treatment take?', a: 'Treatment duration depends on property size and pest type. Most residential treatments are completed within 1–3 hours. We will provide an estimated time during your free inspection.' },
      { q: 'How long will the treatment remain effective?', a: 'Effectiveness varies by treatment type. Termite treatments last 5–10 years. Cockroach and rodent treatments typically last 3–6 months. Mosquito fogging lasts 2–4 weeks. We recommend periodic maintenance plans for lasting results.' },
      { q: 'Do I need to leave my home during treatment?', a: 'For most treatments, we advise staying away from treated areas for 2–4 hours. Your technician will provide specific guidance based on the treatment applied.' },
      { q: 'What if pests return after treatment?', a: 'We offer a warranty period for all treatments. If pests return within the warranty period, we will re-treat your property at no additional cost. Our goal is your complete satisfaction.' },
      { q: 'What areas in Bangalore do you service?', a: 'We service all areas of Bangalore / Bengaluru including Whitefield, Indiranagar, Koramangala, HSR Layout, Jayanagar, Marathahalli, Electronic City, Yelahanka, RT Nagar, and all other localities.' },
    ],
  },
]

function FAQItemComp({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button
        className="faq-item__btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`faq-body-${q.slice(0, 20).replace(/\s/g, '-')}`}
      >
        {q}
        <ChevronDown size={18} className="faq-item__icon" aria-hidden="true" />
      </button>
      {open && (
        <motion.div
          id={`faq-body-${q.slice(0, 20).replace(/\s/g, '-')}`}
          className="faq-item__body"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
        >
          {a}
        </motion.div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <>
      <Helmet>
        <title>FAQs | A to Z Pest Solutions – Pest Control Bangalore</title>
        <meta name="description" content="Frequently asked questions about pest control in Bangalore. Learn about our treatments, pricing, safety, and booking process at A to Z Pest Solutions." />
        <link rel="canonical" href="https://pestcontrolbengaluru.in/faq" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ_DATA.flatMap(cat => cat.items.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          }))),
        })}</script>
      </Helmet>
      <div className="page-enter">
        <section className="page-hero" aria-label="FAQ page header">
          <div className="page-hero__bg" aria-hidden="true" />
          <div className="container page-hero__content">
            <div className="eyebrow">❓ FAQ</div>
            <h1 className="display-xl">Frequently Asked <span className="gradient-text">Questions</span></h1>
            <p className="body-lg text-muted" style={{ maxWidth: 560, margin: '1rem auto 0' }}>
              Everything you need to know about our pest control services, pricing, safety, and process.
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="faq-main-heading">
          <div className="container">
            <h2 id="faq-main-heading" className="sr-only">All Frequently Asked Questions</h2>
            {FAQ_DATA.map((cat, ci) => (
              <motion.div
                key={cat.category}
                style={{ marginBottom: '3rem' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.1 }}
              >
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--clr-primary)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {cat.category}
                </h2>
                <div className="faq-list">
                  {cat.items.map((item) => (
                    <FAQItemComp key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        <CTABanner />
      </div>
    </>
  )
}
