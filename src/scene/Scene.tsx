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

/**
 * Narrative phases (scroll progress 0 → 1)
 *
 * HOME     0.00 – 0.38   only forest.glb, human eye-level walk along the front of the island
 * TRANSIT  0.38 – 0.48   heavy fog, fade home
 * SOCIALS  0.48 – 0.72   isolated dead tree + social orbs as last leaves
 * ROOTS    0.72 – 0.86   spiral down into roots / soil / black fog
 * PLAYER   0.86 – 1.00   stone lying on the ground
 */

const EYE = 1.65

/** HOME path — low arc along the front of the island, always looking toward the church */
const HOME_KEYS = [
  // start: standing near the small house + tombstones (blue circle)
  { t: 0.0, pos: new Vector3(-5.8, EYE, 3.8), look: new Vector3(-1.2, 1.4, -0.8) },
  // step forward along the graves
  { t: 0.25, pos: new Vector3(-3.2, EYE, 4.6), look: new Vector3(0.2, 1.6, -1.5) },
  // mid arc
  { t: 0.5, pos: new Vector3(-0.4, EYE + 0.15, 5.4), look: new Vector3(0.5, 1.8, -2.2) },
  // continue toward the right side of the clearing
  { t: 0.75, pos: new Vector3(2.6, EYE + 0.1, 4.9), look: new Vector3(0.8, 1.9, -2.8) },
  // end of home path — still ground level, looking at church + big tree
  { t: 1.0, pos: new Vector3(4.4, EYE + 0.2, 3.6), look: new Vector3(1.0, 2.2, -3.5) },
]

/** SOCIALS — camera in front of the isolated dead tree */
const SOCIALS_KEYS = [
  { t: 0.0, pos: new Vector3(0, 2.8, 7.5), look: new Vector3(0, 4.5, 0) },
  { t: 0.4, pos: new Vector3(3.2, 3.5, 5.5), look: new Vector3(0, 4.2, 0) },
  { t: 0.7, pos: new Vector3(-2.8, 4.2, 4.8), look: new Vector3(0, 4.0, 0) },
  { t: 1.0, pos: new Vector3(0.5, 5.0, 6.2), look: new Vector3(0, 3.5, 0) },
]

/** ROOTS spiral — descending around the trunk into the ground */
const ROOTS_KEYS = [
  { t: 0.0, pos: new Vector3(3.5, 3.5, 3.0), look: new Vector3(0, 2.0, 0) },
  { t: 0.3, pos: new Vector3(-3.0, 1.5, 2.5), look: new Vector3(0, 0.5, 0) },
  { t: 0.6, pos: new Vector3(2.5, -0.5, 1.8), look: new Vector3(0, -1.5, 0) },
  { t: 1.0, pos: new Vector3(-1.0, -3.5, 0.5), look: new Vector3(0, -5.0, 0) },
]

/** PLAYER — stone on the ground */
const PLAYER_KEYS = [
  { t: 0.0, pos: new Vector3(0, 1.8, 5.5), look: new Vector3(0, 0.4, 1.2) },
  { t: 1.0, pos: new Vector3(0, 1.5, 4.2), look: new Vector3(0, 0.35, 1.0) },
]

function sampleKeys(
  keys: { t: number; pos: Vector3; look: Vector3 }[],
  progress: number,
) {
  const p = MathUtils.clamp(progress, 0, 1)
  let i = 0
  while (i < keys.length - 2 && keys[i + 1].t < p) i++
  const a = keys[i]
  const b = keys[i + 1]
  const localT = (p - a.t) / (b.t - a.t || 1)
  const t = localT * localT * (3 - 2 * localT)
  return {
    pos: a.pos.clone().lerp(b.pos, t),
    look: a.look.clone().lerp(b.look, t),
  }
}

function getCameraForProgress(progress: number) {
  if (progress < 0.38) {
    const local = progress / 0.38
    return sampleKeys(HOME_KEYS, local)
  }
  if (progress < 0.48) {
    return sampleKeys(HOME_KEYS, 1)
  }
  if (progress < 0.72) {
    const local = (progress - 0.48) / 0.24
    return sampleKeys(SOCIALS_KEYS, local)
  }
  if (progress < 0.86) {
    const local = (progress - 0.72) / 0.14
    return sampleKeys(ROOTS_KEYS, local)
  }
  const local = (progress - 0.86) / 0.14
  return sampleKeys(PLAYER_KEYS, local)
}

