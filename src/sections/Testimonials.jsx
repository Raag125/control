import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'
import './Testimonials.css'

const REVIEWS = [
  {
    name: 'Priya Sharma',
    location: 'Whitefield, Bangalore',
    rating: 5,
    text: 'I booked termite treatment for my new flat and the team was incredibly professional. They explained every step clearly and the cockroach treatment they recommended alongside worked brilliantly. Totally pest-free now!',
    service: 'Termite & Cockroach Treatment',
  },
  {
    name: 'Rajan Mehta',
    location: 'Indiranagar, Bangalore',
    rating: 5,
    text: 'Excellent service! Had a serious bed bug infestation and their team resolved it from day one. They also handled ticks and fleas for my dogs — safe and effective. Highly recommended!',
    service: 'Bed Bugs & Ticks Treatment',
  },
  {
    name: 'Sunitha Rao',
    location: 'Koramangala, Bangalore',
    rating: 5,
    text: 'Their rodent treatment solved my rat problem permanently. I was amazed at how safely they handled the honey bee hive removal — didn\'t harm a single bee. Truly a reliable company.',
    service: 'Rodent & Honey Bee Treatment',
  },
  {
    name: 'Amit Kulkarni',
    location: 'Jayanagar, Bangalore',
    rating: 5,
    text: 'Cockroach and mosquito treatment worked like magic. My kitchen is completely clean now and the balcony is mosquito-free. Super professional staff and transparent pricing.',
    service: 'Cockroach & Mosquito Treatment',
  },
  {
    name: 'Deepa Nair',
    location: 'HSR Layout, Bangalore',
    rating: 5,
    text: 'Had both termite and bed bug treatments done. Technicians arrived on time, used the safest methods, and I haven\'t faced any pest issues since. Absolutely worth every rupee!',
    service: 'Termite & Bed Bugs Treatment',
  },
  {
    name: 'Vikram Hegde',
    location: 'RT Nagar, Bangalore',
    rating: 5,
    text: 'Best pest control in Bengaluru without a doubt! The wood borer treatment for my furniture was done perfectly. Their rodent control at my office space was also excellent.',
    service: 'Wood Borer & Rodent Treatment',
  },
]

export default function Testimonials() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section className="testimonials section" aria-labelledby="testimonials-heading" ref={ref}>
      <div className="testimonials__bg" aria-hidden="true" />
      <div className="container">
        <div className="section-header">
          <div className="eyebrow" aria-hidden="true">⭐ Customer Reviews</div>
          <h2 id="testimonials-heading" className="display-lg">
            What Our Clients <span className="gradient-text">Say</span>
          </h2>
          <p>
            Over 15,000 satisfied customers trust A to Z Pest Solutions across Bangalore.
            Here's what they have to say about our services.
          </p>
        </div>

        <div className="testimonials__grid">
          {REVIEWS.map((r, i) => (
            <motion.article
              key={r.name}
              className="testimonial-card"
              initial={{ opacity: 0, y: 35 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              aria-label={`Review by ${r.name} from ${r.location}`}
            >
              <Quote size={28} className="testimonial-card__quote" aria-hidden="true" />

              <div className="testimonial-card__stars" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" aria-hidden="true" />
                ))}
              </div>

              <p className="testimonial-card__text">"{r.text}"</p>

              <div className="testimonial-card__meta">
                <div className="testimonial-card__avatar" aria-hidden="true">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <strong className="testimonial-card__name">{r.name}</strong>
                  <span className="testimonial-card__location">{r.location}</span>
                  <span className="testimonial-card__service badge">{r.service}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
