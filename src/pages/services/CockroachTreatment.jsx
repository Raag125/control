import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/cockroach.png'

export default function CockroachTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Cockroach Treatment in Bangalore | A to Z Pest Solutions', desc: 'Effective cockroach control in Bangalore using gel bait and spray treatment. Safe, long-lasting, and eco-friendly. Call 9845559710 for FREE inspection.', canonical: 'https://pestcontrolbengaluru.in/cockroach-treatment' }}
    image={imgPest} title="Cockroach Treatment" tagline="Eliminate cockroaches from your kitchen, bathroom, and every dark corner — permanently."
    intro="Cockroaches are one of the most common and hazardous pests in Bengaluru homes and restaurants. They contaminate food, trigger allergies, and spread bacteria like Salmonella and E. coli. A to Z Pest Solutions uses a powerful combination of gel-bait technology and residual spray treatment targeting the breeding zones in kitchens, bathrooms, and sewage areas — delivering fast, lasting results without shutting down your space."
    signs={['Cockroaches spotted during daytime','Musty, unpleasant odor in kitchen','Cockroach droppings resembling black pepper','Smear marks on walls near water sources','Egg cases found behind appliances','Seeing cockroaches scurry when lights turn on','Allergic reactions or unexplained asthma flare-ups','Cockroaches in food storage areas']}
    benefits={['Gel bait safe for kitchen use','No need to empty cabinets','Odorless treatment option','Works within 24–48 hours','WHO-approved insecticides','Free follow-up treatment included']}
    process={[
      { title: 'Inspection of Harboring Zones', desc: 'We identify all cockroach hiding spots — behind fridges, under sinks, inside cabinets, and electrical boards.' },
      { title: 'Gel Bait Application', desc: 'Professional-grade gel bait is applied at harboring points. Cockroaches feed on it and carry it back to the colony.' },
      { title: 'Residual Spray', desc: 'Residual insecticide spray is applied around drainage, baseboards, and external entry points.' },
      { title: 'Colony Elimination', desc: 'The bait cascades through the colony, eliminating cockroaches at the source over 24–72 hours.' },
      { title: 'Follow-up & Prevention', desc: 'Post-treatment inspection and advice on hygiene practices to prevent future infestations.' },
    ]}
    faqs={[
      { q: 'Is cockroach gel bait safe around food areas?', a: 'Yes. The gel bait we use is specifically designed for kitchen use — it is non-volatile, odorless, and safe around food preparation areas when applied correctly by our certified technicians.' },
      { q: 'How soon will cockroaches disappear?', a: 'You will see a significant reduction within 24–48 hours. Complete elimination typically takes 1–2 weeks as the bait works through the entire colony.' },
    ]}
  />
}
