import { useEffect, useState } from 'react'
import { PlayerUI } from './ui/PlayerUI'
import { Scene } from './scene/Scene'
import './App.css'

type Project = {
  number: string
  name: string
  type: string
  description: string
  stack: string[]
  repo: string
  live?: string
  visual: 'music' | 'docs' | 'jobs' | 'shop'
  featured?: boolean
}

const projects: Project[] = [
  {
    number: '01',
    name: 'SelfMusic',
    type: 'Personal music platform',
    description: 'A private music library with streaming, playlists, listening history and offline-ready playback.',
    stack: ['React', 'JavaScript', 'Vite', 'Express', 'SQLite'],
    repo: 'https://github.com/b-1-o/selfmusic',
    visual: 'music',
    featured: true,
  },
  {
    number: '02',
    name: 'Collab Docs',
    type: 'Collaborative workspace',
    description: 'A real-time document workspace built around rich-text editing and edge-powered collaboration.',
    stack: ['React', 'TypeScript', 'Tiptap', 'Yjs', 'Cloudflare'],
    repo: 'https://github.com/b-1-o/cloud-project',
    live: 'https://collab-docs-4tb.pages.dev/',
    visual: 'docs',
  },
  {
    number: '03',
    name: 'JoBrain',
    type: 'Job search companion',
    description: 'A focused workspace to organize job applications, track progress and keep the search in one place.',
    stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma'],
    repo: 'https://github.com/b-1-o/JoBrain',
    live: 'https://jobrain.vercel.app',
    visual: 'jobs',
  },
  {
    number: '04',
    name: 'Shopline',
    type: 'Smart grocery planning',
    description: 'A grocery planning concept that connects a target budget, shopping preferences and product discovery.',
    stack: ['React', 'TypeScript', 'APIs', 'Vercel'],
    repo: 'https://github.com/b-1-o/shopline',
    visual: 'shop',
  },
]

const skills = ['React', 'TypeScript', 'Next.js', 'JavaScript', 'Vite', 'CSS', 'Git', 'Vercel', 'PostgreSQL']

function ArrowIcon({ diagonal = true }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 15 15 5M6 5h9v9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10h13M10 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .9A11.1 11.1 0 0 0 8.49 22.53c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.75-1.32-3.75-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.7 2.22 3.52 1.69.1-.72.39-1.22.7-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.04-1.14 3.04-1.14.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.29-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M5.2 7.7A2.2 2.2 0 1 0 5.2 3.3a2.2 2.2 0 0 0 0 4.4ZM3.3 9.4h3.8v11.3H3.3V9.4Zm6.1 0H13v1.55h.05a4.05 4.05 0 0 1 3.65-2.01c3.9 0 4.62 2.56 4.62 5.9v5.86h-3.8v-5.2c0-1.24-.02-2.84-1.73-2.84-1.74 0-2 1.36-2 2.75v5.29H9.4V9.4Z" />
    </svg>
  )
}

