import { useEffect, useRef } from 'react'

const vertexShaderSource = [
  'attribute vec2 position;',
  'varying vec2 vUv;',
  'void main() {',
  '  vUv = position * 0.5 + 0.5;',
  '  gl_Position = vec4(position, 0.0, 1.0);',
  '}',
].join('\n')

const fragmentShaderSource = [
  'precision highp float;',
  'uniform float uTime;',
  'uniform vec2 uResolution;',
  'varying vec2 vUv;',
  '',
  'float hash(vec2 p) {',
  '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);',
  '}',
  '',
  'float noise(vec2 p) {',
  '  vec2 i = floor(p);',
  '  vec2 f = fract(p);',
  '  f = f * f * (3.0 - 2.0 * f);',
  '  float a = hash(i);',
  '  float b = hash(i + vec2(1.0, 0.0));',
  '  float c = hash(i + vec2(0.0, 1.0));',
  '  float d = hash(i + vec2(1.0, 1.0));',
  '  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
  '}',
  '',
  'float fbm(vec2 p) {',
  '  float value = 0.0;',
  '  float amplitude = 0.5;',
  '  mat2 turn = mat2(1.62, 1.18, -1.18, 1.62);',
  '  for (int i = 0; i < 4; i++) {',
  '    value += amplitude * noise(p);',
  '    p = turn * p + vec2(13.7, 7.3);',
  '    amplitude *= 0.5;',
  '  }',
  '  return value;',
  '}',
  '',
  'void main() {',
  '  float time = uTime * 0.12;',
  '  vec2 p = vUv - vec2(0.77, 0.52);',
  '  p.x *= uResolution.x / max(uResolution.y, 1.0);',
  '',
  '  vec2 drift = vec2(time * 0.62, -time * 0.38);',
  '  float warpX = fbm(p * 2.7 + vec2(3.4, 8.2) + drift);',
  '  float warpY = fbm(p * 2.5 + vec2(-6.2, 1.8) - drift * 0.72);',
  '  vec2 q = p + (vec2(warpX, warpY) - 0.5) * vec2(0.62, 0.76);',
  '',
  '  float broad = fbm(q * 2.7 + drift * 0.68);',
  '  float middle = fbm(q * 4.9 - drift * 0.54 + vec2(2.1, -3.8));',
  '  float detail = fbm(q * 9.4 + drift * 1.1 + vec2(-5.7, 2.4));',
  '  float radial = length(vec2(q.x / 0.75, q.y / 0.96));',
  '  float silhouette = radial - (broad - 0.48) * 0.42 - (middle - 0.5) * 0.13;',
  '  float shape = 1.0 - smoothstep(0.89, 1.045, silhouette);',
  '',
  '  float depth = sqrt(max(0.025, 1.0 - min(radial, 1.0) * min(radial, 1.0)));',
  '  vec3 normal = normalize(vec3(q.x / 0.75, q.y / 0.96, depth * 1.45));',
  '  vec3 lightDirection = normalize(vec3(-0.52, 0.62, 0.78));',
  '  float diffuse = max(dot(normal, lightDirection), 0.0);',
  '  float specular = pow(max(dot(normal, normalize(lightDirection + vec3(0.0, 0.0, 1.0))), 0.0), 10.0);',
  '  float striation = pow(1.0 - abs(sin((q.x * 2.8 + q.y * 1.7 + middle * 1.8) * 7.2 + time * 1.9)), 13.0);',
  '  float faceted = floor(broad * 8.0) / 8.0;',
  '  float value = 0.08 + diffuse * 0.4 + broad * 0.24 + detail * 0.17 + specular * 0.29 + striation * 0.13;',
  '  value = clamp(value * (0.75 + faceted * 0.48), 0.0, 1.0);',
  '',
  '  vec3 color = mix(vec3(0.012), vec3(0.88), smoothstep(0.08, 0.82, value));',
  '  color *= 0.62 + middle * 0.66;',
  '  color += vec3(0.22) * specular + vec3(0.12) * striation;',
  '  color = mix(color, floor(color * 8.0) / 8.0, 0.22);',
  '  float crease = smoothstep(0.72, 0.9, abs(sin((q.x * 2.4 - q.y * 2.1 + broad) * 5.2 + time)));',
  '  color *= 1.0 - crease * 0.13;',
  '',
  '  float edgeLight = pow(1.0 - depth, 1.7) * 0.12;',
  '  color += vec3(edgeLight);',
  '  gl_FragColor = vec4(clamp(color, 0.0, 1.0), shape);',
  '}',
].join('\n')

