'use client'

import { memo, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkBadge01Icon, FingerPrintIcon } from '@hugeicons/core-free-icons'
import './ReflectiveCard.css'

type ReflectiveCardProps = {
  name?: string; role?: string; badge?: string; status?: string; statusColor?: string
  idLabel?: string; idValue?: string; children?: ReactNode; theme?: 'dark' | 'light'
  videoSrc?: string; webcam?: boolean; onWebcamError?: (error: Error) => void
  tint?: string; metalness?: number; roughness?: number; blurStrength?: number
  grayscale?: number; warp?: number; warpScale?: number; shine?: number; bevel?: number
  glare?: number; enableTilt?: boolean; tiltStrength?: number; intro?: boolean
  width?: number | string; height?: number | string; radius?: number
  className?: string; style?: CSSProperties
}

const THEMES = {
  dark: {
    '--rc-base': '#1d1c22',
    '--rc-shadow': '0 22px 44px -20px rgba(0,0,0,.8), 0 6px 16px -8px rgba(0,0,0,.5)',
    '--rc-ink': '#f4f4f5', '--rc-muted': 'rgba(244,244,245,.6)',
    '--rc-tile': 'linear-gradient(180deg,#3a3644 0%,#27242f 100%)',
    '--rc-tile-edge': 'rgba(255,255,255,.07)', '--rc-tile-highlight': 'rgba(255,255,255,.12)',
    '--rc-tile-shadow': '0 4px 10px -4px rgba(0,0,0,.7)',
    '--rc-rim': 'rgba(255,255,255,.07)', '--rc-rim-highlight': 'rgba(255,255,255,.1)',
  },
  light: {
    '--rc-base': '#e7e7ea',
    '--rc-shadow': '0 22px 44px -22px rgba(24,24,27,.3), 0 6px 16px -10px rgba(24,24,27,.16)',
    '--rc-ink': '#18181b', '--rc-muted': 'rgba(24,24,27,.6)',
    '--rc-tile': 'linear-gradient(180deg,#fff 0%,#f6f6f8 100%)',
    '--rc-tile-edge': 'rgba(24,24,27,.08)', '--rc-tile-highlight': '#fff',
    '--rc-tile-shadow': '0 4px 10px -5px rgba(24,24,27,.25)',
    '--rc-rim': 'rgba(24,24,27,.08)', '--rc-rim-highlight': 'rgba(255,255,255,.8)',
  },
} as const

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const toPx = (value: number | string) => typeof value === 'number' ? value + 'px' : value

function parseColor(value: string): [number, number, number] {
  const input = value.trim().replace('#', '')
  const hex = input.length === 3 ? input.split('').map((v) => v + v).join('') : input
  if (!/^[0-9a-f]{6}$/i.test(hex)) return [1, 1, 1]
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number]
}

const VERTEX = [
  '#version 300 es',
  'in vec2 aPosition;',
  'out vec2 vUv;',
  'void main(){ vUv = aPosition * 0.5 + 0.5; gl_Position = vec4(aPosition, 0.0, 1.0); }',
].join('\n')

