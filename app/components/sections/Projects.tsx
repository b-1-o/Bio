import { motion } from 'framer-motion'
import { LaptopModel, type ProjectScreen } from '../3d/LaptopModel'
import { PhoneModel } from '../3d/PhoneModel'
import { Scene } from '../3d/Scene'

type Project = {
  number: string
  name: string
  category: string
  description: string
  stack: string[]
  repository: string
  live?: string
  screen: ProjectScreen
  device: 'laptop' | 'phone'
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
    screen: 'music',
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
    screen: 'docs',
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
    screen: 'jobs',
    device: 'laptop',
  },
  {
    number: '04',
    name: 'Shopline',
    category: 'Smart grocery planning',
    description:
      'A grocery planning concept that connects budgets, preferences and product discovery without losing sight of the total.',
    stack: ['React', 'TypeScript', 'APIs', 'Vercel'],
    repository: 'https://github.com/b-1-o/shopline',
    screen: 'shop',
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
        {projects.map((project, index) => (
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
                <span>INTERACTIVE OBJECT</span>
                <span>01 — 04</span>
              </div>

              <Scene height={project.device === 'phone' ? 330 : 310}>
                {project.device === 'laptop' ? (
                  <LaptopModel screen={project.screen} />
                ) : (
                  <PhoneModel screen={project.screen} />
                )}
              </Scene>

              <div className="project-visual__footer">
                <span>MONOCHROME RENDER / 60 FPS TARGET</span>
                <span>↗ MOVE TO INTERACT</span>
              </div>
            </div>
          </motion.article>
        ))}
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
