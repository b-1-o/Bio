import { motion, useReducedMotion } from 'framer-motion'
import PhoneDevice from '../ui/PhoneDevice'
import LaptopDevice from '../ui/LaptopDevice'

type ProjectPreviewKind = 'music' | 'docs' | 'jobbrain' | 'heaven'
type ProjectDeviceKind = 'phone' | 'laptop'

type Project = {
  number: string
  name: string
  category: string
  description: string
  stack: string[]
  repository: string
  live?: string
  preview: ProjectPreviewKind
  device: ProjectDeviceKind
}

const projects: Project[] = [
  {
    number: '01',
    name: 'SelfMusic',
    category: 'Personal music platform',
    description:
      'A private, self-hosted music library for streaming, uploads, playlists, favourites and listening history — with YouTube imports and offline-ready playback.',
    stack: ['React 19', 'JavaScript', 'Vite', 'Express', 'SQLite', 'PWA'],
    repository: 'https://github.com/b-1-o/selfmusic',
    preview: 'music',
    device: 'phone',
  },
  {
    number: '02',
    name: 'Collab Docs',
    category: 'Real-time collaboration',
    description:
      'A collaborative writing space with rich-text editing, shared presence and offline-first changes, synchronised through a lightweight Cloudflare edge architecture.',
    stack: ['React', 'TypeScript', 'Tiptap', 'Yjs', 'Cloudflare Workers', 'Durable Objects', 'D1 / KV', 'Auth0'],
    repository: 'https://github.com/b-1-o/cloud-project',
    live: 'https://collab-docs-4tb.pages.dev/',
    preview: 'docs',
    device: 'laptop',
  },
  {
    number: '03',
    name: 'JoBrain',
    category: 'Job search command centre',
    description:
      'A focused workspace for discovering roles, filtering opportunities, tracking applications and turning a scattered job hunt into a clear, measurable pipeline.',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Prisma', 'PostgreSQL', 'Zod', 'Vercel'],
    repository: 'https://github.com/b-1-o/JoBrain',
    live: 'https://jobrain.vercel.app/',
    preview: 'jobbrain',
    device: 'laptop',
  },
  {
    number: '04',
    name: 'Heaven',
    category: 'Developer command centre',
    description:
      'A single workspace for GitHub repositories, engineering activity, deployments, meetings and integrations — bringing the moving parts of a developer workflow together.',
    stack: ['Next.js', 'React', 'TypeScript', 'Neon PostgreSQL', 'Clerk', 'GitHub OAuth', 'Zoom', 'Discord', 'Vercel'],
    repository: 'https://github.com/b-1-o/heaven',
    live: 'https://heaven-b1o.vercel.app/',
    preview: 'heaven',
    device: 'laptop',
  },
]

const rowVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.16 },
  },
}

const textVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.78, ease: 'easeOut' },
  },
}

const deviceVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.92, ease: 'easeOut' },
  },
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M10 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MusicScreen() {
  return (
    <div className="project-screen project-screen--music">
      <div className="music-screen__topbar">
        <span className="music-screen__mark">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg>
        </span>
        <span className="music-screen__wordmark">SELFMUSIC</span>
        <span className="music-screen__top-action">•••</span>
      </div>
      <div className="music-screen__greeting">
        <span className="screen-kicker">YOUR LIBRARY</span>
        <h4>Listen closer.</h4>
        <p>Your music, on your terms.</p>
      </div>
      <div className="music-screen__record-art" aria-hidden="true">
        <span className="music-screen__record-orbit" />
        <span className="music-screen__record">
          <span />
        </span>
        <span className="music-screen__record-shine" />
      </div>
      <div className="music-screen__track">
        <div>
          <strong>Midnight Drive</strong>
          <span>After Hours · 2025</span>
        </div>
        <span className="music-screen__favourite">♥</span>
      </div>
      <div className="music-screen__progress">
        <span />
      </div>
      <div className="music-screen__time"><span>1:42</span><span>3:58</span></div>
      <div className="music-screen__transport">
        <span>↻</span>
        <span>◂</span>
        <b>Ⅱ</b>
        <span>▸</span>
        <span>⌁</span>
      </div>
      <div className="music-screen__up-next">
        <div className="music-screen__up-next-heading"><b>Up next</b><span>VIEW QUEUE ↗</span></div>
        <div className="music-screen__queue-row"><i className="music-screen__art-one" /><span><b>Soft Static</b><small>Bedroom Tapes</small></span><small>3:24</small></div>
        <div className="music-screen__queue-row"><i className="music-screen__art-two" /><span><b>Slow Motion</b><small>Grey Skies</small></span><small>4:06</small></div>
      </div>
      <div className="music-screen__nav"><span className="is-active">LISTEN</span><span>SEARCH</span><span>LIBRARY</span></div>
    </div>
  )
}

