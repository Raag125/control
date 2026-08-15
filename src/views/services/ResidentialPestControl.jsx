import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/residential.png'
import bgImage from '../../assets/services/bg/residential.png'

export default function ResidentialPestControl() {
  return <ServiceDetailPage
    meta={{ title: 'Residential Pest Control in Bangalore | A to Z Pest Solutions', desc: 'Comprehensive residential pest control in Bangalore. Protect your home and family from cockroaches, termites, rodents, mosquitoes, and bed bugs. Safe & eco-friendly.' }}
    image={imgPest} bgImage={bgImage} title="Residential Pest Control" tagline="Protect your home and family with comprehensive, eco-friendly pest management."
    intro="Your home should be your safe haven, not a breeding ground for pests. At A to Z Pest Solutions, we offer complete residential pest control services tailored to Bangalore's unique climate. From eradicating cockroaches in the kitchen to stopping silent destroyers like termites, we use advanced, low-toxicity treatments that are completely safe for children and pets."
    signs={['Cockroach droppings in kitchen cabinets','Unexplained itchy bites from bed bugs or mosquitoes','Hollow-sounding wood or mud tubes (termites)','Scratching noises in walls or ceilings (rodents)','Visible ant trails near food sources']}
    benefits={['Safe for children, pregnant women, and pets','Eco-friendly, WHO-approved chemicals','Long-term prevention, not just a quick fix','Odorless and hassle-free treatments','Warranties on most services','Trained & background-verified technicians']}
    process={[
      { title: 'Detailed Inspection', desc: 'We survey your entire home to identify pest entry points, breeding sites, and the severity of the infestation.' },
      { title: 'Customized Treatment Plan', desc: 'A targeted action plan using gels, baits, or sprays depending on the specific pests found.' },
      { title: 'Targeted Execution', desc: 'Application of eco-friendly, odorless treatments focusing on hotspots like kitchens and bathrooms.' },
      { title: 'Prevention Advice', desc: 'We provide actionable tips on hygiene and sealing entry points to prevent future infestations.' },
      { title: 'Follow-up Service', desc: 'Re-inspection and secondary treatments as needed to ensure complete eradication.' },
    ]}
    faqs={[
      { q: 'Is it safe for my kids and pets?', a: 'Absolutely. We use specialized, low-toxicity, and often organic treatments that are 100% safe for your family and pets.' },
      { q: 'Do I need to leave my home during the treatment?', a: 'For most residential services like gel baiting for cockroaches, you do not need to leave. For intensive treatments like fumigation, we may ask you to vacate for 2-4 hours.' },
      { q: 'How often should I get my home treated?', a: 'We recommend a general pest control service every 3-4 months to keep your home completely pest-free year-round.' },
    ]}
  />
}
