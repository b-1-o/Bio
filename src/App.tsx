import { useCallback, useEffect, useState } from 'react'
import { Experience } from './scene/Experience'
import { PlayerUI } from './ui/PlayerUI'
import './App.css'

export default function App() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const markScrolled = useCallback((scrolled: boolean) => {
    if (scrolled) setHasScrolled(true)
  }, [])

  useEffect(() => {
    const updateHint = () => {
      if (window.scrollY > 50) setHasScrolled(true)
    }

    window.addEventListener('scroll', updateHint, { passive: true })
    return () => window.removeEventListener('scroll', updateHint)
  }, [])

  useEffect(() => {
    if (!isPlayerOpen) return

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [isPlayerOpen])

  return (
    <main className="app">
      <Experience
        isPlayerOpen={isPlayerOpen}
        onPlayerOpenChange={setIsPlayerOpen}
        onScrollStateChange={markScrolled}
      />

      <div className={`scene-wordmark${hasScrolled ? ' is-scrolled' : ''}`}>
        <span className="scene-wordmark__name">b-1-o</span>
        {!hasScrolled && !isPlayerOpen && (
          <span className="scene-wordmark__hint">SCROLL TO EXPLORE</span>
        )}
      </div>

      {isPlayerOpen && (
        <PlayerUI onClose={() => setIsPlayerOpen(false)} />
      )}
    </main>
  )
}
