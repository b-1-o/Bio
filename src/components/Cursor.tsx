import { useEffect, useRef } from 'react'

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reducedMotion) return

    const move = (event: PointerEvent) => {
      const element = dot.current
      if (!element) return
      element.style.transform =
        'translate3d(' + event.clientX + 'px,' + event.clientY + 'px,0) translate(-50%,-50%)'
      element.classList.add('is-visible')
      const target = event.target
      element.classList.toggle(
        'is-hovering',
        target instanceof Element && Boolean(target.closest('a, button, [role="button"]')),
      )
    }
    const leave = () => dot.current?.classList.remove('is-visible', 'is-hovering')

    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <div className="cursor-dot" ref={dot} aria-hidden="true" />
}
