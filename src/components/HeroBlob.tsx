import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Environment } from '@react-three/drei'
import * as THREE from 'three'

export function HeroBlob() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return

    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.05

    // A gentle pointer-follow keeps the object alive without distracting from the copy.
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      state.pointer.x * 0.5,
      0.05,
    )
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      state.pointer.y * 0.5,
      0.05,
    )
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={1} color="#a3a3a3" />
      <Sphere ref={meshRef} args={[1, 128, 128]} scale={3.5}>
        <MeshDistortMaterial
          color="#111111"
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.9}
          roughness={0.2}
          distort={0.4}
          speed={2}
        />
      </Sphere>
      <Environment preset="studio" />
    </>
  )
}
