'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import CTABanner from '../sections/CTABanner'
import './PageStyles.css'

const FAQ_DATA = [
  {
    category: 'General',
    items: [
      { q: 'What pest control services do you provide in Bangalore?', a: 'We provide professional pest control services for residential and commercial properties across Bangalore. Our services include bed bug treatment, termite control, cockroach control, rodent control, mosquito control, ant control, spider control, lizard control, bee and wasp removal, post-construction anti-termite treatment, pre-construction anti-termite treatment, and annual pest management services. Every treatment is carried out by trained technicians using approved methods tailored to the type of pest and level of infestation.' },
      { q: 'Which areas of Bangalore do you serve?', a: 'We serve most major residential and commercial areas across Bangalore, including Whitefield, Electronic City, HSR Layout, Koramangala, Indiranagar, Jayanagar, JP Nagar, Yelahanka, Hebbal, Marathahalli, Bellandur, Banashankari, Rajajinagar, Malleshwaram, RT Nagar, Kalyan Nagar, Sarjapur Road, and many other nearby localities. Contact us to confirm service availability in your area.' },
      { q: 'Are your technicians licensed and trained?', a: 'Yes. Our technicians receive professional training in pest identification, treatment procedures, safety practices, and the correct application of pest management products. They also use appropriate safety equipment while performing treatments.' },
      { q: 'How can I keep my home pest-free throughout the year?', a: 'Keeping your home pest-free requires regular cleaning, proper waste disposal, sealing cracks and gaps, repairing water leaks, storing food in airtight containers, reducing clutter, and scheduling preventive pest control inspections. Simple maintenance can significantly reduce the chances of future infestations.' },
      { q: 'Does regular cleaning eliminate pests completely?', a: 'Regular cleaning plays an important role in preventing pest problems, but it may not eliminate established infestations. Many pests hide inside walls, ceilings, furniture, drains, and other inaccessible areas. Professional pest control provides a more comprehensive solution when infestations occur.' },
      { q: 'Can gardens and landscaping attract pests?', a: 'Yes. Overgrown vegetation, standing water, firewood, compost piles, and excessive moisture around gardens can attract termites, mosquitoes, ants, rodents, and other pests. Proper landscaping maintenance helps reduce these risks.' },
      { q: 'Why should I choose professional pest control instead of DIY products?', a: 'Professional pest control offers accurate pest identification, customised treatment plans, specialised equipment, and experienced technicians who know where pests hide and how to manage infestations effectively. DIY products may provide temporary relief but often fail to address the root cause of the problem.' },
      { q: 'How do I choose the best pest control company in Bangalore?', a: 'When selecting a pest control company, consider the following: Choose an experienced and established company. Ensure technicians are trained and qualified. Read genuine customer reviews and ratings. Ask about the treatment process and safety precautions. Request transparent pricing with no hidden charges. Check whether follow-up support or warranties are available. Select a company that offers solutions tailored to your specific pest problem rather than a one-size-fits-all approach. A reliable pest control provider should focus on effective treatment, customer satisfaction, and long-term pest prevention.' },
      { q: 'What are the most common pests during Bangalore\'s monsoon season?', a: 'During the monsoon, increased moisture often leads to higher activity from termites, cockroaches, mosquitoes, ants, rodents, flies, and other crawling insects. Preventive pest control before and during the rainy season can help minimise infestations.' },
      { q: 'What attracts pests to a property?', a: 'Pests are attracted by food, water, moisture, shelter, clutter, overflowing bins, uncovered food, leaking pipes, and unsealed entry points. Maintaining good hygiene and addressing these conditions helps reduce pest activity.' }
    ],
  },
  {
    category: 'Booking & Pricing',
    items: [
      { q: 'How do I book a pest control service?', a: 'Booking a service is simple. You can call our customer support team, submit an enquiry through our website, or send us a WhatsApp message. After understanding your pest problem, we\'ll schedule a convenient inspection or treatment appointment.' },
      { q: 'Do you offer same-day pest control in Bangalore?', a: 'Yes. Depending on technician availability and your location, we strive to provide same-day pest control services for urgent infestations. Early booking improves the chances of receiving same-day assistance.' },
      { q: 'How much does pest control cost in Bangalore?', a: 'The cost depends on several factors, including the type of pest, property size, infestation level, and treatment method. After understanding your requirements or conducting a site inspection, we provide a transparent quotation with no hidden charges.' },
      { q: 'How can I request a free inspection?', a: 'You can request an inspection by calling our customer support team, submitting the enquiry form on our website, or contacting us through WhatsApp. We\'ll collect basic information about your pest problem and arrange an inspection at a convenient time.' },
      { q: 'Which payment methods do you accept?', a: 'We accept multiple payment methods, including UPI, bank transfer, debit cards, credit cards, cash, and other commonly used digital payment options. Our team will confirm the available payment methods when your service is booked.' },
      { q: 'Can I reschedule my appointment?', a: 'Yes. If your plans change, please contact us as early as possible to reschedule your appointment. We\'ll do our best to arrange another suitable date and time based on technician availability.' },
      { q: 'Do you provide emergency pest control services?', a: 'Yes. We offer emergency pest control assistance for urgent pest problems whenever possible. Response times depend on your location, technician availability, and the type of pest involved.' },
      { q: 'How quickly can your technician arrive?', a: 'In many cases, we can schedule a technician on the same day or the next available day. Arrival time depends on your location within Bangalore, current bookings, and traffic conditions.' },
      { q: 'How do I contact customer support?', a: 'You can reach our customer support team by phone, WhatsApp, email, or through the contact form on our website. Our team will be happy to answer your questions, schedule appointments, and provide information about our pest control services.' }
    ],
  },
  {
    category: 'Treatment & Safety',
    items: [
      { q: 'Is pest control safe for children and pets?', a: 'Our technicians follow recommended application procedures and use products approved for professional pest control. Depending on the type of treatment, you may be advised to avoid treated areas for a short period. Our team will provide clear pre-treatment and post-treatment instructions to help ensure safety.' },
      { q: 'How long does a pest control treatment take?', a: 'The treatment duration depends on the type of pest, the size of the property, and the severity of the infestation. Most residential treatments take between 30 minutes and 2 hours, while larger commercial projects may require additional time.' },
      { q: 'How often should pest control be done?', a: 'For most homes, preventive pest control every 3 to 6 months helps keep common pests under control. Commercial establishments such as restaurants, hotels, warehouses, and food businesses may require more frequent inspections and treatments based on their operational needs.' },
      { q: 'Do I need to leave my home during treatment?', a: 'This depends on the type of pest control service being performed. Some treatments allow occupants to remain in the property, while others may require temporary vacating of the treated area. Our technician will explain any precautions before the service begins.' },
      { q: 'What should I do before the pest control visit?', a: 'Before the technician arrives, it\'s helpful to: Remove food items from open surfaces, cover utensils if instructed, keep children and pets away from the work area, provide easy access to affected rooms, and inform the technician about any specific pest activity you\'ve noticed.' },
      { q: 'What should I do after pest control treatment?', a: 'After treatment, follow the technician\'s instructions carefully. Avoid cleaning treated surfaces immediately unless advised otherwise, maintain good hygiene, fix water leaks, store food properly, and reduce clutter that may attract pests. Following these recommendations improves treatment effectiveness.' },
      { q: 'Do you provide follow-up support after treatment?', a: 'Yes. We provide free follow-up visits for most treatments if pests return after the initial service. Our team will explain the post-treatment support included before beginning the work.' },
      { q: 'Will I receive a treatment report after the service?', a: 'Yes. After completing the treatment, our technician can provide details about the work performed, the pest identified, recommendations for preventing future infestations, and any post-treatment instructions that should be followed.' },
      { q: 'How often should I schedule preventive pest control?', a: 'For most homes, preventive pest control every 3 to 6 months is recommended. Commercial properties such as restaurants, hotels, warehouses, and food businesses may require more frequent visits depending on their operations and pest risk.' },
      { q: 'Should I book pest control before moving into a new house?', a: 'Yes. Booking pest control before moving into a new home is a good preventive measure. Treating an empty property allows technicians easier access to all areas and helps address any hidden pest activity before your belongings are moved in.' }
    ],
  },
  {
    category: 'Residential & Commercial',
    items: [
      { q: 'Do you offer residential and commercial pest control?', a: 'Yes. We provide customised pest control solutions for homes, apartments, villas, offices, restaurants, hotels, hospitals, schools, warehouses, factories, retail stores, and other commercial properties throughout Bangalore.' },
      { q: 'Do you provide pest control for apartments and villas?', a: 'Absolutely. Whether you live in a studio apartment, a multi-bedroom flat, an independent house, or a luxury villa, we offer pest control services designed to suit different property sizes and pest problems.' },
      { q: 'Do you provide pest control for offices?', a: 'Yes. We provide customised pest management solutions for offices of all sizes. Our services help control common pests such as cockroaches, rodents, ants, termites, and mosquitoes while minimising disruption to your daily business operations.' },
      { q: 'Can you service restaurants and hotels?', a: 'Yes. Restaurants, cafés, hotels, bakeries, and other hospitality businesses require regular pest management to maintain hygiene standards. We offer scheduled treatments designed to help businesses maintain clean and pest-free environments.' },
      { q: 'Do you offer Annual Pest Management Contracts (AMC)?', a: 'Yes. We offer Annual Pest Management Contracts (AMC) for residential, commercial, and industrial properties. An AMC includes scheduled inspections, preventive treatments, monitoring, and professional support throughout the year. Regular maintenance helps reduce the likelihood of major pest infestations while providing greater peace of mind.' },
      { q: 'Can pest control services be scheduled after business hours?', a: 'Yes. We understand that many businesses prefer pest control services outside normal working hours to minimise disruption. Depending on availability, we can schedule treatments during evenings, weekends, or other convenient times.' },
      { q: 'Do you provide pest control for warehouses and industrial facilities?', a: 'Yes. We provide customised pest management solutions for warehouses, factories, manufacturing units, logistics centres, and industrial facilities. Our technicians inspect the premises, identify pest risks, and recommend suitable treatment and monitoring plans based on the type of facility.' }
    ],
  },
  {
    category: 'Bed Bugs',
    items: [
      { q: 'What are the signs of a bed bug infestation?', a: 'Common signs include itchy bite marks, tiny blood stains on bedsheets, dark faecal spots on mattresses, shed bed bug skins, small white eggs, and live bed bugs hiding in mattress seams, furniture joints, headboards, and nearby cracks.' },
      { q: 'How do bed bugs enter a home?', a: 'Bed bugs often enter homes by hitchhiking on luggage, clothing, second-hand furniture, mattresses, or other personal belongings. They can also spread between neighbouring apartments through wall gaps, electrical conduits, and plumbing lines.' },
      { q: 'Can bed bugs spread from one apartment to another?', a: 'Yes. Bed bugs are capable of moving through wall voids, electrical outlets, pipe openings, and shared building structures. This is why apartment infestations should be addressed promptly to minimise the risk of spreading to neighbouring units.' },
      { q: 'Are bed bugs harmful to humans?', a: 'Bed bugs are not known to transmit diseases, but their bites can cause itching, skin irritation, allergic reactions, and sleep disturbances. A prolonged infestation may also lead to stress and discomfort for occupants.' },
      { q: 'Can I remove bed bugs myself?', a: 'DIY sprays and home remedies may reduce visible bed bugs but often fail to eliminate hidden eggs and insects deep inside furniture and wall cracks. Professional treatment is generally more effective because it targets the entire infestation using proven inspection and treatment methods.' },
      { q: 'How many bed bug treatments are usually required?', a: 'The number of treatments depends on the severity of the infestation, the size of the property, and how long the bed bugs have been present. Minor infestations may be controlled in fewer visits, while larger or long-standing infestations may require follow-up treatments. Our technicians will inspect your property and recommend the most suitable treatment plan.' },
      { q: 'How long does a bed bug treatment take?', a: 'Most residential bed bug treatments take between 1 to 3 hours, depending on the number of rooms and the level of infestation. Larger homes, villas, hotels, or commercial properties may require additional time to ensure thorough treatment.' },
      { q: 'Will bed bugs return after treatment?', a: 'A professionally carried out treatment significantly reduces the infestation. However, bed bugs can be reintroduced through luggage, second-hand furniture, or travel. Following the technician\'s recommendations and maintaining good hygiene can help minimise the risk of future infestations.' },
      { q: 'Is your bed bug treatment safe for children and pets?', a: 'Our technicians use professional treatment methods and follow recommended safety procedures. Depending on the treatment performed, you may be advised to keep children and pets away from treated areas for a short period. We will provide clear safety instructions before and after the service.' },
      { q: 'Should I throw away my mattress if I have bed bugs?', a: 'Not necessarily. In many cases, a mattress can be treated successfully without being discarded. Throwing away furniture should only be considered if it is severely damaged or cannot be effectively treated. Our technician will advise you after inspecting the infestation.' }
    ],
  },
  {
    category: 'Termites',
    items: [
      { q: 'What are the early signs of termites?', a: 'Common signs include mud tubes along walls, hollow-sounding wood, damaged wooden furniture, discarded wings near windows, tight-fitting doors or windows, and small piles of termite droppings. Scheduling an inspection as soon as these signs appear can help prevent further damage.' },
      { q: 'How quickly can termites damage a property?', a: 'Termites work continuously and can cause significant damage if left untreated. Since they often remain hidden inside walls, floors, or wooden structures, damage may go unnoticed until it becomes extensive. Early detection and professional treatment are essential.' },
      { q: 'Do you provide pre-construction termite treatment?', a: 'Yes. We offer pre-construction anti-termite treatment for residential and commercial construction projects. The treatment creates a protective barrier beneath the building before construction is completed, helping prevent termite entry in the future.' },
      { q: 'What is post-construction termite treatment?', a: 'Post-construction termite treatment is carried out after a building has already been completed. It involves treating affected areas and creating protective barriers around the structure using specialised application techniques to help control active termite infestations.' },
      { q: 'How long does termite treatment last?', a: 'The longevity of termite treatment depends on factors such as soil conditions, construction type, moisture levels, and the treatment method used. Regular inspections help ensure continued protection and allow early detection of any new termite activity.' },
      { q: 'Can termites come back after treatment?', a: 'Professional termite treatment greatly reduces termite activity, but new colonies can develop over time in surrounding areas. Regular inspections, good property maintenance, and prompt attention to moisture problems help minimise the chances of reinfestation.' },
      { q: 'Is termite treatment safe?', a: 'Yes. Professional termite treatments are carried out by trained technicians using approved products and recommended application procedures. Our team also provides guidance on any precautions you should follow before and after treatment.' },
      { q: 'Do termites only attack wood?', a: 'No. While termites feed primarily on wood and other cellulose-based materials, they can also damage paper products, cardboard, wooden flooring, books, and certain decorative materials. They may even travel through concrete cracks to reach wooden structures inside a building.' },
      { q: 'How much does termite treatment cost?', a: 'The cost varies depending on the property size, treatment area, type of infestation, and whether the treatment is for a residential or commercial property. After inspecting the site, we provide a detailed quotation based on your specific requirements.' },
      { q: 'When should I schedule a termite inspection?', a: 'It\'s a good idea to arrange a termite inspection if you notice signs of termite activity, are purchasing a property, are renovating a home, or are planning a new construction project. Annual inspections are also recommended for long-term protection.' },
      { q: 'How can I reduce the risk of termite infestation around my home?', a: 'Reduce termite risk by fixing water leaks, avoiding direct wood-to-soil contact, removing tree stumps and wooden debris, maintaining proper drainage, and scheduling regular termite inspections. If you\'re building a new property, consider pre-construction anti-termite treatment for long-term protection.' }
    ],
  },
  {
    category: 'Cockroaches',
    items: [
      { q: 'Why do cockroaches keep coming back?', a: 'Cockroaches return when they continue to find food, water, and shelter. Common causes include food crumbs, leaking pipes, overflowing bins, cluttered storage areas, and untreated hiding places. Regular cleaning combined with professional pest control helps reduce recurring infestations.' },
      { q: 'Which cockroach species are common in Bangalore?', a: 'The most commonly encountered species include the German cockroach, American cockroach, Oriental cockroach, and Brown-banded cockroach. Each species behaves differently, so correct identification helps determine the most effective treatment approach.' },
      { q: 'How long does cockroach treatment take?', a: 'Most residential cockroach treatments are completed within 30 minutes to 2 hours, depending on the size of the property and the severity of the infestation. Larger commercial premises may require additional treatment time.' },
      { q: 'Is cockroach treatment safe for kitchens?', a: 'Yes. Professional technicians take appropriate precautions when treating kitchen areas. You may be asked to cover or store food items and utensils before treatment. Detailed post-treatment instructions will also be provided to help ensure safe use of the kitchen.' },
      { q: 'Can cockroaches spread diseases?', a: 'Yes. Cockroaches can contaminate food and surfaces with bacteria and other microorganisms picked up from drains, rubbish bins, and other unsanitary areas. Maintaining good hygiene and arranging timely pest control can help reduce health risks associated with cockroach infestations.' },
      { q: 'How can I prevent cockroach infestations?', a: 'Preventing cockroaches starts with maintaining a clean and hygienic environment. Store food in sealed containers, clean kitchen surfaces daily, dispose of garbage regularly, repair leaking pipes, and seal cracks around doors, windows, and plumbing. Scheduling preventive pest control every few months can also help keep cockroach populations under control.' },
      { q: 'Do I need more than one cockroach treatment?', a: 'The number of treatments depends on the severity of the infestation and the type of property. Light infestations may be resolved with a single professional treatment, while heavy infestations or commercial kitchens may require follow-up visits as recommended by the technician.' }
    ],
  },
  {
    category: 'Rodents',
    items: [
      { q: 'How do rats enter homes?', a: 'Rats and mice can enter through surprisingly small openings around doors, windows, roof gaps, drainage pipes, utility lines, and damaged vents. They are excellent climbers and can squeeze through narrow gaps to access food and shelter inside buildings.' },
      { q: 'What are the signs of a rodent infestation?', a: 'Common signs include rodent droppings, gnaw marks on wires or furniture, scratching noises inside walls or ceilings, damaged food packaging, nesting materials, and unpleasant odours. If you notice these signs, it\'s advisable to arrange a professional inspection.' },
      { q: 'Are rodents dangerous?', a: 'Yes. Rodents can contaminate food, damage electrical wiring, insulation, furniture, and stored goods. They may also spread diseases through their urine, droppings, and saliva. Prompt rodent control helps protect both your property and your family\'s health.' },
      { q: 'How do professionals control rats and mice?', a: 'Professional rodent control begins with a detailed inspection to identify entry points, nesting areas, and food sources. Depending on the situation, technicians may use traps, bait stations, exclusion methods, and sanitation recommendations to help control rodent activity and prevent future infestations.' },
      { q: 'How long does rodent control take?', a: 'The time required depends on the size of the property and the level of infestation. While initial treatment can usually be completed within a few hours, monitoring and follow-up visits may be recommended to ensure long-term control.' },
      { q: 'Can rodents return after treatment?', a: 'Rodents may return if entry points remain open or if food and water sources are easily available. Sealing gaps, maintaining cleanliness, and following the technician\'s recommendations greatly reduce the chances of reinfestation.' }
    ],
  },
  {
    category: 'Mosquitoes',
    items: [
      { q: 'How does mosquito control work?', a: 'Mosquito control focuses on reducing mosquito breeding sites and treating areas where mosquitoes rest. Professional services may include larval control, residual treatments, and fogging where appropriate. An integrated approach provides the best long-term results.' },
      { q: 'How long does mosquito treatment last?', a: 'The effectiveness of mosquito treatment depends on weather conditions, rainfall, surrounding vegetation, and the treatment method used. During the monsoon season, periodic treatments may be recommended to maintain effective mosquito control.' },
      { q: 'Is mosquito fogging safe?', a: 'Mosquito fogging should always be carried out by trained professionals using approved products and following recommended safety procedures. Occupants should follow any temporary precautions advised by the technician during and after the treatment.' },
      { q: 'Can mosquito treatment reduce the risk of dengue and malaria?', a: 'Professional mosquito control helps reduce mosquito populations around your property, which may lower the risk of mosquito bites. However, residents should also remove stagnant water, use mosquito screens, and follow general public health recommendations to reduce exposure.' },
      { q: 'How often should mosquito control be done?', a: 'For homes in mosquito-prone areas, especially during Bangalore\'s monsoon season, preventive mosquito control every few months can help maintain lower mosquito activity. Commercial properties with landscaped gardens or water features may require more frequent treatments.' }
    ],
  },
  {
    category: 'Ants',
    items: [
      { q: 'Why do ants keep entering my home?', a: 'Ants usually enter homes in search of food, water, and shelter. Sweet foods, pet food, moisture, and small crumbs can attract them. Sealing entry points and maintaining cleanliness can help reduce ant activity.' },
      { q: 'Can ants damage my property?', a: 'Most household ants are considered a nuisance rather than a structural threat. However, some species may damage wooden structures or contaminate food. Professional identification helps determine the appropriate treatment.' },
      { q: 'How long does ant control treatment last?', a: 'The duration of protection depends on the species of ant, the treatment method, and environmental conditions. Following preventive measures and maintaining good hygiene can help extend the effectiveness of the treatment.' },
      { q: 'Is ant treatment safe around food?', a: 'Yes. Before treatment, you may be asked to store food items, utensils, and cooking equipment safely. After the service, our technician will explain when it is safe to resume normal use of the treated areas.' }
    ],
  },
]

