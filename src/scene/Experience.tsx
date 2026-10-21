import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { CameraRig } from './CameraRig'
import { Scene } from './Scene'
import { PostFX } from './PostFX'

type ExperienceProps = {
  isPlayerOpen: boolean
  onPlayerOpenChange: (open: boolean) => void
  onScrollStateChange: (scrolled: boolean) => void
}

export function Experience({
  isPlayerOpen,
  onPlayerOpenChange,
  onScrollStateChange,
}: ExperienceProps) {
  return (
    <Canvas
      camera={{
        position: [0, 25, 25],
        fov: 48,
        near: 0.1,
        far: 240,
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
          damping={0.15}
          enabled={!isPlayerOpen}
          style={{
            overflowY: isPlayerOpen ? 'hidden' : 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
          }}
        >
          {/*
            Keep the world in fixed world-space coordinates while the camera
            travels. Wrapping the whole world in drei's <Scroll> would translate
            every model too and cause a second, competing movement.
          */}
          <Scene
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
