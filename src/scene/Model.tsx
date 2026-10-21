import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import type { Color, Material, Mesh, Object3D } from 'three'

const BASE = import.meta.env.BASE_URL

useGLTF.setDecoderPath(`${BASE}draco/`)

type ModelProps = ThreeElements['group'] & {
  path: string
  highlight?: boolean
}

type EmissiveMaterial = Material & {
  emissive?: Color
  emissiveIntensity?: number
}

function cloneWithMaterials(scene: Object3D) {
  const clone = scene.clone(true)
  clone.traverse((object) => {
    const mesh = object as Mesh
    if (!mesh.isMesh) return
    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map((material) => material.clone())
      : mesh.material.clone()
  })
  return clone
}

export function Model({ path, highlight = false, ...props }: ModelProps) {
  const { scene } = useGLTF(path)
  const clonedScene = useMemo(() => cloneWithMaterials(scene), [scene])

  useEffect(() => {
    if (!highlight) return

    const restore: Array<() => void> = []
    clonedScene.traverse((object) => {
      const mesh = object as Mesh
      if (!mesh.isMesh) return

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      for (const material of materials) {
        const emissiveMaterial = material as EmissiveMaterial
        if (!emissiveMaterial.emissive) continue

        const previousColor = emissiveMaterial.emissive.clone()
        const previousIntensity = emissiveMaterial.emissiveIntensity ?? 1
        emissiveMaterial.emissive.set('#263f68')
        emissiveMaterial.emissiveIntensity = Math.max(previousIntensity, 0.65)

        restore.push(() => {
          emissiveMaterial.emissive?.copy(previousColor)
          emissiveMaterial.emissiveIntensity = previousIntensity
        })
      }
    })

    return () => restore.forEach((restoreMaterial) => restoreMaterial())
  }, [clonedScene, highlight])

  return <primitive object={clonedScene} {...props} dispose={null} />
}

useGLTF.preload(`${BASE}assets/stone_opt.glb`)
useGLTF.preload(`${BASE}assets/rocks_web.glb`)
useGLTF.preload(`${BASE}assets/tree_web.glb`)
useGLTF.preload(`${BASE}assets/forest_web.glb`)
