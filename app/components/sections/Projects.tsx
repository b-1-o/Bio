import { motion } from 'framer-motion'
import PhoneDevice from '../ui/PhoneDevice'
import LaptopDevice from '../ui/LaptopDevice'

type DeviceKind = 'phone' | 'laptop'
type PreviewKind = 'music' | 'docs' | 'jobbrain' | 'heaven'

type Project = {
  number: string
  name: string
  category: string
  description: string
  stack: string[]
  repository: string
  live?: string
  device: DeviceKind
  preview: PreviewKind
}

const projects: Project[] = [
  {
    number: '01',
    name: 'SelfMusic',
    category: 'Personal music platform',
    description:
      'A self-hosted music library that keeps your collection yours. Stream tracks across devices, build playlists, keep your listening history, and take music offline with an installable player.',
    stack: ['React 19', 'JavaScript', 'Vite', 'Express', 'SQLite', 'PWA', 'YouTube Data API'],
    repository: 'https://github.com/b-1-o/selfmusic',
    device: 'phone',
    preview: 'music',
  },
  {
    number: '02',
    name: 'Collab Docs',
    category: 'Real-time document workspace',
    description:
      'A collaborative editor built around shared documents and live cursors. Tiptap and Yjs power the writing experience, while Cloudflare Workers, Durable Objects and edge storage keep collaboration in sync.',
    stack: ['React', 'TypeScript', 'Tiptap', 'Yjs', 'Cloudflare Workers', 'Durable Objects', 'D1 / KV / Queues'],
    repository: 'https://github.com/b-1-o/cloud-project',
    live: 'https://collab-docs-4tb.pages.dev/',
    device: 'laptop',
    preview: 'docs',
  },
  {
    number: '03',
    name: 'JoBrain',
    category: 'Job search command center',
    description:
      'A focused hiring pipeline for finding roles and tracking applications from discovery to interview. Search, smart filters, visual progress, and a review-first autofill companion live in one workspace.',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Prisma', 'PostgreSQL / Neon', 'Zod', 'Vercel'],
    repository: 'https://github.com/b-1-o/JoBrain',
    live: 'https://jobrain.vercel.app/',
    device: 'laptop',
    preview: 'jobbrain',
  },
  {
    number: '04',
    name: 'HEAVEN',
    category: 'Developer command center',
    description:
      'A single workspace for GitHub repositories, engineering activity, deployments, meetings, integrations and team collaboration — with a glass-and-fog inspired interface.',
    stack: ['Next.js', 'React', 'TypeScript', 'Neon PostgreSQL', 'Clerk', 'GitHub OAuth', 'Zoom OAuth', 'Discord', 'Vercel'],
    repository: 'https://github.com/b-1-o/heaven',
    live: 'https://heaven-b1o.vercel.app/',
    device: 'laptop',
    preview: 'heaven',
  },
]

const rowVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.04,
    },
  },
}

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

function MusicPreview() {
  const waveform = [12, 20, 30, 17, 26, 36, 23, 12, 31, 44, 25, 16, 33, 22, 39, 18, 27, 13, 34, 21, 15, 29, 38, 17]
  return (
    <div className="project-ui project-ui--music">
      <header className="pui-topbar">
        <span className="pui-brand-mark pui-brand-mark--music">♫</span>
        <span className="pui-wordmark">SELF<span>MUSIC</span></span>
        <span className="pui-icon-button">···</span>
      </header>
      <div className="music-preview__intro">
        <span className="pui-overline">YOUR MUSIC, YOUR SPACE</span>
        <div className="music-preview__cover">
          <span className="music-preview__orbit music-preview__orbit--one" />
          <span className="music-preview__orbit music-preview__orbit--two" />
          <span className="music-preview__disc"><i /></span>
          <span className="music-preview__cover-label">SIDE A / 001</span>
        </div>
        <h3>After Hours</h3>
        <p>Personal collection · 42 tracks</p>
      </div>
      <div className="music-preview__wave" aria-hidden="true">
        {waveform.map((height, index) => <span key={index} style={{ height: height + 'px' }} />)}
      </div>
      <div className="music-preview__time"><span>01:24</span><span>03:48</span></div>
      <div className="music-preview__transport">
        <span>↶</span><span className="music-preview__play">Ⅱ</span><span>↷</span>
      </div>
      <div className="music-preview__queue">
        <div><span className="music-preview__track-art">01</span><span><b>Midnight City</b><small>M83 · Hurry Up, We're Dreaming</small></span><span>•••</span></div>
        <div><span className="music-preview__track-art">02</span><span><b>Nightcall</b><small>Kavinsky · OutRun</small></span><span>•••</span></div>
      </div>
      <footer className="music-preview__nav"><span className="is-active">LIBRARY</span><span>SEARCH</span><span>PLAYLISTS</span></footer>
    </div>
  )
}

