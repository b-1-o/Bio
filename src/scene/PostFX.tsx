import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export function PostFX() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.4}
        mipmapBlur
        blendFunction={BlendFunction.ADD}
      />
      <Vignette offset={0.3} darkness={0.85} eskil={false} />
      <ChromaticAberration
        offset={[0.001, 0.001]}
        radialModulation
        modulationOffset={0.2}
      />
      <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  )
}
