import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/termite.png'
import bgImage from '../../assets/services/bg/termite.png'

export default function TermiteTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Termite Treatment in Bangalore | A to Z Pest Solutions', desc: 'Expert termite treatment in Bangalore. Anti-termite soil treatment, wood treatment, and long-lasting protection. Call 9845559710 for FREE inspection.', canonical: 'https://pestcontrolbengaluru.in/termite-treatment' }}
    image={imgPest} bgImage={bgImage} title="Termite Treatment" tagline="Stop termites before they destroy your property's structural integrity and wooden assets."
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
      { q: "What are the signs of termite infestation?", a: "Signs of termite infestation include mud tubes on walls, damaged wood, and discarded wings." },
      { q: "How do termites enter homes?", a: "Termites enter homes through soil, wood, and other materials." },
      { q: "What are the types of termite treatments?", a: "Types of termite treatments include soil treatment, wood treatment, and baiting." },
      { q: "How long does termite treatment take?", a: "Termite treatment can take several hours to several days depending on the severity of the infestation and also the total area." },
      { q: "Is termite treatment safe for my family and pets?", a: "Yes, termite treatment is safe for your family and pets when done by a professional." },
      { q: "How much does termite treatment cost?", a: "The cost of termite treatment varies depending on the size of the area and severity of the infestation." },
      { q: "What is the warranty for termite treatment?", a: "The warranty for termite treatment varies depending on the company and type of treatment." },
      { q: "Can I do termite treatment myself?", a: "No, termite treatment requires professional expertise and equipment." },
      { q: "How often should I get termite treatment done?", a: "Termite treatment should be done annually or as recommended by a professional." },
      { q: "What are the benefits of termite treatment?", a: "Benefits of termite treatment include protection of your home, prevention of structural damage, and peace of mind." }
    ]}
  />
}
