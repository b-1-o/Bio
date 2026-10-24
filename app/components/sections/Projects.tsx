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
  image?: string
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
    image: 'https://raw.githubusercontent.com/b-1-o/selfmusic/main/public/icon-512.png',
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

function ProjectScreen({ project }: { project: Project }) {
  if (project.image) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#050505] p-6 text-center">
        <img
          src={project.image}
          alt={`${project.name} app icon`}
          loading="lazy"
          className="max-h-[42%] max-w-[56%] object-contain grayscale contrast-110"
        />
        <div className="font-mono text-[11px] tracking-[0.18em] text-white">{project.name}</div>
        <div className="font-mono text-[8px] tracking-[0.14em] text-[#737373]">SELF-HOSTED / SOURCE</div>
      </div>
    )
  }

  if (project.live) {
    return (
      <iframe
        title={`${project.name} live preview`}
        src={project.live}
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin"
        className="block h-full w-full border-0 bg-[#050505]"
        style={{ pointerEvents: 'none' }}
      />
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#050505] p-5 text-center">
      <span className="font-mono text-[9px] tracking-[0.18em] text-[#737373]">PREVIEW UNAVAILABLE</span>
      <span className="text-sm text-white">{project.name}</span>
      <span className="font-mono text-[8px] tracking-[0.12em] text-[#525252]">OPEN SOURCE / VIEW REPOSITORY</span>
    </div>
  )
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

      <div className="project-list">
        {projects.map((project, index) => {
          const useLaptop = index % 2 === 0
          return (
            <motion.article
              key={project.number}
              className="project-row"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="project-row__kanji" aria-hidden="true">
                {index % 2 === 0 ? 'プロジェクト' : '作品記録'}
              </span>

              <div className="project-copy">
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
              </div>

              <div className="project-visual">
                <div className="project-visual__heading">
                  <span>DEVICE PREVIEW</span>
                  <span>{project.number} — 04</span>
                </div>

                <div className="flex items-center justify-center py-6">
                  {useLaptop ? (
                    <LaptopDevice>
                      <ProjectScreen project={project} />
                    </LaptopDevice>
                  ) : (
                    <PhoneDevice>
                      <ProjectScreen project={project} />
                    </PhoneDevice>
                  )}
                </div>

                <div className="project-visual__footer">
                  <span>{useLaptop ? 'LAPTOP / CSS 3D' : 'PHONE / CSS 3D'}</span>
                  <span>↗ VIEW REPO</span>
                </div>
              </div>
            </motion.article>
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
