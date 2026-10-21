import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { Box3, type Color, type Material, type Mesh, type Object3D } from 'three'

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

/**
 * Clone geometry references but give each instance its own materials.
 * Translate the clone by its measured local bounding-box minimum so GLBs whose
 * origin is at their center still rest on the parent group's ground plane.
 */
function cloneAndGround(scene: Object3D) {
  const clone = scene.clone(true)

  clone.traverse((object) => {
    const mesh = object as Mesh
    if (!mesh.isMesh) return
    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map((material) => material.clone())
      : mesh.material.clone()
  })

  clone.updateMatrixWorld(true)
  const bounds = new Box3().setFromObject(clone)
  if (!bounds.isEmpty()) clone.position.y -= bounds.min.y
  clone.updateMatrixWorld(true)

  return clone
}

export function Model({ path, highlight = false, ...props }: ModelProps) {
  const { scene } = useGLTF(path)
  const groundedScene = useMemo(() => cloneAndGround(scene), [scene])

  useEffect(() => {
    const restorers: Array<() => void> = []

    groundedScene.traverse((object) => {
      const mesh = object as Mesh
      if (!mesh.isMesh) return

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      for (const material of materials) {
        const emissiveMaterial = material as EmissiveMaterial
        if (!emissiveMaterial.emissive) continue

        const previousColor = emissiveMaterial.emissive.clone()
        const previousIntensity = emissiveMaterial.emissiveIntensity ?? 1

        if (highlight) {
          emissiveMaterial.emissive.set('#263f68')
          emissiveMaterial.emissiveIntensity = Math.max(previousIntensity, 0.65)
        } else {
          emissiveMaterial.emissive.copy(previousColor)
          emissiveMaterial.emissiveIntensity = previousIntensity
        }

        restorers.push(() => {
          emissiveMaterial.emissive?.copy(previousColor)
          emissiveMaterial.emissiveIntensity = previousIntensity
        })
      }
    })

    return () => restorers.forEach((restore) => restore())
  }, [groundedScene, highlight])

  return <primitive object={groundedScene} {...props} dispose={null} />
}

useGLTF.preload(`${BASE}assets/stone_opt.glb`)
useGLTF.preload(`${BASE}assets/rocks_web.glb`)
useGLTF.preload(`${BASE}assets/tree_web.glb`)
useGLTF.preload(`${BASE}assets/forest_web.glb`)
