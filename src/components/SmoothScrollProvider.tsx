import { useEffect, useState, type PropsWithChildren } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LenisContext } from './useSmoothScroll'
import 'lenis/dist/lenis.css'

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const instance = new Lenis({
      autoRaf: false,
      anchors: true,
      duration: 1.08,
      smoothWheel: true,
      wheelMultiplier: 0.85,
    })

    const updateScrollTrigger = () => ScrollTrigger.update()
    const ticker = (time: number) => instance.raf(time * 1000)

    instance.on('scroll', updateScrollTrigger)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.cancelAnimationFrame(refreshFrame)
      instance.off('scroll', updateScrollTrigger)
      gsap.ticker.remove(ticker)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
