import { useCallback, useState } from 'react'
import { Experience } from './scene/Experience'
import { PlayerUI } from './ui/PlayerUI'
import './App.css'

export default function App() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const handleScrollStateChange = useCallback((scrolled: boolean) => {
    setHasScrolled(scrolled)
  }, [])

  return (
    <main className="app">
      <Experience
        isPlayerOpen={isPlayerOpen}
        onPlayerOpenChange={setIsPlayerOpen}
        onScrollStateChange={handleScrollStateChange}
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
