import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/ant.png'
import bgImage from '../../assets/services/bg/cockroach.png'

export default function AntPestControl() {
  return <ServiceDetailPage
    meta={{ title: 'Ant Pest Control in Bangalore | A to Z Pest Solutions', desc: 'Professional ant pest control in Bangalore. Eliminate ant colonies safely and effectively. Fast response and guaranteed results.', canonical: 'https://pestcontrolbengaluru.in/ant-pest-control' }}
    image={imgPest} bgImage={bgImage} title="Ant Pest Control" tagline="Target the colony, eliminate the queen, and stop ant trails for good."
    intro="Ants in Bangalore can quickly become a relentless nuisance, invading kitchens and contaminating food. Because ants live in large colonies, over-the-counter sprays only kill the visible workers, causing the colony to split and spread. At A to Z Pest Solutions, we use advanced baiting systems that worker ants carry back to the nest, effectively eliminating the entire colony, including the queen."
    signs={['Visible ant trails on walls or countertops','Swarmers (winged ants) near windows','Small piles of dirt or frass (sawdust) near skirting boards','Ants congregating around pet food or sugar spills','Rustling noises inside wooden structures (Carpenter Ants)']}
    benefits={['Complete colony eradication, including the queen','Non-toxic, safe baits for kitchens and indoor use','Prevents "budding" (colony splitting) caused by bad sprays','Targeted barrier treatments to block entry points','Long-lasting results and warranties','Expert identification of specific ant species']}
    process={[
      { title: 'Trail Mapping', desc: 'We inspect your property to locate entry points and trace ant trails back to their hidden nests.' },
      { title: 'Strategic Baiting', desc: 'Placement of highly attractive, slow-acting gel baits along active trails for workers to consume.' },
      { title: 'Colony Transfer', desc: 'Workers share the bait with the colony and the queen, leading to total eradication from within.' },
      { title: 'Perimeter Defense', desc: 'Applying a protective residual spray around the exterior to prevent new colonies from invading.' },
      { title: 'Sanitation Advice', desc: 'Expert tips on removing food sources and modifying environments to keep ants away long-term.' },
    ]}
    faqs={[
      { q: 'Why do ants keep coming back after I spray them?', a: 'Store-bought sprays only kill the ants you see and can cause the colony to panic and split into multiple new nests. Our baiting system destroys the root cause: the queen.' },
      { q: 'How long does the bait take to work?', a: 'You will see a significant reduction in ant activity within 48 to 72 hours as the bait is distributed throughout the colony.' },
      { q: 'Is the ant bait safe around my pets?', a: 'Yes, we place baits strategically in crevices or bait stations that are inaccessible to pets, and the toxicity level is extremely low for mammals.' },
    ]}
  />
}
