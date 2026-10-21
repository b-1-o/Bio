import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { MathUtils, Vector3 } from 'three'

type CameraRigProps = {
  isPlayerOpen: boolean
  onScrollStateChange?: (hasScrolled: boolean) => void
}

const smooth01 = (value: number) => {
  const clamped = Math.max(0, Math.min(1, value))
  return clamped * clamped * (3 - 2 * clamped)
}

export function CameraRig({
  isPlayerOpen,
  onScrollStateChange,
}: CameraRigProps) {
  const { camera } = useThree()
  const scroll = useScroll()

  const startPosition = useMemo(() => new Vector3(0, 1.6, 8), [])
  const endPosition = useMemo(() => new Vector3(0, 1.2, 1.5), [])
  const startLookAt = useMemo(() => new Vector3(0, 1, 0), [])
  const endLookAt = useMemo(() => new Vector3(0, 1, 0), [])
  const targetPosition = useMemo(() => new Vector3(), [])
  const targetLookAt = useMemo(() => new Vector3(0, 1, 0), [])
  const currentLookAt = useMemo(() => new Vector3(0, 1, 0), [])

  // ScrollControls owns the real scroll element, not window. Listen to both
  // its element and window so the DOM hint hides for either scrolling method.
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
    const progress = isPlayerOpen ? 1 : smooth01(scroll.offset)

    targetPosition.copy(startPosition).lerp(endPosition, progress)
    targetLookAt.copy(startLookAt).lerp(endLookAt, progress)

    camera.position.x = MathUtils.damp(
      camera.position.x,
      targetPosition.x,
      2.4,
      delta,
    )
    camera.position.y = MathUtils.damp(
      camera.position.y,
      targetPosition.y,
      2.4,
      delta,
    )
    camera.position.z = MathUtils.damp(
      camera.position.z,
      targetPosition.z,
      2.4,
      delta,
    )

    currentLookAt.x = MathUtils.damp(
      currentLookAt.x,
      targetLookAt.x,
      3.2,
      delta,
    )
    currentLookAt.y = MathUtils.damp(
      currentLookAt.y,
      targetLookAt.y,
      3.2,
      delta,
    )
    currentLookAt.z = MathUtils.damp(
      currentLookAt.z,
      targetLookAt.z,
      3.2,
      delta,
    )

    camera.lookAt(currentLookAt)
  })

  return null
}