const FRAGMENT = [
  '#version 300 es',
  'precision highp float;',
  'in vec2 vUv; out vec4 fragColor;',
  'uniform vec2 uResolution; uniform float uTime; uniform vec2 uPointer;',
  'uniform vec3 uTint; uniform float uTheme; uniform float uMetal; uniform float uRough;',
  'uniform float uBlur; uniform float uGray; uniform float uWarp; uniform float uWarpScale;',
  'uniform float uShine; uniform float uBevel; uniform float uGlare; uniform float uHasMedia;',
  'uniform sampler2D uMedia;',
  'float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }',
  'float noise(vec2 p){ vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);',
  'return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }',
  'void main(){',
  'vec2 uv=vUv; vec2 p=uv*2.0-1.0; p.x*=uResolution.x/max(uResolution.y,1.0);',
  'float t=uTime*0.22; float bend=uWarp*0.025;',
  'vec2 warped=uv+vec2(sin((p.y*3.1+t)*uWarpScale),cos((p.x*2.4-t)*uWarpScale))*bend;',
  'vec3 studio=mix(vec3(0.025,0.025,0.03),vec3(0.45,0.45,0.47),smoothstep(-0.85,0.7,p.y));',
  'float bandA=exp(-pow((p.x+0.42+sin(t)*0.13-uPointer.x*0.18)/(0.08+uBlur*0.006),2.0));',
  'float bandB=exp(-pow((p.x-0.48+cos(t*0.7)*0.08)/(0.035+uRough*0.04),2.0));',
  'float ceiling=exp(-pow((p.y+0.73)/0.18,2.0))*0.22;',
  'float shine=clamp((bandA*0.45+bandB*0.27+ceiling)*uShine,0.0,1.4);',
  'float glare=exp(-length((uv-uPointer)*vec2(1.0,1.2))*(7.0+uBlur))*uGlare;',
  'float grain=(noise(gl_FragCoord.xy*0.16+uTime)-0.5)*(0.04+uRough*0.08);',
  'vec3 media=texture(uMedia,clamp(warped,0.002,0.998)).rgb;',
  'float luma=dot(media,vec3(0.2126,0.7152,0.0722)); media=mix(media,vec3(luma),uGray);',
  'vec3 environment=mix(studio,media,uHasMedia);',
  'environment=mix(environment,vec3(dot(environment,vec3(0.2126,0.7152,0.0722))),uGray);',
  'float topLight=exp(-pow((p.y+0.9)/0.24,2.0))*0.18;',
  'vec3 darkMetal=vec3(0.012,0.012,0.014)+uTint*(environment*0.16*uMetal+shine*0.35+glare*0.45);',
  'vec3 lightMetal=mix(vec3(0.72,0.72,0.74),environment,0.38*uMetal)+uTint*(shine*0.24+glare*0.18+topLight);',
  'vec3 color=mix(darkMetal,lightMetal,uTheme);',
  'float edge=1.0-smoothstep(0.0,max(uBevel/min(uResolution.x,uResolution.y),0.001),min(min(uv.x,1.0-uv.x),min(uv.y,1.0-uv.y)));',
  'color+=uTint*edge*0.15*step(0.01,uBevel); color+=grain;',
  'color=clamp(color,0.0,1.0); fragColor=vec4(color,1.0);',
  '}',
].join('\n')

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('[ReflectiveCard]', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function ReflectiveCard({
  name = 'Alexander Doe', role = 'Senior Developer', badge = 'Verified',
  status = 'Active', statusColor = '#22c55e', idLabel = 'ID number', idValue = '8901 2345 6789',
  children, theme = 'dark', videoSrc, webcam = false, onWebcamError,
  tint = '#ffffff', metalness = 1, roughness = 0.3, blurStrength = 6, grayscale = 1,
  warp = 0.6, warpScale = 1, shine = 1, bevel = 3, glare = 0.5,
  enableTilt = true, tiltStrength = 12, intro = true, width = 320, height = 500, radius = 24,
  className = '', style,
}: ReflectiveCardProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const camRef = useRef<HTMLVideoElement>(null)
  const pointerRef = useRef<[number, number]>([0.5, 0.5])
  const errorRef = useRef(onWebcamError)
  errorRef.current = onWebcamError

  useEffect(() => {
    const root = rootRef.current, body = bodyRef.current, canvas = canvasRef.current
    const video = videoRef.current, camera = camRef.current
    if (!root || !body || !canvas || !video || !camera) return
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' })
    if (!gl) return

    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX)
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex)
      if (fragment) gl.deleteShader(fragment)
      return
    }
    const program = gl.createProgram()
    if (!program) { gl.deleteShader(vertex); gl.deleteShader(fragment); return }
    gl.attachShader(program, vertex); gl.attachShader(program, fragment)
    gl.bindAttribLocation(program, 0, 'aPosition'); gl.linkProgram(program)
    gl.deleteShader(vertex); gl.deleteShader(fragment)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[ReflectiveCard]', gl.getProgramInfoLog(program)); gl.deleteProgram(program); return
    }

    const buffer = gl.createBuffer(), texture = gl.createTexture(), vao = gl.createVertexArray()
    if (!buffer || !texture || !vao) {
      if (buffer) gl.deleteBuffer(buffer)
      if (texture) gl.deleteTexture(texture)
      if (vao) gl.deleteVertexArray(vao)
      gl.deleteProgram(program)
      return
    }
    gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([45,45,48,255]))

    const loc = (key: string) => gl.getUniformLocation(program, key)
    const u = {
      resolution: loc('uResolution'), time: loc('uTime'), pointer: loc('uPointer'), tint: loc('uTint'),
      theme: loc('uTheme'), metal: loc('uMetal'), rough: loc('uRough'), blur: loc('uBlur'),
      gray: loc('uGray'), warp: loc('uWarp'), warpScale: loc('uWarpScale'), shine: loc('uShine'),
      bevel: loc('uBevel'), glare: loc('uGlare'), hasMedia: loc('uHasMedia'), media: loc('uMedia'),
    }
    const rgb = parseColor(tint).map((channel) => Math.pow(channel, 2.2))
    let raf = 0, visible = true, pageVisible = document.visibilityState !== 'hidden'
    let lastFrame = 0, elapsed = 0, mediaTextureReady = false
    let introComplete = !intro || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const introAt = performance.now()

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75)
      const w = Math.max(1, Math.round(body.clientWidth * ratio))
      const h = Math.max(1, Math.round(body.clientHeight * ratio))
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
    }
    const draw = (now: number) => {
      raf = 0
      if (!visible || !pageVisible) return
      if (now - lastFrame < 30) { raf = requestAnimationFrame(draw); return }
      const dt = Math.min((now - (lastFrame || now)) / 1000, 0.1)
      lastFrame = now; elapsed += dt
      if (!introComplete && now - introAt > 1250) introComplete = true
      resize(); gl.viewport(0, 0, canvas.width, canvas.height); gl.useProgram(program)
      gl.bindVertexArray(vao); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture)

      const source: HTMLVideoElement | null = webcam && camera.readyState >= 2 && camera.videoWidth
        ? camera : video.readyState >= 2 && video.videoWidth ? video : null
      if (source) {
        try {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
          mediaTextureReady = true
        } catch { /* Fall back to the last valid media frame. */ }
      }
      gl.uniform2f(u.resolution, canvas.width, canvas.height)
      gl.uniform1f(u.time, elapsed)
      gl.uniform2f(u.pointer, pointerRef.current[0], pointerRef.current[1])
      gl.uniform3fv(u.tint, rgb)
      gl.uniform1f(u.theme, theme === 'light' ? 1 : 0)
      gl.uniform1f(u.metal, clamp(metalness, 0, 1))
      gl.uniform1f(u.rough, clamp(roughness, 0, 1))
      gl.uniform1f(u.blur, clamp(blurStrength, 0, 40))
      gl.uniform1f(u.gray, clamp(grayscale, 0, 1))
      gl.uniform1f(u.warp, clamp(warp, 0, 2))
      gl.uniform1f(u.warpScale, clamp(warpScale, 0.2, 4))
      gl.uniform1f(u.shine, clamp(shine, 0, 3))
      gl.uniform1f(u.bevel, clamp(bevel, 0, 16))
      gl.uniform1f(u.glare, clamp(glare, 0, 1))
      gl.uniform1f(u.hasMedia, source && mediaTextureReady ? 1 : 0)
      gl.uniform1i(u.media, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!introComplete || (source && !source.paused)) raf = requestAnimationFrame(draw)
    }
    const wake = () => { if (!raf && visible && pageVisible) raf = requestAnimationFrame(draw) }
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting)
      if (visible) { lastFrame = 0; wake() } else { cancelAnimationFrame(raf); raf = 0 }
    })
    observer.observe(root)
    const sizes = new ResizeObserver(() => { resize(); wake() })
    sizes.observe(body)
    const onVisibility = () => {
      pageVisible = document.visibilityState !== 'hidden'
      if (pageVisible) { lastFrame = 0; wake() } else { cancelAnimationFrame(raf); raf = 0 }
    }
    const onMedia = () => wake()
    document.addEventListener('visibilitychange', onVisibility)
    ;[video, camera].forEach((element) => ['loadeddata','playing','pause'].forEach((event) => element.addEventListener(event, onMedia)))
    resize(); wake()

    const onPointerMove = (event: PointerEvent) => {
      if (!enableTilt || event.pointerType !== 'mouse') return
      const rect = root.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
      const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)
      pointerRef.current = [x, y]
      body.style.setProperty('--rc-rotate-x', ((0.5 - y) * tiltStrength) + 'deg')
      body.style.setProperty('--rc-rotate-y', ((x - 0.5) * tiltStrength) + 'deg')
      wake()
    }
    const onPointerLeave = () => {
      pointerRef.current = [0.5, 0.5]
      body.style.setProperty('--rc-rotate-x', '0deg')
      body.style.setProperty('--rc-rotate-y', '0deg')
      wake()
    }
    root.addEventListener('pointermove', onPointerMove)
    root.addEventListener('pointerleave', onPointerLeave)
    const introFrame = requestAnimationFrame(() => {
      root.style.setProperty('--rc-presence', '1')
      root.style.setProperty('--rc-lift', '0px')
      wake()
    })

    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(introFrame)
      observer.disconnect(); sizes.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      ;[video, camera].forEach((element) => ['loadeddata','playing','pause'].forEach((event) => element.removeEventListener(event, onMedia)))
      root.removeEventListener('pointermove', onPointerMove); root.removeEventListener('pointerleave', onPointerLeave)
      gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteVertexArray(vao); gl.deleteProgram(program)
    }
  }, [theme, tint, metalness, roughness, blurStrength, grayscale, warp, warpScale, shine, bevel, glare, enableTilt, tiltStrength, intro, webcam, videoSrc])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!videoSrc) { video.pause(); video.removeAttribute('src'); video.load(); return }
    video.src = videoSrc
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(() => {})
    return () => video.pause()
  }, [videoSrc])

  useEffect(() => {
    const camera = camRef.current
    if (!webcam || !camera) return
    const mediaDevices = navigator.mediaDevices
    if (!mediaDevices?.getUserMedia) { errorRef.current?.(new Error('Camera access is not available in this browser.')); return }
    let stream: MediaStream | null = null
    let cancelled = false
    mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
      .then((result) => {
        if (cancelled) { result.getTracks().forEach((track) => track.stop()); return }
        stream = result; camera.srcObject = result; camera.play().catch(() => {})
      })
      .catch((error: unknown) => {
        if (!cancelled) errorRef.current?.(error instanceof Error ? error : new Error('Camera access failed.'))
      })
    return () => { cancelled = true; stream?.getTracks().forEach((track) => track.stop()); camera.srcObject = null }
  }, [webcam])

  const palette = theme === 'light' ? 'light' : 'dark'
  const corner = Math.max(0, radius)
  const cardStyle = {
    ...THEMES[palette],
    '--rc-width': toPx(width), '--rc-height': toPx(height), '--rc-radius': corner + 'px',
    '--rc-pad': Math.round(clamp(corner * 0.8, 16, 22)) + 'px',
    '--rc-tile-radius': Math.round(clamp(corner * 0.5, 8, 14)) + 'px',
    '--rc-status': statusColor,
  } as unknown as CSSProperties

  return (
    <div ref={rootRef} className={('reflective-card ' + className).trim()} style={{ ...cardStyle, ...style }}>
      <div ref={bodyRef} className="reflective-card__body">
        <canvas ref={canvasRef} className="reflective-card__canvas" aria-hidden="true" />
        <div className="reflective-card__content">
          {children ?? (
            <>
              {(badge || status) && <div className="reflective-card__header">
                {badge && <span className="reflective-card__badge"><HugeiconsIcon icon={CheckmarkBadge01Icon} size={16} strokeWidth={1.8} />{badge}</span>}
                {status && <span className="reflective-card__status"><span className="reflective-card__dot" />{status}</span>}
              </div>}
              <div className="reflective-card__identity">
                {name && <h3 className="reflective-card__name">{name}</h3>}
                {role && <p className="reflective-card__role">{role}</p>}
              </div>
              {(idLabel || idValue) && <div className="reflective-card__footer">
                <div className="reflective-card__id">
                  {idLabel && <span className="reflective-card__label">{idLabel}</span>}
                  {idValue && <span className="reflective-card__value">{idValue}</span>}
                </div>
                <span className="reflective-card__tile"><HugeiconsIcon icon={FingerPrintIcon} size={22} strokeWidth={1.6} /></span>
              </div>}
            </>
          )}
        </div>
        <span className="reflective-card__rim" />
      </div>
      <video ref={videoRef} className="reflective-card__media" muted loop playsInline crossOrigin="anonymous" aria-hidden="true" />
      <video ref={camRef} className="reflective-card__media" muted playsInline aria-hidden="true" />
    </div>
  )
}

export default memo(ReflectiveCard)
