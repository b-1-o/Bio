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
    position: [1.45, 2.25, -4.55],
  },
  {
    id: 'github',
    label: 'GitHub',
    username: 'b-1-o',
    href: 'https://github.com/b-1-o',
    glyph: '⌘',
    position: [-1.4, 3.45, -5.15],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    username: '@__._saint',
    href: 'https://www.instagram.com/__._saint',
    glyph: '◎',
    position: [1.5, 4.7, -5.2],
  },
  {
    id: 'discord',
    label: 'Discord',
    username: 'psycho_b1o',
    href: 'https://discord.gg/P9aqyGCSG',
    glyph: '◌',
    position: [-1.15, 5.8, -5.1],
  },
]

export function SocialLinks() {
  return (
    <group>
      {links.map((link) => (
        <group key={link.id}>
          <mesh position={link.position}>
            <sphereGeometry args={[0.18, 24, 24]} />
            <meshStandardMaterial
              color="#333"
              roughness={0.42}
              metalness={0.08}
            />
          </mesh>

          <Html
            position={[link.position[0], link.position[1], link.position[2] + 0.1]}
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
