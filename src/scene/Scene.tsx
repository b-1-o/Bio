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

/** Key camera positions along the narrative path (progress 0 → 1) */
const CAMERA_KEYS = [
  // 0.00 — start near the small house (blue circle)
  { t: 0.0, pos: new Vector3(-6.2, 1.8, 4.5), look: new Vector3(-1.5, 1.2, 0.5) },
  // 0.12 — mid fly-in, still low, approaching the clearing
  { t: 0.12, pos: new Vector3(-3.5, 3.2, 7.5), look: new Vector3(0, 1.5, -1) },
  // 0.22 — arrive at overview of the forest / church
  { t: 0.22, pos: new Vector3(0, 6.5, 11), look: new Vector3(0, 1.5, -2) },
  // 0.32 — move toward the dead tree
  { t: 0.32, pos: new Vector3(2.5, 5.5, 2), look: new Vector3(0, 3, -5) },
  // 0.42 — start of spiral around dead tree (high)
  { t: 0.42, pos: new Vector3(4.2, 7.5, -5), look: new Vector3(0, 4, -5) },
  // 0.52 — spiral mid (around trunk, social leaves visible)
  { t: 0.52, pos: new Vector3(-3.8, 4.5, -5), look: new Vector3(0, 3.2, -5) },
  // 0.62 — spiral lower + roots
  { t: 0.62, pos: new Vector3(3.5, 1.8, -5), look: new Vector3(0, 1.2, -5) },
  // 0.72 — descending into roots / soil
  { t: 0.72, pos: new Vector3(-2.2, -0.8, -4.5), look: new Vector3(0, -1.5, -5) },
  // 0.82 — deep underground / darkness
  { t: 0.82, pos: new Vector3(0.5, -4.5, -3), look: new Vector3(0, -6, -4) },
  // 0.90 — pure black transition
  { t: 0.9, pos: new Vector3(0, -8, 0), look: new Vector3(0, -10, 0) },
  // 1.00 — emerge at the stone on the ground
  { t: 1.0, pos: new Vector3(0, 2.8, 6.5), look: new Vector3(0, 0.6, 2) },
]

function samplePath(progress: number) {
  const p = MathUtils.clamp(progress, 0, 1)
  let i = 0
  while (i < CAMERA_KEYS.length - 2 && CAMERA_KEYS[i + 1].t < p) i++

  const a = CAMERA_KEYS[i]
  const b = CAMERA_KEYS[i + 1]
  const localT = (p - a.t) / (b.t - a.t || 1)
  // smoothstep for cinematic feel
  const t = localT * localT * (3 - 2 * localT)

  const pos = a.pos.clone().lerp(b.pos, t)
  const look = a.look.clone().lerp(b.look, t)
  return { pos, look }
}

function CameraRig({
  isPlayerOpen,
  onScrollStateChange,
  onPlayerOpenChange,
}: SceneProps) {
  const { camera, gl } = useThree()
  const lastScrolled = useRef(false)
  const currentPos = useMemo(() => new Vector3(-6.2, 1.8, 4.5), [])
  const currentLook = useMemo(() => new Vector3(-1.5, 1.2, 0.5), [])
  const playerTargetPos = useMemo(() => new Vector3(0, 1.4, 3.2), [])
  const playerTargetLook = useMemo(() => new Vector3(0, 0.7, 2), [])
  const crashProgress = useRef(0)
  const wasPlayerOpen = useRef(false)

  // Background click closes player
  useEffect(() => {
    const canvas = gl.domElement
    const onPointerDown = () => {
      if (!isPlayerOpen) return
      onPlayerOpenChange(false)
    }
    canvas.addEventListener('pointerdown', onPointerDown)
    return () => canvas.removeEventListener('pointerdown', onPointerDown)
  }, [gl, isPlayerOpen, onPlayerOpenChange])

  useFrame((_, delta) => {
    const scrollRange = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    )
    const scrollProgress = MathUtils.clamp(window.scrollY / scrollRange, 0, 1)

    if (scrollProgress > 0.04 !== lastScrolled.current) {
      lastScrolled.current = scrollProgress > 0.04
      onScrollStateChange?.(lastScrolled.current)
    }

    // Crash / pull-back animation for player
    if (isPlayerOpen && !wasPlayerOpen.current) {
      crashProgress.current = 0
    }
    wasPlayerOpen.current = isPlayerOpen

    if (isPlayerOpen) {
      crashProgress.current = MathUtils.damp(crashProgress.current, 1, 4.5, delta)
      const t = crashProgress.current
      const ease = t * t * (3 - 2 * t)
      const crashPos = currentPos.clone().lerp(playerTargetPos, ease)
      const crashLook = currentLook.clone().lerp(playerTargetLook, ease)
      camera.position.copy(crashPos)
      camera.lookAt(crashLook)
      return
    } else {
      crashProgress.current = MathUtils.damp(crashProgress.current, 0, 3.2, delta)
    }

    const { pos, look } = samplePath(scrollProgress)

    const targetPos = pos.clone().lerp(playerTargetPos, crashProgress.current)
    const targetLook = look.clone().lerp(playerTargetLook, crashProgress.current)

    currentPos.x = MathUtils.damp(currentPos.x, targetPos.x, 2.8, delta)
    currentPos.y = MathUtils.damp(currentPos.y, targetPos.y, 2.8, delta)
    currentPos.z = MathUtils.damp(currentPos.z, targetPos.z, 2.8, delta)

    currentLook.x = MathUtils.damp(currentLook.x, targetLook.x, 3.4, delta)
    currentLook.y = MathUtils.damp(currentLook.y, targetLook.y, 3.4, delta)
    currentLook.z = MathUtils.damp(currentLook.z, targetLook.z, 3.4, delta)

    camera.position.copy(currentPos)
    camera.lookAt(currentLook)
  })

  return null
}