function DocsPreview() {
  return (
    <div className="project-ui project-ui--docs">
      <div className="pui-browserbar"><span /><span /><span /><div>collab-docs / workspace / roadmap</div><b>•••</b></div>
      <div className="docs-preview__app">
        <aside className="docs-preview__sidebar">
          <div className="docs-preview__brand"><span className="pui-brand-mark">C</span><b>collab<span>docs</span></b></div>
          <p>WORKSPACE</p>
          <div className="docs-preview__nav docs-preview__nav--active">⌘ <span>All documents</span></div>
          <div className="docs-preview__nav">◷ <span>Recent</span></div>
          <div className="docs-preview__nav">☆ <span>Starred</span></div>
          <p>YOUR SPACE</p>
          <div className="docs-preview__file"><i /> Product roadmap</div>
          <div className="docs-preview__file"><i /> Design notes</div>
          <div className="docs-preview__file"><i /> Launch checklist</div>
          <div className="docs-preview__user"><span>EG</span><b>Erik G.</b><small>Free workspace</small></div>
        </aside>
        <main className="docs-preview__document">
          <div className="docs-preview__docmeta"><span>PRODUCT / ROADMAP</span><div><i>EG</i><i>MK</i><i>+2</i><b>Share ↗</b></div></div>
          <h3>Product roadmap<span>.</span></h3>
          <p className="docs-preview__subtitle">A living document for ideas worth making.</p>
          <div className="docs-preview__rule" />
          <h4>01 — The direction</h4>
          <p>Build tools that feel calm, clear, and intentional. Make the details disappear so the work can take focus.</p>
          <div className="docs-preview__quote">“Good collaboration should feel like one thought, shared.”</div>
          <h4>02 — Next milestones</h4>
          <div className="docs-preview__task"><span>✓</span> Shape the editing experience</div>
          <div className="docs-preview__task"><span>✓</span> Realtime cursors & presence</div>
          <div className="docs-preview__task"><span /> Offline-first document sync</div>
          <div className="docs-preview__comment"><b>MK</b><span><strong>Mika</strong> left a note <em>just now</em></span></div>
        </main>
      </div>
    </div>
  )
}

