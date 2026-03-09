import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const MLG_TEXTS = [
  'REKT', 'GET NOSCOPED', 'WOW', 'MOM GET THE CAMERA', '420 BLAZE IT',
  'ILLUMINATI', 'HITMARKER', 'MLG', '360', 'NO SCOPE', 'GG EZ', 'PWNED',
  'LEGENDARY', 'TRIPLE KILL', 'UNSTOPPABLE', 'RAMPAGE', '2 MLG 4 U',
  'DEAL WITH IT', 'SALE', 'EPIC', 'BRUV', 'OMAE WA MOU',
]

function useHardcoreTechno(muted: boolean, started: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  useEffect(() => {
    if (!started) return
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    ctxRef.current = ctx
    const gain = ctx.createGain()
    gain.gain.value = 0.4
    gain.connect(ctx.destination)
    gainRef.current = gain

    const bpm = 155
    const step = 60 / bpm / 4
    let nextTime = ctx.currentTime

    const schedule = (t: number) => {
      for (let i = 0; i < 64; i++) {
        const time = t + i * step
        const kick = (i % 16) === 0
        const snare = (i % 16) === 8
        const hihat = true
        const bass = (i % 4) === 0

        if (kick) {
          const osc = ctx.createOscillator()
          osc.frequency.setValueAtTime(80, time)
          osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.25)
          osc.type = 'sine'
          const g = ctx.createGain()
          g.gain.setValueAtTime(1.2, time)
          g.gain.exponentialRampToValueAtTime(0.01, time + 0.25)
          osc.connect(g)
          g.connect(gain)
          osc.start(time)
          osc.stop(time + 0.3)
        }
        if (snare) {
          const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate)
          const d = buf.getChannelData(0)
          for (let j = 0; j < d.length; j++) {
            d[j] = (Math.random() * 2 - 1) * Math.exp(-j / (d.length * 0.4))
          }
          const noise = ctx.createBufferSource()
          noise.buffer = buf
          const osc = ctx.createOscillator()
          osc.frequency.setValueAtTime(180, time)
          osc.type = 'triangle'
          const gNoise = ctx.createGain()
          gNoise.gain.setValueAtTime(0.4, time)
          gNoise.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
          const gOsc = ctx.createGain()
          gOsc.gain.setValueAtTime(0.3, time)
          gOsc.gain.exponentialRampToValueAtTime(0.01, time + 0.08)
          noise.connect(gNoise)
          gNoise.connect(gain)
          osc.connect(gOsc)
          gOsc.connect(gain)
          noise.start(time)
          noise.stop(time + 0.15)
          osc.start(time)
          osc.stop(time + 0.1)
        }
        if (hihat) {
          const buf = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate)
          const d = buf.getChannelData(0)
          for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.exp(-j / (d.length * 0.2))
          const noise = ctx.createBufferSource()
          noise.buffer = buf
          const g = ctx.createGain()
          g.gain.setValueAtTime(i % 4 === 0 ? 0.2 : 0.08, time)
          g.gain.exponentialRampToValueAtTime(0.01, time + 0.02)
          noise.connect(g)
          g.connect(gain)
          noise.start(time)
          noise.stop(time + 0.03)
        }
        if (bass) {
          const osc = ctx.createOscillator()
          osc.frequency.setValueAtTime(55, time)
          osc.frequency.setValueAtTime(45, time + 0.1)
          osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.35)
          osc.type = 'sawtooth'
          const g = ctx.createGain()
          g.gain.setValueAtTime(0.5, time)
          g.gain.exponentialRampToValueAtTime(0.01, time + 0.35)
          osc.connect(g)
          g.connect(gain)
          osc.start(time)
          osc.stop(time + 0.4)
        }
      }
    }

    const loop = () => {
      if (nextTime < ctx.currentTime + 0.5) {
        schedule(nextTime)
        nextTime += 64 * step
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
    gainRef.current.gain.value = muted ? 0 : 0.4
  }, [muted])
}

