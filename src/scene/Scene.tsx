import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { MathUtils, Vector3, type Group } from 'three'
import { Model } from './Model'
import { PostFX } from './PostFX'
import { useScrollProgress } from './useScrollProgress'

const BASE = import.meta.env.BASE_URL
type Position3 = [number, number, number]

function getRingPositions(count: number, radius: number, y: number): Position3[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2
    return [Math.cos(angle) * radius, y, Math.sin(angle) * radius]
  })
}

function CameraRig() {
  const progress = useScrollProgress()
  const { camera } = useThree()
  const lookTarget = useMemo(() => new Vector3(0, 0.45, 0), [])

  useFrame((_, delta) => {
    const p = progress.current
    const arc = Math.sin(p * Math.PI)
    const targetX = MathUtils.lerp(0, 4, p) + arc * 1.1
    const targetY = MathUtils.lerp(2.5, 1.5, p) + arc * 0.65
    const targetZ = MathUtils.lerp(8, 1, p)

    camera.position.x = MathUtils.damp(camera.position.x, targetX, 2.2, delta)
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 2.2, delta)
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 2.2, delta)
    camera.lookAt(lookTarget)
  })

  return null
}

function RotatingMonolith() {
  const group = useRef<Group>(null)

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.1
  })

  return (
    <group ref={group} position={[0, 1, 0]} scale={3}>
      <Model path={`${BASE}assets/stone_opt.glb`} />
    </group>
  )
}

function ModelRing({
  count,
  radius,
  y,
  scale,
  path,
}: {
  count: number
  radius: number
  y: number
  scale: number
  path: string
}) {
  const positions = useMemo(
    () => getRingPositions(count, radius, y),
    [count, radius, y],
  )

  return (
    <>
      {positions.map((position, index) => (
        <group key={index} position={position} scale={scale}>
          <Model path={path} />
        </group>
      ))}
    </>
  )
}

function SceneContent() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <fogExp2 attach="fog" args={['#050505', 0.06]} />

      <Environment
        files={`${BASE}assets/dark_autumn_forest_1k.hdr`}
        background={false}
        environmentIntensity={0.4}
      />

      <directionalLight
        color="#6a8fc0"
        intensity={2}
        position={[5, 10, 5]}
      />
      <pointLight
        color="#ff9a55"
        intensity={3}
        distance={15}
        position={[0, 2, -8]}
        decay={2}
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      <RotatingMonolith />
      <ModelRing
        count={8}
        radius={4}
        y={-0.2}
        scale={1}
        path={`${BASE}assets/rocks_web.glb`}
      />
      <ModelRing
        count={6}
        radius={7}
        y={-0.3}
        scale={2}
        path={`${BASE}assets/tree_web.glb`}
      />
      <ModelRing
        count={5}
        radius={14}
        y={-1}
        scale={5}
        path={`${BASE}assets/forest_web.glb`}
      />

      <CameraRig />
      <PostFX />
    </>
  )
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 8], fov: 50, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
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
