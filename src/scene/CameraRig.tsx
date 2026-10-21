import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { FogExp2, MathUtils, Vector3 } from 'three'

type CameraRigProps = {
  isPlayerOpen: boolean
  onScrollStateChange?: (hasScrolled: boolean) => void
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
  const fog = useMemo(() => new FogExp2('#020508', 0.05), [])

  const startPosition = useMemo(() => new Vector3(-4, 1.6, -2), [])
  const churchPosition = useMemo(() => new Vector3(0, 1.35, 4.5), [])
  const treeEntryPosition = useMemo(() => new Vector3(0, -15.6, 8), [])
  const treeExitPosition = useMemo(() => new Vector3(4, -15.8, 5), [])
  const caveEntryPosition = useMemo(() => new Vector3(0, -34.2, 5), [])
  const endOfSpiral = useMemo(() => {
    const startAngle = Math.atan2(5, 4)
    return new Vector3(
      Math.cos(startAngle) * 2.1,
      -29.8,
      Math.sin(startAngle) * 2.1,
    )
  }, [])

  const startLook = useMemo(() => new Vector3(0, 1, 0), [])
  const churchLook = useMemo(() => new Vector3(0, 0.7, 0), [])
  const treeLookStart = useMemo(() => new Vector3(0, -13.8, 0), [])
  const treeLookEnd = useMemo(() => new Vector3(0, -15.5, 0), [])
  const caveLook = useMemo(() => new Vector3(0, -35.1, 0), [])
  const rootsLook = useMemo(() => new Vector3(0, -26.5, 0), [])

  const targetPosition = useMemo(() => new Vector3(), [])
  const targetLook = useMemo(() => new Vector3(0, 1, 0), [])
  const currentLook = useMemo(() => new Vector3(0, 1, 0), [])

  useEffect(() => {
    const previousFog = scene.fog
    scene.fog = fog
    return () => {
      scene.fog = previousFog
    }
  }, [fog, scene])

  useEffect(() => {
    const element = scroll.el
    if (!element) return
    const updateHint = () => {
      if (element.scrollTop > 50) onScrollStateChange?.(true)
    }
    element.addEventListener('scroll', updateHint, { passive: true })
    updateHint()
    return () => element.removeEventListener('scroll', updateHint)
  }, [scroll.el, onScrollStateChange])

  useFrame((_, delta) => {
    const p = isPlayerOpen ? 1 : scroll.offset

    if (p <= 0.2) {
      const t = segmentProgress(p, 0, 0.2)
      targetPosition.copy(startPosition).lerp(churchPosition, t)
      targetLook.copy(startLook).lerp(churchLook, t)
    } else if (p <= 0.3) {
      // The fog spike conceals the large vertical transfer between worlds.
      const t = segmentProgress(p, 0.2, 0.3)
      targetPosition.copy(churchPosition).lerp(treeEntryPosition, t)
      targetLook.copy(churchLook).lerp(treeLookStart, t)
    } else if (p <= 0.6) {
      const t = segmentProgress(p, 0.3, 0.6)
      targetPosition.copy(treeEntryPosition).lerp(treeExitPosition, t)
      targetLook.copy(treeLookStart).lerp(treeLookEnd, t)
    } else if (p <= 0.8) {
      const t = segmentProgress(p, 0.6, 0.8)
      const angle = Math.atan2(5, 4) + t * Math.PI * 4
      const radius = MathUtils.lerp(Math.hypot(4, 5), 2.1, t)
      targetPosition.set(
        Math.cos(angle) * radius,
        MathUtils.lerp(-15.8, -29.8, t),
        Math.sin(angle) * radius,
      )
      targetLook.set(0, MathUtils.lerp(-18, -26.5, t), 0)
    } else {
      const t = segmentProgress(p, 0.8, 1)
      targetPosition.copy(endOfSpiral).lerp(caveEntryPosition, t)
      targetLook.copy(rootsLook).lerp(caveLook, t)
    }

    const transitionIn = smooth01((p - 0.2) / 0.04)
    const transitionOut = 1 - smooth01((p - 0.26) / 0.04)
    const transitionFog = Math.min(transitionIn, transitionOut)
    let fogDensity = 0.05 + 0.45 * transitionFog

    if (p >= 0.6 && p < 0.8) {
      fogDensity = MathUtils.lerp(0.06, 0.22, segmentProgress(p, 0.6, 0.8))
    } else if (p >= 0.8) {
      fogDensity = MathUtils.lerp(0.22, 0.075, segmentProgress(p, 0.8, 0.88))
    }
    fog.density = fogDensity

    camera.position.x = MathUtils.damp(camera.position.x, targetPosition.x, 2.4, delta)
    camera.position.y = MathUtils.damp(camera.position.y, targetPosition.y, 2.4, delta)
    camera.position.z = MathUtils.damp(camera.position.z, targetPosition.z, 2.4, delta)

    currentLook.x = MathUtils.damp(currentLook.x, targetLook.x, 3.2, delta)
    currentLook.y = MathUtils.damp(currentLook.y, targetLook.y, 3.2, delta)
    currentLook.z = MathUtils.damp(currentLook.z, targetLook.z, 3.2, delta)
    camera.lookAt(currentLook)
  })

  return null
}
