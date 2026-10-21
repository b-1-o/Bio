import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Box3, MathUtils, Vector3, Group, type Object3D } from 'three'
import { useGLTF } from '@react-three/drei'
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
 * Continuous narrative driven only by scroll.
 * Transitions are hidden inside dense fog so model swaps never pop.
 *
 * 0.00–0.36  HOME     human eye-level walk in forest.glb
 * 0.36–0.46  TRANSIT  fog swallows everything → swap to tree
 * 0.46–0.70  SOCIALS  isolated dead tree + social leaves
 * 0.70–0.84  ROOTS    spiral into roots / black
 * 0.84–1.00  PLAYER   stone on the ground
 */

// Measure the actual forest asset once (useGLTF caches the source). Model.tsx grounds its clone;
 // this helper applies the same grounding offset before deriving a human eye height.
function measureForest(scene: Object3D) {
  const bounds = new Box3().setFromObject(scene)
  if (bounds.isEmpty()) return { eye: 1.25, min: new Vector3(-5, 0, -5), size: new Vector3(10, 9, 10) }
  const min = bounds.min.clone()
  const size = bounds.getSize(new Vector3())
  // forest.glb is rendered at scale 2. A person’s eye line is estimated from the
  // measured environment height; all HOME keyframes then share this exact Y.
  const scale = 2
  const groundedHeight = size.y * scale
  const eye = Math.max(0.8, Math.min(3.2, groundedHeight * 0.14))
  return {
    eye,
    min: new Vector3(min.x * scale, 0, min.z * scale),
    size: size.multiplyScalar(scale),
  }
}

// HOME: strictly eye-level walk, constant height, looking forward at the church
function homeKeys(eye: number): Key[] {
  return [
    { t: 0.0, pos: [-5.4, eye, 3.4], look: [-0.8, eye, -1.0] },
    { t: 0.2, pos: [-3.6, eye, 4.2], look: [0.0, eye, -1.6] },
    { t: 0.4, pos: [-1.4, eye, 4.9], look: [0.3, eye, -2.0] },
    { t: 0.6, pos: [0.8, eye, 5.1], look: [0.5, eye, -2.4] },
    { t: 0.8, pos: [2.9, eye, 4.4], look: [0.7, eye, -2.7] },
    { t: 1.0, pos: [4.2, eye, 3.2], look: [0.9, eye, -2.9] },
  ]
}

// SOCIALS: orbit around the isolated tree
const SOCIALS = [
  { t: 0.0,  pos: [0.0, 3.2, 8.0], look: [0, 4.2, 0] },
  { t: 0.35, pos: [4.0, 4.0, 5.5], look: [0, 4.0, 0] },
  { t: 0.65, pos: [-3.5, 4.8, 5.0], look: [0, 3.8, 0] },
  { t: 1.0,  pos: [0.5, 5.5, 6.5], look: [0, 3.5, 0] },
]

// ROOTS: spiral down
const ROOTS = [
  { t: 0.0,  pos: [3.2, 4.0, 3.5], look: [0, 2.5, 0] },
  { t: 0.3,  pos: [-2.8, 1.8, 2.8], look: [0, 0.8, 0] },
  { t: 0.6,  pos: [2.2, -0.6, 1.5], look: [0, -1.8, 0] },
  { t: 1.0,  pos: [-0.8, -4.0, 0.2], look: [0, -6.0, 0] },
]

// PLAYER
const PLAYER = [
  { t: 0.0,  pos: [0, 1.9, 5.8], look: [0, 0.45, 1.3] },
  { t: 1.0,  pos: [0, 1.55, 4.0], look: [0, 0.4, 1.1] },
]

type Key = { t: number; pos: number[]; look: number[] }

