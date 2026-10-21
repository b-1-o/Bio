import { Scene } from './scene/Scene'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Scene />
      <div className="overlay">
        <h1 className="hero-title">b-1-o</h1>
        <p className="scroll-hint">Scroll to explore</p>
      </div>
    </div>
  )
}
