import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/termite.png'
import bgImage from '../../assets/services/bg/termite.png'

export default function TermiteTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Termite Treatment in Bangalore | A to Z Pest Solutions', desc: 'Expert anti-termite treatment in Bangalore. Drill-fill-seal soil treatment, wood protection & pre/post-construction solutions. 5-year warranty. Call 9845559710 for FREE inspection.', canonical: 'https://pestcontrolbengaluru.in/termite-treatment' }}
    image={imgPest} bgImage={bgImage} title="Termite Treatment" tagline="Termites silently destroy lakhs worth of property. Get a science-backed barrier treatment before it's too late."
    intro="Termites — particularly subterranean species like Coptotermes gestroi and Odontotermes obesus — are responsible for over ₹45,000 crore in property damage annually across India. In Bangalore's humid tropical climate, termite colonies can number in the millions and consume 100 grams of wood per day. At A to Z Pest Solutions, we deploy a CIB-registered termiticide (Bifenthrin 10% EC / Chlorpyrifos 20% EC) using the industry-standard Drill-Fill-Seal (DFS) method — creating a continuous chemical barrier around your entire structure, protecting both foundations and wooden elements for up to 5 years."
    signs={['Hollow-sounding timber when knocked','Mud tubes (shelter tubes) running along walls, pipes, or foundations','Frass — fine, powdery sawdust-like droppings near wood','Discarded termite wings near windows and light sources after rain','Blistered or bubbling paint that feels damp underneath','Sagging floors, loose tiles, or warped door frames','Tiny holes with dirt around them on wooden surfaces','Weak or crumbling wooden furniture legs and panels']}
    benefits={['CIB-registered, WHO-approved termiticide formulations','Drill-Fill-Seal (DFS) method for 100% barrier coverage','5-year warranty on post-construction treatment','10-year warranty on pre-construction soil treatment','Zero disruption — no need to vacate the property','Odorless, non-staining treatment — safe for family and pets','Certified & trained PCAI member technicians','Free annual inspection within warranty period']}
    process={[
      { title: 'Comprehensive Property Inspection', desc: 'Our ISI-trained inspector maps all active termite colonies, mud tubes, entry points, and vulnerable wooden structures using a moisture meter and sounding rod.' },
      { title: 'Customized Treatment Plan', desc: 'We recommend the right combination of soil treatment, wood treatment, and baiting based on infestation severity, construction type, and property layout.' },
      { title: 'Drill-Fill-Seal Soil Treatment', desc: 'Holes are drilled at 12-inch intervals along the perimeter. Termiticide is pressure-injected into the soil and drill holes are sealed with white cement — creating an unbreakable chemical barrier.' },
      { title: 'Wood Surface & Injection Treatment', desc: 'Timber, plywood, and wooden furniture are treated with boron-based wood preservatives or Bifenthrin spray to protect against drywood termite attack.' },
      { title: 'Post-Treatment Certification & Warranty', desc: 'A documented treatment report and official warranty certificate is issued. We schedule free follow-up visits within the warranty period to confirm barrier integrity.' },
    ]}
    faqs={[
      { q: "What is the cost of termite treatment in Bangalore?", a: "Termite treatment costs in Bangalore typically range from ₹3,500 to ₹18,000 depending on property size (sqft), type of construction, and method used (soil treatment vs. wood treatment). Contact us for a free quote." },
      { q: "Which termite species are most common in Bangalore?", a: "The most common species in Bangalore are Subterranean Termites (Coptotermes gestroi) which travel through soil, and Drywood Termites (Cryptotermes spp.) which live inside wooden furniture and structures. Both require different treatment approaches." },
      { q: "How long does termite treatment take?", a: "For an average 2BHK apartment, the Drill-Fill-Seal treatment takes 4–6 hours. Larger properties like villas or commercial buildings may require a full day. Wood treatment adds another 1–2 hours." },
      { q: "Is termite treatment safe for children and pets?", a: "Yes. Once the treatment is applied and the area has dried (approximately 4–6 hours), it is completely safe for children and pets. We use WHO-approved, low-toxicity formulations." },
      { q: "How long does the warranty last?", a: "Our post-construction Drill-Fill-Seal treatment carries a 5-year warranty. Pre-construction soil treatment carries a 10-year warranty. Free re-treatment is provided if termites return within this period." },
      { q: "Can I do termite treatment myself using store-bought chemicals?", a: "Store-bought products only treat surface areas and cannot create the continuous soil barrier needed to prevent subterranean termites. Professional Drill-Fill-Seal treatment is the only scientifically validated method recommended by PCAI and CIB." },
      { q: "Do I need to vacate my home during termite treatment?", a: "No. You do not need to leave your home. The treatment is applied to the structure, floors, and exterior walls. Residents can stay inside. We recommend keeping children and pets in a separate room during active spraying." },
      { q: "How quickly does termite treatment work?", a: "Termiticide barriers take effect immediately upon application. Active colonies in soil contact start dying within 24–48 hours. Full colony elimination typically occurs within 2–4 weeks." },
      { q: "Can termites come back after treatment?", a: "Within the warranty period (5 years), re-infestation is extremely rare due to the continuous chemical barrier. If termite activity is detected, we re-treat free of charge." },
      { q: "What is the difference between pre-construction and post-construction termite treatment?", a: "Pre-construction treatment is applied to the soil and foundation before the structure is built, providing 10-year protection. Post-construction treatment is the Drill-Fill-Seal method applied to existing buildings, providing 5-year protection." },
    ]}
  />
}
