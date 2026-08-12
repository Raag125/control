import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/mosquito.png'
import bgImage from '../../assets/services/bg/mosquito.png'

export default function MosquitoTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Mosquito Treatment in Bangalore | A to Z Pest Solutions', desc: 'Professional mosquito control in Bangalore. Larvicidal and fogging treatments for homes and businesses. Call 9845559710 for FREE inspection.', canonical: 'https://pestcontrolbengaluru.in/mosquito-treatment' }}
    image={imgPest} bgImage={bgImage} title="Mosquito Treatment" tagline="Enjoy bite-free evenings. Our mosquito control eliminates breeding grounds and active populations."
    intro="Mosquitoes in Bangalore are not just a nuisance — they are carriers of life-threatening diseases including Dengue, Malaria, Chikungunya, and Zika. A to Z Pest Solutions employs a dual-action approach: larvicidal treatment to destroy breeding grounds in stagnant water, and ULV (Ultra Low Volume) fogging to eliminate adult mosquito populations — providing comprehensive protection for your home, garden, and commercial premises."
    signs={['Persistent mosquito bites indoors or outdoors','Buzzing sounds near ears at night','Visible mosquito larvae in stagnant water','Standing water in pots, drains, or gutters','High mosquito activity during dusk and dawn','Dengue or malaria cases in your neighborhood','Water cooler or AC drainage not cleaned regularly','Garden or terrace with waterlogged areas']}
    benefits={['Larvicidal treatment destroys breeding sites','ULV fogging kills adult mosquitoes instantly','WHO-approved, DEET-free formulations','Safe for children and pets post-treatment','Covers indoor and outdoor areas','Service available for homes, offices, and events']}
    process={[
      { title: 'Breeding Site Survey', desc: 'Identification of all stagnant water sources — drains, coolers, plant pots, rooftops, and construction areas.' },
      { title: 'Larvicidal Treatment', desc: 'Application of biological or chemical larvicides to destroy mosquito eggs and larvae in breeding zones.' },
      { title: 'ULV Fogging', desc: 'Ultra-low volume fogging kills adult mosquitoes in garden areas, exterior walls, and outdoor spaces.' },
      { title: 'Indoor Residual Spray', desc: 'Targeted indoor spray treatment on walls, curtains, and dark resting areas of mosquitoes.' },
      { title: 'Source Reduction Advice', desc: 'Practical guidance on eliminating water collection points to prevent future mosquito breeding.' },
    ]}
    faqs={[
      { q: "What are the signs of a mosquito infestation?", a: "Signs include seeing mosquitoes flying around, hearing their buzzing, or finding larvae in standing water." },
      { q: "How do mosquitoes enter my home?", a: "Mosquitoes enter through open windows, doors, or cracks in screens." },
      { q: "Are mosquitoes dangerous?", a: "Yes, mosquitoes can transmit diseases like Zika, dengue, chikungunya, and malaria." },
      { q: "How do I get rid of mosquitoes?", a: "Use a combination of eliminating standing water, using mosquito traps, and applying insecticides." },
      { q: "Can I treat mosquitoes myself?", a: "Self-treatment is possible but often ineffective; professional help is recommended." },
      { q: "How long does mosquito treatment take?", a: "Treatment can take several weeks to several months depending on the severity of the infestation." },
      { q: "How can I prevent mosquitoes?", a: "Eliminate standing water, use screens, wear repellent, and plant mosquito-repelling plants." },
      { q: "Are mosquitoes attracted to certain colors?", a: "Yes, mosquitoes are attracted to dark colors, especially black." },
      { q: "Can mosquitoes transmit diseases to animals?", a: "Yes, mosquitoes can transmit diseases like heartworms to animals." }
    ]}
  />
}
