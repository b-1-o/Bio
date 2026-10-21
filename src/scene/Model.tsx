import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'

useGLTF.setDecoderPath('/draco/')

type ModelProps = ThreeElements['group'] & {
  path: string
}

export function Model({ path, ...props }: ModelProps) {
  const { scene } = useGLTF(path)
  return <primitive object={scene} {...props} />
}

// Предзагрузка — начнёт качать модели сразу при импорте модуля
useGLTF.preload('/assets/stone_opt.glb')
useGLTF.preload('/assets/rocks_web.glb')
useGLTF.preload('/assets/tree_web.glb')
useGLTF.preload('/assets/forest_web.glb')
