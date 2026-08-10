import { Helmet } from 'react-helmet-async'
import HeroSection from '../sections/HeroSection'
import ServicesGrid from '../sections/ServicesGrid'
import WhyChooseUs from '../sections/WhyChooseUs'
import HowItWorks from '../sections/HowItWorks'
import StatsSection from '../sections/StatsSection'
import Testimonials from '../sections/Testimonials'
import ResidentialCommercial from '../sections/ResidentialCommercial'
import CTABanner from '../sections/CTABanner'
import ScrollReveal from '../components/ScrollReveal'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Pest Control in Bangalore | A to Z Pest Solutions – #1 Termite & Bed Bug Experts</title>
        <meta name="description" content="A to Z Pest Solutions – Bangalore's most trusted pest control company since 1993. Expert termite, bed bug, cockroach, rodent & mosquito treatments. Eco-friendly, same-day service. Call 9845559710 for FREE inspection!" />
        <link rel="canonical" href="https://pestcontrolbengaluru.in/" />
      </Helmet>

      <div className="page-enter">
        <HeroSection />
        
        <ScrollReveal yOffset={60}>
          <StatsSection />
        </ScrollReveal>
        
        <ScrollReveal yOffset={60}>
          <ServicesGrid />
        </ScrollReveal>
        
        <ScrollReveal yOffset={60}>
          <WhyChooseUs />
        </ScrollReveal>
        
        <ScrollReveal yOffset={60}>
          <ResidentialCommercial />
        </ScrollReveal>
        
        <ScrollReveal yOffset={60}>
          <HowItWorks />
        </ScrollReveal>
        
        <ScrollReveal yOffset={60}>
          <Testimonials />
        </ScrollReveal>
        
        <ScrollReveal yOffset={60}>
          <CTABanner />
        </ScrollReveal>
      </div>
    </>
  )
}
