import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/termite.png'

export default function TermiteTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Termite Treatment in Bangalore | A to Z Pest Solutions', desc: 'Expert termite treatment in Bangalore. Anti-termite soil treatment, wood treatment, and long-lasting protection. Call 9845559710 for FREE inspection.', canonical: 'https://pestcontrolbengaluru.in/termite-treatment' }}
    image={imgPest} title="Termite Treatment" tagline="Stop termites before they destroy your property's structural integrity and wooden assets."
    intro="Termites are among the most destructive pests in Bangalore, silently feeding on wooden structures, furniture, and flooring — often causing thousands of rupees in damage before being detected. At A to Z Pest Solutions, we use scientifically proven anti-termite treatments including pre-construction soil treatment, post-construction drilling & injection, and surface wood treatment to provide comprehensive protection against both subterranean and drywood termites."
    signs={['Hollow-sounding wood when tapped','Mud tubes along walls or foundations','Discarded wings near windows or doors','Bubbling or uneven paint on walls','Damaged or weakened wooden furniture','Frass (termite droppings) resembling sawdust','Tight-fitting doors and windows suddenly','Visible cracks in wooden structures']}
    benefits={['ISO-certified treatment methods','Odorless, family-safe chemicals used','5-year warranty on pre-construction treatment','30+ years of termite control expertise','Certified, uniformed technicians','Free follow-up inspection included']}
    process={[
      { title: 'Property Inspection', desc: 'Our expert inspects every corner of your property to assess termite activity levels and entry points.' },
      { title: 'Treatment Plan', desc: 'We design a customized termite control strategy based on infestation type and severity.' },
      { title: 'Soil & Wood Treatment', desc: 'Application of termiticide to soil, drilling, and injection into affected wooden areas.' },
      { title: 'Barrier Creation', desc: 'Chemical soil barriers around the foundation prevent future subterranean termite entry.' },
      { title: 'Follow-up Inspection', desc: 'Post-treatment check to confirm complete elimination and provide warranty documentation.' },
    ]}
    faqs={[
      { q: 'How long does termite treatment last?', a: 'Professional termite treatment by A to Z Pest Solutions lasts 5–10 years depending on the method used. We offer a 5-year warranty for pre-construction treatments.' },
      { q: 'Is termite treatment safe for my family and pets?', a: 'Yes. We use WHO-approved, eco-friendly termiticides that are completely safe for humans and pets once dry — typically within 2–4 hours.' },
      { q: 'What is the cost of termite treatment in Bangalore?', a: 'The cost depends on your property size and infestation level. Call us at 9845559710 for a free inspection and transparent quote with no hidden charges.' },
    ]}
  />
}
