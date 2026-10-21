import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import type { Group } from 'three'
import { Model } from './Model'

const BASE = import.meta.env.BASE_URL

// Вращаем монолит вокруг Y
function RotatingModel({
  path,
  speed = 0.15,
  ...props
}: {
  path: string
  speed?: number
} & React.ComponentProps<'group'>) {
  const ref = useRef<Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed
  })
  return (
    <group ref={ref} {...props}>
      <Model path={path} />
    </group>
  )
}

function SceneContent() {
  // Позиции окружения фиксируем один раз
  const rocks = useMemo(() => {
    const angles = [0, 72, 144, 216, 288].map((deg) => (deg * Math.PI) / 180)
    return angles.map((angle, i) => {
      const radius = 3.5 + (i % 2) * 0.5 + (i * 0.07) % 0.4
      const jitter = ((i * 0.37) % 0.6) - 0.3
      return {
        position: [
          Math.cos(angle) * radius + jitter,
          -0.2 - (i % 3) * 0.05,
          Math.sin(angle) * radius + jitter * 0.5,
        ] as [number, number, number],
        scale: 0.6 + (i % 5) * 0.08,
        rotation: [0, angle + i * 0.4, 0] as [number, number, number],
      }
    })
  }, [])

  const trees = useMemo(
    () => [
      { position: [-3.5, 0, -4] as [number, number, number], rotation: [0, 0.2, 0.1] as [number, number, number], scale: 1.5 },
      { position: [3.5, 0, -4] as [number, number, number], rotation: [0, -0.3, -0.1] as [number, number, number], scale: 1.5 },
    ],
    []
  )

  const forests = useMemo(
    () => [
      { position: [-2, 0, -8] as [number, number, number], scale: 3 },
      { position: [2, 0, -8] as [number, number, number], scale: 3 },
    ],
    []
  )

  return (
    <>
      {/* HDRI + экспоненциальный туман */}
      <Environment files={`${BASE}assets/dark_autumn_forest_1k.hdr`} background={false} />
      <fogExp2 attach="fog" args={['#0a0a0f', 0.08]} />

      {/* Холодный лунный свет сверху */}
      <pointLight color="#4a6fa5" intensity={2.5} distance={10} position={[0, 5, 0]} decay={2} />
      {/* Тёплый красный акцент в тон UI */}
      <pointLight color="#a01828" intensity={1.2} distance={5} position={[-3, 1.5, 2]} decay={2} />
      {/* Подсветка сзади для rim */}
      <pointLight color="#6a4a8a" intensity={0.8} distance={6} position={[2, 2, -4]} decay={2} />

      {/* Центральный монолит */}
      <RotatingModel path={`${BASE}assets/stone_opt.glb`} scale={2} position={[0, 0, 0]} />

      {/* Камни по кругу */}
      {rocks.map((r, i) => (
        <Model
          key={`rock-${i}`}
          path={`${BASE}assets/rocks_web.glb`}
          position={r.position}
          scale={r.scale}
          rotation={r.rotation}
        />
      ))}

      {/* Мёртвые деревья */}
      {trees.map((t, i) => (
        <Model
          key={`tree-${i}`}
          path={`${BASE}assets/tree_web.glb`}
          position={t.position}
          rotation={t.rotation}
          scale={t.scale}
        />
      ))}

      {/* Дальний лес */}
      {forests.map((f, i) => (
        <Model
          key={`forest-${i}`}
          path={`${BASE}assets/forest_web.glb`}
          position={f.position}
          scale={f.scale}
        />
      ))}
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
