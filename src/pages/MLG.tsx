import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function useTechno(muted: boolean, started: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  useEffect(() => {
    if (!started) return
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    ctxRef.current = ctx
    const gain = ctx.createGain()
    gain.gain.value = 0.35
    gain.connect(ctx.destination)
    gainRef.current = gain

    const bpm = 128
    const step = 60 / bpm / 2
    let nextTime = ctx.currentTime

    const schedule = (t: number) => {
      for (let i = 0; i < 32; i++) {
        const time = t + i * step
        const kick = (i % 4) === 0
        const hihat = true
        if (kick) {
          const osc = ctx.createOscillator()
          osc.frequency.setValueAtTime(150, time)
          osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.2)
          osc.type = 'sine'
          const g = ctx.createGain()
          g.gain.setValueAtTime(1, time)
          g.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
          osc.connect(g)
          g.connect(gain)
          osc.start(time)
          osc.stop(time + 0.25)
        }
        if (hihat) {
          const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate)
          const d = buf.getChannelData(0)
          for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.exp(-j / (d.length * 0.3))
          const noise = ctx.createBufferSource()
          noise.buffer = buf
          const g = ctx.createGain()
          g.gain.setValueAtTime(0.15, time)
          g.gain.exponentialRampToValueAtTime(0.01, time + 0.04)
          noise.connect(g)
          g.connect(gain)
          noise.start(time)
          noise.stop(time + 0.05)
        }
      }
    }

    const loop = () => {
      if (nextTime < ctx.currentTime + 0.5) {
        schedule(nextTime)
        nextTime += 32 * step
      }
      if (ctxRef.current) requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)

    return () => {
      ctx.close()
      ctxRef.current = null
    }
  }, [started])

  useEffect(() => {
    if (!gainRef.current) return
    gainRef.current.gain.value = muted ? 0 : 0.35
  }, [muted])
}

export default function MLG() {
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)
  useTechno(muted, started)

  useEffect(() => {
    document.title = 'EMPASTICK MLG – 360 NO SCOPE'
  }, [])

  const handleStart = () => {
    if (!started) setStarted(true)
  }
  const toggleMute = () => setMuted((m) => !m)

  return (
    <div
      className="fixed inset-0 overflow-hidden cursor-pointer select-none"
      onClick={handleStart}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleStart()}
      aria-label="Démarrer l’expérience MLG"
    >
      {/* Fond stroboscopique qui tourne */}
      <div
        className="absolute inset-0 mlg-bg"
        style={{
          background: 'conic-gradient(from 0deg, #ff00ff, #00ffff, #ffff00, #ff0000, #00ff00, #0000ff, #ff00ff)',
          animation: 'mlg-spin 2s linear infinite, mlg-strobe 0.15s steps(2) infinite',
        }}
      />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      {/* Bâtons Empastick qui dansent */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16">
          {[0, 1, 2, 3, 4].map((i) => (
            <img
              key={i}
              src="/images/triple_baton.png"
              alt=""
              className="mlg-stick w-24 sm:w-28 md:w-32 h-auto drop-shadow-2xl"
              style={{
                animationDelay: `${i * 0.2}s`,
                animation: 'mlg-dance 0.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      </div>

      {/* Texte MLG */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p
          className="text-4xl sm:text-6xl md:text-8xl font-black text-white text-center uppercase tracking-wider outline-text"
          style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
        >
          EMPASTICK
        </p>
        <p
          className="text-2xl sm:text-4xl md:text-5xl font-black text-white/90 mt-2 uppercase tracking-[0.3em]"
          style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
        >
          360 NO SCOPE
        </p>
      </div>

      {/* Contrôles (ne pas déclencher le clic start) */}
      <div
        className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-center gap-4 pointer-events-auto z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={toggleMute}
          className="px-4 py-2 bg-white/20 hover:bg-white/40 text-white font-bold rounded border-2 border-white/50 backdrop-blur"
          style={{ fontFamily: 'Impact, sans-serif' }}
        >
          {muted ? '🔇 Son' : '🔊 Son'}
        </button>
        <Link
          to="/"
          className="px-4 py-2 bg-white/20 hover:bg-white/40 text-white font-bold rounded border-2 border-white/50 backdrop-blur"
          style={{ fontFamily: 'Impact, sans-serif' }}
        >
          Quitter
        </Link>
      </div>

      {!started && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none"
          aria-hidden="true"
        >
          <p className="text-white text-xl sm:text-2xl font-bold uppercase tracking-widest">
            Clique pour lancer la techno
          </p>
        </div>
      )}

      <style>{`
        @keyframes mlg-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes mlg-strobe {
          0%, 100% { filter: brightness(1) saturate(1.2); }
          50% { filter: brightness(1.4) saturate(1.5); }
        }
        @keyframes mlg-dance {
          0%, 100% { transform: translateY(0) rotate(-5deg) scale(1); }
          25% { transform: translateY(-12px) rotate(5deg) scale(1.05); }
          50% { transform: translateY(0) rotate(-3deg) scale(1); }
          75% { transform: translateY(-8px) rotate(4deg) scale(1.03); }
        }
        .outline-text {
          text-shadow:
            2px 2px 0 #000,
            -2px -2px 0 #000,
            2px -2px 0 #000,
            -2px 2px 0 #000,
            0 0 20px rgba(255,255,255,0.5);
        }
        .mlg-bg {
          background-size: 100% 100%;
        }
      `}</style>
    </div>
  )
}
