import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

const REF_BASE = "https://raw.githubusercontent.com/b-1-o/refs/main";
const MAIN_BG = `${REF_BASE}/2026-09-09_21-41.png`;
const KNOWN_OLD_IMAGES = new Set(["2026-09-09_21-41.png", "angel.png", "content.gif", "eyes.png", "fallen.jpg", "fogtree.jpg", "trees.jpeg", "vamp.webp", "akak.jpg", "face.jpg", "heck.jpg", "uau.jpg"]);
const TRACKS = [`${REF_BASE}/Jane!.mp3`, `${REF_BASE}/Pantyhose.mp3`, `${REF_BASE}/Cigarettes out the Window.mp3`, `${REF_BASE}/Televisions.mp3`, `${REF_BASE}/It Almost Worked.mp3`, `${REF_BASE}/Crystal Castles - Vanished.mp3`, `${REF_BASE}/Type O Negative - I Don't Wanna Be Me.mp3`, `${REF_BASE}/DᐳEᐳAᐳTᐳHᐳMᐳEᐳTᐳAᐳL.mp3`];
const TRACK_NAMES = ["Jane!", "Pantyhose", "Cigarettes out the Window", "Televisions", "It Almost Worked", "Vanished", "I Don't Wanna Be Me", "DᐳEᐳAᐳTᐳHᐳMᐳEᐳTᐳAᐳL"];
const LINKS = [
  { label: "TikTok", username: "@psycho_b1o", href: "https://www.tiktok.com/@psycho_b1o", glyph: "♪", image: `${REF_BASE}/vamp.webp` },
  { label: "Instagram", username: "@__._saint", href: "https://www.instagram.com/__._saint", glyph: "◎", image: `${REF_BASE}/akak.jpg` },
  { label: "Music", username: "@blood_on_music", href: "https://t.me/blood_on_music", glyph: "◈", image: `${REF_BASE}/face.jpg` },
  { label: "Discord", username: "psycho_b1o", href: "https://discord.gg/P9aqyGCSG", glyph: "◌", image: `${REF_BASE}/heck.jpg` },
  { label: "GitHub", username: "b-1-o", href: "https://github.com/b-1-o", glyph: "⌘", image: `${REF_BASE}/uau.jpg` },
];

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? <svg viewBox="0 0 24 24"><path d="M7.5 5.5h3v13h-3zm6 0h3v13h-3z" /></svg> : <svg viewBox="0 0 24 24"><path d="m8.5 5.8 10 6.2-10 6.2z" /></svg>;
}
function Chevron({ direction = "right" }: { direction?: "left" | "right" }) {
  return <svg viewBox="0 0 24 24"><path d={direction === "right" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} /></svg>;
}
function ShuffleIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4 7h2.2c2.4 0 3.8 1.8 5.1 5s2.7 5 5.2 5H20m-3-3 3 3-3 3M4 17h2.2c1.6 0 2.8-.8 3.8-2.1M14.3 9.1C15.5 7.7 16.5 7 18 7H20m-3-3 3 3-3 3" /></svg>;
}

function Visualizer({ analyser, playing }: { analyser: AnalyserNode | null; playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;
    let raf = 0;
    let width = 1;
    let height = 1;
    const data = new Uint8Array(analyser?.frequencyBinCount || 128);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      width = Math.max(1, r.width);
      height = Math.max(1, r.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    if (!playing) {
      ctx.clearRect(0, 0, width, height);
      window.removeEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }

    const count = 24;
    const bw = width / count;
    const center = height / 2;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(255,255,255,.04)");
    gradient.addColorStop(.45, "rgba(255,255,255,.66)");
    gradient.addColorStop(.62, "rgba(184,45,53,.9)");
    gradient.addColorStop(1, "rgba(255,255,255,.02)");
    ctx.fillStyle = gradient;

    const draw = () => {
      analyser?.getByteFrequencyData(data);
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const idx = Math.min(data.length - 1, Math.floor((t ** 1.65) * data.length * .78));
        const live = (data[idx] || 0) / 255;
        const env = .34 + Math.sin(Math.PI * t) * .66;
        const h = Math.max(2, Math.pow(live, 1.15) * height * .9 * env);
        ctx.globalAlpha = .44 + env * .42;
        ctx.fillRect(i * bw + 1, center - h / 2, Math.max(1, bw - 2), h);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [analyser, playing]);
  return <canvas ref={canvasRef} className="visualizer" />;
}

function Background({ playing, track, playerBackgrounds }: { playing: boolean; track: number; playerBackgrounds: string[] }) {
  const source = !playing ? MAIN_BG : (playerBackgrounds[track % Math.max(1, playerBackgrounds.length)] || MAIN_BG);
  return <div className="background"><AnimatePresence initial={false} mode="sync"><motion.img key={source} className="background-image" src={source} alt="" initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }} /></AnimatePresence><div className="background-colorwash" /><div className="background-fog" /><div className="background-vignette" /></div>;
}