function CameraRig({
  isPlayerOpen,
  onScrollStateChange,
  onPlayerOpenChange,
}: SceneProps) {
  const { camera, gl } = useThree()
  const lastScrolled = useRef(false)
  const currentPos = useMemo(() => new Vector3(-5.8, EYE, 3.8), [])
  const currentLook = useMemo(() => new Vector3(-1.2, 1.4, -0.8), [])
  const playerTargetPos = useMemo(() => new Vector3(0, 1.15, 2.6), [])
  const playerTargetLook = useMemo(() => new Vector3(0, 0.45, 1.0), [])
  const crashProgress = useRef(0)
  const wasPlayerOpen = useRef(false)

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

    if (scrollProgress > 0.03 !== lastScrolled.current) {
      lastScrolled.current = scrollProgress > 0.03
      onScrollStateChange?.(lastScrolled.current)
    }

    if (isPlayerOpen && !wasPlayerOpen.current) {
      crashProgress.current = 0
    }
    wasPlayerOpen.current = isPlayerOpen

    if (isPlayerOpen) {
      crashProgress.current = MathUtils.damp(crashProgress.current, 1, 5.5, delta)
      const t = crashProgress.current
      const ease = t * t * (3 - 2 * t)
      const crashPos = currentPos.clone().lerp(playerTargetPos, ease)
      const crashLook = currentLook.clone().lerp(playerTargetLook, ease)
      camera.position.copy(crashPos)
      camera.lookAt(crashLook)
      return
    } else {
      crashProgress.current = MathUtils.damp(crashProgress.current, 0, 3.0, delta)
    }

    const { pos, look } = getCameraForProgress(scrollProgress)

    const targetPos = pos.clone().lerp(playerTargetPos, crashProgress.current)
    const targetLook = look.clone().lerp(playerTargetLook, crashProgress.current)

    currentPos.x = MathUtils.damp(currentPos.x, targetPos.x, 3.4, delta)
    currentPos.y = MathUtils.damp(currentPos.y, targetPos.y, 3.4, delta)
    currentPos.z = MathUtils.damp(currentPos.z, targetPos.z, 3.4, delta)

    currentLook.x = MathUtils.damp(currentLook.x, targetLook.x, 4.0, delta)
    currentLook.y = MathUtils.damp(currentLook.y, targetLook.y, 4.0, delta)
    currentLook.z = MathUtils.damp(currentLook.z, targetLook.z, 4.0, delta)

    camera.position.copy(currentPos)
    camera.lookAt(currentLook)
  })

  return null
}

type PlayerStoneProps = {
  onPlayerOpenChange: (open: boolean) => void
  isPlayerOpen: boolean
  visible: boolean
}

function PlayerStone({ onPlayerOpenChange, isPlayerOpen, visible }: PlayerStoneProps) {
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [])

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (!isPlayerOpen && visible) {
      onPlayerOpenChange(true)
    }
  }

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    if (!visible) return
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
      position={[0, 0, 1.1]}
      scale={1.05}
      visible={visible}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <pointLight
        position={[0, 1.3, 0.2]}
        color="#888"
        intensity={hovered || isPlayerOpen ? 1.6 : 0.45}
        distance={hovered || isPlayerOpen ? 5 : 2.8}
        decay={2}
      />
      <Model
        path={BASE + 'assets/stone_opt.glb'}
        scale={1.2}
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

    let near = 6
    let far = 32

    if (p < 0.38) {
      near = 8
      far = 36
    } else if (p < 0.48) {
      const local = (p - 0.38) / 0.1
      near = MathUtils.lerp(8, 1.5, local)
      far = MathUtils.lerp(36, 8, local)
    } else if (p < 0.72) {
      near = 4
      far = 22
    } else if (p < 0.86) {
      const local = (p - 0.72) / 0.14
      near = MathUtils.lerp(3, 0.8, local)
      far = MathUtils.lerp(18, 5, local)
    } else {
      const local = (p - 0.86) / 0.14
      near = MathUtils.lerp(1.5, 5, local)
      far = MathUtils.lerp(8, 18, local)
    }

    if (scene.fog && 'near' in scene.fog) {
      ;(scene.fog as any).near = near
      ;(scene.fog as any).far = far
    }
  })
  return null
}

function PhaseContent({
  isPlayerOpen,
  onPlayerOpenChange,
}: {
  isPlayerOpen: boolean
  onPlayerOpenChange: (open: boolean) => void
}) {
  const [phase, setPhase] = useState<'home' | 'socials' | 'player'>('home')

  useFrame(() => {
    const scrollRange = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    )
    const p = MathUtils.clamp(window.scrollY / scrollRange, 0, 1)

    if (p < 0.46) setPhase('home')
    else if (p < 0.84) setPhase('socials')
    else setPhase('player')
  })

  return (
    <>
      {/* HOME — only forest.glb */}
      <group visible={phase === 'home'}>
        <group position={[0, 0, 0]} scale={2}>
          <Model path={BASE + 'assets/forest.glb'} />
        </group>
        <spotLight
          position={[0, 6, 2]}
          intensity={1.6}
          color="#888"
          angle={0.65}
          penumbra={1}
          castShadow
        />
      </group>

      {/* SOCIALS — isolated dead tree */}
      <group visible={phase === 'socials' || phase === 'player'}>
        <group position={[0, 0, 0]} scale={2.4}>
          <Model path={BASE + 'assets/tree_web.glb'} />
        </group>
        <spotLight
          position={[2, 8, 4]}
          intensity={1.4}
          color="#888"
          angle={0.55}
          penumbra={1}
        />
        {phase === 'socials' && <SocialLinks />}
      </group>

      {/* PLAYER stone — lies on the ground */}
      <PlayerStone
        onPlayerOpenChange={onPlayerOpenChange}
        isPlayerOpen={isPlayerOpen}
        visible={phase === 'player'}
      />
    </>
  )
}

function World(props: SceneProps) {
  return (
    <>
      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#000', 6, 32]} />
      <FogController />

      <ambientLight intensity={0.14} color="#888" />
      <directionalLight
        intensity={1.25}
        color="#888"
        position={[4, 9, 6]}
        castShadow
      />

      <PhaseContent
        isPlayerOpen={props.isPlayerOpen}
        onPlayerOpenChange={props.onPlayerOpenChange}
      />
    </>
  )
}

export function Scene(props: SceneProps) {
  return (
    <Canvas
      camera={{
        position: [-5.8, EYE, 3.8],
        fov: 55,
        near: 0.08,
        far: 120,
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
