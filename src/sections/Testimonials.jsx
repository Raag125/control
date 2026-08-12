import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'
import './Testimonials.css'

const REVIEWS = [
  {
    name: 'Priya Ramnath',
    location: 'Whitefield, Bangalore',
    rating: 5,
    text: 'We had a severe termite infestation that had been silently damaging our teak flooring for over two years. A to Z\'s team conducted a thorough inspection, gave us a clear written quote, and completed the Drill-Fill-Seal treatment in one day. Eleven months later — not a single mud tube. The technicians were professional, punctual, and very knowledgeable. Best money I\'ve spent on home maintenance.',
    service: 'Post-Construction Termite Treatment',
  },
  {
    name: 'Karthik Srinivasan',
    location: 'Indiranagar, Bangalore',
    rating: 5,
    text: 'We came back from a 10-day holiday to discover our guest bedroom had a bed bug problem from a visiting relative. I called A to Z at 8 PM and they arrived the next morning at 9 AM sharp. The steam treatment was odorless and the technician was incredibly thorough — even treating behind the wall sockets. Two weeks later, zero bites. The 90-day warranty gave us complete peace of mind.',
    service: 'Bed Bugs Steam Treatment',
  },
  {
    name: 'Sunitha Gopal',
    location: 'Koramangala, Bangalore',
    rating: 5,
    text: 'Running a cloud kitchen, cockroach control is non-negotiable for our FSSAI license. A to Z set up a quarterly AMC contract for us. The gel bait treatment is completely odorless and we don\'t need to shut down during treatment. In 18 months of the contract, we have had zero cockroach activity and our last three FSSAI inspections passed without any pest control observations. Extremely reliable service.',
    service: 'Commercial Cockroach Control (Quarterly AMC)',
  },
  {
    name: 'Rajeev Nambiar',
    location: 'Jayanagar, Bangalore',
    rating: 5,
    text: 'We found a large honey bee hive (football-sized) inside our bathroom wall cavity. A to Z sent a specialist who removed the entire hive without a single person getting stung — even with the hive inside the wall. They opened a small access point, removed every fragment of honeycomb, sealed the wall, and even coordinated with an apiary to relocate the bees. Absolutely professional. Would highly recommend for any bee-related emergency.',
    service: 'Honey Bee Hive Removal & Relocation',
  },
  {
    name: 'Ananya Krishnamurthy',
    location: 'HSR Layout, Bangalore',
    rating: 5,
    text: 'Had a persistent rodent problem for months — gnawed wires, droppings in the kitchen, scratching in the ceiling at night. Called three companies before A to Z — none of them offered exclusion (sealing entry points). A to Z\'s team found 7 entry gaps we had missed, sealed all of them with wire mesh, placed tamper-resistant bait stations, and the problem was completely resolved in 3 weeks. One year later, no re-entry.',
    service: 'Integrated Rodent Management',
  },
  {
    name: 'Vikram Hegde',
    location: 'Malleshwaram, Bangalore',
    rating: 5,
    text: 'Our 80-year-old ancestral home had a severe wood borer problem in the original teak beams and wooden doors. The A to Z specialist correctly identified the species as Common Furniture Beetle and treated every single exit hole with insecticide injection followed by borate surface treatment. Six months later, no new holes, no new frass. The team handled our antique woodwork with great care — no damage to any surface. Highly professional.',
    service: 'Wood Borer Beetle Treatment',
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
            Over 18,000 verified clients across Bangalore rate A to Z Pest Solutions 4.9★ on Google and JustDial.
            These are real stories from real families and business owners.
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