function BrowserBar({ address }: { address: string }) {
  return (
    <div className="project-screen__browser">
      <span /><span /><span />
      <div>{address}</div>
      <b>↗</b>
    </div>
  )
}

function DocsScreen() {
  return (
    <div className="project-screen project-screen--docs">
      <BrowserBar address="collab-docs.pages.dev / workspace" />
      <div className="docs-screen__app">
        <aside className="docs-screen__sidebar">
          <div className="docs-screen__brand"><span>c.</span><b>collab<span>docs</span></b></div>
          <small>WORKSPACE</small>
          <div className="docs-screen__nav docs-screen__nav--active"><i>▤</i> All documents</div>
          <div className="docs-screen__nav"><i>◷</i> Recent</div>
          <div className="docs-screen__nav"><i>☆</i> Favourites</div>
          <small>YOUR SPACE</small>
          <div className="docs-screen__file"><i /> Product direction</div>
          <div className="docs-screen__file"><i /> Launch notes</div>
          <div className="docs-screen__file"><i /> Design system</div>
          <div className="docs-screen__workspace"><span>EG</span><div><b>Erik's workspace</b><small>Free workspace</small></div><i>⌄</i></div>
        </aside>
        <main className="docs-screen__document">
          <div className="docs-screen__toolbar">
            <span>Product direction / <b>Edited just now</b></span>
            <div><i>EG</i><i>AM</i><i>+2</i><button>Share ↗</button></div>
          </div>
          <article>
            <div className="screen-kicker">STRATEGY · 6 MIN READ</div>
            <h3>Make room for<br />good <em>ideas.</em></h3>
            <p className="docs-screen__intro">A shared space for thinking clearly, writing together and moving work forward.</p>
            <hr />
            <h4>01. The foundation</h4>
            <p>Great collaboration feels effortless. The document stays out of the way while every person can contribute in real time.</p>
            <div className="docs-screen__quote">“The best tools make the work feel lighter, not louder.”<span>— Team note <i /></span></div>
            <h4>02. What matters</h4>
            <div className="docs-screen__task"><i>✓</i> One clear source of truth</div>
            <div className="docs-screen__task"><i /> Changes that stay in sync</div>
          </article>
          <span className="docs-screen__cursor">AM <i /></span>
        </main>
      </div>
    </div>
  )
}

