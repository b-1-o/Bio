import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useThree, type ThreeElements } from '@react-three/fiber'
import type { Color, Material, Mesh, Object3D, Texture } from 'three'
import {
  Box3,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
} from 'three'

const BASE = import.meta.env.BASE_URL

useGLTF.setDecoderPath(BASE + 'draco/')

type ModelProps = ThreeElements['group'] & {
  path: string
  highlight?: boolean
}

type EmissiveMaterial = Material & {
  emissive?: Color
  emissiveIntensity?: number
}

const COLOR_TEXTURE_FIELDS = new Set([
  'map',
  'emissiveMap',
  'sheenColorMap',
  'specularColorMap',
])

function configureTextureQuality(scene: Object3D, anisotropy: number) {
  scene.traverse((object) => {
    const mesh = object as Mesh
    if (!mesh.isMesh) return

    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material]

    for (const material of materials) {
      for (const [field, value] of Object.entries(material)) {
        if (
          !value ||
          typeof value !== 'object' ||
          !(value as Texture).isTexture
        ) {
          continue
        }

        const texture = value as Texture
        texture.anisotropy = anisotropy
        texture.minFilter = LinearMipmapLinearFilter
        texture.magFilter = LinearFilter
        texture.generateMipmaps = true

        // Only color maps use sRGB; normal/roughness/metalness maps are data.
        if (COLOR_TEXTURE_FIELDS.has(field)) {
          texture.colorSpace = SRGBColorSpace
        }

        texture.needsUpdate = true
      }
    }
  })
}

/**
 * Clone model instances and ground each clone from its measured local bounds.
 * Textures stay shared with the cached GLTF and receive higher-quality sampling.
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
  const { gl } = useThree()

  const groundedScene = useMemo(() => {
    const anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy())
    configureTextureQuality(scene, anisotropy)
    return cloneAndGround(scene)
  }, [scene, gl])

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

useGLTF.preload(BASE + 'assets/stone_opt.glb')
useGLTF.preload(BASE + 'assets/rocks_web.glb')
useGLTF.preload(BASE + 'assets/tree_web.glb')
useGLTF.preload(BASE + 'assets/forest_web.glb')
