import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Box3, MathUtils, Vector3, Group, type Object3D } from 'three'
import { useGLTF } from '@react-three/drei'
import { Model } from './Model'
import { SocialLinks, TREE_SCALE } from './SocialLinks'
import { PostFX } from './PostFX'

const BASE = import.meta.env.BASE_URL
const FOREST_SCALE = 2
const STONE_SCALE = 1.15
const STONE_POSITION = new Vector3(0, 0, 1)

type SceneProps = {
  isPlayerOpen: boolean
  onPlayerOpenChange: (open: boolean) => void
  onScrollStateChange?: (scrolled: boolean) => void
}

type Key = { t: number; pos: [number, number, number]; look: [number, number, number] }

type AssetMetrics = {
  min: Vector3
  max: Vector3
  size: Vector3
  center: Vector3
  eye?: number
  churchTarget?: Vector3
  houseTarget?: Vector3
  houseSize?: Vector3
}

type Routes = {
  eye: number
  home: Key[]
  socials: Key[]
  roots: Key[]
  player: Key[]
  stoneCenter: Vector3
  crashPosition: Vector3
  crashLook: Vector3
}

/**
 * Scroll narrative:
 * HOME 0.00–0.36 · black-fog swap 0.36–0.46
 * SOCIALS 0.46–0.70 · ROOTS 0.70–0.84 · black-fog swap/reveal 0.84–0.88
 * PLAYER 0.88–1.00
 *
 * All geometry metrics use the same scales as the rendered model groups.
 * Model.tsx grounds each cloned GLTF; the metrics below apply that same Y offset.
 */
function measureAsset(scene: Object3D, scale: number): AssetMetrics {
  scene.updateMatrixWorld(true)
  const raw = new Box3().setFromObject(scene)
  if (raw.isEmpty()) {
    const size = new Vector3(10, 8, 10).multiplyScalar(scale)
    const min = new Vector3(-size.x / 2, 0, -size.z / 2)
    const max = new Vector3(size.x / 2, size.y, size.z / 2)
    return { min, max, size, center: new Vector3(0, size.y / 2, 0) }
  }

  const rawSize = raw.getSize(new Vector3())
  const size = rawSize.clone().multiplyScalar(scale)
  const min = new Vector3(raw.min.x * scale, 0, raw.min.z * scale)
  const max = new Vector3(raw.max.x * scale, size.y, raw.max.z * scale)
  const center = new Vector3(
    (raw.min.x + raw.max.x) * 0.5 * scale,
    size.y * 0.5,
    (raw.min.z + raw.max.z) * 0.5 * scale,
  )

  let namedHouseHeight = 0
  let houseVolume = 0
  let houseTarget: Vector3 | undefined
  let houseSize: Vector3 | undefined
  let churchVolume = 0
  let churchTarget: Vector3 | undefined

  scene.traverse((object) => {
    const name = object.name.toLowerCase()
    const bounds = new Box3().setFromObject(object)
    if (bounds.isEmpty()) return
    const objectSize = bounds.getSize(new Vector3())
    const worldHeight = objectSize.y * scale

    // Prefer a named one-storey house/cabin over the church tower or trees.
    if (
      /(house|cabin|cottage|shack|home)/i.test(name) &&
      worldHeight >= 1.2 &&
      worldHeight <= 4.5
    ) {
      const volume = objectSize.x * objectSize.y * objectSize.z
      if (worldHeight > namedHouseHeight || volume > houseVolume) {
        namedHouseHeight = Math.max(namedHouseHeight, worldHeight)
        houseVolume = volume
        const c = bounds.getCenter(new Vector3())
        houseTarget = new Vector3(c.x * scale, 0, c.z * scale)
        houseSize = objectSize.clone().multiplyScalar(scale)
      }
    }

    if (/(church|chapel|cathedral|steeple)/i.test(name) && worldHeight < size.y * 0.96) {
      const volume = objectSize.x * objectSize.y * objectSize.z
      if (volume > churchVolume) {
        churchVolume = volume
        const c = bounds.getCenter(new Vector3())
        churchTarget = new Vector3(c.x * scale, 0, c.z * scale)
      }
    }
  })

  // The doorway/house height is the preferred reference. For GLBs without
  // semantic node names, use a conservative human-scale fallback instead of
  // a percentage of the tallest tree/church steeple.
  const eye = namedHouseHeight > 0
    ? MathUtils.clamp(namedHouseHeight * 0.60, 1.15, 1.65)
    : MathUtils.clamp(size.y * 0.16, 1.25, 1.65)

  return { min, max, size, center, eye, churchTarget, houseTarget, houseSize }
}

