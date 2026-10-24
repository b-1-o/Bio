import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Environment } from '@react-three/drei'
import * as THREE from 'three'

export function HeroBlob() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Slow continuous rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.03

      // Soft mouse parallax
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        state.pointer.x * 0.5 + 1.2,
        0.05,
      )
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        state.pointer.y * 0.4,
        0.05,
      )
    }

    // Breathing distortion
    if (materialRef.current) {
      materialRef.current.distort = 0.4 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={1} color="#a3a3a3" />
      <spotLight position={[0, 10, 0]} intensity={2} color="#ffffff" angle={0.5} penumbra={1} />

      <Sphere ref={meshRef} args={[1, 128, 128]} scale={4.2} position={[0, 0, 0]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#0a0a0a"
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.85}
          roughness={0.18}
          distort={0.4}
          speed={2}
        />
      </Sphere>

      <Environment preset="studio" />
    </>
  )
}