function JobBrainPreview() {
  return (
    <div className="project-ui project-ui--jobbrain">
      <div className="pui-browserbar"><span /><span /><span /><div>app.jobrain / dashboard</div><b>···</b></div>
      <div className="job-preview__app">
        <aside className="job-preview__sidebar">
          <div className="job-preview__brand"><span>J</span><b>JoBrain</b></div>
          <small>WORKSPACE</small>
          <div className="job-preview__nav job-preview__nav--active">▦ <span>Overview</span></div>
          <div className="job-preview__nav">⌕ <span>Find jobs</span></div>
          <div className="job-preview__nav">◷ <span>Applications</span></div>
          <div className="job-preview__nav">↗ <span>Analytics</span></div>
          <div className="job-preview__profile"><span>EG</span><p>Erik G.<small>Personal space</small></p></div>
        </aside>
        <main className="job-preview__main">
          <div className="job-preview__welcome"><div><small>MONDAY, 09:41 AM</small><h3>Good morning, Erik<span>.</span></h3><p>A little progress adds up.</p></div><span className="job-preview__avatar">EG</span></div>
          <div className="job-preview__stats">
            <div><small>TRACKED</small><b>24</b><span>applications</span></div>
            <div><small>IN REVIEW</small><b>08</b><span>awaiting a reply</span></div>
            <div><small>INTERVIEWS</small><b>03</b><span>in the pipeline</span></div>
          </div>
          <div className="job-preview__section-title"><b>Application pipeline</b><span>Last 30 days ↘</span></div>
          <div className="job-preview__chart">
            <div className="job-preview__chart-label"><b>Activity</b><span>+18% this month</span></div>
            <div className="job-preview__bars">{[21,31,26,44,34,48,39,58,43,65,52,76,59,69,46,84,62,73,54,89,68,78,61,96].map((height,index)=><i key={index} style={{height:height+'%'}} />)}</div>
            <div className="job-preview__chart-days"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
          </div>
          <div className="job-preview__recent"><b>Recently tracked</b><span>View all ↗</span><div><i>V</i><span><b>Vercel</b><small>Frontend Engineer</small></span><em>Applied</em></div><div><i>N</i><span><b>Notion</b><small>Product Engineer</small></span><em>In review</em></div></div>
        </main>
      </div>
    </div>
  )
}

function HeavenPreview() {
  return (
    <div className="project-ui project-ui--heaven">
      <div className="pui-browserbar"><span /><span /><span /><div>heaven / workspace</div><b>↗</b></div>
      <div className="heaven-preview__app">
        <aside className="heaven-preview__sidebar">
          <div className="heaven-preview__brand"><span>✳</span><b>HEAVEN</b></div>
          <small>COMMAND</small>
          <div className="heaven-preview__nav heaven-preview__nav--active">⌂ <span>Overview</span></div>
          <div className="heaven-preview__nav">⌘ <span>Repositories</span></div>
          <div className="heaven-preview__nav">↗ <span>Deployments</span></div>
          <div className="heaven-preview__nav">◷ <span>Meetings</span></div>
          <div className="heaven-preview__nav">⌘ <span>Integrations</span></div>
          <div className="heaven-preview__workspace"><span>EG</span><p>Personal workspace<small>Free plan</small></p></div>
        </aside>
        <main className="heaven-preview__main">
          <header><div><small>WORKSPACE / OVERVIEW</small><h3>Your command center<span>.</span></h3></div><span className="heaven-preview__date">OCT 24, 2026&nbsp; ↗</span></header>
          <div className="heaven-preview__summary"><div><small>REPOSITORIES</small><b>12</b><span>connected</span></div><div><small>DEPLOYMENTS</small><b>08</b><span>this week</span></div><div><small>INTEGRATIONS</small><b>04</b><span>active channels</span></div></div>
          <div className="heaven-preview__middle">
            <section className="heaven-preview__repos"><div className="heaven-preview__section-title"><b>Recent repositories</b><span>All ↗</span></div><div><i>◈</i><span><b>heaven</b><small>Last commit · 4h ago</small></span><em>main</em></div><div><i>◉</i><span><b>cloud-project</b><small>Last commit · yesterday</small></span><em>main</em></div><div><i>◎</i><span><b>selfmusic</b><small>Last commit · 2d ago</small></span><em>main</em></div></section>
            <section className="heaven-preview__activity"><div className="heaven-preview__section-title"><b>Activity</b><span>7 days</span></div><div className="heaven-preview__graph"><svg viewBox="0 0 160 72" aria-hidden="true"><path d="M0 58 C15 54 13 27 30 35 S48 57 61 40 S78 14 92 25 S114 42 125 21 S145 14 160 5" fill="none" stroke="#dedede" strokeWidth="1.5"/><path d="M0 58 C15 54 13 27 30 35 S48 57 61 40 S78 14 92 25 S114 42 125 21 S145 14 160 5V72H0Z" fill="url(#heavenGraphFill)" opacity=".22"/><defs><linearGradient id="heavenGraphFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#dedede"/><stop offset="1" stopColor="#dedede" stopOpacity="0"/></linearGradient></defs></svg></div></section>
          </div>
          <div className="heaven-preview__integrations"><div className="heaven-preview__section-title"><b>Connected services</b><span>Manage ↗</span></div><span><i>GH</i>GitHub <b>Connected</b></span><span><i>ZM</i>Zoom <b>Connected</b></span><span><i>DC</i>Discord <b>Connected</b></span></div>
        </main>
      </div>
    </div>
  )
}

