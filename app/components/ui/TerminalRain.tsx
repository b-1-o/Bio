'use client'

import { useEffect, useRef } from 'react'

type TerminalRainProps = {
  color?: string
  highlightColor?: string
  opacity?: number
  className?: string
}

const GLYPHS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01アイウエオ<>[]{}|/\\:;.,*+-=_#@&$%?!ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export default function TerminalRain({
  color = '#333333',
  highlightColor = '#a3a3a3',
  opacity = 0.35,
  className = '',
}: TerminalRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = 0
    let height = 0
    let columns = 0
    let drops: number[] = []
    let speeds: number[] = []
    let pageVisible = document.visibilityState !== 'hidden'
    const fontSize = 14

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = Math.ceil(width / fontSize)
      drops = Array.from({ length: columns }, () => Math.random() * -40)
      speeds = Array.from({ length: columns }, () => 0.35 + Math.random() * 0.9)
    }

    const draw = () => {
      ctx.fillStyle = `rgba(5, 5, 5, 0.08)`
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize
        const y = drops[i] * fontSize
        const char = GLYPHS[(Math.random() * GLYPHS.length) | 0]
        const isHead = Math.random() > 0.92

        ctx.fillStyle = isHead ? highlightColor : color
        ctx.globalAlpha = isHead ? 0.85 : 0.45 + Math.random() * 0.35
        ctx.fillText(char, x, y)

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += speeds[i]
      }

      ctx.globalAlpha = 1
      if (pageVisible) raf = requestAnimationFrame(draw)
    }

    const onVisibilityChange = () => {
      pageVisible = document.visibilityState !== 'hidden'
      if (pageVisible && !raf) raf = requestAnimationFrame(draw)
      if (!pageVisible && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    resize()
    if (pageVisible) raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [color, highlightColor])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity,
      }}
    />
  )
}
