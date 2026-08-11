import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/pre_construction.png'

export default function PreConstructionTermite() {
  return <ServiceDetailPage
    meta={{ title: 'Pre Construction Termite Treatment Bangalore | A to Z Pest Solutions', desc: 'Protect your new building from termites before it is built. Expert pre-construction termite treatment in Bangalore as per BIS IS 6313.', canonical: 'https://pestcontrolbengaluru.in/pre-construction-termite-treatment' }}
    image={imgPest} title="Pre Construction Termite Treatment" tagline="Build a termite-proof foundation for long-lasting structural integrity."
    intro="Pre-construction anti-termite treatment is the most effective way to protect a new building from subterranean termites. By applying a specialized chemical barrier to the soil before the foundation is laid, A to Z Pest Solutions ensures that termites cannot enter the structure from the ground up. We strictly adhere to the Bureau of Indian Standards (BIS) IS 6313 to guarantee maximum protection."
    signs={['Not applicable (Preventive measure before construction)','High water table or damp soil on site (increases risk)','Proximity to older, termite-infested buildings or trees','Wood-heavy construction plans']}
    benefits={['Creates an impenetrable continuous chemical barrier','Much cheaper than post-construction damage repairs','Prevents structural damage to foundations and masonry','Protects future wooden fixtures and flooring','Long-lasting protection (often 10-15+ years)','Backed by long-term warranties and guarantees']}
    process={[
      { title: 'Trench Treatment', desc: 'Treating the bottom and sides of the foundation trenches with an approved termiticide emulsion.' },
      { title: 'Backfill Treatment', desc: 'Applying chemicals to the earth used to backfill around the foundation pillars and walls.' },
      { title: 'Plinth Level Barrier', desc: 'Treating the top surface of the consolidated earth within the plinth walls before laying the stone bed.' },
      { title: 'Wall/Floor Junctions', desc: 'Specialized heavy application at the critical junction where walls meet the floor to block entry points.' },
      { title: 'External Perimeter', desc: 'Creating a protective chemical ring in the soil around the exterior of the completed building.' },
    ]}
    faqs={[
      { q: 'Why is pre-construction treatment better than post-construction?', a: 'During construction, the soil is completely exposed, allowing us to create a seamless, uniform chemical barrier. Once the building is up, achieving a continuous barrier is much more difficult and involves drilling.' },
      { q: 'Do you follow official standards?', a: 'Yes, we rigorously follow the procedures laid out in BIS IS 6313 (Part 2) using CIB-approved chemicals.' },
      { q: 'Is there a warranty?', a: 'Yes, because of the high efficacy of this method, we offer extensive long-term warranties for pre-construction treatments.' },
    ]}
  />
}