function PortalLink({ link, armed, onArm, onReset }: { link: (typeof LINKS)[number]; armed: boolean; onArm: () => void; onReset: () => void }) {
  return <motion.div className={`portal-shell ${armed ? "armed" : ""}`} animate={{ rotate: armed ? 180 : 0 }} transition={{ type: "spring", stiffness: 185, damping: 25, mass: .75 }}><div className="portal-card glass" onPointerDown={e => e.stopPropagation()}><div className="portal-face"><span className="portal-glyph">{link.glyph}</span><span className="portal-label">{link.label}</span><span className="portal-orbit">↗</span></div><div className="portal-open"><div className="social-art"><img src={link.image} alt="" loading="lazy" decoding="async" /><span className="social-art-shine" /></div><div className="portal-copy"><strong>{link.label}</strong><span>{link.username}</span><small>ENTER THE PORTAL</small></div><a className="portal-go" href={link.href} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} aria-label={`Open ${link.label}`}><Chevron /></a><button className="portal-close" onClick={onReset} aria-label={`Close ${link.label}`}>×</button></div>{!armed && <button className="portal-hit" onClick={onArm} aria-label={`Open ${link.label}`} />}</div></motion.div>;
}

export default function App() {
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [armedLink, setArmedLink] = useState<number | null>(null);
  const [playerBackgrounds, setPlayerBackgrounds] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const swipeStart = useRef<number | null>(null);
  const playingRef = useRef(false);
  const shuffleRef = useRef(false);
  const armedRef = useRef<number | null>(null);

  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { armedRef.current = armedLink; }, [armedLink]);

  useEffect(() => {
    let alive = true;
    const cached = sessionStorage.getItem("b1o-track-backgrounds");
    if (cached) {
      try { setPlayerBackgrounds(JSON.parse(cached)); return () => { alive = false; }; } catch { sessionStorage.removeItem("b1o-track-backgrounds"); }
    }
    fetch("https://api.github.com/repos/b-1-o/refs/contents", { headers: { Accept: "application/vnd.github+json" } })
      .then(r => r.ok ? r.json() : [])
      .then((items: Array<{ name: string; type: string }>) => {
        if (!alive) return;
        const backgrounds = items.filter(x => x.type === "file" && /\.(png|jpe?g|webp)$/i.test(x.name) && !KNOWN_OLD_IMAGES.has(x.name)).map(x => `${REF_BASE}/${encodeURIComponent(x.name).replace(/%2F/g, "/")}`);
        setPlayerBackgrounds(backgrounds);
        try { sessionStorage.setItem("b1o-track-backgrounds", JSON.stringify(backgrounds)); } catch { /* storage unavailable */ }
      }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const setupAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioContextRef.current) {
      const Ctor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      const node = ctx.createAnalyser();
      node.fftSize = 256;
      node.smoothingTimeConstant = .86;
      node.connect(ctx.destination);
      audioContextRef.current = ctx;
      analyserRef.current = node;
      setAnalyser(node);
    }
    if (!sourceRef.current) {
      try {
        sourceRef.current = audioContextRef.current!.createMediaElementSource(audio);
        sourceRef.current.connect(analyserRef.current!);
      } catch { /* source already connected */ }
    }
    if (audioContextRef.current.state === "suspended") void audioContextRef.current.resume();
  }, []);

  const chooseNext = useCallback((from: number) => {
    if (!shuffleRef.current) return (from + 1) % TRACKS.length;
    let n = Math.floor(Math.random() * TRACKS.length);
    if (n === from) n = (n + 1) % TRACKS.length;
    return n;
  }, []);

  useEffect(() => {
    const wasPlaying = playingRef.current;
    const audio = new Audio(TRACKS[track]);
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.volume = armedRef.current === null ? 1 : .18;
    audioRef.current = audio;
    sourceRef.current = null;
    setProgress(0);
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onEnded = () => setTrack(chooseNext(track));
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    if (wasPlaying) {
      setupAudio();
      void audio.play().catch(() => setPlaying(false));
    }
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [track, chooseNext, setupAudio]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = armedLink === null ? 1 : .18;
  }, [armedLink]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setupAudio();
    if (audio.paused) void audio.play().catch(() => setPlaying(false));
    else audio.pause();
  };
  const changeTrack = (next: number) => { setArmedLink(null); setTrack(next); };
  const nextTrack = () => changeTrack(chooseNext(track));
  const previousTrack = () => changeTrack((track - 1 + TRACKS.length) % TRACKS.length);
  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const a = audioRef.current;
    if (!a?.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * a.duration;
  };
  const pointerDown = (e: React.PointerEvent<HTMLElement>) => { swipeStart.current = e.clientX; };
  const pointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (swipeStart.current === null) return;
    const d = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(d) < 55) {
      if (armedLink !== null) setArmedLink(null);
      return;
    }
    if (d < 0) nextTrack(); else previousTrack();
  };

  return <div className="app" onPointerDown={() => armedLink !== null && setArmedLink(null)}><Background playing={playing} track={track} playerBackgrounds={playerBackgrounds} /><main className={`page ${armedLink !== null ? "portal-open-page" : ""}`}><motion.header className="identity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: [0.22, 1, 0.36, 1] }}><span className="identity-mark">b-1-o</span><span className="identity-name">psycho_b1o</span></motion.header><motion.section className={`player glass ${playing ? "playing" : ""} ${armedLink !== null ? "collapsed" : ""}`} initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .65, delay: .06, ease: [0.22, 1, 0.36, 1] }} onPointerDown={e => { e.stopPropagation(); pointerDown(e); }} onPointerUp={e => { e.stopPropagation(); pointerUp(e); }}><div className="player-collapsed"><button className="mini-play" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}><PlayIcon playing={playing} /></button><div className="mini-track"><span>{TRACK_NAMES[track]}</span><i style={{ transform: `scaleX(${progress})` }} /></div><span className="mini-index">{String(track + 1).padStart(2, "0")}</span></div><div className="player-expanded"><div className="player-header"><span className="live-indicator"><i />{playing ? "live" : "idle"}</span><span className="track-count">{String(track + 1).padStart(2, "0")} / 08</span></div><div className="visual-stage"><div className="visual-aura" /><div className="visual-ring ring-one" /><div className="visual-ring ring-two" /><div className="visual-ring ring-three" /><div className="glass-core"><div className="core-reflection" /><motion.div className="core-pulse" animate={playing ? { scale: [1, 1.16, 1], opacity: [.28, .66, .28] } : { scale: 1, opacity: .2 }} transition={playing ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : { duration: .25 }} /><div className="core-line" /></div><Visualizer analyser={analyser} playing={playing} /></div><div className="player-controls" onPointerDown={e => e.stopPropagation()}><button className={`control-button ${shuffle ? "active" : ""}`} onClick={() => setShuffle(v => !v)} aria-label="Shuffle"><ShuffleIcon /></button><button className="control-button" onClick={previousTrack} aria-label="Previous"><Chevron direction="left" /></button><motion.button className="play-button" onClick={togglePlay} whileTap={{ scale: .92 }} aria-label={playing ? "Pause" : "Play"}><PlayIcon playing={playing} /></motion.button><button className="control-button" onClick={nextTrack} aria-label="Next"><Chevron /></button></div><div className="progress-track" onPointerDown={seek} role="slider" aria-label="Track progress"><div className="progress-fill" style={{ transform: `scaleX(${progress})` }} /><div className="progress-thumb" style={{ left: `${progress * 100}%` }} /></div><div className="track-dots" onPointerDown={e => e.stopPropagation()}>{TRACKS.map((_, i) => <button key={i} className={`track-dot ${i === track ? "active" : ""}`} onClick={() => changeTrack(i)} aria-label={`Track ${i + 1}`} />)}</div></div></motion.section><motion.nav className="links" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .055, delayChildren: .2 } } }}>{LINKS.map((link, index) => <motion.div key={link.label} className="link-row" variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}><PortalLink link={link} armed={armedLink === index} onArm={() => setArmedLink(index)} onReset={() => setArmedLink(null)} /></motion.div>)}</motion.nav><motion.footer className="footer" initial={{ opacity: 0 }} animate={{ opacity: .42 }} transition={{ delay: .7, duration: .5 }}>b1o · digital space</motion.footer></main></div>;
}
