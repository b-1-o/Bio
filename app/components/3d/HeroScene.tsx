import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { HeroBlob } from './HeroBlob'

export function HeroScene() {
  return (
    <div
      className="hero-3d-scene"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <HeroBlob />
        </Suspense>
      </Canvas>
    </div>
  )
}
