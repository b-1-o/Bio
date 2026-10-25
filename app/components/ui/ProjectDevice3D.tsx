import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, Html, RoundedBox } from '@react-three/drei'
import PhoneDevice from './PhoneDevice'
import LaptopDevice from './LaptopDevice'

type DeviceKind = 'phone' | 'laptop'

type ProjectDevice3DProps = {
  device: DeviceKind
  children: ReactNode
}

function DeviceLighting() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[-4, 6, 8]} intensity={3.2} color="#ffffff" />
      <directionalLight position={[5, 0, 5]} intensity={1.6} color="#c8c8c8" />
      <directionalLight position={[0, -5, -3]} intensity={0.7} color="#777777" />
    </>
  )
}

function PhoneModel({ children }: { children: ReactNode }) {
  return (
    <Float speed={1.15} rotationIntensity={0.045} floatIntensity={0.11}>
      <group rotation={[0.018, -0.11, -0.022]}>
        <RoundedBox args={[1.78, 3.66, 0.17]} radius={0.22} smoothness={8}>
          <meshPhysicalMaterial
            color="#464646"
            metalness={0.62}
            roughness={0.24}
            clearcoat={1}
            clearcoatRoughness={0.14}
          />
        </RoundedBox>
        <RoundedBox args={[1.62, 3.45, 0.024]} radius={0.17} smoothness={8} position={[0, 0, 0.09]}>
          <meshBasicMaterial color="#020202" toneMapped={false} />
        </RoundedBox>
        <Html
          transform
          position={[0, 0, 0.108]}
          distanceFactor={100}
          zIndexRange={[20, 0]}
          style={{
            width: '158px',
            height: '337px',
            overflow: 'hidden',
            borderRadius: '20px',
            pointerEvents: 'none',
          }}
        >
          <div className="project-device-html project-device-html--phone" aria-hidden="true">
            {children}
          </div>
        </Html>
      </group>
    </Float>
  )
}

function LaptopModel({ children }: { children: ReactNode }) {
  return (
    <Float speed={0.9} rotationIntensity={0.035} floatIntensity={0.075}>
      <group rotation={[-0.035, -0.105, -0.012]}>
        <RoundedBox
          args={[5.82, 3.58, 0.18]}
          radius={0.14}
          smoothness={8}
          position={[0, 0.16, 0]}
        >
          <meshPhysicalMaterial
            color="#3b3b3b"
            metalness={0.58}
            roughness={0.28}
            clearcoat={0.9}
            clearcoatRoughness={0.18}
          />
        </RoundedBox>
        <RoundedBox
          args={[5.56, 3.31, 0.025]}
          radius={0.075}
          smoothness={6}
          position={[0, 0.16, 0.101]}
        >
          <meshBasicMaterial color="#020202" toneMapped={false} />
        </RoundedBox>
        <Html
          transform
          position={[0, 0.16, 0.119]}
          distanceFactor={100}
          zIndexRange={[20, 0]}
          style={{
            width: '546px',
            height: '325px',
            overflow: 'hidden',
            borderRadius: '5px',
            pointerEvents: 'none',
          }}
        >
          <div className="project-device-html project-device-html--laptop" aria-hidden="true">
            {children}
          </div>
        </Html>
        <RoundedBox
          args={[5.98, 0.15, 0.72]}
          radius={0.075}
          smoothness={6}
          position={[0, -1.72, 0.2]}
        >
          <meshPhysicalMaterial
            color="#333333"
            metalness={0.52}
            roughness={0.3}
            clearcoat={0.8}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.82, 0.012, 0.27]}
          radius={0.025}
          smoothness={4}
          position={[0, -1.637, 0.405]}
        >
          <meshStandardMaterial color="#1a1a1a" metalness={0.15} roughness={0.42} />
        </RoundedBox>
        <RoundedBox
          args={[0.62, 0.012, 0.026]}
          radius={0.01}
          smoothness={4}
          position={[0, -1.635, 0.16]}
        >
          <meshStandardMaterial color="#444444" roughness={0.45} />
        </RoundedBox>
      </group>
    </Float>
  )
}

export function ProjectDevice3D({ device, children }: ProjectDevice3DProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [sceneVisible, setSceneVisible] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => setSceneVisible(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: '140px 0px', threshold: 0.01 },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={rootRef} className={'project-device-3d project-device-3d--' + device}>
      {sceneVisible ? (
        <Canvas
          dpr={[1, 1.15]}
          camera={{
            position: [0, 0, device === 'phone' ? 7.8 : 10],
            fov: device === 'phone' ? 32 : 33,
          }}
          gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <DeviceLighting />
          {device === 'phone' ? (
            <PhoneModel>{children}</PhoneModel>
          ) : (
            <LaptopModel>{children}</LaptopModel>
          )}
        </Canvas>
      ) : (
        <div className="project-device-3d__fallback" aria-hidden="true">
          {device === 'phone' ? (
            <PhoneDevice className="projects-showcase__phone">{children}</PhoneDevice>
          ) : (
            <LaptopDevice className="projects-showcase__laptop">{children}</LaptopDevice>
          )}
        </div>
      )}
    </div>
  )
}
