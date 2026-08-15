'use client'

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
  )
}
