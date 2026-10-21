import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export function PostFX() {
  return (
    <EffectComposer multisampling={2}>
      <Bloom intensity={0.8} luminanceThreshold={0.6} mipmapBlur />
      <Vignette darkness={0.9} offset={0.25} />
      <Noise opacity={0.012} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  )
}
