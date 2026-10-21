import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { MathUtils, Vector3, type Group } from 'three'
import { Model } from './Model'
import { PostFX } from './PostFX'
import { useScrollProgress } from './useScrollProgress'

const BASE = import.meta.env.BASE_URL

type ModelPlacement = {
  id: string
  position: [number, number, number]
  scale: number
  rotation: number
}

const treePlacements: ModelPlacement[] = [
  { id: 'tree-nw', position: [-10, -1.1, -9], scale: 2, rotation: 0.42 },
  { id: 'tree-ne', position: [10, -1.1, -9], scale: 2, rotation: -0.36 },
  { id: 'tree-west', position: [-12, -1.1, 0], scale: 2.1, rotation: 0.15 },
  { id: 'tree-east', position: [12, -1.1, 1], scale: 2, rotation: -0.22 },
  { id: 'tree-sw', position: [-9, -1.1, 9], scale: 1.9, rotation: -0.2 },
  { id: 'tree-se', position: [9, -1.1, 9], scale: 2.1, rotation: 0.31 },
]

const rockPlacements: ModelPlacement[] = [
  { id: 'rock-1', position: [5.1, -1.02, 0.8], scale: 0.72, rotation: 0.4 },
  { id: 'rock-2', position: [3.6, -1.02, 4.2], scale: 0.62, rotation: 1.2 },
  { id: 'rock-3', position: [-3.8, -1.02, 3.8], scale: 0.7, rotation: -0.65 },
  { id: 'rock-4', position: [-5.3, -1.02, -0.6], scale: 0.76, rotation: 0.8 },
  { id: 'rock-5', position: [-2.3, -1.02, -5.1], scale: 0.62, rotation: 2.1 },
  { id: 'rock-6', position: [4.3, -1.02, -4.1], scale: 0.68, rotation: -1.05 },
]

type SceneProps = {
  isPlayerOpen: boolean
  onPlayerOpenChange: (open: boolean) => void
}

function CameraRig({ isPlayerOpen }: { isPlayerOpen: boolean }) {
  const progress = useScrollProgress()
  const { camera } = useThree()
  const lookAt = useMemo(() => new Vector3(0, 0.25, 0), [])

  useFrame((_, delta) => {
    const p = progress.current
    const parallaxX = Math.sin(p * Math.PI * 1.4) * 0.55
    const targetX = isPlayerOpen ? 0 : parallaxX
    const targetY = isPlayerOpen ? 2.2 : 4.7 - p * 0.4
    const targetZ = isPlayerOpen ? 6.2 : 16 - p * 1.3

    camera.position.x = MathUtils.damp(camera.position.x, targetX, 1.9, delta)
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 1.9, delta)
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 1.9, delta)
    camera.lookAt(lookAt)
  })

  return null
}

function CentralStone({
  isPlayerOpen,
  onPlayerOpenChange,
}: Pick<SceneProps, 'isPlayerOpen' | 'onPlayerOpenChange'>) {
  const spin = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [])

  useFrame((_, delta) => {
    if (spin.current && !isPlayerOpen) {
      spin.current.rotation.y += delta * 0.075
    }
  })

  const openPlayer = (event: { stopPropagation: () => void }) => {
    event.stopPropagation()
    onPlayerOpenChange(!isPlayerOpen)
  }

  const hoverStone = (event: { stopPropagation: () => void }) => {
    event.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const leaveStone = (event: { stopPropagation: () => void }) => {
    event.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'default'
  }

  return (
    <group
      position={[0, 0, 0]}
      onClick={openPlayer}
      onPointerOver={hoverStone}
      onPointerOut={leaveStone}
    >
      <pointLight
        color="#6a8fc0"
        intensity={hovered ? 1.7 : 0.15}
        distance={hovered ? 5 : 2.2}
        decay={2}
        position={[0, 0.55, 0]}
      />
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[1.35, 24, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={spin} scale={2}>
        <Model path={`${BASE}assets/stone_opt.glb`} highlight={hovered} />
      </group>
    </group>
  )
}

function SceneContent(props: SceneProps) {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <fogExp2 attach="fog" args={['#050505', 0.05]} />

      <Environment
        files={`${BASE}assets/dark_autumn_forest_1k.hdr`}
        background={false}
        environmentIntensity={0.32}
      />

      <ambientLight color="#202a3a" intensity={0.48} />
      <directionalLight
        color="#6a8fc0"
        intensity={2.1}
        position={[4, 11, 5]}
      />
      <directionalLight
        color="#26364e"
        intensity={0.7}
        position={[-8, 5, -5]}
      />

      <group position={[0, -1, 0]} scale={3}>
        <Model path={`${BASE}assets/forest_web.glb`} />
      </group>

      {treePlacements.map((tree) => (
        <group
          key={tree.id}
          position={tree.position}
          scale={tree.scale}
          rotation={[0, tree.rotation, 0]}
        >
          <Model path={`${BASE}assets/tree_web.glb`} />
        </group>
      ))}

      {rockPlacements.map((rock) => (
        <group
          key={rock.id}
          position={rock.position}
          scale={rock.scale}
          rotation={[0, rock.rotation, 0]}
        >
          <Model path={`${BASE}assets/rocks_web.glb`} />
        </group>
      ))}

      <CentralStone {...props} />
      <CameraRig isPlayerOpen={props.isPlayerOpen} />
      <PostFX />
    </>
  )
}

export function Scene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 4.7, 16], fov: 48, near: 0.1, far: 150 }}
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
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
        <SceneContent {...props} />
      </Suspense>
    </Canvas>
  )
}
