'use client'
import { useEffect, useState } from 'react'
import './AnimatedBackground.css'

export default function AnimatedBackground() {
  const [isMobile, setIsMobile] = useState(true)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)

    if (!mobile) {
      // Only load framer-motion animations on desktop
      const count = 15
      const newParticles = Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 8 + 4,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
      }))
      setParticles(newParticles)

      // Dynamically import framer-motion only on desktop
      import('framer-motion').then(({ motion }) => {
        // motion is available via dynamic render — particles will render in next effect
      })
    }
  }, [])

  // On mobile: render a simple static background with no JS animations
  if (isMobile) {
    return <div className="animated-bg" aria-hidden="true" />
  }

  // Desktop: full animated background using CSS keyframes (no framer-motion needed)
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="aura aura-1 aura-desktop" />
      <div className="aura aura-2 aura-desktop" />
      <div className="aura aura-3 aura-desktop" />
      <div className="particles-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
