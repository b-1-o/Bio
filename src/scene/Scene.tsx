import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { MathUtils, Vector3, type Group } from 'three'
import { Model } from './Model'
import { PostFX } from './PostFX'
import { useScrollProgress } from './useScrollProgress'

const BASE = import.meta.env.BASE_URL

type Placement = {
  id: string
  position: [number, number, number]
  scale: number
  rotation: number
}

/**
 * Near trees frame the clearing; larger trees beyond them build a real sense
 * of scale instead of a small ring of props around the camera.
 */
const trees: Placement[] = [
  { id: 'tree-left-frame', position: [-4, 0, -2], scale: 2.5, rotation: 0.5 },
  { id: 'tree-right-frame', position: [5, 0, -4], scale: 3, rotation: -0.5 },
  { id: 'tree-left-mid', position: [-11, 0, -10], scale: 4.2, rotation: 0.18 },
  { id: 'tree-right-mid', position: [12, 0, -13], scale: 4.6, rotation: -0.32 },
  { id: 'tree-left-deep', position: [-17, 0, -23], scale: 5, rotation: -0.12 },
  { id: 'tree-right-deep', position: [18, 0, -25], scale: 5.4, rotation: 0.25 },
  { id: 'tree-far-left', position: [-22, 0, -4], scale: 4.5, rotation: 0.35 },
  { id: 'tree-far-right', position: [23, 0, -7], scale: 4.8, rotation: -0.24 },
]

/** The model component grounds each GLB using its actual geometry bounds. */
const rocks: Placement[] = [
  { id: 'rock-near-left', position: [-2, 0, 1], scale: 0.62, rotation: 0.42 },
  { id: 'rock-near-right', position: [3, 0, 2], scale: 0.56, rotation: -0.6 },
  { id: 'rock-rear-left', position: [-5, 0, -3], scale: 0.76, rotation: 0.8 },
  { id: 'rock-rear-right', position: [2, 0, -5], scale: 0.7, rotation: -1.05 },
  { id: 'rock-side-right', position: [6, 0, 0], scale: 0.68, rotation: 1.6 },
]

type SceneProps = {
  isPlayerOpen: boolean
  onPlayerOpenChange: (open: boolean) => void
}

function CameraRig() {
  const scrollProgress = useScrollProgress()
  const { camera } = useThree()
  const lookTarget = useMemo(() => new Vector3(0, 1, 0), [])

  useFrame((_, delta) => {
    const progress = scrollProgress.current
    // Keep the eye-level camera almost fixed; scroll only adds gentle parallax.
    const targetX = Math.sin(progress * Math.PI) * 0.22
    const targetY = 1.6 + Math.sin(progress * Math.PI * 2) * 0.035
    const targetZ = 5 - progress * 0.18

    camera.position.x = MathUtils.damp(camera.position.x, targetX, 1.8, delta)
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 1.8, delta)
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 1.8, delta)
    camera.lookAt(lookTarget)
  })

  return null
}

function CentralStone({
  isPlayerOpen,
  onPlayerOpenChange,
}: SceneProps) {
  const rotationGroup = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [])

  useFrame((_, delta) => {
    if (rotationGroup.current && !isPlayerOpen) {
      rotationGroup.current.rotation.y += delta * 0.055
    }
  })

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onPlayerOpenChange(!isPlayerOpen)
  }

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'default'
  }

  return (
    <group
      position={[0, 0.5, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <pointLight
        color="#4a6fa5"
        intensity={hovered ? 1.45 : 0.12}
        distance={hovered ? 5 : 2}
        decay={2}
        position={[0, 0.85, 0.25]}
      />

      <group ref={rotationGroup} scale={1.5}>
        {/*
          The outer group is at the requested y=0.5. This local offset
          compensates for that height after scaling, so the model's grounded
          bounding-box minimum remains at world y=0.
        */}
        <group position={[0, -0.5 / 1.5, 0]}>
          <Model path={`${BASE}assets/stone_opt.glb`} highlight={hovered} />
        </group>
      </group>
    </group>
  )
}

function SceneContent(props: SceneProps) {
  return (
    <>
      <color attach="background" args={['#030303']} />
      <fogExp2 attach="fog" args={['#030303', 0.08]} />

      <Environment
        files={`${BASE}assets/dark_autumn_forest_1k.hdr`}
        background={false}
        environmentIntensity={0.22}
      />

      <ambientLight intensity={0.2} color="#1a1a2e" />

      <directionalLight
        color="#6a8fc0"
        intensity={1.35}
        position={[5, 8, 4]}
      />

      <spotLight
        position={[0, 4, -2]}
        angle={0.5}
        penumbra={1}
        intensity={5}
        color="#4a6fa5"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Existing forest GLB forms the terrain/forest base — no invented floor. */}
      <group position={[0, 0, 0]} rotation={[0, 0, 0]} scale={10}>
        <Model path={`${BASE}assets/forest_web.glb`} />
      </group>

      {trees.map((tree) => (
        <group
          key={tree.id}
          position={tree.position}
          scale={tree.scale}
          rotation={[0, tree.rotation, 0]}
        >
          <Model path={`${BASE}assets/tree_web.glb`} />
        </group>
      ))}

      {rocks.map((rock) => (
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
      <CameraRig />
      <PostFX />
    </>
  )
}

export function Scene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 5], fov: 65, near: 0.1, far: 200 }}
      dpr={[1, 1.5]}
      frameloop="always"
      shadows
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
