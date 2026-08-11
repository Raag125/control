import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/rodent.png'

export default function RodentTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Rodent Treatment in Bangalore | A to Z Pest Solutions', desc: 'Professional rat and mouse control in Bangalore. Humane trapping, baiting, and exclusion services. Safe for family. Call 9845559710 for FREE inspection.', canonical: 'https://pestcontrolbengaluru.in/rodent-treatment' }}
    image={imgPest} title="Rodent Treatment" tagline="Eliminate rats and mice from your home and business with safe, proven rodent control."
    intro="Rodents like rats and mice cause significant damage to electrical wiring (a leading cause of house fires), food supplies, and structural elements. They also carry dangerous diseases including Leptospirosis and Hantavirus. A to Z Pest Solutions provides comprehensive rodent management using a combination of snap traps, glue boards, tamper-resistant bait stations, and exclusion techniques to permanently eliminate and prevent rodent intrusions."
    signs={['Droppings near food areas or in drawers','Gnaw marks on wires, pipes, or wood','Scratching noises in walls or ceilings','Grease smear marks along walls and baseboards','Nests made from shredded materials','Food containers or packages chewed through','Unusual pet behavior (sniffing at walls)','Visible rodent burrows outside the property']}
    benefits={['Humane and effective trapping methods','Tamper-resistant bait stations','Exclusion gap-sealing service','Safe for children and pets','Targets both rats and mice','Comprehensive prevention plan included']}
    process={[
      { title: 'Rodent Activity Assessment', desc: 'We identify entry points, runways, harboring areas, and determine rodent species present.' },
      { title: 'Trap & Bait Placement', desc: 'Strategic placement of snap traps and tamper-resistant bait stations along rodent runways and near burrows.' },
      { title: 'Exclusion Service', desc: 'Sealing entry gaps with rodent-proof materials — steel wool, wire mesh, and sealant.' },
      { title: 'Monitoring & Removal', desc: 'Regular monitoring visits to check and reset traps, and safely dispose of caught rodents.' },
      { title: 'Prevention Consultation', desc: 'Hygiene and structural advice to prevent future rodent entry into your property.' },
    ]}
    faqs={[
      { q: 'How long does rodent control take?', a: 'Active infestations are typically controlled within 1–2 weeks with our combined trap and bait approach. Exclusion work provides long-term prevention.' },
      { q: 'Is rodent bait dangerous to pets?', a: 'All bait stations are tamper-resistant and placed in areas inaccessible to children and pets. We use rodenticides that are handled only by trained technicians.' },
    ]}
  />
}