function sample(keys: Key[], progress: number) {
  const p = MathUtils.clamp(progress, 0, 1)
  let i = 0
  while (i < keys.length - 2 && keys[i + 1].t < p) i++
  const a = keys[i]
  const b = keys[i + 1]
  const local = (p - a.t) / (b.t - a.t || 1)
  const t = local * local * (3 - 2 * local)
  return {
    pos: new Vector3(
      MathUtils.lerp(a.pos[0], b.pos[0], t),
      MathUtils.lerp(a.pos[1], b.pos[1], t),
      MathUtils.lerp(a.pos[2], b.pos[2], t),
    ),
    look: new Vector3(
      MathUtils.lerp(a.look[0], b.look[0], t),
      MathUtils.lerp(a.look[1], b.look[1], t),
      MathUtils.lerp(a.look[2], b.look[2], t),
    ),
  }
}

function cameraAt(progress: number) {
  if (progress < 0.36) return sample(HOME, progress / 0.36)
  if (progress < 0.46) return sample(HOME, 1)
  if (progress < 0.70) return sample(SOCIALS, (progress - 0.46) / 0.24)
  if (progress < 0.84) return sample(ROOTS, (progress - 0.70) / 0.14)
  return sample(PLAYER, (progress - 0.84) / 0.16)
}

function CameraRig({
  isPlayerOpen,
  onScrollStateChange,
  onPlayerOpenChange,
}: SceneProps) {
  const { camera, gl } = useThree()\n  const { scene: forestSource } = useGLTF(BASE + 'assets/forest.glb')\n  const measured = useMemo(() => measureForest(forestSource), [forestSource])\n  const EYE = measured.eye
  const lastScrolled = useRef(false)
  const pos = useMemo(() => new Vector3(-5.4, EYE, 3.4), [EYE])
  const look = useMemo(() => new Vector3(-0.8, EYE, -1.0), [EYE])
  const crashPos = useMemo(() => new Vector3(0, 1.1, 2.4), [])
  const crashLook = useMemo(() => new Vector3(0, 0.4, 1.0), [])
  const crashT = useRef(0)
  const wasOpen = useRef(false)

  useEffect(() => {
    const el = gl.domElement
    const close = () => {
      if (isPlayerOpen) onPlayerOpenChange(false)
    }
    el.addEventListener('pointerdown', close)
    return () => el.removeEventListener('pointerdown', close)
  }, [gl, isPlayerOpen, onPlayerOpenChange])

  useFrame((_, dt) => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const p = MathUtils.clamp(window.scrollY / max, 0, 1)

    if (p > 0.025 !== lastScrolled.current) {
      lastScrolled.current = p > 0.025
      onScrollStateChange?.(lastScrolled.current)
    }

    if (isPlayerOpen && !wasOpen.current) crashT.current = 0
    wasOpen.current = isPlayerOpen

    if (isPlayerOpen) {
      crashT.current = MathUtils.damp(crashT.current, 1, 6, dt)
      const e = crashT.current * crashT.current * (3 - 2 * crashT.current)
      camera.position.lerpVectors(pos, crashPos, e)
      const l = look.clone().lerp(crashLook, e)
      camera.lookAt(l)
      return
    }
    crashT.current = MathUtils.damp(crashT.current, 0, 3.2, dt)

    const target = cameraAt(p, EYE, measured.size)
    target.pos.lerp(crashPos, crashT.current)
    target.look.lerp(crashLook, crashT.current)

    pos.x = MathUtils.damp(pos.x, target.pos.x, 3.6, dt)
    pos.y = MathUtils.damp(pos.y, target.pos.y, 3.6, dt)
    pos.z = MathUtils.damp(pos.z, target.pos.z, 3.6, dt)
    look.x = MathUtils.damp(look.x, target.look.x, 4.2, dt)
    look.y = MathUtils.damp(look.y, target.look.y, 4.2, dt)
    look.z = MathUtils.damp(look.z, target.look.z, 4.2, dt)

    camera.position.copy(pos)
    camera.lookAt(look)
  })

  return null
}

