import ServiceDetailPage from './ServiceDetailPage'
export default function TicksFleaTreatment() {
  return <ServiceDetailPage
    meta={{ title: 'Ticks & Fleas Treatment in Bangalore | A to Z Pest Solutions', desc: 'Professional ticks and fleas control in Bangalore. Safe for dogs, cats, and children. Call 9845559710 for FREE inspection and same-day service.', canonical: 'https://pestcontrolbengaluru.in/ticks-fleas-treatment' }}
    emoji="🦗" title="Ticks & Fleas Treatment" tagline="Protect your family and pets from ticks and fleas with our pet-safe, targeted treatment."
    intro="Ticks and fleas are external parasites that infest both pets and homes, causing intense itching, allergic reactions, hair loss in pets, and transmitting dangerous diseases like Lyme disease and typhus. A to Z Pest Solutions provides comprehensive ticks and fleas treatment using pet-safe, WHO-approved formulations — targeting pet bedding, carpets, furniture, garden areas, and all harboring zones to completely break the pest life cycle."
    signs={['Pets scratching excessively','Red, itchy bites on humans or animals','Visible fleas jumping on carpets or furniture','Flea dirt (black specks) in pet fur or bedding','Bald patches or hair loss in pets','Pets shaking their heads frequently','Ticks visible on pet skin after outdoor activity','Allergic reactions in children after pet contact']}
    benefits={['Pet-safe, child-safe formulations used','Covers indoor and outdoor garden areas','Targets all life stages of ticks and fleas','No need to remove pets during treatment','Same-day service available','Post-treatment prevention guidance for pets']}
    process={[
      { title: 'Pet & Home Assessment', desc: 'We inspect pet resting areas, carpets, garden zones, and kennels to map infestation severity.' },
      { title: 'Pet Area Treatment', desc: 'Targeted pet-safe spray applied to pet bedding, kennels, and furniture where pets rest.' },
      { title: 'Indoor Residual Treatment', desc: 'All carpets, rugs, furniture bases, and skirting boards treated to kill fleas in all life stages.' },
      { title: 'Garden & Outdoor Treatment', desc: 'Garden soil, grass, and shaded outdoor areas are treated to eliminate tick harboring zones.' },
      { title: 'Prevention Advice', desc: 'Guidance on regular pet grooming, flea prevention products, and home hygiene to prevent re-infestation.' },
    ]}
    faqs={[
      { q: 'Do I need to take my pets outside during treatment?', a: 'We recommend keeping pets away from treated areas for 2–3 hours. Our formulations are pet-safe once dry, so your pets can return comfortably after that.' },
      { q: 'How many treatments are needed to fully eliminate fleas?', a: 'Most infestations are resolved in 1–2 treatments, as our formulation targets all life stages including eggs and larvae. We offer a free follow-up if needed.' },
    ]}
  />
}
