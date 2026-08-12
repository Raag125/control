import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/honey_bee.png'
import bgImage from '../../assets/services/bg/honeybee.png'

export default function HoneyBeeTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Honey Bee Treatment & Removal in Bangalore | A to Z Pest Solutions', desc: 'Safe and humane honey bee hive removal and relocation in Bangalore. Eco-friendly, no harm to bees. Call 9845559710 for expert bee removal.', canonical: 'https://pestcontrolbengaluru.in/honey-bee-treatment' }}
    image={imgPest} bgImage={bgImage} title="Honey Bee Treatment" tagline="Safe, ethical honey bee removal and hive relocation — protecting people and pollinators alike."
    intro="Honey bees are essential pollinators, but when they build hives near your home, office, or school, they can pose a serious stinging hazard — especially for those allergic to bee stings. A to Z Pest Solutions specializes in safe, humane bee hive removal and relocation. We remove hives without harming the bees wherever possible, relocating colonies to safe environments. Where removal is not feasible, we use targeted bee-safe treatments to disperse the colony."
    signs={['Visible bee hive on walls, trees, or roof','Increased bee activity around entry points','Honey or wax dripping from walls','Bees entering or exiting through cracks','Buzzing sounds inside walls','Bee swarms settling on trees or fences','Bees near children\'s play areas or schools','Bees aggressive near specific areas']}
    benefits={['Ethical, no-harm-to-bees approach wherever possible','Expert hive removal from any height or surface','Same-day emergency service available','No chemical residue on your property','Complete hive comb removal prevents re-infestation','Certified, uniformed bee removal specialists']}
    process={[
      { title: 'Hive Assessment', desc: 'Our specialist assesses the hive size, location, bee species, and accessibility to plan the safest removal approach.' },
      { title: 'Protection Setup', desc: 'Full protective gear is worn and entry areas are secured to ensure the safety of all occupants during removal.' },
      { title: 'Humane Hive Removal', desc: 'The hive is carefully removed from walls, roofs, or trees and the colony is collected for relocation.' },
      { title: 'Colony Relocation', desc: 'Bees are safely transported to an apiary or rural area where they can continue to thrive and pollinate.' },
      { title: 'Comb Removal & Sealing', desc: 'All wax combs are removed and entry holes sealed to prevent future bee colonies from settling in the same spot.' },
    ]}
    faqs={[
      { q: "What are the signs of a honey bee infestation?", a: "Signs include seeing bees flying around, hearing buzzing sounds, or finding a hive or nest." },
      { q: "How do honey bees enter my home?", a: "Bees enter through openings or cracks in walls, windows, or doors." },
      { q: "Are honey bees dangerous?", a: "Yes, honey bees can sting and cause allergic reactions." },
      { q: "How do I get rid of honey bees?", a: "Contact a professional pest control service to safely remove the hive and bees." },
      { q: "Can I treat honey bees myself?", a: "No, self-treatment is not recommended due to the risk of stings and allergic reactions." },
      { q: "How long does honey bee treatment take?", a: "Treatment can take several hours to several days depending on the size of the infestation." },
      { q: "How can I prevent honey bees?", a: "Seal all openings and cracks, install bee screens, and keep food and drinks covered." },
      { q: "What is the difference between honey bees and other bees?", a: "Honey bees are social bees that live in colonies, while other bees are solitary." },
      { q: "Do honey bees die after they sting?", a: "Yes, honey bees die after they sting, while other bees can sting multiple times." },
      { q: "Are honey bees important?", a: "Yes, honey bees are essential for pollination and the ecosystem." }
    ]}
  />
}
