import ServiceDetailPage from './ServiceDetailPage'
import imgPest from '../../assets/services/commercial.png'
import bgImage from '../../assets/services/bg/rodent.png'

export default function CommercialPestControl() {
  return <ServiceDetailPage
    meta={{ title: 'Commercial Pest Control in Bangalore | A to Z Pest Solutions', desc: 'Reliable commercial pest control for offices, restaurants, and warehouses in Bangalore. Ensure compliance and protect your business reputation.', canonical: 'https://pestcontrolbengaluru.in/commercial-pest-control' }}
    image={imgPest} bgImage={bgImage} title="Commercial Pest Control" tagline="Ensure health, safety, and regulatory compliance for your business."
    intro="A pest infestation can severely damage your brand's reputation, disrupt operations, and lead to regulatory fines. A to Z Pest Solutions provides specialized commercial pest control for businesses in Bangalore, including offices, restaurants, hospitals, and retail spaces. We offer proactive Annual Maintenance Contracts (AMCs) to keep your premises hygienic and compliant with health standards."
    signs={['Pest sightings by employees or customers','Damaged inventory, packaging, or electrical wiring','Droppings or smear marks in storage areas','Failing health inspections or audits','Unpleasant odors in hidden areas']}
    benefits={['FSSAI & FDA compliance support','Flexible scheduling (after-hours/weekends)','Digital reports and service logs for audits','Protection of assets, inventory, and reputation','Tailored Annual Maintenance Contracts (AMCs)','Discreet and professional service']}
    process={[
      { title: 'Thorough Site Audit', desc: 'Comprehensive inspection to identify high-risk zones, structural vulnerabilities, and current pest activity.' },
      { title: 'Tailored Management Plan', desc: 'Developing a strategy that aligns with your industry regulations (e.g., food safety standards).' },
      { title: 'Proactive Treatment', desc: 'Using bait stations, exclusion methods, and controlled chemical applications to eliminate pests.' },
      { title: 'Monitoring & Documentation', desc: 'Continuous monitoring with detailed service reports to keep your compliance records updated.' },
      { title: 'Preventive Maintenance', desc: 'Regular scheduled visits to proactively stop infestations before they impact your business.' },
    ]}
    faqs={[
      { q: 'Can you treat my restaurant without disrupting service?', a: 'Yes. We offer flexible scheduling, including after-hours and weekend services, to ensure zero disruption to your daily operations.' },
      { q: 'Do you provide documentation for health audits?', a: 'Absolutely. We provide detailed digital reports, service logs, and compliance certificates necessary for FSSAI and other regulatory audits.' },
      { q: 'What industries do you serve?', a: 'We serve a wide range of commercial clients, including F&B, hospitality, healthcare, IT parks, warehousing, and retail.' },
    ]}
  />
}
