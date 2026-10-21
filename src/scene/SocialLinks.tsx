import { Html, useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'
import { useMemo } from 'react'

export const TREE_SCALE = 2.35

type SocialLink = {
  id: string
  label: string
  username: string
  href: string
  glyph: string
  position: [number, number, number]
}

// Link identity is stable; positions are calculated from tree_web.glb's actual bounds.
const links: Omit<SocialLink, 'position'>[] = [
  {
    id: 'tiktok',
    label: 'TikTok',
    username: '@psycho_b1o',
    href: 'https://www.tiktok.com/@psycho_b1o',
    glyph: '♪',
  },
  {
    id: 'github',
    label: 'GitHub',
    username: 'b-1-o',
    href: 'https://github.com/b-1-o',
    glyph: '⌘',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    username: '@__._saint',
    href: 'https://www.instagram.com/__._saint',
    glyph: '◎',
  },
  {
    id: 'discord',
    label: 'Discord',
    username: 'psycho_b1o',
    href: 'https://discord.gg/P9aqyGCSG',
    glyph: '◌',
  },
]

export function SocialLinks({ scale = TREE_SCALE }: { scale?: number }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'assets/tree_web.glb')
  const positionedLinks = useMemo(() => {
    scene.updateMatrixWorld(true)
    const bounds = new Box3().setFromObject(scene)
    if (bounds.isEmpty()) {
      const fallbackPositions: [number, number, number][] = [
        [1.2, 3.4, 0.4],
        [-1.2, 4.3, 0.4],
        [1.0, 5.2, 0.4],
        [-0.8, 6.0, 0.4],
      ]
      return links.map((link, index) => {
        const [x, y, z] = fallbackPositions[index]
        return { ...link, position: [x * scale, y * scale, z * scale] }
      })
    }

    const size = bounds.getSize(new Vector3())
    const center = bounds.getCenter(new Vector3())
    // Keep the orbs in the upper crown, slightly in front of the tree surface.
    const anchors = [
      [0.70, 0.62],
      [0.30, 0.72],
      [0.68, 0.82],
      [0.38, 0.91],
    ]
    return links.map((link, index) => ({
      ...link,
      position: [
        (bounds.min.x + size.x * anchors[index][0]) * scale,
        size.y * anchors[index][1] * scale,
        (center.z + size.z * 0.16) * scale,
      ] as [number, number, number],
    }))
  }, [scene, scale])

  return (
    <group>
      {positionedLinks.map((link) => (
        <group key={link.id}>
          <mesh position={link.position}>
            <sphereGeometry args={[0.16, 20, 20]} />
            <meshStandardMaterial color="#222" roughness={0.42} metalness={0.08} />
          </mesh>

          <Html
            position={[link.position[0], link.position[1], link.position[2] + 0.12]}
            center
            zIndexRange={[30, 0]}
          >
            <a
              className="social-orb"
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={'Open ' + link.label + ': ' + link.username}
              title={link.label + ' · ' + link.username}
              onClick={(event) => event.stopPropagation()}
              draggable={false}
            >
              <span className="social-orb__core">{link.glyph}</span>
              <span className="social-orb__label">{link.label}</span>
            </a>
          </Html>
        </group>
      ))}
    </group>
  )
}
