import { Float } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { useInView } from 'framer-motion'
import * as THREE from 'three'
import { LaptopModel, type ProjectScreen } from './LaptopModel'
import { PhoneModel } from './PhoneModel'

type DeviceSceneProps = {
  kind: 'laptop' | 'phone'
  screen: ProjectScreen
  label: string
}
function InteractiveDevice({ kind, screen }: Omit<DeviceSceneProps, 'label'>) {
  const group = useRef<THREE.Group>(null)
  useFrame(({ pointer, clock }, delta) => {
    if (!group.current) return
    const targetY = -0.16 + pointer.x * 0.22
    const targetX = pointer.y * -0.1
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 2.2, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 2, delta)
    group.current.position.y = Math.sin(clock.elapsedTime * 0.65) * 0.045
  })
  return <group ref={group}>
    <Float speed={1.1} rotationIntensity={0.025} floatIntensity={0.12} floatingRange={[-0.03, 0.03]}>
      {kind === 'laptop' ? <LaptopModel screen={screen} /> : <PhoneModel screen={screen} />}
    </Float>
  </group>
}

export function DeviceScene({ kind, screen, label }: DeviceSceneProps) {
  const host = useRef<HTMLDivElement>(null)
  const inView = useInView(host, { once: false, margin: '180px' })
  return <div className={'device-stage device-stage--' + kind} ref={host} role="img" aria-label={label}>
    {!inView && <div className="device-stage__placeholder" aria-hidden="true"><span>3D VIEW / STANDBY</span><i /></div>}
    {inView && <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 5.1], fov: 36 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      fallback={<div className="device-stage__placeholder"><span>DEVICE PREVIEW</span></div>}
    >
      <ambientLight intensity={1.4} color="#ffffff" />
      <directionalLight position={[2.5, 3, 4]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-3, 0.5, 2]} intensity={0.62} color="#a6a6a6" />
      <directionalLight position={[0, -2, -3]} intensity={0.3} color="#ffffff" />
      <Suspense fallback={null}><InteractiveDevice kind={kind} screen={screen} /></Suspense>
    </Canvas>}
    <span className="device-stage__index" aria-hidden="true">FIG. {screen.toUpperCase()} / MONOCHROME</span>
  </div>
}
