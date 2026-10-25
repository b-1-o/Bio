import { useEffect, useRef, useState, type MouseEvent } from 'react'
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
  const [heroVisible, setHeroVisible] = useState(true)
  const [socialsOpen, setSocialsOpen] = useState(false)
  const plusRef = useRef<HTMLSpanElement>(null)
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    const hero = heroRef.current
    if (!hero || !('IntersectionObserver' in window)) {
      setHeroVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { rootMargin: '80px 0px' },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!socialsOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSocialsOpen(false)
    }
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !plusRef.current?.contains(event.target)) {
        setSocialsOpen(false)
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnOutsidePress)
    }
  }, [socialsOpen])

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
      <div className="hero__content">
        <p className="hero__kicker" data-hero-enter>
          <span>静寂</span> <i>///</i> <span>創造</span>
        </p>
        <h1 id="hero-title" className="hero__title" aria-label="Developer + Geek">
          <SplitWord word="Developer" />
          <span className={'hero__plus-wrap' + (socialsOpen ? ' is-open' : '')} ref={plusRef}>
            <button
              className="hero__plus"
              type="button"
              data-hero-char
              aria-label={socialsOpen ? 'Close social links' : 'Open social links'}
              aria-expanded={socialsOpen}
              aria-controls="hero-social-links"
              onClick={() => setSocialsOpen((open) => !open)}
            >
              +
            </button>
            <span
              className="hero__social-menu"
              id="hero-social-links"
              aria-hidden={!socialsOpen}
            >
              <a href="https://github.com/b-1-o" target="_blank" rel="noreferrer" tabIndex={socialsOpen ? 0 : -1} aria-label="GitHub">
                <span className="hero__social-mark" aria-hidden="true">GH</span><span>GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/b1o" target="_blank" rel="noreferrer" tabIndex={socialsOpen ? 0 : -1} aria-label="LinkedIn">
                <span className="hero__social-mark" aria-hidden="true">in</span><span>LinkedIn</span>
              </a>
              <a href="https://www.instagram.com/__._saint" target="_blank" rel="noreferrer" tabIndex={socialsOpen ? 0 : -1} aria-label="Instagram">
                <span className="hero__social-mark" aria-hidden="true">◎</span><span>Instagram</span>
              </a>
              <a href="https://www.tiktok.com/@psycho_b1o" target="_blank" rel="noreferrer" tabIndex={socialsOpen ? 0 : -1} aria-label="TikTok">
                <span className="hero__social-mark" aria-hidden="true">♪</span><span>TikTok</span>
              </a>
            </span>
          </span>
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
      </div>

      <div className="hero__japanese" aria-hidden="true">
        <span>異界</span>
        <span>静寂から形へ</span>
        <span>創造の余白</span>
      </div>

      <div
        ref={visualRef}
        className="hero__visual"
        role="img"
        aria-label="An animated flowing monochrome abstract form"
      >
        <HeroBlob active={heroVisible} />
        <div className="hero__blob-fallback" aria-hidden="true" />
      </div>
    </section>
  )
}