function JobBrainScreen() {
  return (
    <div className="project-screen project-screen--jobbrain">
      <BrowserBar address="jobrain.vercel.app / dashboard" />
      <div className="jobbrain-screen__app">
        <aside className="jobbrain-screen__sidebar">
          <div className="jobbrain-screen__brand"><span>J</span><b>JoBrain</b></div>
          <small>WORKSPACE</small>
          <div className="jobbrain-screen__nav jobbrain-screen__nav--active"><i>⌂</i> Overview</div>
          <div className="jobbrain-screen__nav"><i>⌕</i> Discover jobs</div>
          <div className="jobbrain-screen__nav"><i>▤</i> Applications</div>
          <div className="jobbrain-screen__nav"><i>◫</i> Analytics</div>
          <div className="jobbrain-screen__profile"><span>EG</span><div><b>Erik G.</b><small>Frontend developer</small></div><i>•••</i></div>
        </aside>
        <main className="jobbrain-screen__main">
          <header className="jobbrain-screen__header"><div><span className="screen-kicker">MONDAY, OCTOBER 19</span><h3>Your search, <em>in focus.</em></h3><p>Here is what is moving this week.</p></div><span className="jobbrain-screen__avatar">EG</span></header>
          <div className="jobbrain-screen__stats">
            <div><small>TRACKED ROLES</small><b>28</b><span>+6 this week</span></div>
            <div><small>IN PROGRESS</small><b>12</b><span>Across 4 stages</span></div>
            <div><small>INTERVIEWS</small><b>04</b><span>2 upcoming</span></div>
          </div>
          <div className="jobbrain-screen__section-head"><b>Application activity</b><span>Last 7 days　⌄</span></div>
          <div className="jobbrain-screen__chart">
            <div className="jobbrain-screen__chart-grid"><span>8</span><span>6</span><span>4</span><span>2</span></div>
            <div className="jobbrain-screen__bars">
              <i style={{ height: '28%' }} /><i style={{ height: '44%' }} /><i style={{ height: '35%' }} /><i style={{ height: '72%' }} /><i style={{ height: '52%' }} /><i style={{ height: '88%' }} /><i style={{ height: '62%' }} />
            </div>
            <div className="jobbrain-screen__chart-days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
          </div>
          <div className="jobbrain-screen__section-head"><b>Recently updated</b><span>View all ↗</span></div>
          <div className="jobbrain-screen__recent"><span className="jobbrain-screen__company-mark">A</span><div><b>Frontend Engineer</b><small>Acme Studio · Remote</small></div><span className="jobbrain-screen__status">INTERVIEW</span></div>
          <div className="jobbrain-screen__recent"><span className="jobbrain-screen__company-mark">N</span><div><b>React Developer</b><small>Northstar · Los Angeles, CA</small></div><span className="jobbrain-screen__status">APPLIED</span></div>
        </main>
      </div>
    </div>
  )
}

function HeavenScreen() {
  return (
    <div className="project-screen project-screen--heaven">
      <BrowserBar address="heaven-b1o.vercel.app / overview" />
      <div className="heaven-screen__app">
        <aside className="heaven-screen__sidebar">
          <div className="heaven-screen__brand"><span>✳</span><b>HEAVEN</b></div>
          <small>COMMAND CENTRE</small>
          <div className="heaven-screen__nav heaven-screen__nav--active"><i>⌂</i> Overview</div>
          <div className="heaven-screen__nav"><i>⌘</i> Repositories</div>
          <div className="heaven-screen__nav"><i>◷</i> Activity</div>
          <div className="heaven-screen__nav"><i>◈</i> Deployments</div>
          <div className="heaven-screen__nav"><i>▣</i> Meetings</div>
          <div className="heaven-screen__user"><span>EG</span><div><b>Erik G.</b><small>Personal workspace</small></div></div>
        </aside>
        <main className="heaven-screen__main">
          <header><div><span className="screen-kicker">YOUR WORKSPACE</span><h3>Everything, <em>connected.</em></h3></div><span className="heaven-screen__date">MON / 09:41 AM</span></header>
          <div className="heaven-screen__metrics"><div><small>REPOSITORIES</small><b>12</b><span>Across 3 languages</span></div><div><small>DEPLOYMENTS</small><b>08</b><span>All systems steady</span></div><div><small>ACTIVITY</small><b>34</b><span>This week</span></div></div>
          <div className="heaven-screen__columns">
            <section className="heaven-screen__repos"><div className="heaven-screen__section-head"><b>Recent repositories</b><span>All ↗</span></div><div><i>◉</i><span><b>Bio</b><small>Portfolio · TypeScript</small></span><small>2m</small></div><div><i>◈</i><span><b>cloud-project</b><small>Collab Docs · TypeScript</small></span><small>1h</small></div><div><i>⌘</i><span><b>selfmusic</b><small>Music platform · JavaScript</small></span><small>3h</small></div></section>
            <section className="heaven-screen__activity"><div className="heaven-screen__section-head"><b>Activity pulse</b><span>7 days</span></div><div className="heaven-screen__graph"><svg viewBox="0 0 220 80" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="heavenGraphFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bdbdbd" stopOpacity=".32" /><stop offset="1" stopColor="#bdbdbd" stopOpacity="0" /></linearGradient></defs><path d="M0 65 C18 63 20 42 39 50 S62 65 80 40 S103 55 122 27 S147 46 163 29 S187 39 220 10" fill="none" stroke="#d4d4d4" strokeWidth="1.6" /><path d="M0 65 C18 63 20 42 39 50 S62 65 80 40 S103 55 122 27 S147 46 163 29 S187 39 220 10 L220 80 L0 80 Z" fill="url(#heavenGraphFill)" opacity=".4" /></svg></div><div className="heaven-screen__chart-legend"><span>Commits</span><span>Deploys</span></div></section>
          </div>
          <div className="heaven-screen__integrations"><div className="heaven-screen__section-head"><b>Connected services</b><span>Manage ↗</span></div><span><i>GH</i> GitHub <b>CONNECTED</b></span><span><i>Z</i> Zoom <b>CONNECTED</b></span><span><i>D</i> Discord <b>CONNECTED</b></span></div>
        </main>
      </div>
    </div>
  )
}

