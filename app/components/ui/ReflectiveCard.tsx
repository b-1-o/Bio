'use client'

import {
  memo,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import './ReflectiveCard.css'

type ReflectiveCardProps = {
  name?: string
  role?: string
  badge?: string
  status?: string
  statusColor?: string
  idLabel?: string
  idValue?: string
  children?: ReactNode
  theme?: 'dark' | 'light'
  tint?: string
  metalness?: number
  roughness?: number
  grayscale?: number
  enableTilt?: boolean
  tiltStrength?: number
  intro?: boolean
  width?: number | string
  height?: number | string
  radius?: number
  className?: string
  style?: CSSProperties
}

const THEMES = {
  dark: {
    '--rc-base': '#1d1c22',
    '--rc-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--rc-ink': '#f4f4f5',
    '--rc-muted': 'rgba(244, 244, 245, 0.6)',
    '--rc-tile': 'linear-gradient(180deg, #3a3644 0%, #27242f 100%)',
    '--rc-tile-edge': 'rgba(255, 255, 255, 0.07)',
    '--rc-tile-highlight': 'rgba(255, 255, 255, 0.12)',
    '--rc-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    '--rc-rim': 'rgba(255, 255, 255, 0.07)',
    '--rc-rim-highlight': 'rgba(255, 255, 255, 0.1)',
  },
  light: {
    '--rc-base': '#e7e7ea',
    '--rc-shadow': '0 22px 44px -22px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)',
    '--rc-ink': '#18181b',
    '--rc-muted': 'rgba(24, 24, 27, 0.6)',
    '--rc-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
    '--rc-tile-edge': 'rgba(24, 24, 27, 0.08)',
    '--rc-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--rc-tile-shadow': '0 4px 10px -5px rgba(24, 24, 27, 0.25)',
    '--rc-rim': 'rgba(24, 24, 27, 0.08)',
    '--rc-rim-highlight': 'rgba(255, 255, 255, 0.8)',
  },
} as const

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const toPx = (value: number | string) => (typeof value === 'number' ? `${value}px` : value)

function ReflectiveCard({
  name = 'Erik Ghabuzyan',
  role = 'Frontend Developer',
  badge = 'Verified',
  status = 'Active',
  statusColor = '#a3a3a3',
  idLabel = 'ID number',
  idValue = '0xB10 · 2026',
  children,
  theme = 'dark',
  tint = '#ffffff',
  metalness = 1,
  roughness = 0.2,
  grayscale = 1,
  enableTilt = true,
  tiltStrength = 12,
  intro = true,
  width = 320,
  height = 500,
  radius = 24,
  className = '',
  style,
}: ReflectiveCardProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !enableTilt) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let raf = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const write = () => {
      currentX += (targetX - currentX) * 0.12
      currentY += (targetY - currentY) * 0.12
      root.style.setProperty('--rc-rotate-x', `${(currentY * tiltStrength).toFixed(3)}deg`)
      root.style.setProperty('--rc-rotate-y', `${(-currentX * tiltStrength).toFixed(3)}deg`)
      raf = requestAnimationFrame(write)
    }

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1
    }

    const onLeave = () => {
      targetX = 0
      targetY = 0
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(write)

    return () => {
      cancelAnimationFrame(raf)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [enableTilt, tiltStrength])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !intro) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    root.style.setProperty('--rc-presence', '0')
    root.style.setProperty('--rc-lift', '14px')
    const id = requestAnimationFrame(() => {
      root.style.transition = 'opacity 0.9s ease, transform 0.9s ease'
      root.style.setProperty('--rc-presence', '1')
      root.style.setProperty('--rc-lift', '0px')
    })
    return () => cancelAnimationFrame(id)
  }, [intro])

  const palette = theme === 'light' ? 'light' : 'dark'
  const corner = Math.max(0, radius)
  const cardStyle = {
    ...THEMES[palette],
    '--rc-width': toPx(width),
    '--rc-height': toPx(height),
    '--rc-radius': `${corner}px`,
    '--rc-pad': `${Math.round(clamp(corner * 0.8, 16, 22))}px`,
    '--rc-tile-radius': `${Math.round(clamp(corner * 0.5, 8, 14))}px`,
    '--rc-status': statusColor,
    // metal look via CSS variables for the overlay
    '--rc-metal': String(clamp(metalness, 0, 1)),
    '--rc-rough': String(clamp(roughness, 0, 1)),
    '--rc-gray': String(clamp(grayscale, 0, 1)),
    '--rc-tint': tint,
  } as unknown as CSSProperties

  return (
    <div
      ref={rootRef}
      className={`reflective-card ${className}`.trim()}
      style={{ ...cardStyle, ...style, opacity: ready ? undefined : 0 }}
    >
      <div className="reflective-card__body">
        {/* Metal / reflection overlay (CSS approximation) */}
        <div
          className="reflective-card__metal"
          aria-hidden="true"
          style={{
            background: `
              linear-gradient(
                125deg,
                rgba(255,255,255,0.14) 0%,
                rgba(255,255,255,0.02) 28%,
                rgba(0,0,0,0.35) 52%,
                rgba(255,255,255,0.08) 78%,
                rgba(0,0,0,0.25) 100%
              )
            `,
            mixBlendMode: 'soft-light',
            opacity: 0.55 + metalness * 0.25,
          }}
        />
        <div
          className="reflective-card__grain"
          aria-hidden="true"
          style={{ opacity: 0.08 + roughness * 0.12 }}
        />

        <div className="reflective-card__content">
          {children ?? (
            <>
              {(badge || status) && (
                <div className="reflective-card__header">
                  {badge && <span className="reflective-card__badge">{badge}</span>}
                  {status && (
                    <span className="reflective-card__status">
                      <span className="reflective-card__dot" />
                      {status}
                    </span>
                  )}
                </div>
              )}
              <div className="reflective-card__identity">
                {name && <h3 className="reflective-card__name">{name}</h3>}
                {role && <p className="reflective-card__role">{role}</p>}
              </div>
              {(idLabel || idValue) && (
                <div className="reflective-card__footer">
                  <div className="reflective-card__id">
                    {idLabel && <span className="reflective-card__label">{idLabel}</span>}
                    {idValue && <span className="reflective-card__value">{idValue}</span>}
                  </div>
                  <span className="reflective-card__tile">ID</span>
                </div>
              )}
            </>
          )}
        </div>
        <span className="reflective-card__rim" />
      </div>
    </div>
  )
}

export default memo(ReflectiveCard)
