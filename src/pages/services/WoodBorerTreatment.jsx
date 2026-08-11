import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/wood_borer.png'

export default function WoodBorerTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Wood Borer Treatment in Bangalore | A to Z Pest Solutions', desc: 'Expert wood borer treatment in Bangalore. Protect furniture and wooden structures from wood-boring beetles. Call 9845559710 for FREE inspection.', canonical: 'https://pestcontrolbengaluru.in/wood-borer-treatment' }}
    image={imgPest} title="Wood Borer Treatment" tagline="Preserve the life and beauty of your wooden furniture and structures from destructive wood borers."
    intro="Wood borers are beetles whose larvae bore deep into timber, furniture, and wooden structural elements — causing extensive internal damage that often goes undetected until the wood collapses. A to Z Pest Solutions provides specialized wood borer treatment using insecticide injection into flight holes, surface treatment sprays, and fumigation for severely affected items — protecting your valuable wooden investments and structural woodwork."
    signs={['Small, round holes in wooden furniture or floors','Fine powder (frass) falling from wooden items','Weakened, hollow-sounding wood','Adult beetles emerging from wood','Sawdust-like material near wooden furniture','Crumbling or damaged wooden edges','Gallery tunnels visible in cross-sections of wood','Squeaking floorboards that previously were silent']}
    benefits={['Insecticide injection directly into flight holes','Surface spray treatment for lasting protection','Safe for varnished and polished furniture','No disassembly of furniture required','Targets larvae, pupae, and adult beetles','10-year protection warranty on treated wood']}
    process={[
      { title: 'Wood Damage Assessment', desc: 'Our specialist inspects all wooden furniture, flooring, and structural timber to assess infestation extent and beetle species.' },
      { title: 'Flight Hole Injection', desc: 'Specialized insecticide is injected directly into every visible flight hole to reach larvae deep inside the wood.' },
      { title: 'Surface Spray Application', desc: 'Residual insecticide spray is applied to all wood surfaces to kill emerging adult beetles and prevent new egg-laying.' },
      { title: 'Fumigation (if required)', desc: 'Severely infested items may be fumigated in a sealed environment for complete colony elimination.' },
      { title: 'Sealing & Protection', desc: 'Treated wood is sealed and recommendations given for wax or polish application to prevent future infestations.' },
    ]}
    faqs={[
      { q: 'Can wood borer treatment save already damaged furniture?', a: 'Yes — if treated in time. While already-created tunnels cannot be restored, treatment stops further damage and protects the remaining wood structure completely.' },
      { q: 'Is wood borer treatment safe for antique or polished furniture?', a: 'Absolutely. We use formulations specifically safe for varnished and polished surfaces. Our technicians are trained to handle antique and heritage wood items carefully.' },
    ]}
  />
}
