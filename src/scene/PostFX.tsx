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
        intensity={0.6}
        luminanceThreshold={0.75}
        mipmapBlur
      />
      <Vignette darkness={0.85} offset={0.25} />
      <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  )
}
