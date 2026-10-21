import { Html } from '@react-three/drei'

type SocialLink = {
  id: string
  label: string
  username: string
  href: string
  glyph: string
  position: [number, number, number]
}

const links: SocialLink[] = [
  {
    id: 'tiktok',
    label: 'TikTok',
    username: '@psycho_b1o',
    href: 'https://www.tiktok.com/@psycho_b1o',
    glyph: '♪',
    position: [2.05, 3.9, -0.85],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    username: '@__._saint',
    href: 'https://www.instagram.com/__._saint',
    glyph: '◎',
    position: [-2.05, 5.8, -1.05],
  },
  {
    id: 'github',
    label: 'GitHub',
    username: 'b-1-o',
    href: 'https://github.com/b-1-o',
    glyph: '⌘',
    position: [1.85, 7.8, -1.15],
  },
  {
    id: 'discord',
    label: 'Discord',
    username: 'psycho_b1o',
    href: 'https://discord.gg/P9aqyGCSG',
    glyph: '◌',
    position: [-1.55, 9.55, -1.25],
  },
]

export function SocialLinks() {
  return (
    <group>
      {links.map((link) => (
        <group key={link.id}>
          {/* Emissive geometry catches Bloom; the HTML anchor handles navigation. */}
          <mesh position={link.position}>
            <sphereGeometry args={[0.16, 28, 28]} />
            <meshStandardMaterial
              color="#c4f1ff"
              emissive="#65d7ff"
              emissiveIntensity={3.2}
              roughness={0.18}
              metalness={0.08}
              toneMapped={false}
            />
          </mesh>

          <pointLight
            position={link.position}
            color="#72dfff"
            intensity={1.2}
            distance={4.5}
            decay={2}
          />

          <Html
            position={[link.position[0], link.position[1], link.position[2] + 0.08]}
            center
            zIndexRange={[30, 0]}
          >
            <a
              className="social-orb"
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${link.label}: ${link.username}`}
              title={`${link.label} · ${link.username}`}
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
