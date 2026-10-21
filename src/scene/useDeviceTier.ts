import { useMemo } from 'react'

export type DeviceTier = 'low' | 'medium' | 'high'

export function useDeviceTier(): DeviceTier {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'medium'
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const isLowEnd = navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency <= 4
      : false
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return 'low'
    if (isMobile || isLowEnd) return 'medium'
    return 'high'
  }, [])
}
