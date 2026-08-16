'use client'

import dynamic from 'next/dynamic'
import HeroSection from '../sections/HeroSection'
const ServicesGrid = dynamic(() => import('../sections/ServicesGrid'), { ssr: true })
const WhyChooseUs = dynamic(() => import('../sections/WhyChooseUs'), { ssr: true })
const HowItWorks = dynamic(() => import('../sections/HowItWorks'), { ssr: true })
const StatsSection = dynamic(() => import('../sections/StatsSection'), { ssr: true })
const Testimonials = dynamic(() => import('../sections/Testimonials'), { ssr: true })
const ResidentialCommercial = dynamic(() => import('../sections/ResidentialCommercial'), { ssr: true })
const CTABanner = dynamic(() => import('../sections/CTABanner'), { ssr: true })
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
