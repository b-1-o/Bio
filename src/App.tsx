import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import profilePortrait from '../assets/Gemini_Generated_Image_uf7b7uuf7b7uuf7b.jpeg'
import { Cursor } from './components/Cursor'
import { DeviceScene } from './components/DeviceScene'
import { HeroBackground } from './components/HeroBackground'
import { Sidebar } from './components/Sidebar'
import { SmoothScroll } from './components/SmoothScroll'
import GlitchText from './components/reactbits/GlitchText'
import Noise from './components/reactbits/Noise'
import PixelTransition from './components/reactbits/PixelTransition'
import { PlayerUI } from './ui/PlayerUI'
import './App.css'

import type { ProjectScreen } from './components/LaptopModel'

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
    description: 'A private music library built for streaming, playlists, listening history, uploads and offline-ready playback — on my own terms.',
    stack: ['React', 'JavaScript', 'Vite', 'Express', 'SQLite', 'PWA'],
    repository: 'https://github.com/b-1-o/selfmusic',
    screen: 'music',
    device: 'laptop',
  },
  {
    number: '02',
    name: 'Collab Docs',
    category: 'Collaborative workspace',
    description: 'A real-time document space with rich-text editing, shared cursors and edge-powered collaboration.',
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
    description: 'A focused workspace to organise applications, track progress and keep the entire search in one place.',
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
    description: 'A grocery planning concept that connects budgets, preferences and product discovery without losing sight of the total.',
    stack: ['React', 'TypeScript', 'APIs', 'Vercel'],
    repository: 'https://github.com/b-1-o/shopline',
    screen: 'shop',
    device: 'phone',
  },
]

const technologies = [
  { number: '01', name: 'React', note: 'Component systems' },
  { number: '02', name: 'Remix', note: 'Routing and web fundamentals' },
  { number: '03', name: 'Three.js', note: 'Real-time 3D on the web' },
  { number: '04', name: 'Framer Motion', note: 'Motion with intention' },
  { number: '05', name: 'TypeScript', note: 'Predictable interfaces' },
  { number: '06', name: 'Tailwind CSS', note: 'Utility-first styling' },
  { number: '07', name: 'Lenis', note: 'Smooth scroll behaviour' },
  { number: '08', name: 'Vite', note: 'Fast frontend tooling' },
]

function ArrowIcon({ diagonal = true }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d={diagonal ? 'M5 15 15 5M6 5h9v9' : 'M3 10h13M10 4l6 6-6 6'} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9A11.1 11.1 0 0 0 8.49 22.53c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.75-1.32-3.75-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.7 2.22 3.52 1.69.1-.72.39-1.22.7-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.04-1.14 3.04-1.14.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.29-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" /></svg>
}

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.2 7.7A2.2 2.2 0 1 0 5.2 3.3a2.2 2.2 0 0 0 0 4.4ZM3.3 9.4h3.8v11.3H3.3V9.4Zm6.1 0H13v1.55h.05a4.05 4.05 0 0 1 3.65-2.01c3.9 0 4.62 2.56 4.62 5.9v5.86h-3.8v-5.2c0-1.24-.02-2.84-1.73-2.84-1.74 0-2 1.36-2 2.75v5.29H9.4V9.4Z" /></svg>
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return <motion.article
    className="project-row"
    initial={{ opacity: 0, y: 38 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.18 }}
    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
  >
    <span className="project-row__kanji" aria-hidden="true">{index % 2 === 0 ? 'プロジェクト' : '作品記録'}</span>
    <div className="project-copy">
      <div className="project-copy__meta"><span className="section-line" /><span>{project.number} / 04</span><span>{project.category}</span></div>
      <h3>{project.name}<span>.</span></h3>
      <p className="project-copy__description">{project.description}</p>
      <div className="project-stack">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="project-actions">
        <a className="project-button" href={project.repository} target="_blank" rel="noreferrer">View repository <ArrowIcon /></a>
        {project.live && <a className="project-link" href={project.live} target="_blank" rel="noreferrer">Open live project <ArrowIcon /></a>}
      </div>
    </div>
    <div className="project-visual">
      <div className="project-visual__heading"><span>INTERACTIVE OBJECT</span><span>01 — 04</span></div>
      <DeviceScene kind={project.device} screen={project.screen} label={project.name + ' 3D device preview'} />
      <div className="project-visual__footer"><span>MONOCHROME RENDER / 60 FPS TARGET</span><span>↗ DRAG TO ROTATE</span></div>
    </div>
  </motion.article>
}

