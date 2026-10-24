import { useEffect, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import profilePortrait from '../assets/Gemini_Generated_Image_uf7b7uuf7b7uuf7b.jpeg'
import { PlayerUI } from './ui/PlayerUI'
import LetterGlitch from './components/reactbits/LetterGlitch'
import Noise from './components/reactbits/Noise'
import SpotlightCard from './components/reactbits/SpotlightCard'
import GlitchText from './components/reactbits/GlitchText'
import PixelTransition from './components/reactbits/PixelTransition'
import './App.css'

type Project = {
  number: string
  name: string
  category: string
  description: string
  stack: string[]
  repo: string
  live?: string
  visual: 'music' | 'docs' | 'jobs' | 'shop'
  signal: string
}

const projects: Project[] = [
  { number: '01', name: 'SelfMusic', category: 'Personal music platform', description: 'A private music library for streaming, playlists, listening history and offline-ready playback.', stack: ['React', 'JavaScript', 'Vite', 'Express', 'SQLite'], repo: 'https://github.com/b-1-o/selfmusic', visual: 'music', signal: 'PRIVATE FREQUENCY' },
  { number: '02', name: 'Collab Docs', category: 'Collaborative workspace', description: 'A real-time document workspace shaped around rich-text editing and edge-powered collaboration.', stack: ['React', 'TypeScript', 'Tiptap', 'Yjs', 'Cloudflare'], repo: 'https://github.com/b-1-o/cloud-project', live: 'https://collab-docs-4tb.pages.dev/', visual: 'docs', signal: 'SHARED MEMORY' },
  { number: '03', name: 'JoBrain', category: 'Job search companion', description: 'A focused workspace to organize applications, track progress and keep the search in one place.', stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma'], repo: 'https://github.com/b-1-o/JoBrain', live: 'https://jobrain.vercel.app', visual: 'jobs', signal: 'SEARCH LOG' },
  { number: '04', name: 'Shopline', category: 'Smart grocery planning', description: 'A grocery planning concept connecting budgets, shopping preferences and product discovery.', stack: ['React', 'TypeScript', 'APIs', 'Vercel'], repo: 'https://github.com/b-1-o/shopline', visual: 'shop', signal: 'BASKET PROTOCOL' },
]
const skills = ['React', 'TypeScript', 'Next.js', 'JavaScript', 'Vite', 'CSS', 'Git', 'Vercel', 'PostgreSQL']

function ArrowIcon({ diagonal = true }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d={diagonal ? 'M5 15 15 5M6 5h9v9' : 'M3 10h13M10 4l6 6-6 6'} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9A11.1 11.1 0 0 0 8.49 22.53c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.75-1.32-3.75-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.7 2.22 3.52 1.69.1-.72.39-1.22.7-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.04-1.14 3.04-1.14.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.29-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" /></svg>
}
function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.2 7.7A2.2 2.2 0 1 0 5.2 3.3a2.2 2.2 0 0 0 0 4.4ZM3.3 9.4h3.8v11.3H3.3V9.4Zm6.1 0H13v1.55h.05a4.05 4.05 0 0 1 3.65-2.01c3.9 0 4.62 2.56 4.62 5.9v5.86h-3.8v-5.2c0-1.24-.02-2.84-1.73-2.84-1.74 0-2 1.36-2 2.75v5.29H9.4V9.4Z" /></svg>
}

function ProjectPreview({ project }: { project: Project }) {
  return <div className={'project-preview project-preview--' + project.visual} aria-hidden="true">
    <div className="preview-topline"><span className="preview-mark">b-1-o <i>///</i></span><span className="preview-status"><i /> SIGNAL STABLE</span></div>
    <div className="preview-content">
      {project.visual === 'music' && <div className="preview-music"><div className="preview-disc"><span /><i /><b>VOID</b></div><div className="preview-equalizer">{Array.from({ length: 19 }, (_, i) => <i key={i} style={{ '--bar': (18 + ((i * 19) % 71)) + '%' } as CSSProperties} />)}</div><span className="preview-detail">NOW PLAYING / LOCAL ARCHIVE</span></div>}
      {project.visual === 'docs' && <div className="preview-document"><span className="document-label">UNNAMED / DOCUMENT_001</span><b>Notes from the other side.</b><i className="document-line document-line--long" /><i className="document-line document-line--medium" /><i className="document-line document-line--short" /><div className="document-caret"><span /></div></div>}
      {project.visual === 'jobs' && <div className="preview-dashboard"><div className="dashboard-number"><span>APPLICATIONS</span><b>024</b><i>+08.2%</i></div><div className="dashboard-bars">{[28, 47, 35, 70, 44, 82, 59, 94, 68, 76, 48, 88].map((height, i) => <i key={i} style={{ height: height + '%' }} />)}</div><div className="dashboard-rows"><i /><i /><i /></div></div>}
      {project.visual === 'shop' && <div className="preview-basket"><div className="basket-header"><span>WEEKLY BASKET</span><b>$64.20</b></div>{['01 / PRODUCE', '02 / PANTRY', '03 / ESSENTIALS'].map((item, i) => <div className="basket-row" key={item}><span>{item}</span><i /><b>{['$18.40', '$24.60', '$21.20'][i]}</b></div>)}<div className="basket-total"><span>UNDER BUDGET</span><b>✓</b></div></div>}
    </div>
    <div className="preview-bottomline"><span>{project.signal}</span><span>{project.number} / 04</span></div>
  </div>
}

function ProjectCard({ project }: { project: Project }) {
  return <SpotlightCard className="project-card" spotlightColor="rgba(231, 229, 220, 0.9)" intensity={0.13} spotlightSize={290} softness={0.82} borderGlow={0.38} proximity={90} smoothing={0.28} ambient={false} flare grain={0.12} theme="dark">
    <ProjectPreview project={project} />
    <div className="project-card__content">
      <div className="project-card__eyebrow"><span>{project.number} / PROJECT FILE</span><span>{project.category}</span></div>
      <div className="project-card__heading"><h3>{project.name}</h3><a className="round-link" href={project.repo} target="_blank" rel="noreferrer" aria-label={'Open ' + project.name + ' repository'}><ArrowIcon /></a></div>
      <p>{project.description}</p>
      <div className="project-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
      <div className="project-links"><a href={project.repo} target="_blank" rel="noreferrer"><GitHubIcon /> Source code <ArrowIcon /></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live signal <ArrowIcon /></a>}</div>
    </div>
  </SpotlightCard>
}