function homeKeys(forest: AssetMetrics, eye: number): Key[] {
  const x = (fraction: number) => forest.min.x + forest.size.x * fraction
  const z = (fraction: number) => forest.min.z + forest.size.z * fraction
  const church = forest.churchTarget ?? new Vector3(
    forest.min.x + forest.size.x * 0.52,
    0,
    forest.min.z + forest.size.z * 0.43,
  )
  // If the GLB has a named house node, derive the opening position from it:
  // stand just to its front-left, then join the measured front-edge arc.
  const house = forest.houseTarget
  const houseSize = forest.houseSize ?? new Vector3(1.4, 2.4, 1.4)
  const startX = house
    ? MathUtils.clamp(house.x - houseSize.x * 0.55, forest.min.x + forest.size.x * 0.025, forest.max.x - forest.size.x * 0.025)
    : x(0.20)
  const startZ = house
    ? MathUtils.clamp(house.z + houseSize.z * 0.85, forest.min.z + forest.size.z * 0.66, forest.max.z - forest.size.z * 0.025)
    : z(0.80)
  // One fixed horizontal sightline for the whole walk: movement changes the
  // viewer's position, never the fact that they are looking toward the church.
  const look: [number, number, number] = [church.x, eye + 0.08, church.z]
  return [
    { t: 0.00, pos: [startX, eye, startZ], look },
    { t: 0.20, pos: [x(0.29), eye, z(0.85)], look },
    { t: 0.40, pos: [x(0.40), eye, z(0.88)], look },
    { t: 0.60, pos: [x(0.53), eye, z(0.88)], look },
    { t: 0.80, pos: [x(0.66), eye, z(0.84)], look },
    { t: 1.00, pos: [x(0.77), eye, z(0.78)], look },
  ]
}

function socialKeys(tree: AssetMetrics): Key[] {
  const height = Math.max(tree.size.y, 2)
  const radius = Math.max(3.6, Math.max(tree.size.x, tree.size.z) * 0.78 + 0.7)
  const cx = tree.center.x
  const cz = tree.center.z
  const at = (angle: number, y: number, r = radius): [number, number, number] => [
    cx + Math.sin(angle) * r,
    y,
    cz + Math.cos(angle) * r,
  ]
  const look = (fraction: number): [number, number, number] => [cx, height * fraction, cz]
  return [
    { t: 0.00, pos: at(0.05, height * 0.62), look: look(0.67) },
    { t: 0.34, pos: at(0.72, height * 0.57), look: look(0.62) },
    { t: 0.68, pos: at(1.55, height * 0.51), look: look(0.56) },
    { t: 1.00, pos: at(2.35, height * 0.44), look: look(0.50) },
  ]
}

function rootKeys(tree: AssetMetrics, socials: Key[]): Key[] {
  const height = Math.max(tree.size.y, 2)
  const radius = Math.max(3.6, Math.max(tree.size.x, tree.size.z) * 0.78 + 0.7)
  const cx = tree.center.x
  const cz = tree.center.z
  const last = socials[socials.length - 1].pos
  const startAngle = 2.35
  const at = (angle: number, y: number, r: number): [number, number, number] => [
    cx + Math.sin(angle) * r,
    y,
    cz + Math.cos(angle) * r,
  ]
  const lookAt = (y: number): [number, number, number] => [cx, y, cz]
  return [
    { t: 0.00, pos: last, look: socials[socials.length - 1].look },
    { t: 0.32, pos: at(startAngle + 1.65, height * 0.30, radius * 0.72), look: lookAt(height * 0.36) },
    { t: 0.67, pos: at(startAngle + 3.55, height * 0.16, radius * 0.43), look: lookAt(height * 0.19) },
    { t: 1.00, pos: at(startAngle + 5.20, Math.max(0.22, height * 0.065), radius * 0.18), look: lookAt(Math.max(0.3, height * 0.11)) },
  ]
}

// Cubic Catmull–Rom interpolation carries momentum through keyframes; unlike
// smoothstep on every segment, the camera does not visibly slow at each point.
function sample(keys: Key[], progress: number) {
  const p = MathUtils.clamp(progress, 0, 1)
  let i = 0
  while (i < keys.length - 2 && keys[i + 1].t < p) i += 1
  const a = keys[i]
  const b = keys[i + 1]
  const previous = keys[Math.max(0, i - 1)]
  const next = keys[Math.min(keys.length - 1, i + 2)]
  const local = MathUtils.clamp((p - a.t) / (b.t - a.t || 1), 0, 1)

  const interpolate = (field: 'pos' | 'look', axis: 0 | 1 | 2) => {
    const p0 = previous[field][axis]
    const p1 = a[field][axis]
    const p2 = b[field][axis]
    const p3 = next[field][axis]
    const t2 = local * local
    const t3 = t2 * local
    return 0.5 * (
      2 * p1 +
      (-p0 + p2) * local +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3
    )
  }

  return {
    pos: new Vector3(interpolate('pos', 0), interpolate('pos', 1), interpolate('pos', 2)),
    look: new Vector3(interpolate('look', 0), interpolate('look', 1), interpolate('look', 2)),
  }
}

