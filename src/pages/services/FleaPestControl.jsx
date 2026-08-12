import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/flea.png'
import bgImage from '../../assets/services/bg/ticks_fleas.png'

export default function FleaPestControl() {
  return <ServiceDetailPage
    meta={{ title: 'Flea Pest Control in Bangalore | A to Z Pest Solutions', desc: 'Eradicate jumping fleas from your home. Professional flea pest control services in Bangalore for a bite-free environment.', canonical: 'https://pestcontrolbengaluru.in/flea-pest-control' }}
    image={imgPest} bgImage={bgImage} title="Flea Pest Control" tagline="Stop the scratching and eradicate fleas from your home."
    intro="Fleas are tiny, agile insects that survive by feeding on the blood of animals and humans. Their bites cause intense itching and allergic reactions. Because flea pupae can remain dormant in carpets and furniture for months, DIY methods rarely succeed. Our professional flea control service aggressively targets all stages of the flea lifecycle—egg, larva, pupa, and adult—to restore comfort to your home."
    signs={['Intense itching and red, swollen bites on ankles or legs','Pets constantly scratching, licking, or biting their fur','Flea dirt (black specks) in pet bedding or carpets','Seeing tiny, dark insects jumping from the floor','Hair loss or irritated skin on pets']}
    benefits={['Eliminates fleas at all life stages (eggs to adults)','Prevents tapeworms and flea allergy dermatitis','Deep treatment of carpets, upholstery, and crevices','Safe and certified chemical applications','Rapid reduction in flea populations','Comprehensive guidance on maintaining a flea-free home']}
    process={[
      { title: 'Preparation Guidance', desc: 'We advise on vacuuming and washing pet bedding prior to our arrival to maximize treatment efficacy.' },
      { title: 'Thorough Inspection', desc: 'Identifying heavy infestation zones, such as pet resting areas, carpets, and upholstered furniture.' },
      { title: 'Growth Regulator Application', desc: 'Applying Insect Growth Regulators (IGRs) to stop flea larvae from developing into biting adults.' },
      { title: 'Adulticide Treatment', desc: 'Using targeted residual sprays to immediately kill adult fleas.' },
      { title: 'Lifecycle Disruption', desc: 'A follow-up visit to ensure any newly hatched fleas from the resistant pupal stage are destroyed.' },
    ]}
    faqs={[
      { q: "What are tick fleas?", a: "Tick fleas are external parasites that feed on the blood of mammals and birds." },
      { q: "What do tick fleas look like?", a: "Tick fleas are small, flat, and oval-shaped, with a reddish-brown color." },
      { q: "Where are tick fleas found?", a: "Tick fleas are found on pets, wildlife, and in grassy, bushy, or wooded areas." },
      { q: "What are the signs of tick flea infestation?", a: "Signs include excessive scratching, biting, and hair loss on pets, and tiny jumping insects in the home." },
      { q: "How do tick fleas spread?", a: "Tick fleas spread through direct contact with infested animals or contaminated environments." },
      { q: "What health risks do tick fleas pose?", a: "Tick fleas can transmit diseases like typhus, tularemia, and tapeworms to humans and pets." },
      { q: "How to get rid of tick fleas?", a: "Use a combination of medicated shampoos, topical treatments, and environmental cleaning." },
      { q: "Can I treat tick fleas myself?", a: "Self-treatment is possible but often ineffective; professional help is recommended." },
      { q: "How long does tick flea treatment take?", a: "Depends on the infestation level. If the problem is high minimum 2 weeks to fully eliminate the infestation." },
      { q: "How can I prevent tick fleas?", a: "Use preventative medications on pets, avoid tick-prone areas, and keep a clean and clutter-free home." }
    ]}
  />
}
