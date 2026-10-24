import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function ParticleField() {
  const points = useRef<THREE.Points>(null)
  const { size } = useThree()
  const count = size.width < 700 ? 760 : 1850

  const positions = useMemo(() => {
    const values = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3
      values[i3] = (Math.random() - 0.5) * 13
      values[i3 + 1] = (Math.random() - 0.5) * 7
      values[i3 + 2] = (Math.random() - 0.5) * 7
    }
    return values
  }, [count])

  const colors = useMemo(() => {
    const values = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const shade = 0.22 + Math.random() * 0.7
      const i3 = i * 3
      values[i3] = shade
      values[i3 + 1] = shade
      values[i3 + 2] = shade
    }
    return values
  }, [count])

  useFrame(({ pointer, clock }, delta) => {
    if (!points.current) return
    points.current.rotation.y += delta * 0.012
    points.current.rotation.y = THREE.MathUtils.damp(points.current.rotation.y, pointer.x * 0.11, 0.8, delta)
    points.current.rotation.x = THREE.MathUtils.damp(points.current.rotation.x, -pointer.y * 0.1, 0.8, delta)
    points.current.position.x = THREE.MathUtils.damp(points.current.position.x, pointer.x * 0.16, 1, delta)
    points.current.position.y = Math.sin(clock.elapsedTime * 0.16) * 0.035 + pointer.y * 0.08
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.74}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export function HeroBackground() {
  return (
    <div className="hero-background" aria-hidden="true">
      <Canvas
        dpr={[1, 1.35]}
        camera={{ position: [0, 0, 5.5], fov: 58 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        fallback={<div className="hero-background__fallback" />}
      >
        <ParticleField />
      </Canvas>
      <div className="hero-background__edge" />
    </div>
  )
}
