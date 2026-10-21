import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { Model } from './Model'
import { SocialLinks } from './SocialLinks'
import { PostFX } from './PostFX'

const BASE = import.meta.env.BASE_URL

type SceneProps = {
  isPlayerOpen: boolean
  onPlayerOpenChange: (open: boolean) => void
  onScrollStateChange?: (scrolled: boolean) => void
}

type Placement = {
  id: string
  position: [number, number, number]
  scale: number
  rotation: number
}

const rocks: Placement[] = [
  { id: 'rock-west-front', position: [-5, 0, 2], scale: 0.8, rotation: 0.35 },
  { id: 'rock-east-front', position: [5, 0, 2.5], scale: 0.85, rotation: -0.4 },
  { id: 'rock-west-back', position: [-5.5, 0, -3.5], scale: 0.9, rotation: 1.1 },
  { id: 'rock-east-back', position: [5.5, 0, -4], scale: 0.88, rotation: -0.8 },
]

function CameraRig({
  isPlayerOpen,
  onScrollStateChange,
}: SceneProps) {
  const { camera } = useThree()
  const lastScrolled = useRef(false)
  const currentLookAt = useMemo(() => new Vector3(0, 0, 0), [])
  const targetLookAt = useMemo(() => new Vector3(0, 0, 0), [])

  useFrame((_, delta) => {
    const scrollRange = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    )
    const scrollProgress = MathUtils.clamp(window.scrollY / scrollRange, 0, 1)

    if (scrollProgress > 0.05 !== lastScrolled.current) {
      lastScrolled.current = scrollProgress > 0.05
      onScrollStateChange?.(lastScrolled.current)
    }

    const progress = scrollProgress
    const targetY = isPlayerOpen
      ? camera.position.y
      : MathUtils.lerp(15, 1.5, progress)
    const targetZ = isPlayerOpen
      ? camera.position.z
      : MathUtils.lerp(15, 5, progress)

    if (isPlayerOpen) {
      targetLookAt.copy(currentLookAt)
    } else {
      targetLookAt.set(
        0,
        MathUtils.lerp(0, 1, progress),
        MathUtils.lerp(0, 2, progress),
      )
    }

    camera.position.x = 0
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 2.6, delta)
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 2.6, delta)

    currentLookAt.x = MathUtils.damp(currentLookAt.x, targetLookAt.x, 3.2, delta)
    currentLookAt.y = MathUtils.damp(currentLookAt.y, targetLookAt.y, 3.2, delta)
    currentLookAt.z = MathUtils.damp(currentLookAt.z, targetLookAt.z, 3.2, delta)
    camera.lookAt(currentLookAt)
  })

  return null
}

type PlayerStoneProps = {
  onPlayerOpenChange: (open: boolean) => void
}

function PlayerStone({
  onPlayerOpenChange,
}: PlayerStoneProps) {
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
      position={[0, 0, 2]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <pointLight
        position={[0, 1.8, 0.1]}
        color="#888"
        intensity={hovered ? 1.4 : 0.65}
        distance={hovered ? 5 : 3.5}
        decay={2}
      />
      <Model
        path={BASE + 'assets/stone_opt.glb'}
        scale={1.5}
        highlight={hovered}
      />
    </group>
  )
}

function World(props: SceneProps) {
  return (
    <>
      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#000', 10, 48]} />

      <ambientLight intensity={0.1} color="#888" />
      <directionalLight
        intensity={1.5}
        color="#888"
        position={[5, 10, 5]}
        castShadow
      />

      {/* Original full-resolution forest asset; no compressed forest substitute. */}
      <group position={[0, 0, 0]} scale={2}>
        <Model path={BASE + 'assets/forest.glb'} />
      </group>

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

      {/* Dead tree stays in the background with a measured grounded origin. */}
      <group position={[0, 0, -5]} scale={2}>
        <Model path={BASE + 'assets/tree_web.glb'} />
      </group>

      <spotLight
        position={[0, 5, -2]}
        intensity={2}
        color="#888"
        angle={0.7}
        penumbra={1}
        castShadow
      />

      <SocialLinks />
      <PlayerStone onPlayerOpenChange={props.onPlayerOpenChange} />
    </>
  )
}

export function Scene(props: SceneProps) {
  return (
    <Canvas
      camera={{
        position: [0, 15, 15],
        fov: 50,
        near: 0.1,
        far: 180,
      }}
      dpr={[1, 1.5]}
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
        filter: 'grayscale(1)',
      }}
    >
      <Suspense fallback={null}>
        <World {...props} />
        <CameraRig {...props} />
        <PostFX />
      </Suspense>
    </Canvas>
  )
}
