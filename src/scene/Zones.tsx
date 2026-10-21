import { Component, Suspense, type ReactNode } from 'react'
import { Html, Environment } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { Model } from './Model'

const BASE = import.meta.env.BASE_URL

type ZonesProps = {
  isPlayerOpen: boolean
  onPlayerOpenChange: (open: boolean) => void
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
      'Original assets/forest.glb is missing; skipping it rather than substituting the compressed forest_web.glb.',
      error.message,
    )
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

function ForestGround() {
  return (
    <ForestAssetBoundary fallback={null}>
      <Suspense fallback={null}>
        <Model path={BASE + 'assets/forest.glb'} />
      </Suspense>
    </ForestAssetBoundary>
  )
}

const openingTrees = [
  { id: 'opening-left-near', position: [-8, 0, 1] as [number, number, number], scale: 3.5, rotation: 0.25 },
  { id: 'opening-right-near', position: [8, 0, 0] as [number, number, number], scale: 3.8, rotation: -0.2 },
  { id: 'opening-left-back', position: [-10, 0, -8] as [number, number, number], scale: 4.1, rotation: 0.1 },
  { id: 'opening-right-back', position: [10, 0, -9] as [number, number, number], scale: 4.2, rotation: -0.15 },
  { id: 'opening-left-deep', position: [-11, 0, 12] as [number, number, number], scale: 4.5, rotation: -0.2 },
  { id: 'opening-right-deep', position: [11, 0, 11] as [number, number, number], scale: 4.6, rotation: 0.3 },
  { id: 'opening-far-left', position: [-17, 0, -2] as [number, number, number], scale: 4.4, rotation: 0.2 },
  { id: 'opening-far-right', position: [18, 0, 1] as [number, number, number], scale: 4.7, rotation: -0.25 },
  { id: 'opening-back-left', position: [-14, 0, -18] as [number, number, number], scale: 4.8, rotation: -0.15 },
  { id: 'opening-back-right', position: [14, 0, -19] as [number, number, number], scale: 4.9, rotation: 0.15 },
  { id: 'opening-forward-left', position: [-5.5, 0, 17] as [number, number, number], scale: 3.8, rotation: 0.1 },
  { id: 'opening-forward-right', position: [5.5, 0, 17] as [number, number, number], scale: 3.9, rotation: -0.1 },
]