function ProjectScreen({ project }: { project: Project }) {
  switch (project.preview) {
    case 'music': return <MusicPreview />
    case 'docs': return <DocsPreview />
    case 'jobbrain': return <JobBrainPreview />
    case 'heaven': return <HeavenPreview />
  }
}

function ProjectDevice({ project }: { project: Project }) {
  const screen = <ProjectScreen project={project} />
  if (project.device === 'phone') {
    return <div className="project-device-frame project-device-frame--phone"><span className="project-device-glow" /><PhoneDevice className="project-phone-device">{screen}</PhoneDevice></div>
  }
  return <div className="project-device-frame project-device-frame--laptop"><span className="project-device-glow" /><LaptopDevice className="project-laptop-device">{screen}</LaptopDevice></div>
}

export function Projects() {
  return (
    <section className="projects-section projects-section--showcase section-wrap" id="projects" aria-labelledby="projects-title">
      <header className="projects-showcase__heading">
        <div>
          <p className="section-eyebrow">01 / SELECTED WORK</p>
          <h2 className="projects-title" id="projects-title">Selected <em>projects</em><span className="projects-title__period">.</span></h2>
        </div>
        <p>Personal software. Useful tools. Ideas brought into the real world.</p>
      </header>

      <div className="projects-showcase__list">
        {projects.map((project, index) => {
          const reversed = index % 2 === 1
          const copyVariants = {
            hidden: { opacity: 0, x: reversed ? 50 : -50 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1] as const } },
          }
          const deviceVariants = {
            hidden: { opacity: 0, x: reversed ? -50 : 50, y: 12 },
            visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.06 } },
          }

          return (
            <motion.div
              className={`project-showcase__item ${reversed ? 'project-showcase__item--reverse' : ''}`}
              key={project.number}
              role="article"
              aria-labelledby={`project-title-${project.number}`}
              variants={rowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.24, margin: '0px 0px -5% 0px' }}
            >
              <motion.div className="project-showcase__copy" variants={copyVariants}>
                <div className="project-showcase__eyebrow"><span>{project.number}</span><i />{project.category}</div>
                <h3 id={`project-title-${project.number}`} className="project-showcase__title">{project.name}<span>.</span></h3>
                <p className="project-showcase__description">{project.description}</p>
                <div className="project-showcase__stack" aria-label="Technology stack">
                  {project.stack.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
                <div className="project-showcase__actions">
                  <a className="project-showcase__primary" href={project.repository} target="_blank" rel="noreferrer">View source <ArrowIcon /></a>
                  {project.live && <a className="project-showcase__secondary" href={project.live} target="_blank" rel="noreferrer">Open live project <ArrowIcon /></a>}
                </div>
              </motion.div>

              <motion.div className={`project-showcase__device project-showcase__device--${project.device}`} variants={deviceVariants}>
                <ProjectDevice project={project} />
                <span className="project-showcase__device-note">{project.number} / 04 <i /> INTERACTIVE PREVIEW</span>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
      <footer className="projects-showcase__footer">
        <span>DESIGN / ENGINEERING / DETAIL</span>
        <a href="https://github.com/b-1-o?tab=repositories" target="_blank" rel="noreferrer">Explore all repositories <ArrowIcon /></a>
      </footer>
    </section>
  )
}
