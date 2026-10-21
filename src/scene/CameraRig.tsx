import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'

type CameraRigProps = {
  isPlayerOpen: boolean
}

type CameraKeyframe = {
  position: Vector3
  lookAt: Vector3
}

function getScrollProgress() {
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight
  return scrollRange > 0
    ? Math.min(1, Math.max(0, window.scrollY / scrollRange))
    : 0
}

const smooth01 = (value: number) => value * value * (3 - 2 * value)

export function CameraRig({ isPlayerOpen }: CameraRigProps) {
  const { camera } = useThree()
  const progressRef = useRef(0)

  const start = useMemo<CameraKeyframe>(() => ({
    position: new Vector3(2, 1.5, 10),
    lookAt: new Vector3(0, 1, 0),
  }), [])

  const middle = useMemo<CameraKeyframe>(() => ({
    position: new Vector3(0, 1.2, 5),
    lookAt: new Vector3(0, 1, 0),
  }), [])

  const end = useMemo<CameraKeyframe>(() => ({
    position: new Vector3(0, 1, 2),
    lookAt: new Vector3(0, 0.9, 0),
  }), [])

  const targetPosition = useMemo(() => new Vector3(), [])
  const targetLookAt = useMemo(() => new Vector3(), [])
  const currentLookAt = useMemo(() => new Vector3(0, 1, 0), [])

  useEffect(() => {
    const updateProgress = () => {
      progressRef.current = getScrollProgress()
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  useFrame((_, delta) => {
    if (isPlayerOpen) {
      targetPosition.copy(end.position)
      targetLookAt.copy(end.lookAt)
    } else {
      const progress = progressRef.current

      if (progress <= 0.5) {
        const t = smooth01(progress * 2)
        targetPosition.copy(start.position).lerp(middle.position, t)
        targetLookAt.copy(start.lookAt).lerp(middle.lookAt, t)
      } else {
        const t = smooth01((progress - 0.5) * 2)
        targetPosition.copy(middle.position).lerp(end.position, t)
        targetLookAt.copy(middle.lookAt).lerp(end.lookAt, t)
      }
    }

    camera.position.x = MathUtils.damp(camera.position.x, targetPosition.x, 1.8, delta)
    camera.position.y = MathUtils.damp(camera.position.y, targetPosition.y, 1.8, delta)
    camera.position.z = MathUtils.damp(camera.position.z, targetPosition.z, 1.8, delta)

    currentLookAt.lerp(targetLookAt, 1 - Math.exp(-delta * 2.2))
    camera.lookAt(currentLookAt)
  })

  return null
}
