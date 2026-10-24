import { useEffect, useRef } from 'react'
import './SignalRain.css'

type Stream = {
  x: number
  y: number
  speed: number
  length: number
  size: number
  seed: number
}

const GLYPHS = Array.from('アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ0123456789ABCDEF<>[]{}:/\\\\_+=-零闇影霧夜鬼記録信号')

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function makeStreams(width: number, height: number): Stream[] {
  const cell = width < 700 ? 25 : 23
  const band = width * 0.17
  const streams: Stream[] = []

  for (let x = 8; x < band; x += cell) {
    streams.push({ x, y: randomBetween(-height, height), speed: randomBetween(18, 50), length: Math.floor(randomBetween(4, 12)), size: randomBetween(10, 14), seed: Math.random() * 100 })
  }
  for (let x = width - band; x < width - 4; x += cell) {
    streams.push({ x, y: randomBetween(-height, height), speed: randomBetween(16, 44), length: Math.floor(randomBetween(4, 11)), size: randomBetween(10, 14), seed: Math.random() * 100 })
  }
  return streams
}

export function SignalRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !context) return

    let width = 0
    let height = 0
    let frameId = 0
    let previous = 0
    let streams: Stream[] = []
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      streams = makeStreams(width, height)
      draw(0)
    }

    const draw = (delta: number) => {
      context.clearRect(0, 0, width, height)
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      for (const stream of streams) {
        stream.y += delta * stream.speed
        if (stream.y - stream.length * 18 > height) stream.y = randomBetween(-height * 0.45, -12)
        context.font = `${stream.size}px "Noto Sans JP", "Hiragino Kaku Gothic ProN", monospace`
        for (let trail = 0; trail < stream.length; trail += 1) {
          const y = stream.y - trail * 17
          if (y < -18 || y > height + 18) continue
          const charIndex = Math.floor(stream.seed + trail * 7 + Math.floor(stream.y / 17) * (trail + 1)) % GLYPHS.length
          const char = GLYPHS[(charIndex + GLYPHS.length) % GLYPHS.length]
          const opacity = (1 - trail / stream.length) ** 1.9
          context.fillStyle = trail === 0
            ? `rgba(242, 241, 237, ${0.2 + opacity * 0.18})`
            : `rgba(168, 168, 162, ${opacity * 0.11})`
          context.fillText(char, stream.x, y)
        }
      }
    }

    const tick = (time: number) => {
      frameId = requestAnimationFrame(tick)
      if (time - previous < 48) return
      const delta = previous ? Math.min((time - previous) / 1000, 0.08) : 0
      previous = time
      draw(delta)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduceMotion) frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="signal-rain-layer" aria-hidden="true" />
}
