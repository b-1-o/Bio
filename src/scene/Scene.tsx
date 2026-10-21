import { useEffect, useState } from 'react'
import { type ThreeEvent } from '@react-three/fiber'
import { Model } from './Model'
import { SocialLinks } from './SocialLinks'

const BASE = import.meta.env.BASE_URL

type SceneProps = {
  isPlayerOpen: boolean
  onPlayerOpenChange: (open: boolean) => void
}

type Placement = {
  id: string
  position: [number, number, number]
  scale: number
  rotation: number
}

const forestRocks: Placement[] = [
  { id: 'forest-rock-west-front', position: [-5.5, 0, 2], scale: 0.85, rotation: 0.35 },
  { id: 'forest-rock-east-front', position: [5.4, 0, 2.5], scale: 0.9, rotation: -0.4 },
  { id: 'forest-rock-west-back', position: [-5.8, 0, -6.5], scale: 0.92, rotation: 1.1 },
  { id: 'forest-rock-east-back', position: [5.7, 0, -6], scale: 0.88, rotation: -0.8 },
]

const caveRocks: Placement[] = [
  { id: 'cave-rock-west', position: [-3.6, 0, 0.1], scale: 0.86, rotation: 0.2 },
  { id: 'cave-rock-east', position: [3.5, 0, -0.4], scale: 0.92, rotation: -0.6 },
  { id: 'cave-rock-back-west', position: [-2.6, 0, -3.8], scale: 0.8, rotation: 1.05 },
  { id: 'cave-rock-back-east', position: [2.5, 0, -3.5], scale: 0.82, rotation: -1.1 },
]

function CentralStone({
  isPlayerOpen,
  onPlayerOpenChange,
}: SceneProps) {
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [])

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
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <pointLight
        position={[0, 2.35, 0.25]}
        color="#91e5ff"
        intensity={hovered ? 4 : 2.1}
        distance={hovered ? 8 : 5.5}
        decay={2}
      />
      <Model
        path={`${BASE}assets/stone_opt.glb`}
        scale={1.5}
        highlight={hovered}
      />
    </group>
  )
}

function CaveZone({
  isPlayerOpen,
  onPlayerOpenChange,
}: SceneProps) {
  return (
    <group position={[0, -8, -15]}>
      <mesh
        position={[0, -0.08, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[8.5, 96]} />
        <meshStandardMaterial
          color="#04090e"
          roughness={0.98}
          metalness={0.08}
        />
      </mesh>

      {caveRocks.map((rock) => (
        <group
          key={rock.id}
          position={rock.position}
          scale={rock.scale}
          rotation={[0, rock.rotation, 0]}
        >
          <Model path={`${BASE}assets/rocks_web.glb`} />
        </group>
      ))}

      <pointLight
        position={[-3, 1.2, 0.5]}
        color="#248dc4"
        intensity={3.4}
        distance={12}
        decay={2}
      />
      <pointLight
        position={[3.5, 1.8, -3]}
        color="#3168a8"
        intensity={2.7}
        distance={10}
        decay={2}
      />
      <pointLight
        position={[0, 2.7, 0.3]}
        color="#9beaff"
        intensity={1.6}
        distance={6}
        decay={2}
      />

      <CentralStone
        isPlayerOpen={isPlayerOpen}
        onPlayerOpenChange={onPlayerOpenChange}
      />
    </group>
  )
}

export function Scene(props: SceneProps) {
  return (
    <>
      <color attach="background" args={['#020509']} />

      <ambientLight color="#1a1a2e" intensity={0.15} />

      <directionalLight
        color="#8dc9ec"
        intensity={0.62}
        position={[-7, 12, 7]}
      />

      {/* The original 12 MB forest asset is the only forest ground model. */}
      <group position={[0, 0, 0]} scale={2}>
        <Model path={`${BASE}assets/forest.glb`} />
      </group>

      {forestRocks.map((rock) => (
        <group
          key={rock.id}
          position={rock.position}
          scale={rock.scale}
          rotation={[0, rock.rotation, 0]}
        >
          <Model path={`${BASE}assets/rocks_web.glb`} />
        </group>
      ))}

      {/* Zone 3: dead tree. Model.tsx grounds it before scaling/placement. */}
      <group position={[0, 0, -2]} scale={3}>
        <Model path={`${BASE}assets/tree_web.glb`} />
      </group>

      <spotLight
        position={[0, 5, 5]}
        intensity={5}
        color="#88bbff"
        angle={0.62}
        penumbra={0.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <SocialLinks />

      {/* Zone 5 is a separate world-space pocket beneath and behind the forest. */}
      <CaveZone
        isPlayerOpen={props.isPlayerOpen}
        onPlayerOpenChange={props.onPlayerOpenChange}
      />
    </>
  )
}
