import { useEffect, useState } from 'react'
import { Scene } from './scene/Scene'
import { PlayerUI } from './ui/PlayerUI'
import './App.css'

export default function App() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const updateHint = () => setHasScrolled(window.scrollY > 50)

    updateHint()
    window.addEventListener('scroll', updateHint, { passive: true })
    return () => window.removeEventListener('scroll', updateHint)
  }, [])

  useEffect(() => {
    if (!isPlayerOpen) return

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      window.scrollTo(scrollX, scrollY)
    }
  }, [isPlayerOpen])

  return (
    <main className="app">
      <Scene
        isPlayerOpen={isPlayerOpen}
        onPlayerOpenChange={setIsPlayerOpen}
      />

      <div className="scene-wordmark" aria-hidden="true">
        <span className="scene-wordmark__name">b-1-o</span>
        {!isPlayerOpen && !hasScrolled && (
          <span className="scene-wordmark__hint">SCROLL TO EXPLORE</span>
        )}
      </div>

      {isPlayerOpen && (
        <PlayerUI onClose={() => setIsPlayerOpen(false)} />
      )}
    </main>
  )
}
