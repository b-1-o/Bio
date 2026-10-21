import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { MathUtils } from 'three'
import { Model } from './Model'
import { PostFX } from './PostFX'
import { useScrollProgress } from './useScrollProgress'
import { useDeviceTier } from './useDeviceTier'

const BASE = import.meta.env.BASE_URL

/* -------------------------------------------------------------------------- */
/*  Камера: вглубь леса при скролле                                            */
/* -------------------------------------------------------------------------- */
function CameraRig() {
  const progress = useScrollProgress()
  const { camera, invalidate } = useThree()
  const target = useRef({ z: 6, y: 1.4, x: 0 })

  // На demand-loop перерисовываем кадр при скролле
  useEffect(() => {
    const onScroll = () => invalidate()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [invalidate])

  useFrame((_, delta) => {
    const p = progress.current
    target.current.z = MathUtils.lerp(6, -12, p)
    target.current.y = MathUtils.lerp(1.4, 1.0, p)
    target.current.x = Math.sin(p * Math.PI * 2) * 0.45

    camera.position.z = MathUtils.damp(camera.position.z, target.current.z, 0.12, delta)
    camera.position.y = MathUtils.damp(camera.position.y, target.current.y, 0.12, delta)
    camera.position.x = MathUtils.damp(camera.position.x, target.current.x, 0.1, delta)
    camera.lookAt(0, 0.6, camera.position.z - 8)
  })

  return null
}

/* -------------------------------------------------------------------------- */
/*  Освещение: холодный лунный + тёплый акцент у «избы»                        */
/* -------------------------------------------------------------------------- */
function Lighting() {
  return (
    <>
      <Environment
        files={`${BASE}assets/dark_autumn_forest_1k.hdr`}
        background={false}
        environmentIntensity={0.3}
      />
      <fogExp2 attach="fog" args={['#050505', 0.05]} />

      <directionalLight color="#4a6fa5" intensity={1.5} position={[5, 12, 4]} />
      <hemisphereLight args={['#1a2838', '#0a0a0c', 0.35]} />
      <pointLight
        color="#ffaa55"
        intensity={2.2}
        distance={18}
        decay={2}
        position={[0, 2.2, -10]}
      />
      <pointLight
        color="#6ec8d8"
        intensity={0.6}
        distance={14}
        decay={2}
        position={[-2, 3, 2]}
      />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Земля                                                                     */
/* -------------------------------------------------------------------------- */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -8]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#0e0e10" roughness={0.95} metalness={0.05} />
    </mesh>
  )
}

/* -------------------------------------------------------------------------- */
/*  Стилизованная «изба»                                                      */
/* -------------------------------------------------------------------------- */
function Cabin() {
  return (
    <group position={[0, -1.2, -10]}>
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[3.2, 2.2, 2.6]} />
        <meshStandardMaterial color="#1a1c20" roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh position={[0, 2.55, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.6, 1.4, 4]} />
        <meshStandardMaterial color="#12141a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.15, 1.32]}>
        <planeGeometry args={[0.7, 0.55]} />
        <meshStandardMaterial
          color="#ffcc88"
          emissive="#ffaa55"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/*  Коридор деревьев                                                          */
/* -------------------------------------------------------------------------- */
function TreeCorridor({ count }: { count: number }) {
  const trees = useMemo(() => {
    const list: { pos: [number, number, number]; scale: number; rot: number }[] = []
    const depths = [-3, -6, -9, -12, -15, -18]
    for (let i = 0; i < Math.min(count, depths.length * 2); i++) {
      const side = i % 2 === 0 ? -1 : 1
      const depthIdx = Math.floor(i / 2)
      const z = depths[depthIdx] ?? -18
      const x = side * (3.8 + (depthIdx % 3) * 0.35)
      list.push({
        pos: [x, -1.2, z],
        scale: 1.6 + (depthIdx % 3) * 0.25,
        rot: side * 0.15 + depthIdx * 0.1,
      })
    }
    return list
  }, [count])

  return (
    <>
      {trees.map((t, i) => (
        <group key={i} position={t.pos} scale={t.scale} rotation={[0, t.rot, 0]}>
          <Model path={`${BASE}assets/tree_web.glb`} />
        </group>
      ))}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Камни                                                                     */
/* -------------------------------------------------------------------------- */
function Rocks({ dense }: { dense: boolean }) {
  const items = useMemo(() => {
    const base = [
      { path: `${BASE}assets/stone_opt.glb`, pos: [-2.2, -1.15, -4] as [number, number, number], scale: 0.9 },
      { path: `${BASE}assets/rocks_web.glb`, pos: [2.5, -1.2, -5.5] as [number, number, number], scale: 0.75 },
      { path: `${BASE}assets/rocks_web.glb`, pos: [-3.4, -1.25, -8] as [number, number, number], scale: 0.65 },
      { path: `${BASE}assets/stone_opt.glb`, pos: [1.8, -1.15, -11] as [number, number, number], scale: 0.7 },
      { path: `${BASE}assets/rocks_web.glb`, pos: [-1.5, -1.2, -14] as [number, number, number], scale: 0.55 },
    ]
    return dense ? base : base.slice(0, 3)
  }, [dense])

  return (
    <>
      {items.map((r, i) => (
        <group key={i} position={r.pos} scale={r.scale}>
          <Model path={r.path} />
        </group>
      ))}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Дальний лес                                                               */
/* -------------------------------------------------------------------------- */
function DistantForest() {
  return (
    <>
      <group position={[-4, -1.5, -22]} scale={4}>
        <Model path={`${BASE}assets/forest_web.glb`} />
      </group>
      <group position={[5, -1.6, -24]} scale={4.5}>
        <Model path={`${BASE}assets/forest_web.glb`} />
      </group>
    </>
  )
}

function SceneContent({ tier }: { tier: 'low' | 'medium' | 'high' }) {
  const treeCount = tier === 'high' ? 10 : tier === 'medium' ? 6 : 4
  const dense = tier === 'high'

  return (
    <>
      <CameraRig />
      <Lighting />
      <Ground />
      <Cabin />
      <TreeCorridor count={treeCount} />
      <Rocks dense={dense} />
      {tier !== 'low' && <DistantForest />}
    </>
  )
}

export function Scene() {
  const tier = useDeviceTier()
  const isMobile = tier !== 'high'

  return (
    <Canvas
      camera={{ position: [0, 1.4, 6], fov: 50 }}
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      frameloop={isMobile ? 'demand' : 'always'}
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
        <SceneContent tier={tier} />
        {tier === 'high' && <PostFX />}
      </Suspense>
    </Canvas>
  )
}
