import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/rodent.png'
import bgImage from '../../assets/services/bg/rodent.png'

export default function RodentTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Rodent Treatment in Bangalore | A to Z Pest Solutions', desc: 'Professional rat and mouse control in Bangalore. Humane trapping, baiting, and exclusion services. Safe for family. Call 9845559710 for FREE inspection.', canonical: 'https://pestcontrolbengaluru.in/rodent-treatment' }}
    image={imgPest} bgImage={bgImage} title="Rodent Treatment" tagline="Eliminate rats and mice from your home and business with safe, proven rodent control."
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
      { q: "What are the signs of a rodent infestation?", a: "Signs include droppings, gnaw marks, burrows, and strange noises in walls or ceilings." },
      { q: "How do rodents spread diseases?", a: "Rodents carry diseases like Hantavirus, Leptospirosis, and Salmonella, which can be transmitted through contact with their urine, feces, or saliva." },
      { q: "What attracts rodents to my home?", a: "Food, water, and shelter attract rodents. Keep your home clean, store food in sealed containers, and repair leaks." },
      { q: "How do I get rid of rodents?", a: "Use a combination of trapping, sealing entry points, and professional pest control services." },
      { q: "What are the most effective rodent control methods?", a: "Sealing entry points, removing food sources, and using traps, baits, and ultrasonic repellents." },
      { q: "Can I treat rodents myself?", a: "Self-treatment is possible but often ineffective; professional help is recommended." },
      { q: "How long does rodent treatment take?", a: "Treatment can take several visits and minimum 2 – 3 weeks to fully eliminate the infestation." },
      { q: "How can I prevent rodents?", a: "Keep your home clean, store food in sealed containers, repair leaks, and use preventative measures like screens and door sweeps." },
      { q: "What are the different types of rodents?", a: "Common types include mice, rats, squirrels, and chipmunks." },
      { q: "Are rodents dangerous?", a: "Yes, rodents can cause property damage, spread diseases, and trigger allergies and asthma." }
    ]}
  />
}
