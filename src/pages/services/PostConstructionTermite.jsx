import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/post_construction.png'
import bgImage from '../../assets/services/bg/termite.png'

export default function PostConstructionTermite() {
  return <ServiceDetailPage
    meta={{ title: 'Post Construction Termite Treatment Bangalore | A to Z Pest Solutions', desc: 'Eradicate existing termites with professional post-construction treatment (Drill-Fill-Seal). Fast, effective termite control in Bangalore.', canonical: 'https://pestcontrolbengaluru.in/post-construction-termite-treatment' }}
    image={imgPest} bgImage={bgImage} title="Post Construction Termite Treatment" tagline="Stop active termite damage with advanced Drill-Fill-Seal technology."
    intro="If termites have already invaded your existing home or office, urgent intervention is required. Since the foundation soil is covered, A to Z Pest Solutions utilizes a specialized 'Drill, Fill, and Seal' method. We inject powerful, CIB-approved termiticides directly into the masonry and soil beneath the flooring, creating a localized chemical barrier that destroys the existing colony and prevents future attacks."
    signs={['Mud tubes climbing up walls or foundations','Hollow-sounding wooden door frames or skirting boards','Discarded termite wings near windowsills','Bubbling paint or crumbling plaster','Visible damage to wooden furniture or books']}
    benefits={['Halts active termite destruction immediately','Protects expensive wooden interiors and furniture','Odorless and safe chemicals used for indoor environments','Restores structural safety','Neat and clean process with exact color-matching seals','Comprehensive warranty on treated areas']}
    process={[
      { title: 'Detailed Inspection', desc: 'Using advanced techniques to map out termite activity, hidden mud tubes, and entry points.' },
      { title: 'Precision Drilling', desc: 'Drilling small 12mm holes at a 45-degree angle along the junction of the walls and floor.' },
      { title: 'Chemical Injection', desc: 'Injecting potent liquid termiticide under high pressure into the holes to saturate the underlying soil.' },
      { title: 'Wood Treatment', desc: 'Treating infested woodwork with specialized anti-termite chemicals to kill active foragers.' },
      { title: 'Sealing', desc: 'Carefully sealing the drilled holes with white cement or matching putty to maintain the aesthetic of your floors.' },
    ]}
    faqs={[
      { q: 'Will drilling damage my floors?', a: 'We use specialized equipment to drill small, precise holes. We seal them neatly afterwards to minimize any visual impact.' },
      { q: 'Is the smell going to be unbearable?', a: 'No, we use modern, highly effective termiticides that are low-odor or completely odorless, making it safe and comfortable for your family.' },
      { q: 'How long does the treatment take?', a: 'Depending on the size of the property, a standard apartment or house treatment takes roughly 3 to 6 hours.' },
    ]}
  />
}