function ProjectPreview({ kind }: { kind: ProjectPreviewKind }) {
  if (kind === 'music') return <MusicScreen />
  if (kind === 'docs') return <DocsScreen />
  if (kind === 'jobbrain') return <JobBrainScreen />
  return <HeavenScreen />
}

function ProjectDevice({ project }: { project: Project }) {
  const preview = <ProjectPreview kind={project.preview} />
  return (
    <div className={'projects-showcase__device projects-showcase__device--' + project.device}>
      <div className="projects-showcase__glow" aria-hidden="true" />
      <div className="projects-showcase__device-float">
        {project.device === 'phone' ? (
          <PhoneDevice className="projects-showcase__phone">{preview}</PhoneDevice>
        ) : (
          <LaptopDevice className="projects-showcase__laptop">{preview}</LaptopDevice>
        )}
      </div>
      <div className="projects-showcase__device-caption"><span />INTERFACE / {project.number}</div>
    </div>
  )
}

export function Projects() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="projects-showcase" id="projects" aria-labelledby="projects-showcase-title">
      <header className="projects-showcase__heading">
        <div>
          <p className="section-eyebrow">01 / BUILD ARCHIVE</p>
          <h2 className="projects-showcase__title" id="projects-showcase-title">Selected <em>projects</em><span>.</span></h2>
        </div>
        <p className="projects-showcase__intro">Four ideas, built into real interfaces. Designed with intent, made to work.</p>
      </header>

      <div className="projects-showcase__list">
        {projects.map((project, index) => (
          <motion.article
            key={project.number}
            className={'projects-showcase__item' + (index % 2 === 1 ? ' projects-showcase__item--reverse' : '')}
            variants={rowVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.22 }}
            transition={reduceMotion ? { duration: 0 } : undefined}
            aria-labelledby={'projects-showcase-title-' + project.number}
          >
            <motion.div className="projects-showcase__copy" variants={textVariants} transition={reduceMotion ? { duration: 0 } : undefined}>
              <div className="projects-showcase__eyebrow"><span>{project.number}</span><i />{project.category}</div>
              <h3 id={'projects-showcase-title-' + project.number}>{project.name}<span>.</span></h3>
              <p className="projects-showcase__description">{project.description}</p>
              <div className="projects-showcase__stack" aria-label="Technology stack">
                {project.stack.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <div className="projects-showcase__actions">
                <a href={project.repository} target="_blank" rel="noreferrer">Repository <ArrowIcon /></a>
                {project.live && <a className="projects-showcase__live" href={project.live} target="_blank" rel="noreferrer">Live project <ArrowIcon /></a>}
              </div>
            </motion.div>
            <motion.div className="projects-showcase__visual" variants={deviceVariants} transition={reduceMotion ? { duration: 0 } : undefined}>
              <ProjectDevice project={project} />
            </motion.div>
          </motion.article>
        ))}
      </div>

      <footer className="projects-showcase__footer">
        <span>SELECTED WORK / 2024 — 2026</span>
        <a href="https://github.com/b-1-o?tab=repositories" target="_blank" rel="noreferrer">Explore all repositories <ArrowIcon /></a>
      </footer>
    </section>
  )
}