type HeroBlobProps = { active?: boolean }

export function HeroBlob({ active = true }: HeroBlobProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const startRef = useRef<(() => void) | null>(null)
  const stopRef = useRef<(() => void) | null>(null)
  activeRef.current = active

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    })
    if (!gl) {
      canvas.classList.add('hero__canvas--unsupported')
      return
    }

    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('[HeroBlob] Shader compilation failed:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vertexShader || !fragmentShader) {
      canvas.classList.add('hero__canvas--unsupported')
      if (vertexShader) gl.deleteShader(vertexShader)
      if (fragmentShader) gl.deleteShader(fragmentShader)
      return
    }

    const program = gl.createProgram()
    if (!program) {
      canvas.classList.add('hero__canvas--unsupported')
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      return
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[HeroBlob] Program linking failed:', gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      canvas.classList.add('hero__canvas--unsupported')
      return
    }

    const buffer = gl.createBuffer()
    if (!buffer) {
      gl.deleteProgram(program)
      canvas.classList.add('hero__canvas--unsupported')
      return
    }

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const timeLocation = gl.getUniformLocation(program, 'uTime')
    const resolutionLocation = gl.getUniformLocation(program, 'uResolution')
    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    let raf = 0
    let timer = 0
    let lastFrame = 0
    let elapsed = 0
    let disposed = false
    const frameInterval = 1000 / (window.matchMedia('(max-width: 760px)').matches ? 30 : 40)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const paint = (time: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clear(gl.COLOR_BUFFER_BIT)
      if (timeLocation) gl.uniform1f(timeLocation, time)
      if (resolutionLocation) gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      // Soft organic shapes retain their silhouette at a sub-1x buffer.
      const maxDpr = window.matchMedia('(max-width: 760px)').matches ? 0.8 : 0.9
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      const width = Math.max(1, Math.round(rect.width * dpr))
      const height = Math.max(1, Math.round(rect.height * dpr))
      if (canvas.width === width && canvas.height === height) return
      canvas.width = width
      canvas.height = height
      paint(elapsed)
    }

    const draw = (now: number) => {
      raf = 0
      if (disposed || !activeRef.current || document.visibilityState === 'hidden') return
      const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0
      elapsed += delta
      lastFrame = now
      paint(elapsed)

      timer = window.setTimeout(() => {
        timer = 0
        if (activeRef.current && !disposed && document.visibilityState !== 'hidden' && !raf) {
          raf = window.requestAnimationFrame(draw)
        }
      }, frameInterval)
    }

    const start = () => {
      if (disposed || reduceMotion || !activeRef.current || document.visibilityState === 'hidden' || raf || timer) return
      raf = window.requestAnimationFrame(draw)
    }
    const stop = () => {
      if (raf) window.cancelAnimationFrame(raf)
      if (timer) window.clearTimeout(timer)
      raf = 0
      timer = 0
      lastFrame = 0
    }
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') stop()
      else start()
    }

    startRef.current = start
    stopRef.current = stop
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    if (resizeObserver) resizeObserver.observe(canvas.parentElement ?? canvas)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibility)
    canvas.addEventListener('webglcontextlost', stop)

    resize()
    paint(elapsed)
    start()

    return () => {
      disposed = true
      stop()
      startRef.current = null
      stopRef.current = null
      resizeObserver?.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
      canvas.removeEventListener('webglcontextlost', stop)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [])

  useEffect(() => {
    if (active) startRef.current?.()
    else stopRef.current?.()
  }, [active])

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
}
