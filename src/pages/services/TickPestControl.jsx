import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/tick.png'

export default function TickPestControl() {
  return <ServiceDetailPage
    meta={{ title: 'Tick Pest Control in Bangalore | A to Z Pest Solutions', desc: 'Protect your family and pets from dangerous tick-borne diseases. Expert tick pest control services in Bangalore.', canonical: 'https://pestcontrolbengaluru.in/tick-pest-control' }}
    image={imgPest} title="Tick Pest Control" tagline="Keep your pets and family safe from disease-carrying ticks."
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
      { q: 'Can you treat my dog/cat for ticks?', a: 'We treat your home and garden to eliminate the tick environment. You must consult a veterinarian for direct treatment on your pet.' },
      { q: 'How long should pets stay away after treatment?', a: 'Pets and children should be kept away from treated areas until the spray has completely dried, usually about 2-4 hours.' },
      { q: 'Why do I need outdoor treatment as well?', a: 'Ticks usually originate outdoors in tall grass or shrubs. Treating the exterior prevents them from re-entering your home.' },
    ]}
  />
}
