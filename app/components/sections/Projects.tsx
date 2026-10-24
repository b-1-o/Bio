import { motion } from 'framer-motion'

type Project = {
  number: string
  name: string
  category: string
  description: string
  stack: string[]
  repository: string
  live?: string
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

function ProjectMockup({ name, index }: { name: string; index: number }) {
  // Abstract monochrome SVG patterns for each project
  const patterns = [
    // SelfMusic — waveform + grid
    <svg key="music" viewBox="0 0 400 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#0a0a0a" />
      <g stroke="#262626" strokeWidth="1">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={20 + i * 20} x2="400" y2={20 + i * 20} />
        ))}
        {Array.from({ length: 16 }, (_, i) => (
          <line key={`v${i}`} x1={25 + i * 25} y1="0" x2={25 + i * 25} y2="240" />
        ))}
      </g>
      <path
        d="M40 140 Q80 80 120 140 T200 140 T280 140 T360 140"
        fill="none"
        stroke="#a3a3a3"
        strokeWidth="1.5"
      />
      <path
        d="M40 160 Q90 100 140 160 T240 160 T340 160"
        fill="none"
        stroke="#525252"
        strokeWidth="1"
      />
      <circle cx="200" cy="120" r="28" fill="none" stroke="#ffffff" strokeWidth="1.5" />
      <text x="200" y="125" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace">
        PLAY
      </text>
    </svg>,
    // Collab Docs — document lines
    <svg key="docs" viewBox="0 0 400 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#0a0a0a" />
      <rect x="40" y="30" width="200" height="180" fill="#111" stroke="#262626" />
      <rect x="50" y="45" width="80" height="6" fill="#a3a3a3" />
      <rect x="50" y="65" width="160" height="3" fill="#404040" />
      <rect x="50" y="78" width="140" height="3" fill="#333" />
      <rect x="50" y="91" width="150" height="3" fill="#404040" />
      <rect x="50" y="104" width="100" height="3" fill="#333" />
      <rect x="50" y="130" width="160" height="3" fill="#404040" />
      <rect x="50" y="143" width="130" height="3" fill="#333" />
      <rect x="260" y="40" width="100" height="70" fill="#111" stroke="#262626" />
      <circle cx="290" cy="70" r="12" fill="#262626" />
      <circle cx="320" cy="70" r="12" fill="#262626" />
      <rect x="270" y="100" width="80" height="3" fill="#404040" />
    </svg>,
    // JoBrain — cards grid
    <svg key="jobs" viewBox="0 0 400 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
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
      <rect x="50" y="55" width="100" height="3" fill="#404040" />
      <rect x="220" y="42" width="50" height="5" fill="#737373" />
      <rect x="220" y="55" width="90" height="3" fill="#404040" />
    </svg>,
    // Shopline — list + bars
    <svg key="shop" viewBox="0 0 400 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#0a0a0a" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="40" y={35 + i * 48} width="320" height="36" fill="#111" stroke="#262626" />
          <rect x="55" y={47 + i * 48} width="12" height="12" fill="#262626" />
          <rect x="80" y={48 + i * 48} width={80 + i * 20} height="4" fill="#a3a3a3" />
          <rect x="80" y={58 + i * 48} width="40" height="3" fill="#404040" />
          <rect x="300" y={47 + i * 48} width="40" height="12" fill="#1a1a1a" stroke="#333" />
        </g>
      ))}
    </svg>,
  ]

  return (
    <div className="relative w-full aspect-[4/3] bg-[#0a0a0a] border border-[#262626] overflow-hidden group">
      {/* Browser chrome */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-[#111] border-b border-[#262626] flex items-center px-4 gap-1.5 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-[#262626]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#262626]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#262626]" />
        <div className="ml-4 flex-1 h-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm flex items-center px-2">
          <span className="text-[8px] text-[#404040] font-mono truncate">{name.toLowerCase()}.app</span>
        </div>
      </div>

      <div className="w-full h-full pt-8">{patterns[index % patterns.length]}</div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#262626]" />
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
                <span>INTERFACE PREVIEW</span>
                <span>{project.number} — 04</span>
              </div>

              <ProjectMockup name={project.name} index={index} />

              <div className="project-visual__footer">
                <span>MONOCHROME / CSS MOCKUP</span>
                <span>↗ VIEW REPO</span>
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
