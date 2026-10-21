import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'

const BASE = import.meta.env.BASE_URL

useGLTF.setDecoderPath(`${BASE}draco/`)

type ModelProps = ThreeElements['group'] & {
  path: string
}

export function Model({ path, ...props }: ModelProps) {
  const { scene } = useGLTF(path)
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  return <primitive object={clonedScene} {...props} dispose={null} />
}

useGLTF.preload(`${BASE}assets/stone_opt.glb`)
useGLTF.preload(`${BASE}assets/rocks_web.glb`)
useGLTF.preload(`${BASE}assets/tree_web.glb`)
useGLTF.preload(`${BASE}assets/forest_web.glb`)