function FAQItemComp({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button
        className="faq-item__btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`faq-body-${q.slice(0, 20).replace(/\s/g, '-')}`}
      >
        {q}
        <ChevronDown size={18} className="faq-item__icon" aria-hidden="true" />
      </button>
      {open && (
        <motion.div
          id={`faq-body-${q.slice(0, 20).replace(/\s/g, '-')}`}
          className="faq-item__body"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
        >
          {a}
        </motion.div>
      )}
    </div>
  )
}

export default function FAQ() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.flatMap(cat => cat.items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    }))),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="page-enter">
        <section className="page-hero" aria-label="FAQ page header">
          <div className="page-hero__bg" aria-hidden="true" />
          <div className="container page-hero__content">
            <div className="eyebrow">❓ FAQ</div>
            <h1 className="display-xl">Frequently Asked <span className="gradient-text">Questions</span></h1>
            <p className="body-lg text-muted" style={{ maxWidth: 580, margin: '1rem auto 0' }}>
              Find clear answers to <strong>frequently asked questions</strong> about our pest control services, pricing, safety standards, and service warranties in Bangalore.
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="faq-main-heading">
          <div className="container">
            <h2 id="faq-main-heading" className="sr-only">All Frequently Asked Questions</h2>
            {FAQ_DATA.map((cat, ci) => (
              <motion.div
                key={cat.category}
                style={{ marginBottom: '3rem' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.1 }}
              >
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--clr-primary)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {cat.category}
                </h2>
                <div className="faq-list">
                  {cat.items.map((item) => (
                    <FAQItemComp key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        <CTABanner />
      </div>
    </>
  )
}
