import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import type { Group } from 'three'
import { Model } from './Model'
import { CameraRig } from './CameraRig'
import { PostFX } from './PostFX'

const BASE = import.meta.env.BASE_URL

type Placement = {
  id: string
  position: [number, number, number]
  scale: number
  rotation: number
}

const trees: Placement[] = [
  { id: 'tree-left-frame', position: [-3, 0, 2], scale: 2.5, rotation: 0.5 },
  { id: 'tree-right-frame', position: [3, 0, 1], scale: 3, rotation: -0.5 },
  { id: 'tree-left-mid', position: [-8, 0, -7], scale: 3.2, rotation: 0.2 },
  { id: 'tree-right-mid', position: [9, 0, -9], scale: 3.5, rotation: -0.3 },
  { id: 'tree-left-deep', position: [-14, 0, -18], scale: 4.3, rotation: -0.1 },
  { id: 'tree-right-deep', position: [15, 0, -20], scale: 4.5, rotation: 0.25 },
  { id: 'tree-far-left', position: [-20, 0, -3], scale: 4, rotation: 0.35 },
  { id: 'tree-far-right', position: [21, 0, -5], scale: 4.2, rotation: -0.2 },
]

const rocks: Placement[] = [
  { id: 'rock-left', position: [-4.5, 0, -2], scale: 0.7, rotation: 0.55 },
  { id: 'rock-right', position: [4.1, 0, -2.8], scale: 0.64, rotation: -0.7 },
  { id: 'rock-back-left', position: [-2.4, 0, -4], scale: 0.82, rotation: 1.1 },
  { id: 'rock-back-right', position: [2.7, 0, -5], scale: 0.76, rotation: -1.2 },
  { id: 'rock-side-left', position: [-6.2, 0, 1], scale: 0.68, rotation: 0.2 },
]

type SceneProps = {
  isPlayerOpen: boolean
  onPlayerOpenChange: (open: boolean) => void
}

function CentralStone({ isPlayerOpen, onPlayerOpenChange }: SceneProps) {
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
    onPlayerOpenChange(true)
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
        color="#88bbff"
        intensity={hovered ? 2 : 0.18}
        distance={hovered ? 5 : 2.5}
        decay={2}
        position={[0, 1, 0.3]}
      />
      <group ref={rotationGroup} scale={1}>
        {/* Model.tsx grounds its geometry; this offset compensates for y=0.5. */}
        <group position={[0, -0.5, 0]}>
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
      <fogExp2 attach="fog" args={['#030303', 0.1]} />

      <Environment
        files={`${BASE}assets/dark_autumn_forest_1k.hdr`}
        background={false}
        environmentIntensity={0.2}
      />

      <ambientLight intensity={0.1} />

      <spotLight
        position={[0, 5, 0]}
        angle={0.6}
        penumbra={1}
        intensity={10}
        color="#88bbff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <directionalLight
        color="#516b92"
        intensity={0.75}
        position={[-5, 7, 4]}
      />

      {/* Existing forest GLB: deliberately kept at a texture-safe scale. */}
      <group position={[0, 0, 0]} rotation={[0, 0, 0]} scale={2}>
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
      <CameraRig isPlayerOpen={props.isPlayerOpen} />
      <PostFX />
    </>
  )
}

export function Scene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [2, 1.5, 10], fov: 50, near: 0.1, far: 200 }}
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
