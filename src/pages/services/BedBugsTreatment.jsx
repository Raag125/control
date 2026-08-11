import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/bed_bug.png'

export default function BedBugsTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Bed Bugs Treatment in Bangalore | A to Z Pest Solutions', desc: 'Professional bed bug treatment in Bangalore. Effective heat and chemical treatment to completely eliminate bed bugs. Call 9845559710 for FREE inspection.', canonical: 'https://pestcontrolbengaluru.in/bed-bugs-treatment' }}
    image={imgPest} title="Bed Bugs Treatment" tagline="Reclaim your sleep. Our targeted treatment eliminates bed bugs from every hidden corner."
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
      { q: 'How many sessions are needed to eliminate bed bugs?', a: 'Most infestations are resolved in 1–2 treatment sessions. Severe infestations may require a third session, included in our guarantee.' },
      { q: 'How long should I stay out of the room after treatment?', a: 'You should stay out for 4–6 hours after treatment. Our technician will advise you on exact timing based on the chemicals used.' },
      { q: 'Can bed bugs come back after treatment?', a: 'If new infested items are brought into the home, re-infestation is possible. We offer prevention advice and a free follow-up treatment within the warranty period.' },
    ]}
  />
}
