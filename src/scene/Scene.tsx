import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Model } from './Model'

function SceneContent() {
  return (
    <>
      {/* Освещение из HDRI */}
      <Environment files="/assets/dark_autumn_forest_1k.hdr" background={false} />

      {/* Небольшая подсветка спереди, чтобы модель не была в полной темноте */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 5, 2]} intensity={0.6} />

      {/* Камень в центре — первый тест */}
      <Model path="/assets/stone_opt.glb" position={[0, 0, 0]} scale={2} />

      {/* Временные контролы, чтобы покрутить сцену мышкой. Уберём позже */}
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
