import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Model } from './Model'

const BASE = import.meta.env.BASE_URL

function SceneContent() {
  return (
    <>
      <Environment files={`${BASE}assets/dark_autumn_forest_1k.hdr`} background={false} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 5, 2]} intensity={0.6} />

      <Model path={`${BASE}assets/stone_opt.glb`} position={[0, 0, 0]} scale={2} />

      <OrbitControls enablePan={false} minDistance={2} maxDistance={8} />
    </>
  )
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 4], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}