function createRoutes(forest: AssetMetrics, tree: AssetMetrics, stone: AssetMetrics): Routes {
  const eye = forest.eye ?? 1.55
  const home = homeKeys(forest, eye)
  const socials = socialKeys(tree)
  const roots = rootKeys(tree, socials)

  // stone_opt.glb is grounded by Model.tsx, then placed at STONE_POSITION.
  const stoneCenter = new Vector3(
    stone.center.x + STONE_POSITION.x,
    Math.max(0.05, stone.size.y * 0.42),
    stone.center.z + STONE_POSITION.z,
  )
  const frontDistance = Math.max(3.1, stone.size.z * 2.1 + stone.size.x * 0.22)
  const playerLook: [number, number, number] = [
    stoneCenter.x,
    Math.max(0.18, stone.size.y * 0.42),
    stoneCenter.z,
  ]
  const player: Key[] = [
    {
      t: 0,
      pos: [stoneCenter.x, Math.max(eye * 0.94, stone.size.y * 1.25), stoneCenter.z + frontDistance],
      look: playerLook,
    },
    {
      t: 0.55,
      pos: [stoneCenter.x, Math.max(eye * 0.94, stone.size.y * 1.2), stoneCenter.z + frontDistance * 0.88],
      look: playerLook,
    },
    {
      t: 1,
      pos: [stoneCenter.x, Math.max(eye * 0.94, stone.size.y * 1.2), stoneCenter.z + frontDistance * 0.80],
      look: playerLook,
    },
  ]

  const crashPosition = new Vector3(
    stoneCenter.x,
    Math.max(0.2, stone.size.y * 0.52),
    stoneCenter.z + Math.max(0.18, stone.size.z * 0.12),
  )
  const crashLook = stoneCenter.clone()
  return { eye, home, socials, roots, player, stoneCenter, crashPosition, crashLook }
}

function cameraAt(progress: number, routes: Routes) {
  if (progress < 0.36) return sample(routes.home, progress / 0.36)
  if (progress < 0.46) return sample(routes.home, 1)
  if (progress < 0.70) return sample(routes.socials, (progress - 0.46) / 0.24)
  if (progress < 0.84) return sample(routes.roots, (progress - 0.70) / 0.14)
  return sample(routes.player, (progress - 0.84) / 0.16)
}

function scrollProgress() {
  const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  return MathUtils.clamp(window.scrollY / scrollable, 0, 1)
}

function CameraRig({ isPlayerOpen, onScrollStateChange, onPlayerOpenChange }: SceneProps) {
  const { camera, gl } = useThree()
  const { scene: forestSource } = useGLTF(BASE + 'assets/forest.glb')
  const { scene: treeSource } = useGLTF(BASE + 'assets/tree_web.glb')
  const { scene: stoneSource } = useGLTF(BASE + 'assets/stone_opt.glb')

  const forest = useMemo(() => measureAsset(forestSource, FOREST_SCALE), [forestSource])
  const tree = useMemo(() => measureAsset(treeSource, TREE_SCALE), [treeSource])
  const stone = useMemo(() => measureAsset(stoneSource, STONE_SCALE), [stoneSource])
  const routes = useMemo(() => createRoutes(forest, tree, stone), [forest, tree, stone])

  const initial = routes.home[0]
  const position = useMemo(() => new Vector3(...initial.pos), [initial])
  const look = useMemo(() => new Vector3(...initial.look), [initial])
  const crashT = useRef(0)
  const wasOpen = useRef(false)
  const lastScrolled = useRef(false)

  useEffect(() => {
    const canvas = gl.domElement
    const closeOnBackground = () => {
      if (isPlayerOpen) onPlayerOpenChange(false)
    }
    canvas.addEventListener('pointerdown', closeOnBackground)
    return () => canvas.removeEventListener('pointerdown', closeOnBackground)
  }, [gl, isPlayerOpen, onPlayerOpenChange])

  useFrame((_, dt) => {
    const p = scrollProgress()
    const scrolled = p > 0.025
    if (scrolled !== lastScrolled.current) {
      lastScrolled.current = scrolled
      onScrollStateChange?.(scrolled)
    }

    if (isPlayerOpen && !wasOpen.current) crashT.current = 0
    wasOpen.current = isPlayerOpen

    if (isPlayerOpen) {
      crashT.current = MathUtils.damp(crashT.current, 1, 7.5, dt)
      const eased = crashT.current * crashT.current * (3 - 2 * crashT.current)
      camera.position.lerpVectors(position, routes.crashPosition, eased)
      camera.lookAt(look.clone().lerp(routes.crashLook, eased))
      return
    }

    crashT.current = MathUtils.damp(crashT.current, 0, 3.5, dt)
    const target = cameraAt(p, routes)
    target.pos.lerp(routes.crashPosition, crashT.current)
    target.look.lerp(routes.crashLook, crashT.current)

    position.x = MathUtils.damp(position.x, target.pos.x, 3.8, dt)
    position.y = MathUtils.damp(position.y, target.pos.y, 3.8, dt)
    position.z = MathUtils.damp(position.z, target.pos.z, 3.8, dt)
    look.x = MathUtils.damp(look.x, target.look.x, 4.4, dt)
    look.y = MathUtils.damp(look.y, target.look.y, 4.4, dt)
    look.z = MathUtils.damp(look.z, target.look.z, 4.4, dt)

    camera.position.copy(position)
    camera.lookAt(look)
  })

  return null
}

