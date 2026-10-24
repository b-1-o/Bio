import { useEffect, useRef, type MouseEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GradientWaves from '../../app/components/ui/GradientWaves'
import { useSmoothScroll } from './useSmoothScroll'

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
  const sphereRef = useRef<HTMLDivElement>(null)
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    const hero = heroRef.current
    const sphere = sphereRef.current
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

      if (sphere) {
        gsap.to(sphere, {
          y: 118,
          scale: 0.93,
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
    }, hero)

    return () => context.revert()
  }, [])

  const exploreProjects = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollTo('#projects', { offset: -12, duration: 1.25 })
  }

  return (
    <section ref={heroRef} className="hero" id="details" aria-labelledby="hero-title">
      <div ref={sphereRef} className="hero-wave-sphere" aria-hidden="true">
        <GradientWaves
          horizonColor="#000000"
          waveColor="#444444"
          crestColor="#ffffff"
          backgroundColor="transparent"
          lightMode={false}
          speed={1.5}
          amplitude={3}
        />
      </div>

      <div className="hero-grid" aria-hidden="true" />

      <div className="hero__topline" data-hero-enter>
        <span>ERIK GHABUZYAN / FRONTEND DEVELOPER</span>
        <span>34° 10' N / LOCAL NODE</span>
      </div>

      <div className="hero__content">
        <p className="hero__kicker" data-hero-enter>
          <span className="status-dot" /> INDEPENDENT DEVELOPER <i>///</i> INTERFACE ENGINEER
        </p>
        <h1 id="hero-title" className="hero__title" aria-label="Developer plus Geek">
          <SplitWord word="Developer" />
          <b className="hero__plus" data-hero-char aria-hidden="true">+</b>
          <SplitWord word="Geek" italic />
        </h1>
        <p className="hero__description" data-hero-enter>
          I build thoughtful interfaces, personal software and little digital worlds. Frontend-first,
          terminal-raised, always curious about what happens when design meets code.
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
      </div>

      <div className="hero__index" data-hero-enter aria-hidden="true">
        <span>DESIGN / CODE / DETAIL</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>
      <span className="hero__vertical" aria-hidden="true">
        開発者 + ギーク / B-1-O
      </span>
      <div className="hero__coordinates" aria-hidden="true">
        <span>001</span>
        <i />
        <span>HUMAN / MACHINE / INTERFACE</span>
      </div>

      <div className="hero__micro" aria-hidden="true">
        <span>v2026.10.24</span>
        <span>SHA · 0xB10</span>
        <span>MONOCHROME / 60FPS</span>
      </div>
    </section>
  )
}
