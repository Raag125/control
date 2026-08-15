'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './AnimatedBackground.css'

export default function AnimatedBackground() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Generate particle data once on mount
    const isMobile = window.innerWidth < 768
    const count = isMobile ? 6 : 15
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: isMobile ? Math.random() * 5 + 3 : Math.random() * 8 + 4,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="animated-bg" aria-hidden="true">
      {/* Drifting Protective Auras */}
      <motion.div 
        className="aura aura-1"
        animate={{
          x: [0, 60, 0, -60, 0],
          y: [0, 40, 70, 40, 0],
          scale: [1, 1.08, 1, 1.12, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div 
        className="aura aura-2"
        animate={{
          x: [0, -70, 0, 70, 0],
          y: [0, 50, -30, 50, 0],
          scale: [1, 1.12, 0.95, 1.08, 1]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <motion.div 
        className="aura aura-3"
        animate={{
          x: [0, 50, -50, 30, 0],
          y: [0, -60, -30, 30, 0],
          scale: [1, 1.15, 1, 1.08, 1]
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Eco Particles */}
      <div className="particles-container">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: ['105vh', '-10vh'],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  )
}
