import { motion } from 'framer-motion'
import PhoneDevice from '../ui/PhoneDevice'
import LaptopDevice from '../ui/LaptopDevice'

type Project = {
  number: string
  name: string
  category: string
  description: string
  stack: string[]
  repository: string
  live?: string
  device: 'phone' | 'laptop'
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
    device: 'laptop',
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
    device: 'phone',
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
    device: 'laptop',
  },
  {
    number: '04',
    name: 'Heaven',
    category: 'Creative interface experiment',
    description:
      'A monochrome space for ambient visuals, sound and interaction — built as a quiet digital refuge.',
    stack: ['React', 'TypeScript', 'Three.js', 'Framer Motion'],
    repository: 'https://github.com/b-1-o',
    device: 'phone',
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

function ProjectScreen({ index }: { index: number }) {
  const patterns = [
    <svg key="music" viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#0a0a0a" />
      <g stroke="#262626" strokeWidth="1">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={20 + i * 20} x2="400" y2={20 + i * 20} />
        ))}
      </g>
      <path d="M40 140 Q80 80 120 140 T200 140 T280 140 T360 140" fill="none" stroke="#a3a3a3" strokeWidth="1.5" />
      <circle cx="200" cy="120" r="28" fill="none" stroke="#ffffff" strokeWidth="1.5" />
      <text x="200" y="125" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace">
        PLAY
      </text>
    </svg>,
    <svg key="docs" viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#0a0a0a" />
      <rect x="40" y="30" width="200" height="180" fill="#111" stroke="#262626" />
      <rect x="50" y="45" width="80" height="6" fill="#a3a3a3" />
      <rect x="50" y="65" width="160" height="3" fill="#404040" />
      <rect x="50" y="78" width="140" height="3" fill="#333" />
      <rect x="50" y="91" width="150" height="3" fill="#404040" />
      <rect x="50" y="104" width="100" height="3" fill="#333" />
    </svg>,
    <svg key="jobs" viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#0a0a0a" />
      {[0, 1, 2].map((row) =>
        [0, 1].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={40 + col * 170}
            y={30 + row * 70}
            width="150"
            height="55"
            fill="#111"
            stroke="#262626"
          />
        )),
      )}
      <rect x="50" y="42" width="60" height="5" fill="#a3a3a3" />
      <rect x="220" y="42" width="50" height="5" fill="#737373" />
    </svg>,
    <svg key="heaven" viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#0a0a0a" />
      <circle cx="200" cy="120" r="60" fill="none" stroke="#262626" strokeWidth="1" />
      <circle cx="200" cy="120" r="40" fill="none" stroke="#404040" strokeWidth="1" />
      <circle cx="200" cy="120" r="20" fill="none" stroke="#a3a3a3" strokeWidth="1" />
      <circle cx="200" cy="120" r="4" fill="#ffffff" />
    </svg>,
  ]
  return patterns[index % patterns.length]
}

export function Projects() {
  return (
    <section className="projects-section section-wrap" id="projects">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">01 / BUILD ARCHIVE</p>
          <h2>
            Selected <em>projects</em>
            <span>.</span>
          </h2>
        </div>
        <p>Actual builds, useful experiments and problems I wanted to solve myself.</p>
      </div>

      <div className="project-list project-list--z">
        {projects.map((project, index) => {
          const reversed = index % 2 === 1
          const Device = project.device === 'phone' ? PhoneDevice : LaptopDevice

          return (
            <article
              key={project.number}
              className={`project-row project-row--z${reversed ? ' project-row--reverse' : ''}`}
            >
              <motion.div
                className="project-copy"
                initial={{ opacity: 0, x: reversed ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              >
                <div className="project-copy__meta">
                  <span className="section-line" />
                  <span>{project.number} / 04</span>
                  <span>{project.category}</span>
                </div>
                <h3>
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
                  <a
                    className="project-button"
                    href={project.repository}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View repository <ArrowIcon />
                  </a>
                  {project.live && (
                    <a
                      className="project-link"
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open live project <ArrowIcon />
                    </a>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="project-visual project-visual--float"
                initial={{ opacity: 0, x: reversed ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              >
                <Device>
                  <ProjectScreen index={index} />
                </Device>
              </motion.div>
            </article>
          )
        })}
      </div>

      <a
        className="section-more"
        href="https://github.com/b-1-o?tab=repositories"
        target="_blank"
        rel="noreferrer"
      >
        Explore all repositories <ArrowIcon />
      </a>
    </section>
  )
}