export default function App() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)

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

  return <main className="portfolio" id="top">
    <SmoothScroll />
    <Sidebar onPlayerOpen={() => setIsPlayerOpen(true)} />
    <Cursor />
    <Noise fixed opacity={0.035} size={1} fps={12} blendMode="soft-light" contrast={0.2} dust={0.035} scratches={0} scanlines={0.025} flicker={0} zIndex={5} />

    <div className="main-content">
      <section className="hero" id="details" aria-labelledby="hero-title">
        <HeroBackground />
        <div className="hero__topline"><span>ERIK GHABUZYAN / FRONTEND DEVELOPER</span><span>34° 10' N / LOCAL NODE</span></div>
        <motion.div className="hero__content" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <p className="hero__kicker"><span className="status-dot" /> INDEPENDENT DEVELOPER <i>///</i> INTERFACE ENGINEER</p>
          <GlitchText className="hero__monogram" trigger="hover" mode="slices" color="#f5f5f5" shadowColors={['#a3a3a3', '#404040']} intensity={0.18} speed={0.42} enableOnHover>B-1-O / 0xB10</GlitchText>
          <h1 id="hero-title" className="hero__title"><span>Developer</span><b>+</b><em>Geek</em></h1>
          <p className="hero__description">I build thoughtful interfaces, personal software and little digital worlds. Frontend-first, terminal-raised, always curious about what happens when design meets code.</p>
          <div className="hero__actions"><a className="button button--white" href="#projects">Explore selected work <ArrowIcon diagonal={false} /></a><a className="button button--text" href="https://github.com/b-1-o" target="_blank" rel="noreferrer">View GitHub <ArrowIcon /></a></div>
        </motion.div>
        <div className="hero__index" aria-hidden="true"><span>DESIGN / CODE / DETAIL</span><span>SCROLL TO EXPLORE ↓</span></div>
        <span className="hero__vertical" aria-hidden="true">開発者 + ギーク / B-1-O</span>
        <div className="hero__coordinates" aria-hidden="true"><span>001</span><i /><span>HUMAN / MACHINE / INTERFACE</span></div>
      </section>

      <div className="ticker" aria-label="Areas of focus"><div className="ticker__track">{Array.from({ length: 2 }, (_, index) => <span className="ticker__group" key={index}><b>FRONTEND ENGINEERING</b><i>✳</i><b>PERSONAL SOFTWARE</b><i>✳</i><b>MONOCHROME WORLDS</b><i>✳</i><b>DETAILS MATTER</b><i>✳</i></span>)}</div></div>

      <section className="projects-section section-wrap" id="projects">
        <div className="section-heading">
          <div><p className="section-eyebrow">01 / BUILD ARCHIVE</p><h2>Selected <em>projects</em><span>.</span></h2></div>
          <p>Actual builds, useful experiments and problems I wanted to solve myself.</p>
        </div>
        <div className="project-list">{projects.map((project, index) => <ProjectRow project={project} index={index} key={project.number} />)}</div>
        <a className="section-more" href="https://github.com/b-1-o?tab=repositories" target="_blank" rel="noreferrer">Explore all repositories <ArrowIcon /></a>
      </section>

      <section className="about-section section-wrap" id="about">
        <div className="section-heading section-heading--about">
          <div><p className="section-eyebrow">02 / PROFILE FILE</p><h2>Hi there<span>.</span></h2></div>
          <p>Curious by nature. Strange by design.</p>
        </div>
        <div className="about-layout">
          <div className="about-portrait">
            <div className="about-portrait__top"><span>SUBJECT / 0xB10</span><span>PROFILE 001</span></div>
            <PixelTransition
              firstContent={<img className="about-portrait__image" src={profilePortrait} alt="Monochrome profile artwork for Erik Ghabuzyan" />}
              secondContent={<div className="about-terminal"><span>IDENTITY VERIFIED</span><strong>0xB10</strong><span>ROLE / FRONTEND</span><span>SYSTEM / LINUX</span><span>STATUS / BUILDING</span></div>}
              gridSize={13}
              pixelColor="#ffffff"
              animationStepDuration={0.38}
              pattern="dither"
              randomness={0.12}
              pixelAnimation="fade"
              pixelShape="square"
              gap={2}
              fps={36}
              trigger="hover"
              once={false}
              aspectRatio="3 / 4"
              className="about-portrait__transition"
            />
            <div className="about-portrait__bottom"><span>夜間プログラマー</span><span>GRAYSCALE / ORIGINAL IMAGE</span></div>
          </div>
          <div className="about-copy">
            <span className="about-copy__kanji" aria-hidden="true">プロフィール</span>
            <p className="about-copy__lead">I'm Erik — a frontend-focused developer who cares about how a product feels as much as how it looks.</p>
            <p>I work primarily with React, TypeScript, and modern web tooling to make responsive, interactive interfaces. I enjoy the details: motion that has a purpose, accessible interactions, performance that stays out of the way, and layouts that feel deliberate on every screen.</p>
            <p>Outside the browser, I'm drawn to Linux, late-night coding, underground music, Japanese horror stories and tools that make everyday life a little better. Most of the projects here began as something I wanted to exist — so I made them.</p>
            <div className="about-signature"><span>— Erik</span><b>b-1-o</b><i>FRONTEND / UI ENGINEERING</i></div>
          </div>
        </div>
      </section>

      <section className="technology-section section-wrap" id="technology">
        <div className="section-heading">
          <div><p className="section-eyebrow">03 / TOOLCHAIN</p><h2>Technology<span>.</span></h2></div>
          <p>Tools I use to shape interfaces, motion and the things behind them.</p>
        </div>
        <div className="technology-list">{technologies.map((technology) => <motion.div className="technology-row" key={technology.number} initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4 }}>
          <span className="technology-row__number">{technology.number}</span><h3>{technology.name}</h3><p>{technology.note}</p><span className="technology-row__mark">↗</span>
        </motion.div>)}</div>
        <div className="technology-foot"><span>DAILY STACK</span><div>{['JavaScript', 'CSS', 'Git', 'Vercel', 'PostgreSQL', 'Three.js', 'Tailwind', 'Lenis'].map((skill) => <span key={skill}>{skill}</span>)}</div></div>
        <div className="font-system"><span>FONT SYSTEM</span><b>Montserrat</b><b>Inter</b><b>Noto Sans JP 900</b></div>
      </section>

      <section className="contact-section section-wrap" id="contact">
        <div className="contact-panel">
          <div className="contact-panel__top"><p className="section-eyebrow">04 / OPEN CHANNEL</p><span>↗</span></div>
          <p className="contact-panel__kicker">AVAILABLE FOR INTERESTING FRONTEND WORK</p>
          <h2>Let's build<br />something <em>worth opening.</em></h2>
          <p className="contact-panel__copy">Have an interface to build, a tricky UI problem, or a frontend opportunity? Send a signal.</p>
          <div className="contact-actions"><a className="button button--white" href="https://www.linkedin.com/in/b1o" target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowIcon /></a><a className="button button--outline" href="https://github.com/b-1-o" target="_blank" rel="noreferrer">Find me on GitHub <GitHubIcon /></a></div>
        </div>
      </section>

      <footer className="site-footer section-wrap">
        <a href="#top" className="site-footer__brand">b-1-o<span>®</span></a>
        <p>Designed with intention. Built with curiosity.</p>
        <div className="site-footer__links"><a href="https://github.com/b-1-o" aria-label="GitHub" target="_blank" rel="noreferrer"><GitHubIcon /></a><a href="https://www.linkedin.com/in/b1o" aria-label="LinkedIn" target="_blank" rel="noreferrer"><LinkedInIcon /></a><a href="https://www.instagram.com/__._saint" aria-label="Instagram" target="_blank" rel="noreferrer">◎</a><a href="https://www.tiktok.com/@psycho_b1o" aria-label="TikTok" target="_blank" rel="noreferrer">♪</a></div>
        <span>© 2026 / B-1-O</span>
      </footer>
    </div>
    {isPlayerOpen && <PlayerUI onClose={() => setIsPlayerOpen(false)} />}
  </main>
}