export default function App() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  useEffect(() => {
    if (!isPlayerOpen) return
    const oldBodyOverflow = document.body.style.overflow
    const oldHtmlOverflow = document.documentElement.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsPlayerOpen(false) }
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = oldBodyOverflow
      document.documentElement.style.overflow = oldHtmlOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isPlayerOpen])

  return <main className="portfolio" id="top">
    <div className="portfolio-glitch" aria-hidden="true"><LetterGlitch className="global-letter-glitch" glitchColors={['#d5d3cc', '#8f8d89', '#4d4b4b']} baseColor="#44423f" characters="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン零一二三四五六七八九<>/{}[]0123456789" fontFamily='"IPA Gothic", "Hiragino Kaku Gothic W8", "Noto Sans JP", monospace' fontSize={17} spacing={9} density={0.56} baseOpacity={0.13} glitchAmount={0.23} speed={0.24} smooth interactive cursorRadius={135} clickEffect="tear" flow={0.3} edgeFade={190} centerFade={0.62} intro backgroundColor="#080808" dpr={1} style={{ position: 'fixed', inset: 0, opacity: 0.32, pointerEvents: 'none' }} /></div>
    <Noise fixed opacity={0.075} size={1} fps={12} blendMode="soft-light" contrast={0.48} dust={0.11} scratches={0.015} scanlines={0.08} flicker={0.025} zIndex={2} />

    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="b-1-o home"><span className="wordmark__symbol">b.</span><span>b-1-o</span><i>個人記録</i></a>
      <nav className="main-nav" aria-label="Main navigation"><a href="#work"><span>01</span> Work</a><a href="#about"><span>02</span> About</a><a href="#technology"><span>03</span> Technology</a></nav>
      <button className="music-trigger" type="button" onClick={() => setIsPlayerOpen(true)}><span className="music-trigger__icon">♫</span><span>Open player</span><ArrowIcon /></button>
    </header>

    <section className="hero section-wrap" aria-labelledby="hero-title">
      <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
        <p className="eyebrow eyebrow--status"><span className="status-light" /> CONNECTION ESTABLISHED <i>///</i> LOCAL NODE / 0xB10</p>
        <p className="hero-kicker">怪異の記録 <span>/</span> DIGITAL CREEPYPASTA ARCHIVE</p>
        <GlitchText className="hero-monogram" trigger="hover" mode="slices" color="#eeede7" shadowColors={['#b8b5ad', '#4e4b4b']} intensity={0.27} speed={0.5} enableOnHover>B-1-O</GlitchText>
        <h1 id="hero-title">Interfaces from<br />the <em>other side.</em></h1>
        <p className="hero-description">I'm Erik — a frontend-focused developer, terminal dweller, and collector of strange ideas. I build personal tools and thoughtful interfaces long after the city goes quiet.</p>
        <div className="hero-actions"><a className="button button--light" href="#work">Explore the archive <ArrowIcon diagonal={false} /></a><a className="text-link" href="https://github.com/b-1-o" target="_blank" rel="noreferrer">View GitHub <ArrowIcon /></a></div>
        <div className="hero-meta"><span>FRONTEND ENGINEERING</span><i /><span>CREATIVE CODE</span><i /><span>AFTER DARK</span></div>
      </motion.div>
      <motion.div className="hero-portrait" initial={{ opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}>
        <div className="portrait-index portrait-index--top"><span>FIG. 001</span><span>UNKNOWN / KNOWN</span></div>
        <div className="portrait-corners" aria-hidden="true"><i /><i /><i /><i /></div>
        <PixelTransition firstContent={<img className="profile-image" src={profilePortrait} alt="Profile artwork for B-1-O" />} secondContent={<div className="portrait-terminal"><span className="terminal-warning">信号異常 / SIGNAL LOST</span><strong>0xB10</strong><span>IDENTITY : ERIK</span><span>ROLE : FRONTEND</span><span>STATUS : ONLINE</span><i>HOVER TO RETURN</i></div>} gridSize={13} pixelColor="#d4d1c8" animationStepDuration={0.42} pattern="dither" randomness={0.14} pixelAnimation="fade" pixelShape="square" gap={2} fps={40} trigger="hover" once={false} aspectRatio="3 / 4" className="portrait-pixel-transition" />
        <div className="portrait-index portrait-index--bottom"><span>夜間プログラマー</span><span>PROFILE / 01</span></div>
        <span className="portrait-side-label" aria-hidden="true">NOTHING HERE IS ACCIDENTAL — SCROLL TO DECODE</span>
      </motion.div>
      <div className="hero-stamp" aria-hidden="true"><span>夜</span><i>NO SIGNAL<br />NO SLEEP</i></div>
      <span className="hero-vertical" aria-hidden="true">夜行端末 · B-1-O · 夜行端末</span>
    </section>

    <div className="ticker" aria-label="Areas of focus"><div className="ticker__inner">{Array.from({ length: 3 }, (_, i) => <span className="ticker-group" key={i}><b>INTERFACE ENGINEERING</b><i>✳</i><b>PERSONAL SOFTWARE</b><i>✳</i><b>JAPANESE HORROR AESTHETIC</b><i>✳</i><b>DETAILS MATTER</b><i>✳</i></span>)}</div></div>

    <section className="work-section section-wrap" id="work">
      <div className="section-heading"><div><p className="eyebrow">作品ログ / BUILD ARCHIVE</p><h2>Selected work<span className="section-period">.</span></h2></div><p className="section-intro">Four project files. Built from real problems, personal curiosity, and too many late-night iterations.</p></div>
      <div className="projects-grid">{projects.map((project) => <ProjectCard key={project.number} project={project} />)}</div>
      <a className="all-work-link" href="https://github.com/b-1-o?tab=repositories" target="_blank" rel="noreferrer">Open the full archive <ArrowIcon /></a>
    </section>

    <section className="about-section" id="about"><div className="about-inner section-wrap">
      <div className="about-heading"><p className="eyebrow">個体記録 / OPERATOR FILE</p><span className="about-glyph" aria-hidden="true">異</span><h2>Curious by nature.<br /><em>Strange by design.</em></h2><span className="about-caption">SUBJECT 0xB10 / HUMAN INTERFACE</span></div>
      <div className="about-copy"><p className="about-lead">I'm a frontend-focused developer who cares about the feeling of using a product as much as its appearance. My favorite space is somewhere between a browser tab, a terminal, and an idea that got a little out of hand.</p><p>I work with React, TypeScript, and modern web tooling to build responsive interfaces, useful personal software, and carefully tuned interactions. I like the details: keyboard flow, motion that feels natural, performance that stays out of the way, and pixels that land exactly where they should.</p><p>Outside of building, I'm drawn to Linux, experimental UI, underground music, and Japanese horror stories. Most projects here started as something I wanted to exist — so I built it myself.</p><div className="about-signature">— Erik <span>b-1-o</span></div></div>
    </div></section>

    <section className="technology-section section-wrap" id="technology">
      <div className="section-heading section-heading--technology"><div><p className="eyebrow">使用技術 / TOOLCHAIN</p><h2>Technology<span className="section-period">.</span></h2></div><p className="section-intro">Tools for building living interfaces, precise motion, and digital spaces with character.</p></div>
      <div className="technology-list">{['React', 'Remix', 'Three.js', 'Framer Motion'].map((name, index) => <div className="technology-item" key={name}><span>{String(index + 1).padStart(2, '0')}</span><b>{name}</b><i>↗</i></div>)}</div>
      <div className="stack-row"><div className="stack-heading"><p className="eyebrow">TOOLS I ACTUALLY SHIP WITH</p><h3>Everyday stack</h3></div><div className="skills-list">{skills.map((skill, index) => <span className="skill-chip" key={skill}><i>{String(index + 1).padStart(2, '0')}</i>{skill}</span>)}</div></div>
      <div className="font-system"><span>FONT SYSTEM</span><b>Gotham</b><b>IPA Gothic Regular</b><b>Hiragino Kaku Gothic W8</b></div>
    </section>

    <section className="contact-section section-wrap" id="connect"><div className="contact-card">
      <div className="contact-card__top"><p className="eyebrow">接続要求 / INCOMING SIGNAL</p><span className="contact-mark">↗</span></div><p className="contact-kicker">OPEN CHANNEL / 04</p><h2>Good things start<br />with a <em>conversation.</em></h2><p className="contact-description">Have a project, an idea, or an opportunity in frontend development? Send a signal.</p>
      <div className="contact-actions"><a className="button button--light" href="https://www.linkedin.com/in/b1o" target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowIcon /></a><a className="button button--outline" href="https://github.com/b-1-o" target="_blank" rel="noreferrer">Find me on GitHub <GitHubIcon /></a></div>
    </div></section>

    <footer className="site-footer section-wrap"><a className="footer-brand" href="#top">b-1-o<span>®</span></a><p>Designed with intention. Built after dark.</p><div className="footer-links"><a href="https://github.com/b-1-o" target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon /></a><a href="https://www.linkedin.com/in/b1o" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a><a href="https://www.instagram.com/__._saint" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a><a href="https://www.tiktok.com/@psycho_b1o" target="_blank" rel="noreferrer" aria-label="TikTok">♪</a></div><span className="footer-year">© 2026</span></footer>
    {isPlayerOpen && <PlayerUI onClose={() => setIsPlayerOpen(false)} />}
  </main>
}