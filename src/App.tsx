import { useState } from 'react'
import { Scene } from './scene/Scene'
import { PlayerUI } from './ui/PlayerUI'
import './App.css'

export default function App() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)

  return (
    <main className="app">
      <Scene
        isPlayerOpen={isPlayerOpen}
        onPlayerOpenChange={setIsPlayerOpen}
      />

      <div className="scene-wordmark">
        <span className="scene-wordmark__name">b-1-o</span>
        {!isPlayerOpen && (
          <span className="scene-wordmark__hint">CLICK THE STONE TO LISTEN</span>
        )}
      </div>

      {isPlayerOpen && (
        <PlayerUI onClose={() => setIsPlayerOpen(false)} />
      )}
    </main>
  )
}
