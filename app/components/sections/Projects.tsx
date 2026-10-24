import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type ProjectArt = 'music' | 'docs' | 'jobbrain' | 'shopline'

type Project = {
  number: string
  name: string
  category: string
  description: string
  stack: string[]
  repository: string
  live?: string
  art: ProjectArt
}

const projects: Project[] = [
  {
    number: '01',
    name: 'SelfMusic',
    category: 'Personal music platform',
    description:
      'A private music library built for streaming, playlists, listening history, uploads and offline-ready playback — on my own terms.',
    stack: ['React', 'JavaScript', 'Vite', 'Express', 'SQLite', 'PWA'],
    repository: 'https://github.com/b-1-o/selfmusic',
    art: 'music',
  },
  {
    number: '02',
    name: 'Collab Docs',
    category: 'Collaborative workspace',
    description:
      'A real-time document space with rich-text editing, shared cursors and edge-powered collaboration.',
    stack: ['React', 'TypeScript', 'Yjs', 'Cloudflare', 'Auth0'],
    repository: 'https://github.com/b-1-o/cloud-project',
    live: 'https://collab-docs-4tb.pages.dev/',
    art: 'docs',
  },
  {
    number: '03',
    name: 'JoBrain',
    category: 'Job search companion',
    description:
      'A focused workspace to organise applications, track progress and keep the entire search in one place.',
    stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma'],
    repository: 'https://github.com/b-1-o/JoBrain',
    live: 'https://jobrain.vercel.app',
    art: 'jobbrain',
  },
  {
    number: '04',
    name: 'Shopline',
    category: 'Smart grocery planning',
    description:
      'A grocery planning concept that connects budgets, preferences and product discovery without losing sight of the total.',
    stack: ['React', 'TypeScript', 'APIs', 'Vercel'],
    repository: 'https://github.com/b-1-o/shopline',
    live: 'https://shopline-bice.vercel.app/',
    art: 'shopline',
  },
]