function FogController() {
  const { scene } = useThree()
  useFrame(() => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const p = MathUtils.clamp(window.scrollY / max, 0, 1)
    let near = 7
    let far = 34

    if (p < 0.36) {
      near = 7
      far = 34
    } else if (p < 0.46) {
      const t = (p - 0.36) / 0.1
      near = MathUtils.lerp(7, 0.6, t)
      far = MathUtils.lerp(34, 4, t)
    } else if (p < 0.70) {
      near = 3.5
      far = 20
    } else if (p < 0.84) {
      const t = (p - 0.70) / 0.14
      near = MathUtils.lerp(3, 0.5, t)
      far = MathUtils.lerp(16, 3.5, t)
    } else {
      const t = (p - 0.84) / 0.16
      near = MathUtils.lerp(1.2, 4.5, t)
      far = MathUtils.lerp(6, 16, t)
    }

    if (scene.fog && 'near' in scene.fog) {
      ;(scene.fog as any).near = near
      ;(scene.fog as any).far = far
    }
  })
  return null
}

function PhaseModels({
  isPlayerOpen,
  onPlayerOpenChange,
}: {
  isPlayerOpen: boolean
  onPlayerOpenChange: (v: boolean) => void
}) {
  const { scene: forestSource } = useGLTF(BASE + 'assets/forest.glb')\n  const homeRef = useRef<Group>(null)
  const treeRef = useRef<Group>(null)
  const stoneVisible = useRef(false)
  const [showStone, setShowStone] = useState(false)
  const [showSocials, setShowSocials] = useState(false)

  useFrame(() => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const p = MathUtils.clamp(window.scrollY / max, 0, 1)

    if (homeRef.current) homeRef.current.visible = p < 0.42
    if (treeRef.current) treeRef.current.visible = p >= 0.40 && p < 0.88

    const social = p >= 0.46 && p < 0.72
    if (social !== showSocials) setShowSocials(social)

    const stone = p >= 0.84
    if (stone !== stoneVisible.current) {
      stoneVisible.current = stone
      setShowStone(stone)
    }
  })

  return (
    <>
      <group ref={homeRef}>
        <group position={[0, 0, 0]} scale={2}>
          <Model path={BASE + 'assets/forest.glb'} />
        </group>
        <spotLight position={[1, 7, 3]} intensity={1.5} color="#888" angle={0.7} penumbra={1} castShadow />
      </group>

      <group ref={treeRef}>
        <group position={[0, 0, 0]} scale={2.35}>
          <Model path={BASE + 'assets/tree_web.glb'} />
        </group>
        <spotLight position={[2, 9, 5]} intensity={1.35} color="#888" angle={0.55} penumbra={1} />
        {showSocials && <SocialLinks />}
      </group>

      <PlayerStone
        onPlayerOpenChange={onPlayerOpenChange}
        isPlayerOpen={isPlayerOpen}
        visible={showStone}
      />
    </>
  )
}

type StoneProps = {
  onPlayerOpenChange: (v: boolean) => void
  isPlayerOpen: boolean
  visible: boolean
}

function PlayerStone({ onPlayerOpenChange, isPlayerOpen, visible }: StoneProps) {
  const [hovered, setHovered] = useState(false)

  useEffect(() => () => {
    document.body.style.cursor = 'default'
  }, [])

  return (
    <group
      position={[0, 0, 1.0]}
      scale={1.0}
      visible={visible}
      onClick={(e) => {
        e.stopPropagation()
        if (!isPlayerOpen && visible) onPlayerOpenChange(true)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (!visible) return
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      <pointLight
        position={[0, 1.2, 0.25]}
        color="#888"
        intensity={hovered || isPlayerOpen ? 1.7 : 0.4}
        distance={hovered || isPlayerOpen ? 5 : 2.6}
        decay={2}
      />
      <Model path={BASE + 'assets/stone_opt.glb'} scale={1.15} highlight={hovered || isPlayerOpen} />
    </group>
  )
}

function World(props: SceneProps) {
  return (
    <>
      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#000', 7, 34]} />
      <FogController />
      <ambientLight intensity={0.13} color="#888" />
      <directionalLight intensity={1.2} color="#888" position={[4, 10, 5]} castShadow />
      <PhaseModels
        isPlayerOpen={props.isPlayerOpen}
        onPlayerOpenChange={props.onPlayerOpenChange}
      />
    </>
  )
}

export function Scene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [-5.4, EYE, 3.4], fov: 55, near: 0.08, far: 100 }}
      dpr={[1, 1.5]}
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
