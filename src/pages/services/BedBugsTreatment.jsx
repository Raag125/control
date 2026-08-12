import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/bed_bug.png'
import bgImage from '../../assets/services/bg/bedbug.png'

export default function BedBugsTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Bed Bugs Treatment in Bangalore | A to Z Pest Solutions', desc: 'Professional bed bug treatment in Bangalore. Effective heat and chemical treatment to completely eliminate bed bugs. Call 9845559710 for FREE inspection.', canonical: 'https://pestcontrolbengaluru.in/bed-bugs-treatment' }}
    image={imgPest} bgImage={bgImage} title="Bed Bugs Treatment" tagline="Reclaim your sleep. Our targeted treatment eliminates bed bugs from every hidden corner."
    intro="Bed bugs are resilient, nocturnal pests that feed on human blood, causing itchy welts, sleepless nights, and intense anxiety. A to Z Pest Solutions employs a combination of steam heat treatment and specialized insecticide application to eliminate bed bug infestations from mattresses, bed frames, headboards, sofas, and all other harboring spots — ensuring you get a good night's sleep again."
    signs={['Red, itchy welts appearing after sleep','Small bloodstains on bed sheets','Dark rust-colored fecal spots on mattress','Musty, sweet odor in bedroom','Live bugs in mattress seams or crevices','Shed exoskeletons on furniture','Eggs or eggshells in hidden crevices','Visible bugs in bed frame joints']}
    benefits={['100% elimination guarantee','Steam and chemical dual treatment','Child-safe, odorless formulations','Experienced, certified technicians','Free follow-up if bugs return','Same-day service available']}
    process={[
      { title: 'Thorough Inspection', desc: 'We identify all infestation zones — mattresses, sofas, curtains, electrical sockets, and furniture joints.' },
      { title: 'Preparation Guidance', desc: 'Our team guides you on how to prepare rooms for maximum treatment effectiveness.' },
      { title: 'Steam Heat Application', desc: 'High-temperature steam is applied to kill bugs, eggs, and nymphs in mattresses and upholstery.' },
      { title: 'Chemical Treatment', desc: 'Residual insecticide is applied to all harboring areas and wall crevices for lasting protection.' },
      { title: 'Post-Treatment Review', desc: 'Follow-up visit within 2 weeks to confirm complete elimination and re-treat if needed.' },
    ]}
    faqs={[
      { q: "What are bed bugs?", a: "Bed bugs are small, flat, parasitic insects that feed on human blood." },
      { q: "What do bed bugs look like?", a: "Adult bed bugs are reddish-brown, about 4-5 mm long, and have six legs." },
      { q: "What are the signs of bed bugs?", a: "Signs include small red bites, blood spots on sheets, and live bugs in cracks and crevices." },
      { q: "Where are bed bugs found?", a: "Bed bugs are found in mattresses, beds, furniture, carpets, and behind walls" },
      { q: "How do bed bugs spread?", a: "Bed bugs spread through human travel, used furniture, and nearby infestations." },
      { q: "What health risks do bed bugs pose?", a: "Bed bugs can cause skin irritation, allergic reactions, and mental stress." },
      { q: "How to get rid of bed bugs?", a: "Use a combination of cleaning, laundering, and professional pest control services." },
      { q: "Can I treat bed bugs myself?", a: "Self-treatment is possible but often ineffective; professional help is recommended." },
      { q: "How long does bed bug treatment take?", a: "Treatment can take several visits and several weeks to fully eliminate the infestation." },
      { q: "How can I prevent bed bugs?", a: "Inspect second-hand items, use mattress encasements, and keep a clean and clutter-free home." }
    ]}
  />
}
