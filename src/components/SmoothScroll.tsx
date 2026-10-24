import { useEffect } from 'react'
import Lenis from 'lenis'

export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const lenis = new Lenis({ autoRaf: true, duration: 1.08, smoothWheel: true, wheelMultiplier: 0.85 })
    return () => lenis.destroy()
  }, [])
  return null
}
