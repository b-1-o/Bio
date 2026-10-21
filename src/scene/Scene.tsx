import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Environment, ScrollControls } from '@react-three/drei'
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
  { id: 'tree-left-front', position: [-3.9, 0, 1.2], scale: 2.4, rotation: 0.35 },
  { id: 'tree-right-front', position: [3.9, 0, 1.4], scale: 2.6, rotation: -0.3 },
  { id: 'tree-left-mid', position: [-6.7, 0, -4.2], scale: 3, rotation: 0.15 },
  { id: 'tree-right-mid', position: [6.9, 0, -5.1], scale: 3.1, rotation: -0.2 },
  { id: 'tree-back-left', position: [-10.5, 0, -12], scale: 3.8, rotation: 0.1 },
  { id: 'tree-back-right', position: [11, 0, -13], scale: 4, rotation: -0.1 },
  { id: 'tree-far-left', position: [-15, 0, -2.5], scale: 4, rotation: 0.25 },
  { id: 'tree-far-right', position: [15.5, 0, -4], scale: 4.1, rotation: -0.2 },
]

const rocks: Placement[] = [
  { id: 'rock-left-front', position: [-3.2, 0, 0.8], scale: 0.68, rotation: 0.45 },
  { id: 'rock-right-front', position: [3.3, 0, 0.5], scale: 0.62, rotation: -0.55 },
  { id: 'rock-left-back', position: [-3.8, 0, -3.3], scale: 0.78, rotation: 1.05 },
  { id: 'rock-right-back', position: [3.9, 0, -4.1], scale: 0.72, rotation: -1.1 },
  { id: 'rock-side-left', position: [-5.4, 0, -0.7], scale: 0.62, rotation: 0.2 },
  { id: 'rock-side-right', position: [5.3, 0, -1.2], scale: 0.65, rotation: -0.15 },
]

type SceneProps = {
  isPlayerOpen: boolean
  onPlayerOpenChange: (open: boolean) => void
  onScrollStateChange?: (hasScrolled: boolean) => void
}

type ForestBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
}

class ForestAssetBoundary extends Component<
  ForestBoundaryProps,
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.warn(
      'assets/forest.glb is unavailable; temporarily using the existing forest_web.glb asset.',
      error.message,
    )
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

function ForestGround() {
  return (
    <ForestAssetBoundary
      fallback={<Model path={BASE + 'assets/forest_web.glb'} />}
    >
      <Suspense fallback={null}>
        <Model path={BASE + 'assets/forest.glb'} />
      </Suspense>
    </ForestAssetBoundary>
  )
}

type StoneProps = Pick<SceneProps, 'isPlayerOpen' | 'onPlayerOpenChange'>

function CentralStone({ isPlayerOpen, onPlayerOpenChange }: StoneProps) {
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
      position={[0, 0, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <pointLight
        color="#88bbff"
        intensity={hovered ? 2 : 0.18}
        distance={hovered ? 5 : 2.5}
        decay={2}
        position={[0, 1.15, 0.2]}
      />

      <group ref={rotationGroup} scale={1}>
        {/* Model.tsx measures the GLB bounds and lowers its clone onto y=0. */}
        <Model
          path={BASE + 'assets/stone_opt.glb'}
          highlight={hovered}
        />
      </group>
    </group>
  )
}

function SceneContent(props: SceneProps) {
  return (
    <>
      <color attach="background" args={['#030303']} />
      <fogExp2 attach="fog" args={['#030303', 0.055]} />

      <Environment
        files={BASE + 'assets/dark_autumn_forest_1k.hdr'}
        background={false}
        environmentIntensity={0.2}
      />

      <ambientLight intensity={0.1} />

      <spotLight
        position={[0, 4.5, 0]}
        angle={0.55}
        penumbra={1}
        intensity={10}
        color="#88bbff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <directionalLight
        color="#516b92"
        intensity={0.65}
        position={[-5, 7, 4]}
      />

      {/* Prefer the original high-resolution asset; the boundary keeps the
          published scene alive until forest.glb is added to public/assets. */}
      <group position={[0, 0, 0]} scale={1.5}>
        <ForestGround />
      </group>

      {trees.map((tree) => (
        <group
          key={tree.id}
          position={tree.position}
          scale={tree.scale}
          rotation={[0, tree.rotation, 0]}
        >
          <Model path={BASE + 'assets/tree_web.glb'} />
        </group>
      ))}

      {rocks.map((rock) => (
        <group
          key={rock.id}
          position={rock.position}
          scale={rock.scale}
          rotation={[0, rock.rotation, 0]}
        >
          <Model path={BASE + 'assets/rocks_web.glb'} />
        </group>
      ))}

      <CentralStone
        isPlayerOpen={props.isPlayerOpen}
        onPlayerOpenChange={props.onPlayerOpenChange}
      />

      <CameraRig
        isPlayerOpen={props.isPlayerOpen}
        onScrollStateChange={props.onScrollStateChange}
      />

      <PostFX />
    </>
  )
}

export function Scene(props: SceneProps) {
  return (
    <Canvas
      camera={{
        position: [0, 1.6, 8],
        fov: 50,
        near: 0.1,
        far: 200,
      }}
      dpr={[1, 1.5]}
      frameloop="always"
      shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
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
        <ScrollControls
          pages={3}
          damping={0.18}
          enabled={!props.isPlayerOpen}
          style={{
            overflowY: props.isPlayerOpen ? 'hidden' : 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
          }}
        >
          <SceneContent {...props} />
        </ScrollControls>
      </Suspense>
    </Canvas>
  )
}
