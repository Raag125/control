'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

import { usePathname } from 'next/navigation'

export default function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    // Disable virtual smooth scrolling on admin pages and mobile / touch devices
    if (typeof window !== 'undefined') {
      if ((pathname && pathname.startsWith('/admin')) || window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
        return
      }
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 1,
      infinite: false,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    window.lenis = lenis

    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      lenis.destroy()
      window.lenis = null
    }
  }, [pathname])

  return null
}
