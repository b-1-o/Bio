import { createContext, useCallback, useContext } from 'react'
import type Lenis from 'lenis'

export const LenisContext = createContext<Lenis | null>(null)

export type SmoothScrollTarget = number | string | HTMLElement

export type SmoothScrollOptions = {
  offset?: number
  duration?: number
  immediate?: boolean
  lock?: boolean
  force?: boolean
}

export function useSmoothScroll() {
  const lenis = useContext(LenisContext)

  const start = useCallback(() => {
    lenis?.start()
  }, [lenis])

  const stop = useCallback(() => {
    lenis?.stop()
  }, [lenis])

  const scrollTo = useCallback(
    (target: SmoothScrollTarget, options: SmoothScrollOptions = {}) => {
      if (lenis) {
        lenis.scrollTo(target, options)
        return
      }

      if (typeof window === 'undefined') return

      let top: number | null = null
      if (typeof target === 'number') {
        top = target
      } else {
        const element =
          typeof target === 'string'
            ? document.querySelector<HTMLElement>(target)
            : target

        if (element) {
          top = element.getBoundingClientRect().top + window.scrollY
        }
      }

      if (top === null) return
      window.scrollTo({
        top: top + (options.offset ?? 0),
        behavior: options.immediate ? 'auto' : 'smooth',
      })
    },
    [lenis],
  )

  return {
    lenis,
    isReady: lenis !== null,
    start,
    stop,
    scrollTo,
  }
}
