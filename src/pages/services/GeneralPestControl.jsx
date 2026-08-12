import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/general.png'
import bgImage from '../../assets/services/bg/residential.png'

export default function GeneralPestControl() {
  return <ServiceDetailPage
    meta={{ title: 'General Pest Control in Bangalore | A to Z Pest Solutions', desc: 'General pest control services in Bangalore. Keep your space free from cockroaches, ants, spiders, and silverfish. Professional & eco-friendly solutions.', canonical: 'https://pestcontrolbengaluru.in/general-pest-control' }}
    image={imgPest} bgImage={bgImage} title="General Pest Control" tagline="Your comprehensive defense against everyday household pests."
    intro="General Pest Control (GPC) is a highly effective, multi-step process designed to manage common nuisances like cockroaches, ants, spiders, and silverfish. Using an Integrated Pest Management (IPM) approach, A to Z Pest Solutions targets these pests at their source, providing long-lasting relief rather than just a temporary surface fix."
    signs={['Frequent sightings of cockroaches in the kitchen or bathroom','Ant trails along walls and countertops','Cobwebs in corners and dark spaces','Silverfish in old books, papers, or damp areas','Unpleasant odors indicating hidden nests']}
    benefits={['Eliminates pests at their source','Safe, eco-friendly, and odorless chemicals','Protects family health from allergens and diseases','Cost-effective preventive maintenance','Convenient service with minimal disruption','Warranty-backed results for peace of mind']}
    process={[
      { title: 'Inspection', desc: 'Expert assessment to identify pest types, severity, and hidden nesting/breeding sites.' },
      { title: 'Gel Baiting', desc: 'Application of odorless, non-toxic gel in cabinet hinges and crevices to target cockroaches and ants.' },
      { title: 'Barrier Spraying', desc: 'Targeted spraying of safe chemical barriers to prevent pests from entering the premises.' },
      { title: 'Exclusion Guidance', desc: 'Providing recommendations on sealing cracks, managing waste, and improving hygiene.' },
      { title: 'Quality Check', desc: 'Post-treatment evaluation to ensure maximum efficacy and customer satisfaction.' },
    ]}
    faqs={[
      { q: 'What pests does General Pest Control cover?', a: 'It covers common household pests including cockroaches, various ant species, spiders, silverfish, and other crawling insects.' },
      { q: 'Do I need to empty my kitchen cabinets?', a: 'No, our gel baiting technology is highly targeted. You do not need to empty cabinets or cover your food.' },
      { q: 'Is the treatment safe for my asthma?', a: 'Yes. We use low-odor, non-airborne gel baits and approved chemical sprays that do not trigger asthma or allergies when applied professionally.' },
    ]}
  />
}
