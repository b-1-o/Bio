import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { CameraRig } from './CameraRig'
import { Zones } from './Zones'
import { PostFX } from './PostFX'

export type ExperienceProps = {
  isPlayerOpen: boolean
  onPlayerOpenChange: (open: boolean) => void
  onScrollStateChange?: (hasScrolled: boolean) => void
}

export function Experience({
  isPlayerOpen,
  onPlayerOpenChange,
  onScrollStateChange,
}: ExperienceProps) {
  return (
    <Canvas
      camera={{
        position: [-4, 1.6, -2],
        fov: 48,
        near: 0.1,
        far: 220,
      }}
      dpr={[1, 1.5]}
      shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'auto',
        touchAction: 'pan-y',
      }}
    >
      <Suspense fallback={null}>
        <ScrollControls
          pages={5}
          damping={0.2}
          enabled={!isPlayerOpen}
          style={{
            overflowY: isPlayerOpen ? 'hidden' : 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
          }}
        >
          <Zones
            isPlayerOpen={isPlayerOpen}
            onPlayerOpenChange={onPlayerOpenChange}
          />
          <CameraRig
            isPlayerOpen={isPlayerOpen}
            onScrollStateChange={onScrollStateChange}
          />
        </ScrollControls>
        <PostFX />
      </Suspense>
    </Canvas>
  )
}
