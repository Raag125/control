import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/mosquito.png'

export default function MosquitoTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Mosquito Treatment in Bangalore | A to Z Pest Solutions', desc: 'Professional mosquito control in Bangalore. Larvicidal and fogging treatments for homes and businesses. Call 9845559710 for FREE inspection.', canonical: 'https://pestcontrolbengaluru.in/mosquito-treatment' }}
    image={imgPest} title="Mosquito Treatment" tagline="Enjoy bite-free evenings. Our mosquito control eliminates breeding grounds and active populations."
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
      { q: 'How long does mosquito treatment last?', a: 'Indoor residual sprays last 2–3 months. Fogging provides immediate relief for 2–4 weeks. We recommend a monthly larvicidal treatment for sustained protection.' },
      { q: 'Is mosquito fogging safe for children and pets?', a: 'Yes. We use WHO-approved formulations. We advise keeping children and pets indoors during treatment and for 1–2 hours post-treatment.' },
    ]}
  />
}
