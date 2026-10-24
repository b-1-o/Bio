import { useEffect, useRef } from 'react'

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reducedMotion) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let ringX = x
    let ringY = y
    let frame = 0
    let active = false

    const move = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      active = true
      const target = event.target
      const interactive = target instanceof Element && Boolean(target.closest('a, button, [role="button"]'))
      dot.current?.classList.toggle('is-hovering', interactive)
      ring.current?.classList.toggle('is-hovering', interactive)
      dot.current?.classList.add('is-visible')
      ring.current?.classList.add('is-visible')
    }
    const leave = () => {
      dot.current?.classList.remove('is-visible', 'is-hovering')
      ring.current?.classList.remove('is-visible', 'is-hovering')
      active = false
    }
    const animate = () => {
      ringX += (x - ringX) * 0.16
      ringY += (y - ringY) * 0.16
      if (dot.current) dot.current.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%)'
      if (ring.current) ring.current.style.transform = 'translate3d(' + ringX + 'px,' + ringY + 'px,0) translate(-50%,-50%)'
      frame = window.requestAnimationFrame(animate)
    }
    frame = window.requestAnimationFrame(animate)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <>
    <div className="cursor-dot" ref={dot} aria-hidden="true" />
    <div className="cursor-ring" ref={ring} aria-hidden="true" />
  </>
}
