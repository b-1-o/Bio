declare module '*.jsx' {
  import type { ComponentType, CSSProperties } from 'react'

  export interface AeroShardsProps {
    shardColor?: string
    accentColor?: string
    backgroundColor?: string
    lightMode?: boolean
    placement?: 'full' | 'left' | 'right' | 'center'
    material?: 'glass' | 'chrome'
    markers?: 'plus' | 'dots' | 'none'
    count?: number
    shardSize?: number
    spread?: number
    twist?: number
    billow?: number
    speed?: number
    scale?: number
    depthOfField?: number
    glow?: number
    grain?: number
    vignette?: number
    intro?: boolean
    mouseInteraction?: boolean
    mouseStrength?: number
    pulseOnClick?: boolean
    holdToGather?: boolean
    parallax?: number
    paused?: boolean
    dpr?: number
    className?: string
    style?: CSSProperties
    onError?: (error: Error) => void
  }

  const AeroShards: ComponentType<AeroShardsProps>
  export default AeroShards
}