function useHitmarkerSound(started: boolean, muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)
  const lastRef = useRef(0)
  useEffect(() => {
    if (!started || muted) return
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    ctxRef.current = ctx
    const gain = ctx.createGain()
    gain.gain.value = 0.25
    gain.connect(ctx.destination)

    const playHit = () => {
      const t = ctx.currentTime
      const osc1 = ctx.createOscillator()
      osc1.frequency.setValueAtTime(1200, t)
      osc1.frequency.exponentialRampToValueAtTime(2400, t + 0.05)
      osc1.type = 'sine'
      const g1 = ctx.createGain()
      g1.gain.setValueAtTime(1, t)
      g1.gain.exponentialRampToValueAtTime(0.01, t + 0.08)
      osc1.connect(g1)
      g1.connect(gain)
      osc1.start(t)
      osc1.stop(t + 0.08)
    }

    const id = setInterval(() => {
      if (Date.now() - lastRef.current > 800 && Math.random() > 0.6) {
        lastRef.current = Date.now()
        playHit()
      }
    }, 400)
    return () => {
      clearInterval(id)
      ctx.close()
    }
  }, [started, muted])
}

export default function MLG() {
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)
  const [popTexts, setPopTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([])
  const popIdRef = useRef(0)

  useHardcoreTechno(muted, started)
  useHitmarkerSound(started, muted)

  useEffect(() => {
    document.title = 'EMPASTICK MLG – 360 NO SCOPE – REKT'
  }, [])

  useEffect(() => {
    if (!started) return
    const id = setInterval(() => {
      setPopTexts((prev) => {
        const next = [...prev.slice(-8)]
        next.push({
          id: ++popIdRef.current,
          text: MLG_TEXTS[Math.floor(Math.random() * MLG_TEXTS.length)],
          x: 10 + Math.random() * 80,
          y: 15 + Math.random() * 70,
        })
        return next
      })
    }, 600)
    return () => clearInterval(id)
  }, [started])

  const handleStart = () => {
    if (!started) setStarted(true)
  }
  const toggleMute = () => setMuted((m) => !m)

  const impact = { fontFamily: 'Impact, "Arial Black", sans-serif' }

  return (
    <div
      className="fixed inset-0 overflow-hidden cursor-pointer select-none mlg-screen-shake"
      onClick={handleStart}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleStart()}
      aria-label="Démarrer l'expérience MLG"
    >
      {/* Triple fond stroboscopique */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: 'conic-gradient(from 0deg, #ff00ff, #00ffff, #ffff00, #ff0000, #00ff00, #0000ff, #ff00ff)',
          animation: 'mlg-spin 1.2s linear infinite, mlg-strobe 0.08s steps(2) infinite',
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: 'conic-gradient(from 180deg, #00ff00, #ff0000, #ffff00, #00ffff, #ff00ff)',
          animation: 'mlg-spin 0.8s linear infinite reverse, mlg-strobe 0.1s steps(2) infinite',
        }}
      />
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

      {/* Grille / scanlines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.15) 50%)', backgroundSize: '100% 4px' }} />

      {/* Coins MLG */}
      <div className="absolute top-2 left-2 text-4xl sm:text-5xl animate-bounce" style={{ animationDuration: '0.5s' }}>🍟</div>
      <div className="absolute top-2 right-2 text-4xl sm:text-5xl animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }}>🥤</div>
      <div className="absolute bottom-14 left-2 text-4xl sm:text-5xl animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }}>🎮</div>
      <div className="absolute bottom-14 right-2 text-4xl sm:text-5xl animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.15s' }}>🔥</div>

      {/* Triangle Illuminati qui tourne */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 pointer-events-none opacity-40" style={{ animation: 'mlg-spin 4s linear infinite' }}>
        <div className="w-full h-full flex items-center justify-center text-6xl sm:text-8xl" style={{ textShadow: '0 0 20px gold' }}>▲</div>
      </div>

      {/* Bâtons Empastick partout */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 md:gap-12">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <img
              key={i}
              src="/images/triple_baton.png"
              alt=""
              className="w-16 sm:w-20 md:w-24 h-auto drop-shadow-2xl"
              style={{
                animation: `mlg-dance 0.4s ease-in-out infinite`,
                animationDelay: `${i * 0.08}s`,
                transform: `rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bâtons qui tournent 360 */}
      <div className="absolute top-[15%] left-[10%] w-20 h-20 sm:w-28 sm:h-28" style={{ animation: 'mlg-spin 1.5s linear infinite' }}>
        <img src="/images/triple_baton.png" alt="" className="w-full h-full object-contain drop-shadow-2xl" />
      </div>
      <div className="absolute top-[20%] right-[15%] w-16 h-16 sm:w-24 sm:h-24" style={{ animation: 'mlg-spin 2s linear infinite reverse' }}>
        <img src="/images/triple_baton.png" alt="" className="w-full h-full object-contain drop-shadow-2xl" />
      </div>
      <div className="absolute bottom-[25%] left-[12%] w-16 h-16 sm:w-24 sm:h-24" style={{ animation: 'mlg-spin 1.8s linear infinite' }}>
        <img src="/images/triple_baton.png" alt="" className="w-full h-full object-contain drop-shadow-2xl" />
      </div>
      <div className="absolute bottom-[20%] right-[10%] w-20 h-20 sm:w-28 sm:h-28" style={{ animation: 'mlg-spin 1.2s linear infinite reverse' }}>
        <img src="/images/triple_baton.png" alt="" className="w-full h-full object-contain drop-shadow-2xl" />
      </div>

      {/* Texte central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-4xl sm:text-6xl md:text-8xl font-black text-white text-center uppercase tracking-wider outline-text rainbow-border" style={impact}>
          EMPASTICK
        </p>
        <p className="text-2xl sm:text-4xl md:text-5xl font-black text-white/95 mt-2 uppercase tracking-[0.3em] outline-text" style={impact}>
          360 NO SCOPE
        </p>
        <p className="text-xl sm:text-2xl font-black text-yellow-400 mt-4 uppercase outline-text" style={impact}>
          LEGENDARY
        </p>
      </div>

      {/* Hitmarker X */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 pointer-events-none text-white opacity-0 hitmarker-flash" style={{ animation: 'hitmarker 0.3s ease-out infinite' }}>
        <span className="text-6xl font-black" style={impact}>✕</span>
      </div>

      {/* Popups de texte aléatoires */}
      {popTexts.map(({ id, text, x, y }) => (
        <div
          key={id}
          className="absolute text-xl sm:text-2xl md:text-3xl font-black uppercase text-white outline-text pop-in"
          style={{ left: `${x}%`, top: `${y}%`, ...impact, animation: 'pop-in 0.4s ease-out forwards' }}
        >
          {text}
        </div>
      ))}

      {/* Bandeau SALE style */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl font-black text-red-600 bg-yellow-400 px-6 py-2 rotate-[-5deg] border-4 border-red-600 stripe-bg" style={impact}>
        MLG SALE 100% REKT
      </div>

      {/* DEAL WITH IT en bas */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl font-black text-white outline-text" style={impact}>
        DEAL WITH IT
      </div>

      {/* Lens flare / reflet */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 pointer-events-none opacity-30 lens-flare" />

      {/* Contrôles */}
      <div
        className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-center gap-4 pointer-events-auto z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={toggleMute}
          className="px-4 py-2 bg-black/50 hover:bg-black/70 text-white font-bold rounded border-2 border-white/50"
          style={impact}
        >
          {muted ? '🔇 Son' : '🔊 Son'}
        </button>
        <Link
          to="/"
          className="px-4 py-2 bg-black/50 hover:bg-black/70 text-white font-bold rounded border-2 border-white/50"
          style={impact}
        >
          Quitter
        </Link>
      </div>

      {!started && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none" aria-hidden="true">
          <p className="text-white text-xl sm:text-2xl font-bold uppercase tracking-widest" style={impact}>
            Clique pour lancer le chaos
          </p>
        </div>
      )}

      <style>{`
        @keyframes mlg-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes mlg-strobe {
          0%, 100% { filter: brightness(1) saturate(1.3); }
          50% { filter: brightness(1.6) saturate(1.8); }
        }
        @keyframes mlg-dance {
          0%, 100% { transform: translateY(0) rotate(-8deg) scale(1); }
          25% { transform: translateY(-15px) rotate(8deg) scale(1.1); }
          50% { transform: translateY(0) rotate(-5deg) scale(1); }
          75% { transform: translateY(-10px) rotate(6deg) scale(1.08); }
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.8; transform: scale(1); }
        }
        @keyframes hitmarker {
          0%, 90%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          5% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          15% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
        }
        .outline-text {
          text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 0 15px rgba(255,255,255,0.6);
        }
        .rainbow-border {
          animation: rainbow 1.5s linear infinite;
        }
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .stripe-bg {
          background: repeating-linear-gradient(45deg, #fbbf24, #fbbf24 4px, #f59e0b 4px, #f59e0b 8px);
        }
        .lens-flare {
          background: radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.4) 0%, transparent 60%);
        }
        .mlg-screen-shake {
          animation: screen-shake 0.15s ease-in-out infinite;
        }
        @keyframes screen-shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-3px, 2px); }
          50% { transform: translate(3px, -2px); }
          75% { transform: translate(-2px, 3px); }
        }
      `}</style>
    </div>
  )
}
