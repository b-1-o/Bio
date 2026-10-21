import { Scene } from './scene/Scene'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Scene />

      {/* Фиксированный оверлей поверх 3D */}
      <div className="overlay">
        <header className="hero">
          <h1 className="hero-title">b-1-o</h1>
          <p className="hero-sub">digital space</p>
        </header>

        <p className="scroll-hint">Scroll to explore</p>
      </div>

      {/* Контент внизу после скролла */}
      <footer className="end">
        <p className="end-mark">b-1-o</p>
        <nav className="end-links">
          <a href="https://github.com/b-1-o" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.tiktok.com/@psycho_b1o" target="_blank" rel="noreferrer">
            TikTok
          </a>
          <a href="https://www.instagram.com/__._saint" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://t.me/blood_on_music" target="_blank" rel="noreferrer">
            Music
          </a>
          <a href="https://discord.gg/P9aqyGCSG" target="_blank" rel="noreferrer">
            Discord
          </a>
        </nav>
      </footer>
    </div>
  )
}