function ArrowIcon({ diagonal = true }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d={diagonal ? 'M5 15 15 5M6 5h9v9' : 'M3 10h13M10 4l6 6-6 6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProjectIllustration({ kind }: { kind: ProjectArt }) {
  if (kind === 'music') {
    return (
      <svg viewBox="0 0 640 420" role="img" aria-label="Illustration of a vinyl record and a personal music library">
        <defs>
          <pattern id="musicGrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#fff" strokeOpacity=".05" strokeWidth=".7" />
          </pattern>
          <radialGradient id="musicHalo">
            <stop offset="0" stopColor="#a3a3a3" stopOpacity=".22" />
            <stop offset="1" stopColor="#080808" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="musicVinyl" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#343434" />
            <stop offset=".42" stopColor="#0c0c0c" />
            <stop offset=".7" stopColor="#202020" />
            <stop offset="1" stopColor="#050505" />
          </linearGradient>
          <linearGradient id="musicLabel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d4d4d4" />
            <stop offset="1" stopColor="#686868" />
          </linearGradient>
        </defs>
        <rect width="640" height="420" fill="#080808" />
        <rect width="640" height="420" fill="url(#musicGrid)" />
        <circle cx="409" cy="185" r="210" fill="url(#musicHalo)" />
        <path d="M20 232C75 232 83 232 116 232S147 209 169 209 191 257 211 257 231 225 256 225" fill="none" stroke="#a3a3a3" strokeOpacity=".54" strokeWidth="1.2" />
        <g opacity=".72">
          {Array.from({ length: 15 }, (_, i) => {
            const heights = [11, 18, 29, 17, 39, 24, 14, 31, 45, 21, 33, 17, 28, 12, 20]
            return <rect key={i} x={48 + i * 14} y={274 - heights[i] / 2} width="3" height={heights[i]} rx="1.5" fill="#d4d4d4" opacity={0.35 + (i % 4) * 0.16} />
          })}
        </g>
        <g className="art-float">
          <circle cx="414" cy="180" r="137" fill="url(#musicVinyl)" stroke="#777" strokeOpacity=".7" />
          {[124, 113, 102, 91, 80, 69].map((radius) => (
            <circle key={radius} cx="414" cy="180" r={radius} fill="none" stroke="#8a8a8a" strokeOpacity=".22" strokeWidth="1" />
          ))}
          <path d="M327 97A124 124 0 0 1 461 83" fill="none" stroke="#f5f5f5" strokeOpacity=".28" strokeWidth="2" strokeLinecap="round" />
          <path d="M477 257A91 91 0 0 1 359 289" fill="none" stroke="#d4d4d4" strokeOpacity=".16" strokeWidth="2" strokeLinecap="round" />
          <circle cx="414" cy="180" r="42" fill="url(#musicLabel)" />
          <circle cx="414" cy="180" r="32" fill="#151515" />
          <path d="M403 165L430 180L403 195Z" fill="#e5e5e5" />
          <circle cx="414" cy="180" r="4" fill="#777" />
        </g>
        <g transform="translate(50 303)">
          <rect width="238" height="76" rx="8" fill="#111" stroke="#555" strokeOpacity=".8" />
          <rect x="12" y="12" width="50" height="50" rx="4" fill="#272727" />
          <path d="M18 51L32 32L41 43L50 25L58 51Z" fill="#a3a3a3" />
          <circle cx="40" cy="25" r="5" fill="#e5e5e5" />
          <text x="75" y="28" fill="#f5f5f5" fontSize="10" letterSpacing="1.4" fontFamily="monospace">NOW SPINNING</text>
          <text x="75" y="45" fill="#a3a3a3" fontSize="11" fontFamily="monospace">your own library</text>
          <rect x="75" y="56" width="146" height="2" rx="1" fill="#393939" />
          <rect x="75" y="56" width="64" height="2" rx="1" fill="#d4d4d4" />
        </g>
        <g transform="translate(472 52)">
          <rect width="118" height="28" rx="14" fill="#101010" stroke="#555" />
          <circle cx="15" cy="14" r="3" fill="#e5e5e5" />
          <text x="25" y="17" fill="#c4c4c4" fontSize="8" letterSpacing="1.2" fontFamily="monospace">LOCAL / HI-FI</text>
        </g>
        <text x="48" y="63" fill="#737373" fontSize="9" letterSpacing="2.4" fontFamily="monospace">SOUND, KEPT PERSONAL</text>
        <text x="48" y="83" fill="#f5f5f5" fontSize="16" letterSpacing="-.4" fontFamily="monospace">SELF / MUSIC</text>
        <path d="M48 96H174" stroke="#737373" strokeOpacity=".6" />
        <circle cx="542" cy="322" r="34" fill="#111" stroke="#686868" />
        <circle cx="542" cy="322" r="24" fill="none" stroke="#515151" strokeDasharray="2 4" />
        <path d="M542 303V322L555 330" fill="none" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (kind === 'docs') {
    return (
      <svg viewBox="0 0 640 420" role="img" aria-label="Illustration of layered documents connected by collaborative cursors">
        <defs>
          <pattern id="docsGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" stroke="#fff" strokeOpacity=".045" strokeWidth=".7" />
          </pattern>
          <radialGradient id="docsHalo">
            <stop offset="0" stopColor="#8a8a8a" stopOpacity=".2" />
            <stop offset="1" stopColor="#080808" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="640" height="420" fill="#080808" />
        <rect width="640" height="420" fill="url(#docsGrid)" />
        <circle cx="354" cy="205" r="214" fill="url(#docsHalo)" />
        <path d="M102 127C144 127 152 154 185 154S231 118 260 140 306 166 334 145 378 127 410 143" fill="none" stroke="#737373" strokeOpacity=".45" strokeDasharray="3 6" />
        <g transform="rotate(-8 326 212)" className="art-float">
          <rect x="193" y="68" width="238" height="302" rx="5" fill="#171717" stroke="#696969" />
          <rect x="216" y="91" width="72" height="4" rx="2" fill="#777" />
          <rect x="216" y="111" width="154" height="13" rx="2" fill="#d4d4d4" />
          <rect x="216" y="134" width="185" height="4" rx="2" fill="#5a5a5a" />
          <rect x="216" y="144" width="164" height="4" rx="2" fill="#444" />
          <rect x="216" y="174" width="190" height="1" fill="#444" />
          <rect x="216" y="192" width="8" height="8" rx="1" fill="none" stroke="#bdbdbd" />
          <path d="M218 196L221 199L227 190" fill="none" stroke="#e5e5e5" strokeWidth="1.5" />
          <rect x="235" y="193" width="153" height="4" rx="2" fill="#777" />
          <rect x="216" y="212" width="8" height="8" rx="1" fill="none" stroke="#6b6b6b" />
          <rect x="235" y="214" width="130" height="4" rx="2" fill="#555" />
          <rect x="216" y="234" width="8" height="8" rx="1" fill="none" stroke="#6b6b6b" />
          <rect x="235" y="236" width="159" height="4" rx="2" fill="#555" />
          <rect x="216" y="263" width="187" height="1" fill="#444" />
          <rect x="216" y="281" width="177" height="4" rx="2" fill="#5a5a5a" />
          <rect x="216" y="293" width="146" height="4" rx="2" fill="#444" />
          <rect x="216" y="314" width="86" height="22" rx="3" fill="#252525" stroke="#5f5f5f" />
          <text x="229" y="328" fill="#d4d4d4" fontSize="8" letterSpacing="1" fontFamily="monospace">SHARED</text>
        </g>
        <g transform="rotate(7 416 200)">
          <rect x="330" y="97" width="225" height="264" rx="5" fill="#0d0d0d" stroke="#454545" />
          <rect x="350" y="119" width="61" height="5" rx="2" fill="#9a9a9a" />
          <rect x="350" y="139" width="178" height="2" fill="#353535" />
          <rect x="350" y="154" width="164" height="2" fill="#353535" />
          <rect x="350" y="169" width="151" height="2" fill="#353535" />
          <rect x="350" y="201" width="184" height="77" rx="3" fill="#171717" stroke="#3f3f3f" />
          <path d="M367 252L393 220L410 237L433 213L461 253Z" fill="#3a3a3a" />
          <path d="M365 261H521" stroke="#555" />
          <rect x="350" y="294" width="166" height="3" rx="1.5" fill="#393939" />
          <rect x="350" y="305" width="140" height="3" rx="1.5" fill="#393939" />
          <rect x="350" y="316" width="155" height="3" rx="1.5" fill="#393939" />
        </g>
        <g transform="translate(64 166)">
          <rect width="138" height="48" rx="5" fill="#111" stroke="#666" />
          <circle cx="20" cy="24" r="9" fill="#d4d4d4" />
          <text x="37" y="21" fill="#f5f5f5" fontSize="8" letterSpacing="1" fontFamily="monospace">ERIK</text>
          <text x="37" y="33" fill="#777" fontSize="8" fontFamily="monospace">editing now</text>
        </g>
        <g transform="translate(430 43)">
          <rect width="132" height="32" rx="16" fill="#161616" stroke="#5d5d5d" />
          <circle cx="17" cy="16" r="4" fill="#a3a3a3" />
          <text x="29" y="19" fill="#c4c4c4" fontSize="8" letterSpacing="1" fontFamily="monospace">LIVE CURSORS</text>
        </g>
        <path d="M182 188L196 174L205 187L198 187L201 196L197 198L193 189Z" fill="#f5f5f5" />
        <path d="M502 307L516 293L525 306L518 306L521 315L517 317L513 308Z" fill="#d4d4d4" />
        <path d="M502 321H557" stroke="#737373" strokeDasharray="2 5" />
        <text x="53" y="76" fill="#737373" fontSize="9" letterSpacing="2.2" fontFamily="monospace">THOUGHTS, IN SYNC</text>
        <text x="53" y="96" fill="#f5f5f5" fontSize="16" letterSpacing="-.4" fontFamily="monospace">COLLAB / DOCS</text>
        <path d="M53 109H175" stroke="#737373" strokeOpacity=".6" />
      </svg>
    )
  }

  if (kind === 'jobbrain') {
    return (
      <svg viewBox="0 0 640 420" role="img" aria-label="Illustration of a job application tracker orbiting a central focus point">
        <defs>
          <pattern id="jobGrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#fff" strokeOpacity=".045" strokeWidth=".7" />
          </pattern>
          <radialGradient id="jobHalo">
            <stop offset="0" stopColor="#a3a3a3" stopOpacity=".23" />
            <stop offset="1" stopColor="#080808" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="jobCore" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dedede" />
            <stop offset="1" stopColor="#656565" />
          </linearGradient>
        </defs>
        <rect width="640" height="420" fill="#080808" />
        <rect width="640" height="420" fill="url(#jobGrid)" />
        <circle cx="336" cy="211" r="220" fill="url(#jobHalo)" />
        <g fill="none" stroke="#5a5a5a">
          <ellipse cx="333" cy="210" rx="194" ry="88" transform="rotate(-27 333 210)" strokeOpacity=".75" />
          <ellipse cx="333" cy="210" rx="150" ry="130" transform="rotate(33 333 210)" strokeOpacity=".55" strokeDasharray="3 7" />
          <circle cx="333" cy="210" r="113" strokeOpacity=".38" />
        </g>
        <g className="art-orbit">
          <circle cx="333" cy="210" r="86" fill="#121212" stroke="#737373" />
          <circle cx="333" cy="210" r="70" fill="none" stroke="#4c4c4c" strokeDasharray="2 5" />
          <circle cx="333" cy="210" r="50" fill="url(#jobCore)" />
          <path d="M311 190H355V230H311Z" fill="#161616" stroke="#343434" />
          <path d="M311 200H355M311 209H355M311 218H355M322 190V230M333 190V230M344 190V230" stroke="#6c6c6c" strokeOpacity=".8" strokeWidth=".7" />
          <circle cx="333" cy="210" r="6" fill="#f5f5f5" />
        </g>
        <g transform="translate(49 127)">
          <rect width="157" height="57" rx="6" fill="#111" stroke="#626262" />
          <rect x="13" y="13" width="29" height="29" rx="5" fill="#252525" stroke="#676767" />
          <path d="M19 24H36M21 19H34M22 29H33M25 34H30" stroke="#d4d4d4" strokeWidth="1.2" strokeLinecap="round" />
          <text x="53" y="24" fill="#e5e5e5" fontSize="9" letterSpacing=".8" fontFamily="monospace">APPLICATION</text>
          <text x="53" y="39" fill="#7a7a7a" fontSize="9" fontFamily="monospace">01 / SENT</text>
          <circle cx="141" cy="13" r="3" fill="#a3a3a3" />
        </g>
        <g transform="translate(425 101)">
          <rect width="160" height="57" rx="6" fill="#111" stroke="#626262" />
          <rect x="13" y="13" width="29" height="29" rx="5" fill="#252525" stroke="#676767" />
          <path d="M21 21H34V34H21ZM24 17V21M31 17V21M24 34V38M31 34V38" fill="none" stroke="#d4d4d4" strokeWidth="1.2" />
          <text x="53" y="24" fill="#e5e5e5" fontSize="9" letterSpacing=".8" fontFamily="monospace">INTERVIEW</text>
          <text x="53" y="39" fill="#7a7a7a" fontSize="9" fontFamily="monospace">02 / NEXT</text>
          <circle cx="144" cy="13" r="3" fill="#e5e5e5" />
        </g>
        <g transform="translate(216 316)">
          <rect width="206" height="51" rx="6" fill="#101010" stroke="#555" />
          <circle cx="21" cy="25" r="6" fill="#dedede" />
          <text x="38" y="22" fill="#e5e5e5" fontSize="9" letterSpacing="1" fontFamily="monospace">PROGRESS, NOT CHAOS</text>
          <text x="38" y="36" fill="#737373" fontSize="8" fontFamily="monospace">A LITTLE MORE FOCUSED</text>
        </g>
        <circle cx="190" cy="272" r="17" fill="#111" stroke="#777" />
        <path d="M183 272L188 277L198 266" fill="none" stroke="#e5e5e5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="472" cy="257" r="6" fill="#e5e5e5" />
        <circle cx="472" cy="257" r="15" fill="none" stroke="#777" strokeDasharray="2 4" />
        <path d="M55 76H164" stroke="#737373" strokeOpacity=".6" />
        <text x="53" y="44" fill="#737373" fontSize="9" letterSpacing="2.2" fontFamily="monospace">THE SEARCH, ORGANISED</text>
        <text x="53" y="63" fill="#f5f5f5" fontSize="16" letterSpacing="-.4" fontFamily="monospace">JOBRAIN / 001</text>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="Illustration of a grocery basket, produce and a budget plan">
      <defs>
        <pattern id="shopGrid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="#fff" strokeOpacity=".045" strokeWidth=".7" />
        </pattern>
        <radialGradient id="shopHalo">
          <stop offset="0" stopColor="#9a9a9a" stopOpacity=".22" />
          <stop offset="1" stopColor="#080808" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="shopMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#292929" />
          <stop offset="1" stopColor="#101010" />
        </linearGradient>
      </defs>
      <rect width="640" height="420" fill="#080808" />
      <rect width="640" height="420" fill="url(#shopGrid)" />
      <circle cx="355" cy="211" r="215" fill="url(#shopHalo)" />
      <path d="M192 168L228 305Q231 315 244 315H426Q438 315 442 303L478 168Z" fill="url(#shopMetal)" stroke="#888" strokeWidth="1.2" />
      <path d="M205 188H466M214 218H458M222 249H450M231 280H442" stroke="#777" strokeOpacity=".72" />
      <path d="M253 174L270 305M308 174L314 314M363 174L358 314M418 174L402 309" stroke="#666" strokeOpacity=".75" />
      <path d="M181 150L193 170H480L494 150" fill="none" stroke="#bdbdbd" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="271" cy="334" r="17" fill="#101010" stroke="#7a7a7a" strokeWidth="2" />
      <circle cx="271" cy="334" r="5" fill="#a3a3a3" />
      <circle cx="407" cy="334" r="17" fill="#101010" stroke="#7a7a7a" strokeWidth="2" />
      <circle cx="407" cy="334" r="5" fill="#a3a3a3" />
      <g className="art-float">
        <circle cx="274" cy="148" r="34" fill="#292929" stroke="#858585" />
        <path d="M274 114C267 131 263 147 274 182M240 148H308M250 126C267 139 280 158 297 170M298 126C281 140 267 158 250 170" fill="none" stroke="#a3a3a3" strokeOpacity=".6" />
        <path d="M274 115C277 103 286 101 295 107C291 116 282 120 274 115Z" fill="#8b8b8b" />
        <path d="M343 125C323 143 326 170 348 179C367 182 379 163 373 146C369 134 356 127 343 125Z" fill="#454545" stroke="#9d9d9d" strokeWidth="1.2" />
        <path d="M347 130C347 141 352 154 363 168" fill="none" stroke="#bdbdbd" strokeOpacity=".75" />
        <path d="M342 126C345 113 355 109 365 112C360 123 352 128 342 126Z" fill="#b0b0b0" />
        <rect x="399" y="106" width="33" height="66" rx="8" fill="#171717" stroke="#9a9a9a" strokeWidth="1.2" />
        <rect x="408" y="96" width="15" height="15" rx="3" fill="#686868" stroke="#aaa" />
        <path d="M406 136H425" stroke="#bdbdbd" strokeOpacity=".6" />
      </g>
      <g transform="translate(55 183)">
        <rect width="117" height="83" rx="7" fill="#101010" stroke="#646464" />
        <text x="14" y="22" fill="#9a9a9a" fontSize="8" letterSpacing="1.4" fontFamily="monospace">WEEKLY CAP</text>
        <text x="14" y="49" fill="#f5f5f5" fontSize="24" letterSpacing="-1.2" fontFamily="monospace">$60</text>
        <rect x="14" y="63" width="88" height="3" rx="1.5" fill="#393939" />
        <rect x="14" y="63" width="61" height="3" rx="1.5" fill="#e5e5e5" />
      </g>
      <g transform="translate(446 234)">
        <rect width="136" height="60" rx="6" fill="#111" stroke="#666" />
        <circle cx="19" cy="20" r="6" fill="none" stroke="#d4d4d4" strokeWidth="1.5" />
        <path d="M16 20L18 22L22 17" fill="none" stroke="#d4d4d4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="33" y="23" fill="#e5e5e5" fontSize="9" fontFamily="monospace">IN BUDGET</text>
        <text x="14" y="44" fill="#737373" fontSize="8" letterSpacing=".8" fontFamily="monospace">NEEDS FIRST</text>
      </g>
      <path d="M173 224C188 224 190 210 201 204" fill="none" stroke="#777" strokeDasharray="2 5" />
      <circle cx="175" cy="224" r="3" fill="#d4d4d4" />
      <text x="53" y="76" fill="#737373" fontSize="9" letterSpacing="2.2" fontFamily="monospace">MORE INTENTION, LESS WASTE</text>
      <text x="53" y="96" fill="#f5f5f5" fontSize="16" letterSpacing="-.4" fontFamily="monospace">SHOPLINE / 004</text>
      <path d="M53 109H171" stroke="#737373" strokeOpacity=".6" />
    </svg>
  )
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!section || !viewport || !track) return

    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()

    media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
      const horizontalMotion = gsap.to(track, {
        x: () => -Math.max(0, track.scrollWidth - viewport.clientWidth),
        ease: 'none',
        paused: true,
        overwrite: 'auto',
      })

      const pin = ScrollTrigger.create({
        id: 'projects-horizontal-pin',
        trigger: section,
        pin: true,
        animation: horizontalMotion,
        start: 'top top',
        end: () => '+=' + Math.max(1, track.scrollWidth - viewport.clientWidth),
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (projects.length - 1),
          duration: { min: 0.16, max: 0.55 },
          delay: 0.06,
          ease: 'power1.inOut',
        },
        onUpdate: (self) => {
          if (progressRef.current) gsap.set(progressRef.current, { scaleX: self.progress })
        },
      })

      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        window.cancelAnimationFrame(refreshFrame)
        pin.kill()
        horizontalMotion.kill()
      }
    })

    media.add('(max-width: 760px), (prefers-reduced-motion: reduce)', () => {
      gsap.set(track, { clearProps: 'transform' })
      return () => gsap.set(track, { clearProps: 'transform' })
    })

    return () => media.revert()
  }, [])

  return (
    <section ref={sectionRef} className="projects-section" id="projects" aria-labelledby="projects-title">
      <div className="projects-stage">
        <div className="section-heading projects-heading">
          <div>
            <p className="section-eyebrow">01 / BUILD ARCHIVE</p>
            <h2 className="projects-title" id="projects-title">
              Selected <em>projects</em><span className="projects-title__period">.</span>
            </h2>
          </div>
          <p>Actual builds, useful experiments and problems I wanted to solve myself.</p>
        </div>

        <div ref={viewportRef} className="projects-viewport" aria-label="Selected projects">
          <div ref={trackRef} className="project-track">
            {projects.map((project, index) => (
              <article key={project.number} className={`project-panel project-panel--${project.art}`} aria-labelledby={`project-title-${project.number}`}>
                <span className="project-row__kanji" aria-hidden="true">
                  {index % 2 === 0 ? 'プロジェクト' : '作品記録'}
                </span>

                <div className="project-copy">
                  <div className="project-copy__meta">
                    <span className="section-line" />
                    <span>{project.number} / 04</span>
                    <span>{project.category}</span>
                  </div>
                  <h3 id={`project-title-${project.number}`}>
                    {project.name}
                    <span>.</span>
                  </h3>
                  <p className="project-copy__description">{project.description}</p>
                  <div className="project-stack">
                    {project.stack.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="project-actions">
                    <a className="project-button" href={project.repository} target="_blank" rel="noreferrer">
                      View repository <ArrowIcon />
                    </a>
                    {project.live && (
                      <a className="project-link" href={project.live} target="_blank" rel="noreferrer">
                        Open live project <ArrowIcon />
                      </a>
                    )}
                  </div>
                </div>

                <div className={`project-visual project-visual--${project.art}`}>
                  <div className="project-visual__topline">
                    <span>VISUAL STUDY</span>
                    <span>{project.number} — 04</span>
                  </div>
                  <div className="project-art">
                    <ProjectIllustration kind={project.art} />
                  </div>
                  <div className="project-visual__footer">
                    <span>{project.category.toUpperCase()}</span>
                    <span>FORM / FUNCTION / DETAIL</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="projects-controls">
          <a className="section-more" href="https://github.com/b-1-o?tab=repositories" target="_blank" rel="noreferrer">
            Explore all repositories <ArrowIcon />
          </a>
          <div className="project-progress" aria-hidden="true">
            <span>SCROLL TO EXPLORE</span>
            <span className="project-progress__track"><span ref={progressRef} /></span>
            <span>01 — 04</span>
          </div>
        </div>
      </div>
    </section>
  )
}
