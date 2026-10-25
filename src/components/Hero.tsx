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
              <span className="hero__social-portal" aria-hidden="true">
                <span className="hero__social-portal-kicker">
                  <span>NETWORK / 04</span>
                  <span>OUTSIDE THE BROWSER</span>
                </span>
                <svg className="hero__social-illustration" viewBox="0 0 340 122" fill="none">
                  <defs>
                    <radialGradient id="social-moon-glow" cx="0" cy="0" r="1" gradientTransform="translate(176 54) rotate(90) scale(52)">
                      <stop stopColor="#f4f4f4" stopOpacity=".3" />
                      <stop offset=".55" stopColor="#bdbdbd" stopOpacity=".1" />
                      <stop offset="1" stopColor="#777777" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="social-moon-light" x1="140" y1="25" x2="210" y2="84" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fff" />
                      <stop offset="1" stopColor="#737373" />
                    </linearGradient>
                    <linearGradient id="social-wave-line" x1="20" y1="100" x2="320" y2="67" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#666" stopOpacity="0" />
                      <stop offset=".5" stopColor="#eee" stopOpacity=".72" />
                      <stop offset="1" stopColor="#888" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <circle cx="176" cy="54" r="51" fill="url(#social-moon-glow)" />
                  <g className="hero__social-orbit">
                    <ellipse cx="176" cy="54" rx="88" ry="28" transform="rotate(-17 176 54)" stroke="#d8d8d8" strokeOpacity=".28" />
                    <ellipse cx="176" cy="54" rx="65" ry="43" transform="rotate(28 176 54)" stroke="#a9a9a9" strokeOpacity=".23" />
                    <path d="M78 47C113 4 215 8 262 55" stroke="url(#social-wave-line)" strokeWidth="1.1" />
                    <path d="M84 77C135 109 227 97 270 56" stroke="#aaa" strokeOpacity=".27" />
                    <circle cx="92" cy="44" r="2" fill="#f5f5f5" />
                    <circle cx="258" cy="57" r="2.2" fill="#fff" />
                  </g>
                  <g className="hero__social-moon">
                    <circle cx="176" cy="54" r="25" fill="url(#social-moon-light)" fillOpacity=".92" />
                    <path d="M184 31C166 36 160 57 170 73C174 79 181 81 187 78C168 84 151 69 151 53C151 36 166 24 184 31Z" fill="#080808" />
                    <path d="M157 43L166 38M166 64L173 60M183 69L190 65" stroke="#111" strokeOpacity=".45" strokeLinecap="round" />
                  </g>
                  <g fill="#d8d8d8" fillOpacity=".7">
                    <path d="M54 26v8M50 30h8" stroke="#eee" strokeWidth=".7" />
                    <path d="M292 82v7M288.5 85.5h7" stroke="#eee" strokeWidth=".7" />
                    <circle cx="115" cy="22" r="1" />
                    <circle cx="235" cy="28" r="1" />
                    <circle cx="69" cy="68" r=".8" />
                    <circle cx="279" cy="40" r=".8" />
                  </g>
                  <text x="20" y="67" fill="#eee" fillOpacity=".72" fontSize="11" letterSpacing="3">異界</text>
                  <text x="278" y="29" fill="#eee" fillOpacity=".58" fontSize="10" letterSpacing="2">接続</text>
                  <path d="M18 106H322" stroke="#fff" strokeOpacity=".12" />
                  <path d="M18 106H86" stroke="url(#social-wave-line)" strokeWidth="1.4" />
                  <text x="18" y="118" fill="#aaa" fillOpacity=".78" fontSize="6.5" letterSpacing="2.1">A SMALL WORLD OF CONNECTIONS</text>
                  <text x="322" y="118" textAnchor="end" fill="#aaa" fillOpacity=".78" fontSize="6.5" letterSpacing="1.5">B-1-O / 01</text>
                </svg>
                <span className="hero__social-portal-caption">
                  <span>FIND ME</span>
                  <span>BEYOND THE INTERFACE <i>↗</i></span>
                </span>
              </span>
              <span className="hero__social-links">
                <a href="https://github.com/b-1-o" target="_blank" rel="noreferrer" tabIndex={socialsOpen ? 0 : -1} aria-label="GitHub">
                  <span className="hero__social-mark" aria-hidden="true">GH</span>
                  <span className="hero__social-copy"><strong>GitHub</strong><small>CODE / BUILDS</small></span>
                  <span className="hero__social-arrow" aria-hidden="true">↗</span>
                </a>
                <a href="https://www.linkedin.com/in/b1o" target="_blank" rel="noreferrer" tabIndex={socialsOpen ? 0 : -1} aria-label="LinkedIn">
                  <span className="hero__social-mark" aria-hidden="true">in</span>
                  <span className="hero__social-copy"><strong>LinkedIn</strong><small>PROFESSIONAL</small></span>
                  <span className="hero__social-arrow" aria-hidden="true">↗</span>
                </a>
                <a href="https://www.instagram.com/__._saint" target="_blank" rel="noreferrer" tabIndex={socialsOpen ? 0 : -1} aria-label="Instagram">
                  <span className="hero__social-mark" aria-hidden="true">◎</span>
                  <span className="hero__social-copy"><strong>Instagram</strong><small>PERSONAL ARCHIVE</small></span>
                  <span className="hero__social-arrow" aria-hidden="true">↗</span>
                </a>
                <a href="https://www.tiktok.com/@psycho_b1o" target="_blank" rel="noreferrer" tabIndex={socialsOpen ? 0 : -1} aria-label="TikTok">
                  <span className="hero__social-mark" aria-hidden="true">♪</span>
                  <span className="hero__social-copy"><strong>TikTok</strong><small>SHORT FORM / SOUND</small></span>
                  <span className="hero__social-arrow" aria-hidden="true">↗</span>
                </a>
              </span>
              <span className="hero__social-foot" aria-hidden="true">
                <span>PERSONAL LINKS / 2026</span>
                <span className="hero__social-status"><i /> ALL SYSTEMS PERSONAL</span>
              </span>
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