type PlayerStoneProps = {
  onPlayerOpenChange: (open: boolean) => void
  isPlayerOpen: boolean
}

function PlayerStone({ onPlayerOpenChange, isPlayerOpen }: PlayerStoneProps) {
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [])

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (!isPlayerOpen) {
      onPlayerOpenChange(true)
    }
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

  // Stone sits on the ground like a simple cobblestone
  return (
    <group
      position={[0, 0, 2]}
      scale={1.15}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <pointLight
        position={[0, 1.6, 0.15]}
        color="#888"
        intensity={hovered || isPlayerOpen ? 1.55 : 0.55}
        distance={hovered || isPlayerOpen ? 5.5 : 3.2}
        decay={2}
      />
      <Model
        path={BASE + 'assets/stone_opt.glb'}
        scale={1.35}
        highlight={hovered || isPlayerOpen}
      />
    </group>
  )
}

function FogController() {
  const { scene } = useThree()
  useFrame(() => {
    const scrollRange = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    )
    const p = MathUtils.clamp(window.scrollY / scrollRange, 0, 1)

    // denser fog during underground / darkness phases
    let near = 10
    let far = 48
    if (p > 0.55 && p < 0.92) {
      const local = (p - 0.55) / 0.37
      near = MathUtils.lerp(8, 2, local)
      far = MathUtils.lerp(40, 12, local)
    } else if (p >= 0.92) {
      near = MathUtils.lerp(2, 6, (p - 0.92) / 0.08)
      far = MathUtils.lerp(12, 28, (p - 0.92) / 0.08)
    }

    if (scene.fog && 'near' in scene.fog) {
      ;(scene.fog as any).near = near
      ;(scene.fog as any).far = far
    }
  })
  return null
}

function World(props: SceneProps) {
  return (
    <>
      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#000', 10, 48]} />
      <FogController />

      <ambientLight intensity={0.12} color="#888" />
      <directionalLight
        intensity={1.35}
        color="#888"
        position={[5, 10, 5]}
        castShadow
      />

      {/* Main forest (includes the house / church area) */}
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

      {/* Dead tree — social links hang on it like last leaves */}
      <group position={[0, 0, -5]} scale={2}>
        <Model path={BASE + 'assets/tree_web.glb'} />
      </group>

      <spotLight
        position={[0, 5, -2]}
        intensity={1.8}
        color="#888"
        angle={0.7}
        penumbra={1}
        castShadow
      />

      <SocialLinks />
      <PlayerStone
        onPlayerOpenChange={props.onPlayerOpenChange}
        isPlayerOpen={props.isPlayerOpen}
      />
    </>
  )
}

export function Scene(props: SceneProps) {
  return (
    <Canvas
      camera={{
        position: [-6.2, 1.8, 4.5],
        fov: 48,
        near: 0.1,
        far: 200,
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
