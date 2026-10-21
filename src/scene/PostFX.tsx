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
        intensity={0.7}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.3}
        mipmapBlur
        blendFunction={BlendFunction.ADD}
      />
      <Vignette offset={0.25} darkness={0.75} eskil={false} />
      <ChromaticAberration
        offset={[0.0008, 0.0008]}
        radialModulation
        modulationOffset={0.15}
      />
      <Noise opacity={0.04} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  )
}
