import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { FogExp2, MathUtils, Vector3 } from 'three'

type CameraRigProps = {
  isPlayerOpen: boolean
  onScrollStateChange: (scrolled: boolean) => void
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

const smooth01 = (value: number) => {
  const t = clamp01(value)
  return t * t * (3 - 2 * t)
}

const segmentProgress = (progress: number, start: number, end: number) =>
  smooth01((progress - start) / (end - start))

export function CameraRig({
  isPlayerOpen,
  onScrollStateChange,
}: CameraRigProps) {
  const { camera, scene } = useThree()
  const scroll = useScroll()
  const didScrollRef = useRef(false)

  const fog = useMemo(() => new FogExp2('#020509', 0.02), [])

  const skyPosition = useMemo(() => new Vector3(0, 25, 25), [])
  const descentPosition = useMemo(() => new Vector3(0, 8, 12), [])
  const treeApproachPosition = useMemo(() => new Vector3(-2, 1.6, 5), [])

  const spiralStartPosition = useMemo(
    () => new Vector3(Math.sin(6) * 3, 1.6, -2 + Math.cos(6) * 3),
    [],
  )
  const spiralEndPosition = useMemo(
    () => new Vector3(Math.sin(8) * 3, -0.4, -2 + Math.cos(8) * 3),
    [],
  )

  // Cave origin is [0, -8, -15], so this is local camera [0, 1.2, 3].
  const caveCameraPosition = useMemo(() => new Vector3(0, -6.8, -12), [])
  const skyLook = useMemo(() => new Vector3(0, 0, 0), [])
  const forestLook = useMemo(() => new Vector3(0, 0, -1), [])
  const treeLook = useMemo(() => new Vector3(0, 5.5, -2), [])
  const treeExitLook = useMemo(() => new Vector3(0, 1, -2), [])
  const rootsLook = useMemo(() => new Vector3(0, -0.45, -2), [])
  const caveLook = useMemo(() => new Vector3(0, -7.2, -15), [])

  const targetPosition = useMemo(() => new Vector3(), [])
  const targetLook = useMemo(() => new Vector3(), [])
  const currentLook = useMemo(() => new Vector3(0, 0, 0), [])

  useEffect(() => {
    const previousFog = scene.fog
    scene.fog = fog

    return () => {
      scene.fog = previousFog
    }
  }, [fog, scene])

  useFrame((_, delta) => {
    const progress = isPlayerOpen ? 1 : scroll.offset
    const hasScrolled = progress > 0.05

    if (hasScrolled !== didScrollRef.current) {
      didScrollRef.current = hasScrolled
      onScrollStateChange(hasScrolled)
    }

    if (progress <= 0.2) {
      // Zone 1: high establishing shot over the forest and church.
      targetPosition.copy(skyPosition)
      targetLook.copy(skyLook)
      fog.density = 0.02
    } else if (progress <= 0.3) {
      // Zone 2a: dive from the aerial view toward the forest.
      const t = segmentProgress(progress, 0.2, 0.3)
      targetPosition.copy(skyPosition).lerp(descentPosition, t)
      targetLook.copy(skyLook).lerp(forestLook, t)
      fog.density = MathUtils.lerp(0.02, 0.1, t)
    } else if (progress <= 0.4) {
      // Zone 2b: fog conceals the final approach into the tree zone.
      const t = segmentProgress(progress, 0.3, 0.4)
      targetPosition.copy(descentPosition).lerp(treeApproachPosition, t)
      targetLook.copy(forestLook).lerp(treeLook, t)
      fog.density = MathUtils.lerp(0.1, 0.025, t)
    } else if (progress <= 0.6) {
      // Zone 3: emerge from the fog and glide toward the tree branches.
      const t = segmentProgress(progress, 0.4, 0.6)
      targetPosition.copy(treeApproachPosition).lerp(spiralStartPosition, t)
      targetLook.copy(treeLook).lerp(treeExitLook, t)
      fog.density = MathUtils.lerp(0.025, 0.035, t)
    } else if (progress <= 0.8) {
      // Zone 4: spiral down around the trunk toward the roots.
      const t = segmentProgress(progress, 0.6, 0.8)
      targetPosition.set(
        Math.sin(progress * 10) * 3,
        1.6 - (progress - 0.6) * 10,
        -2 + Math.cos(progress * 10) * 3,
      )
      targetLook.set(0, MathUtils.lerp(0, -0.45, t), -2)
      fog.density = MathUtils.lerp(0.035, 0.085, t)
    } else {
      // Zone 5: enter the cave; final local camera position is [0, 1.2, 3].
      const t = segmentProgress(progress, 0.8, 1)
      targetPosition.copy(spiralEndPosition).lerp(caveCameraPosition, t)
      targetLook.copy(rootsLook).lerp(caveLook, t)
      fog.density = MathUtils.lerp(0.085, 0.035, t)
    }

    if (isPlayerOpen) {
      targetPosition.copy(caveCameraPosition)
      targetLook.copy(caveLook)
    }

    camera.position.x = MathUtils.damp(camera.position.x, targetPosition.x, 2.8, delta)
    camera.position.y = MathUtils.damp(camera.position.y, targetPosition.y, 2.8, delta)
    camera.position.z = MathUtils.damp(camera.position.z, targetPosition.z, 2.8, delta)

    currentLook.x = MathUtils.damp(currentLook.x, targetLook.x, 3.4, delta)
    currentLook.y = MathUtils.damp(currentLook.y, targetLook.y, 3.4, delta)
    currentLook.z = MathUtils.damp(currentLook.z, targetLook.z, 3.4, delta)
    camera.lookAt(currentLook)
  })

  return null
}
