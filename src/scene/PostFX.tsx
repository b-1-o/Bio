import { EffectComposer, Vignette } from '@react-three/postprocessing'

export function PostFX() {
  return (
    <EffectComposer multisampling={2}>
      <Vignette darkness={0.9} offset={0.28} />
    </EffectComposer>
  )
}
