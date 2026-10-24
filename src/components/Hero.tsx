import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSmoothScroll } from './useSmoothScroll'
import { HeroBlob } from './HeroBlob'

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

function SplitWord({ word, italic = false }: { word: string; italic?: boolean }) {
  return (
    <span className={italic ? 'hero__word hero__word--italic' : 'hero__word'} aria-hidden="true">
      {Array.from(word).map((character, index) => (
        <span className="hero__char" data-hero-char key={word + '-' + index}>
          {character}
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const [sceneReady, setSceneReady] = useState(false)
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    setSceneReady(true)
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    const visual = visualRef.current
    if (!hero) return

    gsap.registerPlugin(ScrollTrigger)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const context = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>('[data-hero-char]')
      const supportingText = gsap.utils.toArray<HTMLElement>('[data-hero-enter]')

      gsap.from(chars, {
        yPercent: 115,
        rotateX: -58,
        opacity: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: { each: 0.026, from: 'start' },
        delay: 0.08,
        clearProps: 'transform',
      })

      gsap.from(supportingText, {
        y: 18,
        opacity: 0,
        duration: 0.72,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.32,
        clearProps: 'transform',
      })

      if (visual) {
        gsap.to(visual, {
          y: 95,
          scale: 0.92,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        })
      }

      gsap.to(hero, {
        scale: 0.965,
        opacity: 0.18,
        transformOrigin: '50% 0%',
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
    }, hero)

    return () => context.revert()
  }, [])

  const exploreProjects = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollTo('#projects', { offset: -12, duration: 1.25 })
  }

  return (
    <section ref={heroRef} className="hero hero--3d" id="details" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero__topline" data-hero-enter>
        <span>ERIK GHABUZYAN / FRONTEND DEVELOPER</span>
        <span>INDEPENDENT / ALWAYS BUILDING</span>
      </div>

      <div className="hero__content">
        <p className="hero__kicker" data-hero-enter>
          <span className="status-dot" /> INTERFACES <i>///</i> PERSONAL SOFTWARE
        </p>
        <h1 id="hero-title" className="hero__title" aria-label="Developer + Geek">
          <SplitWord word="Developer" />
          <b className="hero__plus" data-hero-char aria-hidden="true">+</b>
          <SplitWord word="Geek" italic />
        </h1>
        <p className="hero__description" data-hero-enter>
          I build thoughtful interfaces, personal software and little digital worlds. Frontend-first, terminal-raised, always curious about what happens when design meets code.
        </p>
        <div className="hero__actions" data-hero-enter>
          <a className="button button--white" href="#projects" onClick={exploreProjects}>
            Explore selected work <ArrowIcon diagonal={false} />
          </a>
          <a
            className="button button--text"
            href="https://github.com/b-1-o"
            target="_blank"
            rel="noreferrer"
          >
            View GitHub <ArrowIcon />
          </a>
        </div>
        <p className="hero__manifesto" data-hero-enter>DESIGN / CODE / DETAIL</p>
      </div>

      <div
        ref={visualRef}
        className="hero__visual"
        role="img"
        aria-label="An animated black and white liquid-metal sculpture"
      >
        <div className="hero__visual-halo" aria-hidden="true" />
        {!sceneReady ? (
          <div className="hero__blob-fallback" aria-hidden="true" />
        ) : (
          <Canvas
            className="hero__canvas"
            dpr={[1, 1.6]}
            camera={{ position: [0, 0, 9], fov: 42 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          >
            <HeroBlob />
          </Canvas>
        )}
        <span className="hero__object-label" aria-hidden="true"><i /> FORM / 001</span>
      </div>

      <div className="hero__index" data-hero-enter aria-hidden="true">
        <span>FRONTEND / UI ENGINEERING</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>
    </section>
  )
}
