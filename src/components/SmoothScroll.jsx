'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    let lenisInstance = null
    let rafId = null

    // Disable virtual smooth scrolling on admin pages and mobile / touch devices
    if (typeof window !== 'undefined') {
      if ((pathname && pathname.startsWith('/admin')) || window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
        return
      }
    }

    // Lazily import Lenis and GSAP to keep the main bundle extremely small
    Promise.all([
      import('lenis').then(mod => mod.default),
      import('gsap').then(mod => mod.default),
      import('gsap/ScrollTrigger').then(mod => mod.default)
    ]).then(([Lenis, gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger)

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

      lenisInstance = lenis
      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)

      window.lenis = lenis
    })

    return () => {
      if (lenisInstance) {
        // Need to import gsap here as well or keep a reference.
        // It's safer to just clean up lenis and remove window.lenis
        lenisInstance.destroy()
        window.lenis = null
      }
    }
  }, [pathname])

  return null
}