function FogController() {
  const { scene } = useThree()
  useFrame(() => {
    const p = scrollProgress()
    let near: number
    let far: number

    if (p < 0.36) {
      near = 7
      far = 34
    } else if (p < 0.46) {
      const t = (p - 0.36) / 0.10
      near = MathUtils.lerp(7, 0.04, t)
      far = MathUtils.lerp(34, 0.65, t)
    } else if (p < 0.49) {
      const t = (p - 0.46) / 0.03
      near = MathUtils.lerp(0.04, 3.2, t)
      far = MathUtils.lerp(0.65, 21, t)
    } else if (p < 0.70) {
      near = 3.2
      far = 21
    } else if (p < 0.84) {
      const t = (p - 0.70) / 0.14
      near = MathUtils.lerp(3.2, 0.04, t)
      far = MathUtils.lerp(21, 0.65, t)
    } else if (p < 0.88) {
      const t = (p - 0.84) / 0.04
      near = MathUtils.lerp(0.04, 3.2, t)
      far = MathUtils.lerp(0.65, 21, t)
    } else {
      near = 3.2
      far = 21
    }

    if (scene.fog && 'near' in scene.fog) {
      scene.fog.near = near
      scene.fog.far = far
    }
  })
  return null
}

function PhaseModels({
  isPlayerOpen,
  onPlayerOpenChange,
}: {
  isPlayerOpen: boolean
  onPlayerOpenChange: (open: boolean) => void
}) {
  const homeRef = useRef<Group>(null)
  const treeRef = useRef<Group>(null)
  const stoneVisible = useRef(false)
  const [showStone, setShowStone] = useState(false)
  const [showSocials, setShowSocials] = useState(false)

  useFrame(() => {
    const p = scrollProgress()
    // Model swaps happen at the exact far-fog minimum (far = 0.65).
    if (homeRef.current) homeRef.current.visible = p < 0.46
    if (treeRef.current) treeRef.current.visible = p >= 0.46 && p < 0.84

    const socialsVisible = p >= 0.46 && p < 0.70
    if (socialsVisible !== showSocials) setShowSocials(socialsVisible)

    const stoneIsVisible = p >= 0.84
    if (stoneIsVisible !== stoneVisible.current) {
      stoneVisible.current = stoneIsVisible
      setShowStone(stoneIsVisible)
    }
  })

  return (
    <>
      <group ref={homeRef}>
        <group scale={FOREST_SCALE}>
          <Model path={BASE + 'assets/forest.glb'} />
        </group>
        <spotLight position={[1, 7, 3]} intensity={1.5} color="#888" angle={0.7} penumbra={1} castShadow />
      </group>

      <group ref={treeRef}>
        <group scale={TREE_SCALE}>
          <Model path={BASE + 'assets/tree_web.glb'} />
        </group>
        <spotLight position={[2, 9, 5]} intensity={1.35} color="#888" angle={0.55} penumbra={1} />
        {showSocials && <SocialLinks scale={TREE_SCALE} />}
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
  onPlayerOpenChange: (open: boolean) => void
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
      position={STONE_POSITION}
      visible={visible}
      onClick={(event) => {
        event.stopPropagation()
        if (!isPlayerOpen && visible) onPlayerOpenChange(true)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        if (!visible) return
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
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
      <Model path={BASE + 'assets/stone_opt.glb'} scale={STONE_SCALE} highlight={hovered || isPlayerOpen} />
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
      camera={{ position: [0, 1.55, 5], fov: 55, near: 0.08, far: 100 }}
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
