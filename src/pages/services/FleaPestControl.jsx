import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/flea.png'

export default function FleaPestControl() {
  return <ServiceDetailPage
    meta={{ title: 'Flea Pest Control in Bangalore | A to Z Pest Solutions', desc: 'Eradicate jumping fleas from your home. Professional flea pest control services in Bangalore for a bite-free environment.', canonical: 'https://pestcontrolbengaluru.in/flea-pest-control' }}
    image={imgPest} title="Flea Pest Control" tagline="Stop the scratching and eradicate fleas from your home."
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
      { q: 'Why is vacuuming important before the treatment?', a: 'Vacuuming stimulates dormant flea pupae to hatch, making them susceptible to our chemical treatment. It also removes eggs and organic debris.' },
      { q: 'Will one treatment be enough?', a: 'Because flea pupae are highly resistant to chemicals, a follow-up treatment is often required 10-14 days later to kill newly hatched adults.' },
      { q: 'Are the chemicals safe for my indoor cats?', a: 'Yes, once the applied treatment is fully dry. We provide strict safety instructions regarding when your pets can safely re-enter the treated areas.' },
    ]}
  />
}
