import { useEffect, useRef, useState } from 'react'

type SidebarProps = { onPlayerOpen: () => void }

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

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.7" r="1" fill="currentColor" />
    </svg>
  )
}

export function Sidebar({ onPlayerOpen }: SidebarProps) {
  const [activeSection, setActiveSection] = useState('details')
  const activeSectionRef = useRef('details')

  useEffect(() => {
    let frame = 0
    const sectionIds = ['details', 'projects', 'about']

    const measureActiveSection = () => {
      frame = 0
      const readingLine = window.innerHeight * 0.42
      let bestId = sectionIds[0]
      let bestDistance = Number.POSITIVE_INFINITY

      for (const id of sectionIds) {
        const section = document.getElementById(id)
        if (!section) continue
        const rect = section.getBoundingClientRect()
        const distance = readingLine < rect.top
          ? rect.top - readingLine
          : readingLine > rect.bottom
            ? readingLine - rect.bottom
            : 0

        if (distance < bestDistance) {
          bestDistance = distance
          bestId = id
        }
        if (distance === 0) break
      }

      if (activeSectionRef.current !== bestId) {
        activeSectionRef.current = bestId
        setActiveSection(bestId)
      }
    }

    const scheduleMeasure = () => {
      if (!frame) frame = window.requestAnimationFrame(measureActiveSection)
    }

    measureActiveSection()
    window.addEventListener('scroll', scheduleMeasure, { passive: true })
    window.addEventListener('resize', scheduleMeasure, { passive: true })
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleMeasure)
      window.removeEventListener('resize', scheduleMeasure)
    }
  }, [])

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <a className="sidebar__brand" href="#top" aria-label="B-1-O home">
        <svg className="sidebar__brand-mark" viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="1" />
          <text
            x="18"
            y="23.5"
            textAnchor="middle"
            fill="currentColor"
            fontFamily="Montserrat, Arial, sans-serif"
            fontSize="17"
            fontWeight="800"
          >
            b.
          </text>
        </svg>
        <i>個人</i>
      </a>

      <nav className="sidebar__nav">
        <a href="#details" aria-current={activeSection === 'details' ? 'location' : undefined}>
          <span className="sidebar__nav-number">01</span>
          <span>Details</span>
        </a>
        <a href="#projects" aria-current={activeSection === 'projects' ? 'location' : undefined}>
          <span className="sidebar__nav-number">02</span>
          <span>Projects</span>
        </a>
        <a href="#about" aria-current={activeSection === 'about' ? 'location' : undefined}>
          <span className="sidebar__nav-number">03</span>
          <span>About</span>
        </a>
      </nav>

      <div className="sidebar__bottom">
        <button
          className="sidebar__social"
          type="button"
          onClick={onPlayerOpen}
          aria-label="Open music player"
          title="Music archive"
        >
          <span>♫</span>
        </button>
        <a
          className="sidebar__social"
          href="https://github.com/b-1-o"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <GitHubIcon />
        </a>
        <a
          className="sidebar__social"
          href="https://www.linkedin.com/in/b1o"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedInIcon />
        </a>
        <a
          className="sidebar__social"
          href="https://www.instagram.com/__._saint"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <InstagramIcon />
        </a>
        <span className="sidebar__side-label">LOS ANGELES · CA</span>
      </div>
    </aside>
  )
}