function ProjectVisual({ kind }: { kind: Project['visual'] }) {
  if (kind === 'music') {
    return (
      <div className="project-visual project-visual--music" aria-hidden="true">
        <div className="mock-player">
          <div className="mock-player__top"><span className="mock-dot" /><span>YOUR LIBRARY</span><span className="mock-menu">•••</span></div>
          <div className="mock-player__cover"><span className="cover-orbit cover-orbit--one" /><span className="cover-orbit cover-orbit--two" /><span className="cover-core">S</span></div>
          <div className="mock-player__track"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <div className="mock-player__bottom"><span>PREVIOUS</span><b>Ⅱ</b><span>NEXT</span></div>
        </div>
        <div className="visual-caption"><span>SELF-HOSTED AUDIO</span><span>01 / 04</span></div>
      </div>
    )
  }

  if (kind === 'docs') {
    return (
      <div className="project-visual project-visual--docs" aria-hidden="true">
        <div className="docs-window">
          <div className="window-bar"><i /><i /><i /><span>Untitled document</span></div>
          <div className="docs-body"><aside><b /><i /><i /><i /><i /></aside><div className="docs-paper"><span className="paper-kicker">A SHARED SPACE</span><b /><b /><i /><i /><i /><i /><div className="collaborator-cursor"><span /></div></div></div>
        </div>
        <div className="visual-caption"><span>BUILT FOR COLLABORATION</span><span>02 / 04</span></div>
      </div>
    )
  }

  if (kind === 'jobs') {
    return (
      <div className="project-visual project-visual--jobs" aria-hidden="true">
        <div className="jobs-window">
          <div className="jobs-sidebar"><b>J.</b><i /><i /><i /><i /></div>
          <div className="jobs-main"><div className="jobs-head"><span>Overview</span><b>THIS MONTH ↗</b></div><div className="jobs-stats"><i /><i /><i /></div><div className="jobs-chart"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="jobs-list"><i /><i /><i /></div></div>
        </div>
        <div className="visual-caption"><span>MAKE THE SEARCH CLEARER</span><span>03 / 04</span></div>
      </div>
    )
  }

  return (
    <div className="project-visual project-visual--shop" aria-hidden="true">
      <div className="shop-window">
        <div className="shop-header"><span>weekly basket</span><b>$64.20</b></div>
        <div className="shop-budget"><span /><span /><span /></div>
        <div className="shop-item"><i /><span /><b>$8.49</b></div>
        <div className="shop-item"><i /><span /><b>$4.29</b></div>
        <div className="shop-item"><i /><span /><b>$6.79</b></div>
      </div>
      <div className="visual-caption"><span>PLANNING WITH PURPOSE</span><span>04 / 04</span></div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={'project-card' + (project.featured ? ' project-card--featured' : '')}>
      <ProjectVisual kind={project.visual} />
      <div className="project-card__content">
        <div className="project-card__eyebrow"><span>{project.number}</span><span>{project.type}</span></div>
        <div className="project-card__heading">
          <h3>{project.name}</h3>
          <a className="round-link" href={project.repo} target="_blank" rel="noreferrer" aria-label={'Open ' + project.name + ' repository'}><ArrowIcon /></a>
        </div>
        <p>{project.description}</p>
        <div className="project-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="project-links">
          <a href={project.repo} target="_blank" rel="noreferrer"><GitHubIcon /> Repository <ArrowIcon /></a>
          {project.live && <a href={project.live} target="_blank" rel="noreferrer">Live demo <ArrowIcon /></a>}
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [sceneProgress, setSceneProgress] = useState(0)

  useEffect(() => {
    if (!isPlayerOpen) return
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsPlayerOpen(false)
    }
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isPlayerOpen])

  useEffect(() => {
    const updateSceneProgress = () => {
      const stage = document.getElementById('scene-experience')
      if (!stage) return
      const range = Math.max(1, stage.offsetHeight - window.innerHeight)
      const progress = -stage.getBoundingClientRect().top / range
      setSceneProgress(Math.max(0, Math.min(1, progress)))
    }

    updateSceneProgress()
    window.addEventListener('scroll', updateSceneProgress, { passive: true })
    window.addEventListener('resize', updateSceneProgress)
    return () => {
      window.removeEventListener('scroll', updateSceneProgress)
      window.removeEventListener('resize', updateSceneProgress)
    }
  }, [])

  const sceneStage =
    sceneProgress < 0.36 ? 'forest' :
    sceneProgress < 0.46 ? 'veil' :
    sceneProgress < 0.70 ? 'tree' :
    sceneProgress < 0.84 ? 'roots' : 'stone'

  return (
    <main className="portfolio">
      <Scene isPlayerOpen={isPlayerOpen} onPlayerOpenChange={setIsPlayerOpen} />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="b-1-o home"><span className="wordmark__symbol">b.</span><span className="wordmark__text">b-1-o</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#connect">Connect</a>
        </nav>
        <button className="music-trigger" type="button" onClick={() => setIsPlayerOpen(true)}><span className="music-trigger__icon">♫</span><span>Listen along</span><ArrowIcon /></button>
      </header>

      <section className="scene-experience" id="scene-experience" aria-label="Interactive 3D introduction">
        <div className={`scene-sticky scene-sticky--${sceneStage}`}>
          <div className={`scene-overlay scene-overlay--${sceneStage}`}>
            <div className="scene-frame scene-frame--top">
              <span><i className="scene-frame__mark">b.</i> B-1-O / DIGITAL SPACE</span>
              <span>CALIFORNIA · 2026</span>
            </div>

            <div className="scene-copy" key={sceneStage} aria-live="polite">
              {sceneStage === 'forest' && (
                <>
                  <p className="scene-copy__eyebrow"><span className="scene-status" /> FRONTEND DEVELOPER <span>/</span> UI ENGINEER</p>
                  <h1>Hey, I'm Erik.<br />I make the web feel <em>alive.</em></h1>
                  <p>Thoughtful interfaces, small useful tools, and digital worlds with a little atmosphere.</p>
                  <div className="scene-copy__actions">
                    <a className="button button--light" href="#work">Explore my work <ArrowIcon diagonal={false} /></a>
                    <a className="scene-text-link" href="#about">A little about me <ArrowIcon /></a>
                  </div>
                </>
              )}

              {sceneStage === 'tree' && (
                <>
                  <p className="scene-copy__eyebrow">02 — ELSEWHERE ON THE INTERNET</p>
                  <h2>Outside<br />the <em>code.</em></h2>
                  <p>Somewhere between projects, music, and the rest of the internet. My links are tucked into the tree.</p>
                  <div className="scene-copy__actions">
                    <a className="scene-text-link" href="https://github.com/b-1-o" target="_blank" rel="noreferrer">GitHub <ArrowIcon /></a>
                    <a className="scene-text-link" href="https://www.instagram.com/__._saint" target="_blank" rel="noreferrer">Instagram <ArrowIcon /></a>
                  </div>
                </>
              )}

              {sceneStage === 'roots' && (
                <>
                  <p className="scene-copy__eyebrow">03 — BUILT FROM CURIOSITY</p>
                  <h2>Every idea<br />has <em>roots.</em></h2>
                  <p>Most of my projects start with a problem I want to solve for myself — then grow into something real.</p>
                  <div className="scene-copy__actions">
                    <a className="button button--light" href="#work">See what I've built <ArrowIcon diagonal={false} /></a>
                  </div>
                </>
              )}

              {sceneStage === 'stone' && (
                <>
                  <p className="scene-copy__eyebrow">04 — AFTER HOURS</p>
                  <h2>A little music<br />for the <em>dark.</em></h2>
                  <p>A tiny collection of tracks, hidden in the stone. Take a breath and stay for a song.</p>
                  <div className="scene-copy__actions">
                    <button className="button button--light" type="button" onClick={() => setIsPlayerOpen(true)}>Open the player <span className="music-trigger__icon">♫</span></button>
                    <a className="scene-text-link" href="#work">Back to the work <ArrowIcon /></a>
                  </div>
                </>
              )}
            </div>

            <div className="scene-frame scene-frame--bottom">
              <span>{sceneStage === 'veil' ? 'A MOMENT BETWEEN WORLDS' : 'SCROLL TO TRAVEL THROUGH THE SCENE'}</span>
              <span>{String(Math.min(4, Math.floor(sceneProgress * 4) + 1)).padStart(2, '0')} / 04</span>
            </div>
            <div className="scene-progress" aria-hidden="true"><span style={{ width: `${sceneProgress * 100}%` }} /></div>
          </div>
        </div>
      </section>

      <div className="ticker" aria-label="Areas of focus"><div className="ticker__inner"><span>INTERFACES</span><i>✳</i><span>FRONTEND</span><i>✳</i><span>CREATIVE CODE</span><i>✳</i><span>DETAILS MATTER</span><i>✳</i><span>INTERFACES</span><i>✳</i><span>FRONTEND</span><i>✳</i><span>CREATIVE CODE</span><i>✳</i><span>DETAILS MATTER</span></div></div>

      <section className="work-section section-wrap" id="work">
        <div className="section-heading">
          <div><p className="eyebrow">A FEW THINGS I'VE MADE</p><h2>Selected work<span className="section-period">.</span></h2></div>
          <p className="section-intro">Personal projects, useful experiments, and ideas turned into something you can use.</p>
        </div>
        <div className="projects-grid">{projects.map((project) => <ProjectCard key={project.number} project={project} />)}</div>
        <a className="all-work-link" href="https://github.com/b-1-o?tab=repositories" target="_blank" rel="noreferrer">More on GitHub <ArrowIcon /></a>
      </section>

      <section className="about-section" id="about">
        <div className="about-inner section-wrap">
          <div className="about-heading"><p className="eyebrow">A LITTLE ABOUT ME</p><h2>Curious by nature.<br /><em>Intentional by design.</em></h2></div>
          <div className="about-copy"><p className="about-lead">I'm a frontend-focused developer who enjoys turning complicated ideas into interfaces that feel simple, fast, and considered.</p><p>I work primarily with React, TypeScript, and modern web tooling. I care about how a product behaves as much as how it looks — from responsive layouts and accessibility to animation, performance, and the last few pixels.</p><p>Most of what you see here started as a problem I wanted to solve for myself. Building these projects is how I learn, experiment, and get better at the craft.</p><div className="about-signature">— Erik <span>b-1-o</span></div></div>
        </div>
      </section>

      <section className="stack-section section-wrap">
        <div className="stack-heading"><p className="eyebrow">TOOLS OF THE TRADE</p><h2>My everyday stack</h2></div>
        <div className="skills-list">{skills.map((skill, index) => <span className="skill-chip" key={skill}><i>{String(index + 1).padStart(2, '0')}</i>{skill}</span>)}</div>
      </section>

      <section className="contact-section section-wrap" id="connect">
        <div className="contact-card">
          <div className="contact-card__top"><p className="eyebrow">HAVE SOMETHING IN MIND?</p><span className="contact-mark">↗</span></div>
          <h2>Good things start<br />with a <em>conversation.</em></h2>
          <p>Have a project, an idea, or an opportunity in frontend development? I'd be glad to hear about it.</p>
          <div className="contact-actions">
            <a className="button button--light" href="https://www.linkedin.com/in/b1o" target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowIcon /></a>
            <a className="button button--outline" href="https://github.com/b-1-o" target="_blank" rel="noreferrer">Find me on GitHub <GitHubIcon /></a>
          </div>
        </div>
      </section>

      <footer className="site-footer section-wrap">
        <a className="footer-brand" href="#top">b-1-o<span>®</span></a>
        <p>Designed with intention. Built with curiosity.</p>
        <div className="footer-links">
          <a href="https://github.com/b-1-o" target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon /></a>
          <a href="https://www.linkedin.com/in/b1o" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
          <a href="https://www.instagram.com/__._saint" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
          <a href="https://www.tiktok.com/@psycho_b1o" target="_blank" rel="noreferrer" aria-label="TikTok">♪</a>
        </div>
        <span className="footer-year">© 2026</span>
      </footer>

      {isPlayerOpen && <PlayerUI onClose={() => setIsPlayerOpen(false)} />}
    </main>
  )
}
