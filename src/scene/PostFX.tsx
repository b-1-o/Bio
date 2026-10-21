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
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.8}
        mipmapBlur
      />
      <Vignette darkness={0.8} offset={0.25} />
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  )
}