function OpeningForestZone() {
  return (
    <group>
      {/* Native ground surface only; no substitute forest GLB is loaded. */}
      <mesh
        position={[0, 0.01, -1]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#05090c" roughness={1} />
      </mesh>

      <ForestGround />

      {openingTrees.map((tree) => (
        <group
          key={tree.id}
          position={tree.position}
          scale={tree.scale}
          rotation={[0, tree.rotation, 0]}
        >
          <Model path={BASE + 'assets/tree_web.glb'} />
        </group>
      ))}

      <pointLight
        color="#8bdfff"
        intensity={5}
        distance={16}
        decay={2}
        position={[0, 2.5, 1]}
      />
      <pointLight
        color="#315f88"
        intensity={2}
        distance={13}
        decay={2}
        position={[-7, 1.5, -4]}
      />
    </group>
  )
}

type SocialLink = {
  id: string
  shortLabel: string
  label: string
  href: string
  position: [number, number, number]
}

const socialLinks: SocialLink[] = [
  {
    id: 'github',
    shortLabel: 'GH',
    label: 'GitHub',
    href: 'https://github.com/b-1-o',
    position: [-2.7, -9.8, 0.55],
  },
  {
    id: 'tiktok',
    shortLabel: 'TT',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@psycho_b1o',
    position: [2.5, -11.6, 0.6],
  },
  {
    id: 'instagram',
    shortLabel: 'IG',
    label: 'Instagram',
    href: 'https://www.instagram.com/__._saint/',
    position: [-2, -13.6, 0.8],
  },
  {
    id: 'linkedin',
    shortLabel: 'in',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/b1o',
    position: [2.7, -15, 0.65],
  },
]

function SocialBranch({
  link,
}: {
  link: SocialLink
}) {
  return (
    <>
      <pointLight
        position={link.position}
        color="#7edfff"
        intensity={2.2}
        distance={4.5}
        decay={2}
      />
      <Html
        position={[link.position[0], link.position[1], link.position[2] + 0.2]}
        center
        zIndexRange={[20, 0]}
      >
        <a
          className="social-orb"
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={link.label}
          title={link.label}
          onClick={(event) => event.stopPropagation()}
        >
          <span className="social-orb__core">{link.shortLabel}</span>
          <span className="social-orb__label">{link.label}</span>
        </a>
      </Html>
    </>
  )
}

function DeadTreeSocialZone() {
  return (
    <group>
      {/* A simple floor keeps the tree's base visually grounded at this altitude. */}
      <mesh
        position={[0, -18.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[32, 96]} />
        <meshStandardMaterial color="#070b0e" roughness={1} />
      </mesh>

      <group position={[0, -18, 0]} scale={3.5}>
        <Model path={BASE + 'assets/tree_web.glb'} />
      </group>

      <pointLight
        position={[0, -12, -2]}
        color="#1e6b91"
        intensity={3}
        distance={18}
        decay={2}
      />

      {socialLinks.map((link) => (
        <SocialBranch key={link.id} link={link} />
      ))}
    </group>
  )
}

function CaveZone({
  isPlayerOpen,
  onPlayerOpenChange,
}: ZonesProps) {
  const caveRocks = [
    { id: 'north', position: [0, -36, -11] as [number, number, number], scale: 1.1, rotation: 0.2 },
    { id: 'north-west', position: [-8, -36, -8] as [number, number, number], scale: 0.85, rotation: 1.1 },
    { id: 'north-east', position: [8, -36, -7] as [number, number, number], scale: 0.95, rotation: -0.7 },
    { id: 'west', position: [-11, -36, 0] as [number, number, number], scale: 1.05, rotation: 0.5 },
    { id: 'east', position: [11, -36, 1] as [number, number, number], scale: 1.1, rotation: -0.4 },
    { id: 'south-west', position: [-7, -36, 7] as [number, number, number], scale: 0.9, rotation: -0.8 },
    { id: 'south-east', position: [7, -36, 8] as [number, number, number], scale: 0.85, rotation: 0.9 },
  ]

  const openPlayer = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onPlayerOpenChange(true)
  }

  return (
    <group>
      <mesh
        position={[0, -36.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[36, 128]} />
        <meshStandardMaterial color="#05080b" roughness={0.98} metalness={0.08} />
      </mesh>

      {caveRocks.map((rock) => (
        <group
          key={rock.id}
          position={rock.position}
          scale={rock.scale}
          rotation={[0, rock.rotation, 0]}
        >
          <Model path={BASE + 'assets/rocks_web.glb'} />
        </group>
      ))}

      <pointLight
        color="#3bbde8"
        intensity={4}
        distance={12}
        decay={2}
        position={[-4, -32.5, 1]}
      />
      <pointLight
        color="#1d4b81"
        intensity={3}
        distance={10}
        decay={2}
        position={[5, -34, -3]}
      />
      <pointLight
        color="#9ae9ff"
        intensity={1.1}
        distance={4}
        decay={2}
        position={[0, -34.2, 1.3]}
      />

      <group
        position={[0, -36, 0]}
        onClick={openPlayer}
      >
        <pointLight
          position={[0, 1.1, 0.25]}
          color="#9ae9ff"
          intensity={isPlayerOpen ? 0.4 : 2.3}
          distance={5}
          decay={2}
        />
        <Model path={BASE + 'assets/stone_opt.glb'} />
        <Html position={[0, 1.9, 0]} center zIndexRange={[30, 0]}>
          <span className="stone-prompt">OPEN PLAYER</span>
        </Html>
      </group>
    </group>
  )
}

export function Zones(props: ZonesProps) {
  return (
    <>
      <color attach="background" args={['#020508']} />
      <Environment
        files={BASE + 'assets/dark_autumn_forest_1k.hdr'}
        background={false}
        environmentIntensity={0.18}
      />

      <ambientLight intensity={0.16} />
      <directionalLight
        color="#8acdeb"
        intensity={0.55}
        position={[-4, 7, 5]}
      />

      <OpeningForestZone />

      <DeadTreeSocialZone />

      <CaveZone
        isPlayerOpen={props.isPlayerOpen}
        onPlayerOpenChange={props.onPlayerOpenChange}
      />
    </>
  )
}
