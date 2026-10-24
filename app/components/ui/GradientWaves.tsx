'use client'

import { useEffect, useRef } from 'react'
import './GradientWaves.css'

type GradientWavesProps = {
  horizonColor?: string
  waveColor?: string
  crestColor?: string
  backgroundColor?: string
  lightMode?: boolean
  speed?: number
  amplitude?: number
  className?: string
  style?: React.CSSProperties
}

function parseHex(hex: string, fallback: [number, number, number]): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return fallback
  const n = parseInt(m[1], 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export default function GradientWaves({
  horizonColor = '#000000',
  waveColor = '#444444',
  crestColor = '#ffffff',
  backgroundColor = 'transparent',
  lightMode = false,
  speed = 1.5,
  amplitude = 2.5,
  className = '',
  style,
}: GradientWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const canvas = document.createElement('canvas')
    canvas.className = 'gradient-waves-canvas'
    container.appendChild(canvas)

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    })

    if (!gl) {
      canvas.remove()
      return
    }

    const vsSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `

    const fsSource = `
      precision mediump float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec3 uHorizon;
      uniform vec3 uWave;
      uniform vec3 uCrest;
      uniform float uAmp;
      uniform float uLight;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.02;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

        float t = uTime;
        float wave =
          sin(p.x * 3.5 + t * 0.9) * 0.08 * uAmp +
          sin(p.x * 7.2 - t * 1.3) * 0.04 * uAmp +
          fbm(p * 2.5 + vec2(t * 0.15, t * 0.08)) * 0.12 * uAmp;

        float ridge = smoothstep(0.35, 0.85, 0.5 + 0.5 * sin(p.x * 4.0 - t + wave * 8.0));
        float depth = clamp(0.55 - p.y * 0.9 + wave, 0.0, 1.0);

        vec3 body = mix(uWave, uCrest, ridge * 0.55);
        vec3 col = mix(uHorizon * 0.2, body, depth);

        float sheen = pow(max(0.0, 1.0 - abs(p.y - wave * 0.5)), 8.0) * 0.35;
        col += uCrest * sheen * (0.4 + 0.6 * uLight);

        float vignette = smoothstep(1.15, 0.35, length(p));
        col *= vignette;

        float alpha = mix(0.55, 0.95, depth) * vignette;
        gl_FragColor = vec4(col, alpha);
      }
    `

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = compile(gl.VERTEX_SHADER, vsSource)
    const fs = compile(gl.FRAGMENT_SHADER, fsSource)
    if (!vs || !fs) {
      canvas.remove()
      return
    }

    const program = gl.createProgram()
    if (!program) {
      canvas.remove()
      return
    }
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      canvas.remove()
      return
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const aPosition = gl.getAttribLocation(program, 'aPosition')
    const uResolution = gl.getUniformLocation(program, 'uResolution')
    const uTime = gl.getUniformLocation(program, 'uTime')
    const uHorizon = gl.getUniformLocation(program, 'uHorizon')
    const uWave = gl.getUniformLocation(program, 'uWave')
    const uCrest = gl.getUniformLocation(program, 'uCrest')
    const uAmp = gl.getUniformLocation(program, 'uAmp')
    const uLight = gl.getUniformLocation(program, 'uLight')

    const horizon = parseHex(horizonColor, [0, 0, 0])
    const wave = parseHex(waveColor, [0.27, 0.27, 0.27])
    const crest = parseHex(crestColor, [1, 1, 1])

    let raf = 0
    let start = performance.now()
    let visible = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const w = Math.max(1, Math.floor(container.clientWidth * dpr))
      const h = Math.max(1, Math.floor(container.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }

    const frame = (now: number) => {
      if (!visible || document.hidden) {
        raf = requestAnimationFrame(frame)
        return
      }
      resize()
      const t = ((now - start) / 1000) * speed

      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(aPosition)
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      gl.uniform3fv(uHorizon, horizon)
      gl.uniform3fv(uWave, wave)
      gl.uniform3fv(uCrest, crest)
      gl.uniform1f(uAmp, amplitude)
      gl.uniform1f(uLight, lightMode ? 1 : 0)

      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting)
    })
    io.observe(container)

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      canvas.remove()
    }
  }, [horizonColor, waveColor, crestColor, lightMode, speed, amplitude])

  return (
    <div
      ref={containerRef}
      className={['gradient-waves-container', className].filter(Boolean).join(' ')}
      style={{
        background: backgroundColor === 'transparent' ? undefined : backgroundColor,
        ...style,
      }}
    />
  )
}
