import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import profilePortrait from '../assets/Gemini_Generated_Image_uf7b7uuf7b7uuf7b.jpeg'
import { Cursor } from './components/Cursor'
import Noise from './components/reactbits/Noise'
import { Sidebar } from '../app/components/Sidebar'
import { Projects } from '../app/components/sections/Projects'
import TerminalRain from '../app/components/ui/TerminalRain'
import { Hero } from './components/Hero'
import './App.css'

const LazyPlayerUI = lazy(() => import('./ui/PlayerUI').then((module) => ({ default: module.PlayerUI })))

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .9A11.1 11.1 0 0 0 8.49 22.53c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.75-1.32-3.75-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.7 2.22 3.52 1.69.1-.72.39-1.22.7-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.04-1.14 3.04-1.14.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.29-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5.2 7.7A2.2 2.2 0 1 0 5.2 3.3a2.2 2.2 0 0 0 0 4.4ZM3.3 9.4h3.8v11.3H3.3V9.4Zm6.1 0H13v1.55h.05a4.05 4.05 0 0 1 3.65-2.01c3.9 0 4.62 2.56 4.62 5.9v5.86h-3.8v-5.2c0-1.24-.02-2.84-1.73-2.84-1.74 0-2 1.36-2 2.75v5.29H9.4V9.4Z"
      />
    </svg>
  )
}

export default function App() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const aboutSectionRef = useRef<HTMLElement>(null)
  const [client, setClient] = useState(false)

  useEffect(() => {
    setClient(true)
  }, [])

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
    const about = aboutSectionRef.current
    if (!about || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      gsap.fromTo(
        about,
        { yPercent: 8, clipPath: 'inset(10% 0 0 round 26px)' },
        {
          yPercent: 0,
          clipPath: 'inset(0% 0 0 round 0px)',
          ease: 'none',
          scrollTrigger: {
            id: 'about-curtain',
            trigger: about,
            start: 'top bottom',
            end: 'top 24%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      )

      const reveals = gsap.utils.toArray<HTMLElement>(
        '[data-about-reveal]',
        about,
      )
      gsap.fromTo(
        reveals,
        { y: 58, autoAlpha: 0, clipPath: 'inset(0 0 18% 0)' },
        {
          y: 0,
          autoAlpha: 1,
          clipPath: 'inset(0 0 0% 0)',
          ease: 'power3.out',
          stagger: 0.14,
          scrollTrigger: {
            id: 'about-content-reveal',
            trigger: about,
            start: 'top 78%',
            end: 'top 32%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      )
      const portrait = about.querySelector<HTMLElement>('.about-portrait')
      const portraitImage = about.querySelector<HTMLElement>('[data-portrait-image]')
      const portraitMarks = gsap.utils.toArray<HTMLElement>('[data-portrait-kanji]', about)

      if (portrait && portraitImage) {
        gsap.fromTo(
          portraitImage,
          {
            autoAlpha: 0,
            y: 34,
            scale: 1.055,
            clipPath: 'inset(12% 0 0 0)',
            filter: 'grayscale(1) brightness(.42) blur(7px)',
          },
          {
            autoAlpha: 0.94,
            y: 0,
            scale: 1,
            clipPath: 'inset(0% 0 0 0)',
            filter: 'grayscale(1) contrast(1.12) brightness(.84) blur(0px)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: portrait,
              start: 'top 78%',
              once: true,
            },
          },
        )

        gsap.fromTo(
          portraitMarks,
          { y: 24, opacity: 0, filter: 'blur(7px)' },
          {
            y: 0,
            opacity: 0.2,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            stagger: 0.16,
            scrollTrigger: {
              trigger: portrait,
              start: 'top 74%',
              once: true,
            },
          },
        )
      }

    }, about)

    return () => context.revert()
  }, [])

  return (
    <main className="portfolio" id="top">
      <Sidebar onPlayerOpen={() => setIsPlayerOpen(true)} />
      <Cursor />

      {client && (
        <TerminalRain color="#2a2a2a" highlightColor="#6b6b6b" opacity={0.28} />
      )}

      <Noise
        fixed
        opacity={0.03}
        size={1}
        fps={12}
        blendMode="soft-light"
        contrast={0.18}
        dust={0.03}
        scratches={0}
        scanlines={0.02}
        flicker={0}
        zIndex={5}
      />

      <div className="main-content">
        <Hero />

        <Projects />

        <section ref={aboutSectionRef} className="about-section section-wrap" id="about" aria-labelledby="about-title">
          <div className="about-section__heading" data-about-reveal>
            <p className="section-eyebrow">02 / PROFILE FILE</p>
            <h2 className="about-section__title" id="about-title">Hi there<span>.</span></h2>
            <p className="about-section__tagline">Curious by nature. Strange by design.</p>
          </div>

          <div className="about-layout">
            <div className="about-copy" data-about-reveal>
              <span className="about-copy__kanji" aria-hidden="true">プロフィール</span>
              <p>I'm Erik — a frontend-focused developer who cares about how a product feels as much as how it looks. I work primarily with React, TypeScript, and modern web tooling to make responsive, interactive interfaces. I enjoy the details: motion that has a purpose, accessible interactions, performance that stays out of the way, and layouts that feel deliberate on every screen. Outside the browser, I'm drawn to Linux, late-night coding, underground music, Japanese horror stories and tools that make everyday life a little better. Most of the projects here began as something I wanted to exist — so I made them.</p>
              <div className="about-signature">— Erik, b-1-o, FRONTEND / UI ENGINEERING</div>
            </div>

            <div className="about-portrait" aria-label="Portrait artwork with Japanese typography">
              <div className="about-portrait__art">
                <img
                  src={profilePortrait}
                  alt="Monochrome portrait artwork"
                  className="about-portrait__image"
                  data-portrait-image
                />
                <div className="about-portrait__japanese" aria-hidden="true">
                  <span data-portrait-kanji>異界</span>
                  <span data-portrait-kanji>静寂</span>
                  <span data-portrait-kanji>創造</span>
                </div>
                <span className="about-portrait__index" data-portrait-kanji aria-hidden="true">肖像 / 01</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="site-footer section-wrap">
          <a href="#top" className="site-footer__brand">
            b-1-o<span>®</span>
          </a>
          <p>Designed with intention. Built with curiosity.</p>
          <div className="site-footer__links">
            <a href="https://github.com/b-1-o" aria-label="GitHub" target="_blank" rel="noreferrer">
              <GitHubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/b1o"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://www.instagram.com/__._saint"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              ◎
            </a>
            <a
              href="https://www.tiktok.com/@psycho_b1o"
              aria-label="TikTok"
              target="_blank"
              rel="noreferrer"
            >
              ♪
            </a>
          </div>
          <span>© 2026 / B-1-O</span>
        </footer>
      </div>

      {isPlayerOpen && (
        <Suspense fallback={null}>
          <LazyPlayerUI onClose={() => setIsPlayerOpen(false)} />
        </Suspense>
      )}
    </main>
  )
}
