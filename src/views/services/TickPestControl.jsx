import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/tick.png'
import bgImage from '../../assets/services/bg/ticks_fleas.png'

export default function TickPestControl() {
  return <ServiceDetailPage
    meta={{ title: 'Tick Pest Control in Bangalore | A to Z Pest Solutions', desc: 'Protect your family and pets from dangerous tick-borne diseases. Expert tick pest control services in Bangalore.' }}
    image={imgPest} bgImage={bgImage} title="Tick Pest Control" tagline="Keep your pets and family safe from disease-carrying ticks."
    intro="Ticks are dangerous parasites that feed on the blood of pets and humans, transmitting diseases like Lyme disease and Tick Fever. In Bangalore, ticks often hitch a ride on pets and infest gardens, carpets, and furniture. A to Z Pest Solutions provides specialized tick eradication treatments, focusing on both indoor areas and outdoor resting sites to break their lifecycle completely."
    signs={['Finding attached ticks on your pets or yourself','Unexplained rashes, fever, or fatigue','Small, dark bugs crawling on walls or curtains','Excessive scratching or biting by your pets','Presence of tick eggs in cracks and crevices']}
    benefits={['Reduces the risk of tick-borne illnesses','Thorough treatment of both indoors and outdoors','Safe for pets once the treatment has dried','Breaks the tick breeding cycle','Expert advice on pet and yard maintenance','Fast-acting solutions for immediate relief']}
    process={[
      { title: 'Detailed Inspection', desc: 'We locate tick hiding spots, including carpets, skirting boards, pet bedding, and garden areas.' },
      { title: 'Indoor Treatment', desc: 'Application of targeted, pet-safe residual sprays in cracks, crevices, and flooring to eliminate indoor ticks.' },
      { title: 'Outdoor Perimeter Spray', desc: 'Treating yard edges, bushes, and exterior walls to kill ticks waiting to latch onto hosts.' },
      { title: 'Pet Care Coordination', desc: 'Advising you to coordinate our premises treatment with a vet-approved tick treatment for your pet.' },
      { title: 'Follow-up', desc: 'A secondary treatment is often recommended to target newly hatched ticks and break the lifecycle.' },
    ]}
    faqs={[
      { q: "What are tick fleas?", a: "Tick fleas are external parasites that feed on the blood of mammals and birds." },
      { q: "What do tick fleas look like?", a: "Tick fleas are small, flat, and oval-shaped, with a reddish-brown color." },
      { q: "Where are tick fleas found?", a: "Tick fleas are found on pets, wildlife, and in grassy, bushy, or wooded areas." },
      { q: "What are the signs of tick flea infestation?", a: "Signs include excessive scratching, biting, and hair loss on pets, and tiny jumping insects in the home." },
      { q: "How do tick fleas spread?", a: "Tick fleas spread through direct contact with infested animals or contaminated environments." },
      { q: "What health risks do tick fleas pose?", a: "Tick fleas can transmit diseases like typhus, tularemia, and tapeworms to humans and pets." },
      { q: "How to get rid of tick fleas?", a: "Use a combination of medicated shampoos, topical treatments, and environmental cleaning." },
      { q: "Can I treat tick fleas myself?", a: "Self-treatment is possible but often ineffective; professional help is recommended." },
      { q: "How long does tick flea treatment take?", a: "Depends on the infestation level. If the problem is high minimum 2 weeks to fully eliminate the infestation." },
      { q: "How can I prevent tick fleas?", a: "Use preventative medications on pets, avoid tick-prone areas, and keep a clean and clutter-free home." }
    ]}
  />
}
