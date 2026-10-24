import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { ProjectScreen } from './LaptopModel'

type PhoneMark = { x: number; y: number; w: number; h: number; tone?: string }

const phoneMarks: Record<ProjectScreen, PhoneMark[]> = {
  music: [
    { x: 0, y: 0.72, w: 0.72, h: 0.035, tone: '#eeeeee' },
    { x: 0, y: 0.52, w: 0.92, h: 0.025, tone: '#555555' },
    { x: 0, y: -0.05, w: 0.75, h: 0.63, tone: '#262626' },
    { x: 0, y: -0.05, w: 0.37, h: 0.37, tone: '#bdbdbd' },
    { x: 0, y: -0.56, w: 0.95, h: 0.02, tone: '#808080' },
    { x: 0, y: -0.7, w: 0.68, h: 0.02, tone: '#595959' },
    { x: 0, y: -0.89, w: 0.76, h: 0.02, tone: '#686868' },
  ],
  docs: [
    { x: 0, y: 0.73, w: 0.74, h: 0.035, tone: '#eeeeee' },
    { x: 0, y: 0.48, w: 0.92, h: 0.025, tone: '#bdbdbd' },
    { x: 0, y: 0.27, w: 0.79, h: 0.02, tone: '#626262' },
    { x: 0, y: 0.08, w: 0.95, h: 0.02, tone: '#565656' },
    { x: 0, y: -0.11, w: 0.84, h: 0.02, tone: '#666666' },
    { x: 0, y: -0.3, w: 0.9, h: 0.02, tone: '#575757' },
    { x: 0, y: -0.49, w: 0.75, h: 0.02, tone: '#777777' },
    { x: 0, y: -0.74, w: 0.89, h: 0.12, tone: '#222222' },
  ],
  jobs: [
    { x: 0, y: 0.73, w: 0.74, h: 0.035, tone: '#eeeeee' },
    { x: -0.23, y: 0.38, w: 0.34, h: 0.35, tone: '#242424' },
    { x: 0.23, y: 0.38, w: 0.34, h: 0.35, tone: '#303030' },
    { x: -0.23, y: 0.38, w: 0.17, h: 0.025, tone: '#d6d6d6' },
    { x: 0.23, y: 0.38, w: 0.17, h: 0.025, tone: '#a5a5a5' },
    { x: 0, y: -0.1, w: 0.9, h: 0.02, tone: '#5d5d5d' },
    { x: 0, y: -0.3, w: 0.8, h: 0.02, tone: '#4b4b4b' },
    { x: 0, y: -0.5, w: 0.88, h: 0.02, tone: '#636363' },
    { x: 0, y: -0.7, w: 0.7, h: 0.02, tone: '#535353' },
  ],
  shop: [
    { x: 0, y: 0.73, w: 0.76, h: 0.035, tone: '#eeeeee' },
    { x: 0, y: 0.45, w: 0.94, h: 0.02, tone: '#5e5e5e' },
    { x: 0, y: 0.18, w: 0.94, h: 0.02, tone: '#5e5e5e' },
    { x: 0, y: -0.09, w: 0.94, h: 0.02, tone: '#5e5e5e' },
    { x: 0, y: -0.36, w: 0.94, h: 0.02, tone: '#5e5e5e' },
    { x: 0.22, y: 0.45, w: 0.2, h: 0.045, tone: '#cfcfcf' },
    { x: 0.22, y: 0.18, w: 0.2, h: 0.045, tone: '#cfcfcf' },
    { x: 0.22, y: -0.09, w: 0.2, h: 0.045, tone: '#cfcfcf' },
    { x: 0.22, y: -0.36, w: 0.2, h: 0.045, tone: '#cfcfcf' },
  ],
}

export function PhoneModel({ screen = 'music' }: { screen?: ProjectScreen }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + state.pointer.x * 0.4
    groupRef.current.rotation.x =
      Math.cos(state.clock.elapsedTime * 0.3) * 0.1 + state.pointer.y * 0.2
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.05
  })

  return (
    <group ref={groupRef} scale={1.12}>
      <RoundedBox args={[1.34, 2.48, 0.15]} radius={0.13} smoothness={6} castShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.24} metalness={0.9} />
      </RoundedBox>

      <RoundedBox args={[1.21, 2.34, 0.035]} radius={0.095} smoothness={6} position={[0, 0, 0.078]}>
        <meshStandardMaterial color="#050505" roughness={0.95} metalness={0.06} />
      </RoundedBox>

      {phoneMarks[screen].map((mark, index) => (
        <mesh key={`${screen}-${index}`} position={[mark.x, mark.y, 0.1]}>
          <boxGeometry args={[mark.w, mark.h, 0.008]} />
          <meshStandardMaterial color={mark.tone || '#777777'} roughness={0.95} />
        </mesh>
      ))}

      {/* Notch */}
      <mesh position={[0, 1.04, 0.104]}>
        <boxGeometry args={[0.28, 0.045, 0.008]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Side buttons */}
      <mesh position={[0.69, 0.34, 0]}>
        <boxGeometry args={[0.035, 0.36, 0.045]} />
        <meshStandardMaterial color="#565656" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-0.69, 0.52, 0]}>
        <boxGeometry args={[0.035, 0.23, 0.045]} />
        <meshStandardMaterial color="#565656" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}
