import { Canvas } from '@react-three/fiber'
import { ContactShadows, Float } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { useInView } from 'framer-motion'

export function Scene({
  children,
  className = '',
  height = 500,
}: {
  children: React.ReactNode
  className?: string
  height?: number
}) {
  const host = useRef<HTMLDivElement>(null)
  const inView = useInView(host, { once: false, margin: '200px' })

  return (
    <div
      ref={host}
      className={`w-full relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {!inView && (
        <div className="absolute inset-0 flex items-center justify-center text-[#525252] font-mono text-[8px] tracking-[0.14em]">
          3D VIEW / STANDBY
        </div>
      )}

      {inView && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6], fov: 42 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.6} />
          <directionalLight position={[-4, -2, -3]} intensity={0.4} />
          <Suspense fallback={null}>
            <Float speed={1.2} rotationIntensity={0.04} floatIntensity={0.15}>
              {children}
            </Float>
            <ContactShadows
              position={[0, -1.6, 0]}
              opacity={0.35}
              scale={12}
              blur={2.2}
              far={5}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}
