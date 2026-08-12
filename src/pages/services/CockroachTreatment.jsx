import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/cockroach.png'
import bgImage from '../../assets/services/bg/cockroach.png'

export default function CockroachTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Cockroach Treatment in Bangalore | A to Z Pest Solutions', desc: 'Effective cockroach control in Bangalore using gel bait and spray treatment. Safe, long-lasting, and eco-friendly. Call 9845559710 for FREE inspection.', canonical: 'https://pestcontrolbengaluru.in/cockroach-treatment' }}
    image={imgPest} bgImage={bgImage} title="Cockroach Treatment" tagline="Eliminate cockroaches from your kitchen, bathroom, and every dark corner — permanently."
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
      { q: "What are the signs of a cockroach infestation?", a: "Signs include droppings, egg shells, and live cockroaches in kitchens, bathrooms, and dark areas." },
      { q: "How do cockroaches spread diseases?", a: "Cockroaches carry bacteria, viruses, and parasites that can cause food poisoning, dysentery, and other illnesses." },
      { q: "What attracts cockroaches to my home?", a: "Food, water, and shelter attract cockroaches. Keep your home clean, store food in sealed containers, and repair leaks." },
      { q: "How do I get rid of cockroaches?", a: "Use a combination of cleaning, trapping, and professional pest control services." },
      { q: "What are the most effective cockroach control methods?", a: "Sealing entry points, removing food sources, and using baits, traps, and insecticides." },
      { q: "Can I treat cockroaches myself?", a: "Self-treatment is possible but often ineffective; professional help is recommended." },
      { q: "How long does cockroach treatment take?", a: "Treatment can take several visits and several weeks to fully eliminate the infestation." },
      { q: "How can I prevent cockroaches?", a: "Keep your home clean, store food in sealed containers, repair leaks, and use preventative measures like bait stations." },
      { q: "What are the different types of cockroaches?", a: "Common types include American, German, Oriental, and Australian cockroaches." },
      { q: "Are cockroaches dangerous?", a: "Yes, cockroaches can trigger allergies, asthma, and spread diseases." }
    ]}
  />
}
