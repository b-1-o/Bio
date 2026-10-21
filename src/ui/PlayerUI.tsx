import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './PlayerUI.css'

type Track = {
  title: string
  artist: string
  src: string
}

const BASE = import.meta.env.BASE_URL

const tracks: Track[] = [
  { title: 'Cigarettes out the Window', artist: 'TV Girl', src: `${BASE}music/01-cigarettes-out-the-window.mp3` },
  { title: 'Vanished', artist: 'Crystal Castles', src: `${BASE}music/02-vanished.mp3` },
  { title: 'DᐳEᐳAᐳTᐳHᐳMᐳEᐳTᐳAᐳL', artist: 'Library track', src: `${BASE}music/03-deathmetal.mp3` },
  { title: 'It Almost Worked', artist: 'Library track', src: `${BASE}music/04-it-almost-worked.mp3` },
  { title: 'Jane!', artist: 'Library track', src: `${BASE}music/05-jane.mp3` },
  { title: 'Pantyhose', artist: 'Library track', src: `${BASE}music/06-pantyhose.mp3` },
  { title: 'Televisions', artist: 'Library track', src: `${BASE}music/07-televisions.mp3` },
  { title: "I Don't Wanna Be Me", artist: 'Type O Negative', src: `${BASE}music/08-i-dont-wanna-be-me.mp3` },
]

type PlayerUIProps = {
  onClose: () => void
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remaining = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remaining}`
}

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5h3v13H8zM15 5.5h3v13h-3z" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.6c0-.7.8-1.1 1.4-.7l10 6.2a1 1 0 0 1 0 1.7l-10 6.2c-.6.4-1.4 0-1.4-.7z" fill="currentColor" />
    </svg>
  )
}

export function PlayerUI({ onClose }: PlayerUIProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const track = tracks[trackIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    if (isPlaying) {
      void audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying, trackIndex, volume])

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  const changeTrack = (direction: number) => {
    setTrackIndex((current) => (current + direction + tracks.length) % tracks.length)
    setCurrentTime(0)
    setDuration(0)
  }

  const handleTrackEnd = () => {
    setTrackIndex((current) => (current + 1) % tracks.length)
    setCurrentTime(0)
  }

  const seek = (value: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    audio.currentTime = value
    setCurrentTime(value)
  }

  return (
    <div className="player-backdrop" role="presentation">
      <section
        className="player-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Music player"
      >
        <audio
          ref={audioRef}
          src={track.src}
          preload="metadata"
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onDurationChange={(event) => setDuration(event.currentTarget.duration)}
          onEnded={handleTrackEnd}
          onError={() => setIsPlaying(false)}
        />

        <div className="player-panel__topline">
          <div className="player-panel__label">
            <span className="player-panel__status-dot" />
            STONE PLAYER / 01
          </div>
          <button
            className="player-icon-button player-panel__close"
            type="button"
            onClick={onClose}
            aria-label="Close player"
            title="Close"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6.5 6.5 11 11m0-11-11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="player-artwork" aria-hidden="true">
          <div className="player-artwork__ring player-artwork__ring--outer" />
          <div className="player-artwork__ring player-artwork__ring--inner" />
          <div className="player-artwork__core" />
          <span className={`player-artwork__pulse${isPlaying ? ' is-playing' : ''}`} />
        </div>

        <div className="player-track">
          <p className="player-track__eyebrow">NOW PLAYING</p>
          <h2 className="player-track__title" title={track.title}>{track.title}</h2>
          <p className="player-track__artist">{track.artist}</p>
        </div>

        <div className="player-timeline">
          <input
            className="player-range player-range--seek"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => seek(Number(event.currentTarget.value))}
            aria-label="Seek track"
            style={{ '--range-progress': `${duration ? (currentTime / duration) * 100 : 0}%` } as CSSProperties}
          />
          <div className="player-timeline__times">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-controls">
          <button
            className="player-icon-button"
            type="button"
            onClick={() => changeTrack(-1)}
            aria-label="Previous track"
            title="Previous track"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 5v14M19 6l-10 6 10 6z" fill="currentColor" />
            </svg>
          </button>
          <button
            className="player-play-button"
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <PlayIcon playing={isPlaying} />
          </button>
          <button
            className="player-icon-button"
            type="button"
            onClick={() => changeTrack(1)}
            aria-label="Next track"
            title="Next track"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 5v14M5 6l10 6-10 6z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div className="player-volume">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 10v4h4l5 4V6l-5 4H4zm12-2a6 6 0 0 1 0 8m2-10a9 9 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            className="player-range player-range--volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => setVolume(Number(event.currentTarget.value))}
            aria-label="Volume"
            style={{ '--range-progress': `${volume * 100}%` } as React.CSSProperties}
          />
          <span className="player-volume__percent">{Math.round(volume * 100)}%</span>
        </div>
      </section>
    </div>
  )
}
