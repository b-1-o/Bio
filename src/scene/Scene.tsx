import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import type { Group } from 'three'
import { Model } from './Model'
import { PostFX } from './PostFX'

const BASE = import.meta.env.BASE_URL

/* -------------------------------------------------------------------------- */
/*  Плавающий объект: лёгкий float + опциональное вращение                    */
/* -------------------------------------------------------------------------- */
function Floating({
  children,
  amplitude = 0.12,
  speed = 0.4,
  phase = 0,
  rotateY = 0,
  ...props
}: {
  children: React.ReactNode
  amplitude?: number
  speed?: number
  phase?: number
  rotateY?: number
} & React.ComponentProps<'group'>) {
  const ref = useRef<Group>(null)
  const baseY = useRef<number | null>(null)

  useFrame((state) => {
    if (!ref.current) return
    if (baseY.current === null) baseY.current = ref.current.position.y
    ref.current.position.y =
      baseY.current + Math.sin(state.clock.elapsedTime * speed + phase) * amplitude
    if (rotateY !== 0) {
      ref.current.rotation.y += rotateY * 0.016
    }
  })

  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/*  Освещение: красный снизу-слева + циан сверху-справа                        */
/* -------------------------------------------------------------------------- */
function Lighting() {
  return (
    <>
      {/* HDRI только для отражений, не как основной свет */}
      <Environment
        files={`${BASE}assets/dark_autumn_forest_1k.hdr`}
        background={false}
        environmentIntensity={0.45}
      />

      {/* Густой чёрный туман — прячет границы моделей */}
      <fogExp2 attach="fog" args={['#050505', 0.15]} />

      {/* Зловещий красный снизу-слева — грани монолита */}
      <pointLight
        color="#ff1a1a"
        intensity={5}
        distance={14}
        decay={2}
        position={[-4, -1.5, 2]}
      />
      {/* Холодный циан сверху-справа */}
      <pointLight
        color="#00e5ff"
        intensity={2.2}
        distance={16}
        decay={2}
        position={[5, 4, 1]}
      />
      {/* Мягкий фиолетовый rim сзади */}
      <pointLight
        color="#6a3a8a"
        intensity={1.2}
        distance={12}
        decay={2}
        position={[0, 2, -6]}
      />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Монолит — вылезает из-за нижнего левого края UI                            */
/* -------------------------------------------------------------------------- */
function Monolith() {
  return (
    <Floating
      position={[-2.8, -2.4, 0.5]}
      scale={3.6}
      amplitude={0.08}
      speed={0.25}
      phase={0}
      rotateY={0.08}
    >
      <Model path={`${BASE}assets/stone_opt.glb`} />
    </Floating>
  )
}

/* -------------------------------------------------------------------------- */
/*  Камни по краям — не лезут в центр                                          */
/* -------------------------------------------------------------------------- */
function EdgeRocks() {
  const left = [
    { pos: [-5.2, -2.8, 1.2] as [number, number, number], scale: 1.1, phase: 0.4 },
    { pos: [-4.6, -3.2, -1.5] as [number, number, number], scale: 0.85, phase: 1.2 },
    { pos: [-5.8, -2.5, -0.4] as [number, number, number], scale: 0.7, phase: 2.1 },
  ]
  const right = [
    { pos: [5.0, -2.9, 0.8] as [number, number, number], scale: 1.0, phase: 0.8 },
    { pos: [5.5, -3.1, -1.8] as [number, number, number], scale: 0.9, phase: 1.7 },
    { pos: [4.4, -2.6, -0.6] as [number, number, number], scale: 0.75, phase: 2.6 },
  ]

  return (
    <>
      {left.map((r, i) => (
        <Floating
          key={`L${i}`}
          position={r.pos}
          scale={r.scale}
          amplitude={0.1 + i * 0.03}
          speed={0.35 + i * 0.05}
          phase={r.phase}
          rotation={[0, 0.6 + i * 0.4, 0.05]}
        >
          <Model path={`${BASE}assets/rocks_web.glb`} />
        </Floating>
      ))}
      {right.map((r, i) => (
        <Floating
          key={`R${i}`}
          position={r.pos}
          scale={r.scale}
          amplitude={0.09 + i * 0.025}
          speed={0.3 + i * 0.04}
          phase={r.phase}
          rotation={[0, -0.5 - i * 0.35, -0.04]}
        >
          <Model path={`${BASE}assets/rocks_web.glb`} />
        </Floating>
      ))}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Деревья + лес — далеко, почти растворяются в тумане                        */
/* -------------------------------------------------------------------------- */
function FoggyBackground() {
  return (
    <>
      {/* Два мёртвых дерева — силуэты */}
      <Floating position={[-6.5, -1.5, -14]} scale={2.8} amplitude={0.06} speed={0.2} phase={0.5}>
        <Model path={`${BASE}assets/tree_web.glb`} />
      </Floating>
      <Floating position={[7.0, -1.8, -15]} scale={3.1} amplitude={0.07} speed={0.18} phase={1.4}>
        <Model path={`${BASE}assets/tree_web.glb`} />
      </Floating>

      {/* Стена леса ещё дальше */}
      <Floating position={[-3, -2, -20]} scale={4.5} amplitude={0.04} speed={0.12} phase={0.2}>
        <Model path={`${BASE}assets/forest_web.glb`} />
      </Floating>
      <Floating position={[4, -2.2, -22]} scale={5.0} amplitude={0.05} speed={0.1} phase={1.0}>
        <Model path={`${BASE}assets/forest_web.glb`} />
      </Floating>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Сцена                                                                     */
/* -------------------------------------------------------------------------- */
function SceneContent() {
  return (
    <>
      <Lighting />
      <Monolith />
      <EdgeRocks />
      <FoggyBackground />
    </>
  )
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0.8, 7], fov: 42 }}
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
        <PostFX />
      </Suspense>
    </Canvas>
  )
}
