import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { HeroBlob } from './HeroBlob'

export function HeroScene() {
  return (
    <div className="absolute top-0 right-0 w-full md:w-[58%] h-full z-0 pointer-events-none">
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
