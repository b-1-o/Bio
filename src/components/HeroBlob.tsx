import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = [
  'varying vec2 vUv;',
  'void main() {',
  '  vUv = uv;',
  '  gl_Position = vec4(position.xy, 0.0, 1.0);',
  '}',
].join('\n')

const fragmentShader = [
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

export function HeroBlob() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const elapsedRef = useRef(0)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  )

  useFrame((state, delta) => {
    const material = materialRef.current
    if (!material) return

    elapsedRef.current += delta
    material.uniforms.uTime.value = elapsedRef.current
    material.uniforms.uResolution.value.set(
      Math.max(1, state.size.width),
      Math.max(1, state.size.height),
    )
  })

  return (
    <mesh frustumCulled={false} renderOrder={1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}
