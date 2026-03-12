import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

const MLG_TEXTS = [
  'REKT', 'GET NOSCOPED', 'WOW', 'MOM GET THE CAMERA', '420 BLAZE IT',
  'ILLUMINATI', 'HITMARKER', 'MLG', '360', 'NO SCOPE', 'GG EZ', 'PWNED',
  'LEGENDARY', 'TRIPLE KILL', 'UNSTOPPABLE', 'RAMPAGE', '2 MLG 4 U',
  'DEAL WITH IT', 'SALE', 'EPIC', 'BRUV', 'OMAE WA MOU',
]

const COMBO_FEEDBACK: Record<number, string> = {
  1: 'HIT', 2: 'HIT', 3: 'DOUBLE KILL', 4: 'TRIPLE KILL', 5: 'MEGA KILL',
  6: 'MEGA KILL', 7: 'LEGENDARY', 8: 'LEGENDARY', 9: 'LEGENDARY', 10: 'LEGENDARY',
}

type TargetType = 'normal' | 'bonus' | 'trap'
interface Target {
  id: number
  x: number
  y: number
  spawnTime: number
  type: TargetType
  vx?: number
  vy?: number
}

const INITIAL_LIVES = 3
const FRENZY_DURATION_MS = 5000
const MULTIHIT_RADIUS_PCT = 15
const BOSS_WAVE_INTERVAL = 3
const BOSS_WAVE_COUNT = 6
const TARGET_MARGIN = 12
const MOVE_SPEED = 0.15

function getRank(score: number): string {
  if (score >= 8000) return 'LEGENDARY'
  if (score >= 3000) return 'MLG'
  if (score >= 1000) return 'Rookie'
  return 'Noob'
}

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

function playHitmarker() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const gain = ctx.createGain()
    gain.gain.value = 0.3
    gain.connect(ctx.destination)
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
    setTimeout(() => ctx.close(), 200)
  } catch {
    // ignore
  }
}

function playBonusSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const gain = ctx.createGain()
    gain.gain.value = 0.25
    gain.connect(ctx.destination)
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.frequency.setValueAtTime(880, t)
    osc.frequency.setValueAtTime(1320, t + 0.05)
    osc.frequency.setValueAtTime(1760, t + 0.1)
    osc.type = 'sine'
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.5, t)
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.15)
    osc.connect(g)
    g.connect(gain)
    osc.start(t)
    osc.stop(t + 0.15)
    setTimeout(() => ctx.close(), 250)
  } catch {
    // ignore
  }
}

function playTrapSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const gain = ctx.createGain()
    gain.gain.value = 0.2
    gain.connect(ctx.destination)
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.frequency.setValueAtTime(200, t)
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.1)
    osc.type = 'sawtooth'
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.4, t)
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.12)
    osc.connect(g)
    g.connect(gain)
    osc.start(t)
    osc.stop(t + 0.12)
    setTimeout(() => ctx.close(), 200)
  } catch {
    // ignore
  }
}

function pickTargetType(): TargetType {
  const r = Math.random()
  if (r < 0.15) return 'bonus'
  if (r < 0.25) return 'trap'
  return 'normal'
}

export default function MLG() {
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)
  const [countdownPhase, setCountdownPhase] = useState<null | '3' | '2' | '1' | 'GO'>(null)
  const [gameOver, setGameOver] = useState(false)
  const [finalStats, setFinalStats] = useState<{ score: number; maxCombo: number; wave: number } | null>(null)
  const [newRecord, setNewRecord] = useState(false)

  const [lives, setLives] = useState(INITIAL_LIVES)
  const [wave, setWave] = useState(1)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [targets, setTargets] = useState<Target[]>([])
  const [lastHitFeedback, setLastHitFeedback] = useState<string | null>(null)
  const [announce, setAnnounce] = useState<string | null>(null)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([])
  const [showFlash, setShowFlash] = useState(false)
  const [popTexts, setPopTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([])

  const [activePowerUps, setActivePowerUps] = useState<{
    frenzyUntil?: number
    shieldActive?: boolean
    multiHitActive?: boolean
  }>({})

  const popIdRef = useRef(0)
  const targetIdRef = useRef(0)
  const particleIdRef = useRef(0)
  const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())
  const scoreRef = useRef(0)
  const comboRef = useRef(0)
  const waveRef = useRef(1)
  const gameOverRef = useRef(false)
  const spawnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownDoneRef = useRef(false)
  const spawnCountRef = useRef(0)
  const initialHighScoreRef = useRef(0)
  const maxComboRef = useRef(0)

  scoreRef.current = score
  comboRef.current = combo
  waveRef.current = wave
  gameOverRef.current = gameOver

  useHardcoreTechno(muted, started)

  useEffect(() => {
    document.title = 'EMPASTICK MLG – 360 NO SCOPE – REKT'
  }, [])

  const spawnParticles = useCallback((x: number, y: number) => {
    const id = ++particleIdRef.current
    const count = 8
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: id * 100 + i,
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
    }))
    setParticles((prev) => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles((p) => p.filter((e) => e.id < id * 100 || e.id >= id * 100 + count))
    }, 350)
  }, [])

  const hitTarget = useCallback((id: number, targetX?: number, targetY?: number) => {
    const target = targets.find((t) => t.id === id)
    if (!target) return

    const isTrap = target.type === 'trap'
    if (isTrap) {
      playTrapSound()
      setCombo(0)
      setTargets((prev) => prev.filter((t) => t.id !== id))
      const t = timeoutsRef.current.get(id)
      if (t) clearTimeout(t)
      timeoutsRef.current.delete(id)
      setLastHitFeedback('REKT')
      setTimeout(() => setLastHitFeedback(null), 400)
      return
    }

    const isBonus = target.type === 'bonus'
    if (isBonus) playBonusSound()
    else playHitmarker()

    const x = targetX ?? target.x
    const y = targetY ?? target.y
    spawnParticles(x, y)

    const mult = combo >= 7 ? 4 : combo >= 5 ? 3 : combo >= 3 ? 2 : 1
    const frenzy = activePowerUps.frenzyUntil && Date.now() < activePowerUps.frenzyUntil
    const points = Math.floor(100 * mult * (isBonus ? 2 : 1) * (frenzy ? 2 : 1))

    setTargets((prev) => prev.filter((t) => t.id !== id))
    const t = timeoutsRef.current.get(id)
    if (t) clearTimeout(t)
    timeoutsRef.current.delete(id)

    const nextCombo = combo + 1
    if (nextCombo > maxComboRef.current) maxComboRef.current = nextCombo
    setCombo(nextCombo)
    setScore((s) => s + points)
    setLastHitFeedback(COMBO_FEEDBACK[nextCombo] ?? 'HIT')
    if (nextCombo >= 10) setShowFlash(true)
    setTimeout(() => setShowFlash(false), 120)
    setTimeout(() => setLastHitFeedback(null), 400)

    if (nextCombo === 5) {
      setActivePowerUps((u) => ({ ...u, frenzyUntil: Date.now() + FRENZY_DURATION_MS }))
      setAnnounce('FRENZY')
      setTimeout(() => setAnnounce(null), 800)
    }
    if (nextCombo === 7) {
      setActivePowerUps((u) => ({ ...u, shieldActive: true }))
      setAnnounce('SHIELD')
      setTimeout(() => setAnnounce(null), 800)
    }
    if (nextCombo === 10) {
      setActivePowerUps((u) => ({ ...u, multiHitActive: true }))
      setAnnounce('MULTI-HIT')
      setTimeout(() => setAnnounce(null), 800)
    }
  }, [targets, combo, activePowerUps.frenzyUntil, spawnParticles])

  const hitTargetMulti = useCallback((centerX: number, centerY: number) => {
    const radius = MULTIHIT_RADIUS_PCT
    const inRadius = targets.filter((t) => {
      if (t.type === 'trap') return false
      const dx = t.x - centerX
      const dy = t.y - centerY
      return Math.sqrt(dx * dx + dy * dy) <= radius
    })
    const mult = combo >= 7 ? 4 : combo >= 5 ? 3 : combo >= 3 ? 2 : 1
    const frenzy = activePowerUps.frenzyUntil && Date.now() < activePowerUps.frenzyUntil
    let totalPoints = 0
    inRadius.forEach((t) => {
      const isBonus = t.type === 'bonus'
      totalPoints += Math.floor(100 * mult * (isBonus ? 2 : 1) * (frenzy ? 2 : 1))
    })
    inRadius.forEach((t) => {
      const tId = timeoutsRef.current.get(t.id)
      if (tId) clearTimeout(tId)
      timeoutsRef.current.delete(t.id)
    })
    setTargets((prev) => prev.filter((t) => !inRadius.some((r) => r.id === t.id)))
    setScore((s) => s + totalPoints)
    setActivePowerUps((u) => ({ ...u, multiHitActive: false }))
    spawnParticles(centerX, centerY)
    playHitmarker()
    setLastHitFeedback('MULTI KILL')
    setTimeout(() => setLastHitFeedback(null), 500)
  }, [targets, combo, activePowerUps.frenzyUntil, spawnParticles])

  const onTargetClick = useCallback((target: Target, e: React.MouseEvent) => {
    e.stopPropagation()
    if (activePowerUps.multiHitActive) {
      hitTargetMulti(target.x, target.y)
      return
    }
    hitTarget(target.id, target.x, target.y)
  }, [activePowerUps.multiHitActive, hitTarget, hitTargetMulti])

  const removeLife = useCallback(() => {
    if (activePowerUps.shieldActive) {
      setActivePowerUps((u) => ({ ...u, shieldActive: false }))
      setAnnounce('SHIELD BLOCKED')
      setTimeout(() => setAnnounce(null), 600)
      return
    }
    setLives((l) => {
      const next = l - 1
      if (next <= 0) {
        setGameOver(true)
        setFinalStats({ score: scoreRef.current, maxCombo: maxComboRef.current, wave: waveRef.current })
        const prevCombo = parseInt(localStorage.getItem('mlg_best_combo') ?? '0', 10)
        if (scoreRef.current > initialHighScoreRef.current) {
          localStorage.setItem('mlg_high_score', String(scoreRef.current))
          setNewRecord(true)
        }
        if (comboRef.current > prevCombo) {
          localStorage.setItem('mlg_best_combo', String(comboRef.current))
        }
        if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current)
        timeoutsRef.current.forEach((t) => clearTimeout(t))
        timeoutsRef.current.clear()
      }
      return next
    })
  }, [activePowerUps.shieldActive])

  useEffect(() => {
    if (!started || gameOver || !countdownDoneRef.current) return

    const getLifetime = (w: number, c: number) => {
      const base = Math.max(600, 2200 - w * 80 - scoreRef.current / 50)
      return base + (c === 0 ? 500 : 0)
    }
    const getSpawnDelay = (w: number) => {
      const base = Math.max(500, 1200 - w * 60 - scoreRef.current / 60)
      return base
    }

    const isBossWave = waveRef.current % BOSS_WAVE_INTERVAL === 0
    let spawnCount = 1
    if (isBossWave) {
      setAnnounce('BOSS WAVE')
      setTimeout(() => setAnnounce(null), 1000)
      spawnCount = BOSS_WAVE_COUNT
    }

    const spawnOne = () => {
      if (gameOverRef.current) return
      spawnCountRef.current += 1
      if (spawnCountRef.current > 0 && spawnCountRef.current % 8 === 0) {
        setWave((w) => w + 1)
      }
      const w = waveRef.current
      const c = comboRef.current
      const id = ++targetIdRef.current
      const x = TARGET_MARGIN + Math.random() * (100 - 2 * TARGET_MARGIN)
      const y = TARGET_MARGIN + 8 + Math.random() * (84 - 2 * TARGET_MARGIN)
      const type = pickTargetType()
      const isMoving = Math.random() < 0.2
      const vx = isMoving ? (Math.random() - 0.5) * 2 * MOVE_SPEED : undefined
      const vy = isMoving ? (Math.random() - 0.5) * 2 * MOVE_SPEED : undefined

      const lifetime = getLifetime(w, c)
      setTargets((prev) => [...prev, { id, x, y, spawnTime: Date.now(), type, vx, vy }])

      const t = setTimeout(() => {
        setTargets((prev) => prev.filter((target) => target.id !== id))
        setCombo(0)
        timeoutsRef.current.delete(id)
        removeLife()
      }, lifetime)
      timeoutsRef.current.set(id, t)
    }

    const scheduleNext = (delay: number) => {
      if (gameOverRef.current) return
      spawnTimeoutRef.current = setTimeout(() => {
        for (let i = 0; i < spawnCount; i++) {
          if (i > 0) setTimeout(spawnOne, 80 * i)
          else spawnOne()
        }
        scheduleNext(getSpawnDelay(waveRef.current))
      }, spawnCount > 1 ? 150 : delay)
    }

    scheduleNext(getSpawnDelay(waveRef.current))

    return () => {
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current)
    }
  }, [started, gameOver, wave, removeLife])

  useEffect(() => {
    if (!started || gameOver) return
    const interval = setInterval(() => {
      setTargets((prev) => {
        const hasMoving = prev.some((t) => t.vx != null || t.vy != null)
        if (!hasMoving) return prev
        return prev.map((t) => {
          if (t.vx == null && t.vy == null) return t
          let nx = t.x + (t.vx ?? 0)
          let ny = t.y + (t.vy ?? 0)
          let nvx = t.vx
          let nvy = t.vy
          if (nx < TARGET_MARGIN) { nx = TARGET_MARGIN; nvx = -(t.vx ?? 0) }
          if (nx > 100 - TARGET_MARGIN) { nx = 100 - TARGET_MARGIN; nvx = -(t.vx ?? 0) }
          if (ny < TARGET_MARGIN) { ny = TARGET_MARGIN; nvy = -(t.vy ?? 0) }
          if (ny > 100 - TARGET_MARGIN) { ny = 100 - TARGET_MARGIN; nvy = -(t.vy ?? 0) }
          return { ...t, x: nx, y: ny, vx: nvx, vy: nvy }
        })
      })
    }, 50)
    return () => clearInterval(interval)
  }, [started, gameOver])

  useEffect(() => {
    if (activePowerUps.frenzyUntil && Date.now() > activePowerUps.frenzyUntil) {
      setActivePowerUps((u) => ({ ...u, frenzyUntil: undefined }))
    }
  }, [score, activePowerUps.frenzyUntil])


  useEffect(() => {
    const prev = parseInt(localStorage.getItem('mlg_high_score') ?? '0', 10)
    if (score > prev && score > 0) {
      localStorage.setItem('mlg_high_score', String(score))
    }
    const prevCombo = parseInt(localStorage.getItem('mlg_best_combo') ?? '0', 10)
    if (combo > prevCombo && combo > 0) {
      localStorage.setItem('mlg_best_combo', String(combo))
    }
  }, [score, combo])

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
    if (!started) {
      initialHighScoreRef.current = parseInt(localStorage.getItem('mlg_high_score') ?? '0', 10)
      setStarted(true)
      setCountdownPhase('3')
      const t1 = setTimeout(() => setCountdownPhase('2'), 1000)
      const t2 = setTimeout(() => setCountdownPhase('1'), 2000)
      const t3 = setTimeout(() => setCountdownPhase('GO'), 3000)
      const t4 = setTimeout(() => {
        setCountdownPhase(null)
        countdownDoneRef.current = true
      }, 4000)
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
    }
  }

  const handleReplay = () => {
    setGameOver(false)
    setFinalStats(null)
    setNewRecord(false)
    setLives(INITIAL_LIVES)
    setWave(1)
    setScore(0)
    setCombo(0)
    setTargets([])
    setActivePowerUps({})
    setLastHitFeedback(null)
    setAnnounce(null)
    waveRef.current = 1
    scoreRef.current = 0
    comboRef.current = 0
    gameOverRef.current = false
    countdownDoneRef.current = false
    spawnCountRef.current = 0
    maxComboRef.current = 0
    initialHighScoreRef.current = parseInt(localStorage.getItem('mlg_high_score') ?? '0', 10)
    if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current)
    timeoutsRef.current.forEach((t) => clearTimeout(t))
    timeoutsRef.current.clear()
    setCountdownPhase('3')
    setTimeout(() => setCountdownPhase('2'), 1000)
    setTimeout(() => setCountdownPhase('1'), 2000)
    setTimeout(() => setCountdownPhase('GO'), 3000)
    setTimeout(() => {
      setCountdownPhase(null)
      countdownDoneRef.current = true
    }, 4000)
  }

  const toggleMute = () => setMuted((m) => !m)

  const impact = { fontFamily: 'Impact, "Arial Black", sans-serif' }
  const savedHighScore = parseInt(localStorage.getItem('mlg_high_score') ?? '0', 10)
  const savedBestCombo = parseInt(localStorage.getItem('mlg_best_combo') ?? '0', 10)

  return (
    <div
      className={`fixed inset-0 overflow-hidden select-none mlg-screen-shake ${started ? 'cursor-crosshair' : 'cursor-pointer'}`}
      onClick={handleStart}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleStart()}
      aria-label="Démarrer l'expérience MLG"
    >
      {/* Strobe layers */}
      <div className="absolute inset-0 pointer-events-none hypnotic-flash" style={{ animation: 'hypnotic-flash 0.06s steps(2) infinite' }} />
      <div className="absolute inset-0 opacity-95" style={{ background: 'conic-gradient(from 0deg, #ff00ff, #00ffff, #ffff00, #ff0000, #00ff00, #0000ff, #ff00ff)', animation: 'mlg-spin 1s linear infinite, hypnotic-strobe 0.05s steps(2) infinite' }} />
      <div className="absolute inset-0 opacity-85" style={{ background: 'conic-gradient(from 180deg, #00ff00, #ff0000, #ffff00, #00ffff, #ff00ff, #ff00ff, #00ff00)', animation: 'mlg-spin 0.6s linear infinite reverse, hypnotic-strobe 0.07s steps(2) infinite' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9) 0%, transparent 50%)', animation: 'hypnotic-pulse 0.12s steps(2) infinite' }} />
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.2) 50%)', backgroundSize: '100% 3px' }} />

      <div className="absolute top-2 left-2 text-4xl sm:text-5xl animate-bounce pointer-events-none" style={{ animationDuration: '0.5s' }}>🍟</div>
      <div className="absolute top-2 right-2 text-4xl sm:text-5xl animate-bounce pointer-events-none" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }}>🥤</div>
      <div className="absolute bottom-14 left-2 text-4xl sm:text-5xl animate-bounce pointer-events-none" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }}>🎮</div>
      <div className="absolute bottom-14 right-2 text-4xl sm:text-5xl animate-bounce pointer-events-none" style={{ animationDuration: '0.5s', animationDelay: '0.15s' }}>🔥</div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 pointer-events-none opacity-40" style={{ animation: 'mlg-spin 4s linear infinite' }}>
        <div className="w-full h-full flex items-center justify-center text-6xl sm:text-8xl" style={{ textShadow: '0 0 20px gold' }}>▲</div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 md:gap-12">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <img key={i} src="/images/triple_baton.png" alt="" className="w-16 sm:w-20 md:w-24 h-auto drop-shadow-2xl" style={{ animation: 'mlg-dance 0.4s ease-in-out infinite', animationDelay: `${i * 0.08}s`, transform: `rotate(${i * 45}deg)` }} />
          ))}
        </div>
      </div>

      {[{ top: '15%', left: '10%', dur: '1.5s' }, { top: '20%', right: '15%', dur: '2s' }, { left: '12%', bottom: '25%', dur: '1.8s' }, { right: '10%', bottom: '20%', dur: '1.2s' }].map(({ dur, ...pos }, i) => (
        <div key={i} className="absolute w-16 h-16 sm:w-24 sm:h-24 pointer-events-none" style={{ ...pos, animation: `mlg-spin ${dur} linear infinite` }}>
          <img src="/images/triple_baton.png" alt="" className="w-full h-full object-contain drop-shadow-2xl" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-4xl sm:text-6xl md:text-8xl font-black text-white text-center uppercase tracking-wider outline-text rainbow-border" style={impact}>EMPASTICK</p>
        <p className="text-2xl sm:text-4xl md:text-5xl font-black text-white/95 mt-2 uppercase tracking-[0.3em] outline-text" style={impact}>360 NO SCOPE</p>
        <p className="text-xl sm:text-2xl font-black text-yellow-400 mt-4 uppercase outline-text" style={impact}>MLG HARD</p>
      </div>

      {popTexts.map(({ id, text, x, y }) => (
        <div key={id} className="absolute text-xl sm:text-2xl md:text-3xl font-black uppercase text-white outline-text pointer-events-none" style={{ left: `${x}%`, top: `${y}%`, ...impact, animation: 'pop-in 0.4s ease-out forwards' }}>{text}</div>
      ))}

      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl font-black text-red-600 bg-yellow-400 px-6 py-2 rotate-[-5deg] border-4 border-red-600 stripe-bg pointer-events-none" style={impact}>MLG SALE 100% REKT</div>
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl font-black text-white outline-text pointer-events-none" style={impact}>DEAL WITH IT</div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 pointer-events-none opacity-30 lens-flare" />

      {/* Frenzy border */}
      {activePowerUps.frenzyUntil && Date.now() < activePowerUps.frenzyUntil && (
        <div className="absolute inset-0 pointer-events-none border-4 border-amber-400 animate-pulse opacity-80" style={{ boxShadow: 'inset 0 0 60px rgba(251,191,36,0.5)' }} />
      )}

      {/* Flash overlay */}
      {showFlash && <div className="absolute inset-0 bg-white pointer-events-none flash-overlay" />}

      {/* Particles */}
      {particles.map(({ id, x, y }) => (
        <div key={id} className="absolute w-2 h-2 rounded-full bg-yellow-300 particle" style={{ left: `${x}%`, top: `${y}%` }} />
      ))}

      {/* HUD */}
      {started && !gameOver && (
        <>
          <div className="absolute top-4 left-4 z-20 pointer-events-none" style={impact}>
            <div className="text-white text-2xl sm:text-3xl font-black outline-text">SCORE: {score}</div>
            <div className="text-yellow-400 text-xl font-black outline-text">COMBO: x{combo}</div>
            <div className="text-red-400 text-lg font-black outline-text mt-1">Vies: {'❤️'.repeat(lives)}</div>
            <div className="text-white/90 text-base font-black outline-text">Vague: {wave}</div>
            <div className="text-amber-300 text-sm font-black outline-text mt-1">Rang: {getRank(score)}</div>
            {(activePowerUps.shieldActive || activePowerUps.multiHitActive) && (
              <div className="text-cyan-300 text-xs font-black outline-text mt-1">
                {activePowerUps.shieldActive && '🛡 SHIELD '}
                {activePowerUps.multiHitActive && '💥 MULTI-HIT'}
              </div>
            )}
          </div>
          {announce && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-2xl sm:text-4xl font-black text-amber-400 outline-text announce" style={impact}>{announce}</div>
          )}
          {lastHitFeedback && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-3xl sm:text-4xl font-black text-yellow-400 outline-text hit-feedback pointer-events-none" style={impact}>{lastHitFeedback}</div>
          )}
          {targets.map((target) => (
            <button
              key={target.id}
              type="button"
              className={`absolute z-20 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 -translate-x-1/2 -translate-y-1/2 cursor-crosshair target-btn target-${target.type}`}
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
              onClick={(e) => onTargetClick(target, e)}
              aria-label="Cible"
            >
              <span className={`target-crosshair target-inner-${target.type}`}>
                {target.type === 'bonus' && <span className="target-bonus-label">$</span>}
                {target.type === 'trap' && <span className="target-trap-label">!</span>}
              </span>
            </button>
          ))}
        </>
      )}

      {/* Game Over */}
      {gameOver && finalStats && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/70 p-6" onClick={(e) => e.stopPropagation()}>
          <p className="text-4xl sm:text-5xl font-black text-white outline-text mb-4" style={impact}>GAME OVER</p>
          {newRecord && <p className="text-2xl font-black text-amber-400 outline-text mb-2" style={impact}>NEW RECORD</p>}
          <p className="text-xl text-white/90">Score: {finalStats.score}</p>
          <p className="text-lg text-white/80">Meilleur combo (cette partie): {finalStats.maxCombo}</p>
          <p className="text-lg text-white/80">Vague: {finalStats.wave}</p>
          <p className="text-lg text-white/80">Record: {savedHighScore} · Meilleur combo: {savedBestCombo}</p>
          <p className="text-lg text-amber-300 mt-2">Rang: {getRank(finalStats.score)}</p>
          <div className="flex gap-4 mt-8">
            <button type="button" onClick={handleReplay} className="px-6 py-3 bg-cta hover:bg-cta-hover text-white font-bold rounded border-2 border-white/50" style={impact}>REPLAY</button>
            <Link to="/" className="px-6 py-3 bg-black/50 hover:bg-black/70 text-white font-bold rounded border-2 border-white/50" style={impact}>Quitter</Link>
          </div>
        </div>
      )}

      {/* Countdown */}
      {started && countdownPhase && !gameOver && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <p className="text-8xl sm:text-9xl font-black text-white outline-text countdown" style={impact}>{countdownPhase}</p>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-center gap-4 pointer-events-auto z-10" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={toggleMute} className="px-4 py-2 bg-black/50 hover:bg-black/70 text-white font-bold rounded border-2 border-white/50" style={impact}>{muted ? '🔇 Son' : '🔊 Son'}</button>
        <Link to="/" className="px-4 py-2 bg-black/50 hover:bg-black/70 text-white font-bold rounded border-2 border-white/50" style={impact}>Quitter</Link>
      </div>

      {!started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 pointer-events-none" aria-hidden="true">
          <p className="text-white text-xl sm:text-2xl font-bold uppercase tracking-widest text-center" style={impact}>Clique pour lancer le chaos</p>
          <p className="text-white/80 text-sm mt-2">+ mini-jeu 360 NO SCOPE : clique les cibles</p>
        </div>
      )}

      <style>{`
        @keyframes mlg-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes hypnotic-flash { 0%, 49% { background: rgba(0,0,0,0.85); } 50%, 100% { background: rgba(255,255,255,0.4); } }
        @keyframes hypnotic-strobe { 0%, 49% { filter: brightness(0.4) saturate(1.5); } 50%, 100% { filter: brightness(1.8) saturate(2); } }
        @keyframes hypnotic-pulse { 0%, 49% { opacity: 0.15; transform: scale(0.95); } 50%, 100% { opacity: 0.5; transform: scale(1.05); } }
        @keyframes mlg-dance { 0%, 100% { transform: translateY(0) rotate(-8deg) scale(1); } 25% { transform: translateY(-15px) rotate(8deg) scale(1.1); } 50% { transform: translateY(0) rotate(-5deg) scale(1); } 75% { transform: translateY(-10px) rotate(6deg) scale(1.08); } }
        @keyframes pop-in { 0% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0.8; transform: scale(1); } }
        .outline-text { text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 0 15px rgba(255,255,255,0.6); }
        .rainbow-border { animation: rainbow 1.5s linear infinite; }
        @keyframes rainbow { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        .stripe-bg { background: repeating-linear-gradient(45deg, #fbbf24, #fbbf24 4px, #f59e0b 4px, #f59e0b 8px); }
        .lens-flare { background: radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.4) 0%, transparent 60%); }
        .mlg-screen-shake { animation: screen-shake 0.12s ease-in-out infinite; }
        @keyframes screen-shake { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-3px, 2px); } 50% { transform: translate(3px, -2px); } 75% { transform: translate(-2px, 3px); } }
        .target-btn { background: transparent; border: none; transition: transform 0.05s; }
        .target-btn:hover { transform: translate(-50%, -50%) scale(1.1); }
        .target-crosshair { display: block; width: 100%; height: 100%; border-radius: 50%; position: relative; animation: target-pulse 0.25s ease-in-out infinite; }
        .target-inner-normal { background: #00ff00; border: 5px solid #000; box-shadow: 0 0 0 3px #fff, 0 0 0 6px #000, 0 0 25px 8px rgba(0,255,0,0.9), 0 0 40px 15px rgba(0,255,0,0.5), inset 0 0 15px rgba(255,255,255,0.4); }
        .target-inner-bonus { background: linear-gradient(135deg, #fbbf24, #f59e0b); border: 5px solid #000; box-shadow: 0 0 0 3px #fff, 0 0 0 6px #000, 0 0 30px 10px rgba(251,191,36,0.9), inset 0 0 20px rgba(255,255,255,0.5); animation: target-pulse-bonus 0.2s ease-in-out infinite; }
        .target-inner-trap { background: #dc2626; border: 5px solid #000; box-shadow: 0 0 0 3px #fff, 0 0 0 6px #000, 0 0 25px 8px rgba(220,38,38,0.8), inset 0 0 10px rgba(0,0,0,0.3); }
        .target-bonus-label, .target-trap-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.5rem; font-weight: 900; color: #000; font-family: Impact, sans-serif; }
        .target-trap-label { color: #fff; }
        @keyframes target-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes target-pulse-bonus { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
        .hit-feedback { animation: hit-feedback 0.35s ease-out forwards; }
        @keyframes hit-feedback { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); } 30% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); } 100% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); } }
        .flash-overlay { animation: flash 0.12s ease-out forwards; }
        @keyframes flash { 0% { opacity: 0.9; } 100% { opacity: 0; } }
        .particle { animation: particle-out 0.35s ease-out forwards; }
        @keyframes particle-out { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0) translate(calc(var(--dx, 0) * 20px), calc(var(--dy, 0) * 20px)); } }
        .announce { animation: pop-in 0.4s ease-out; }
        .countdown { animation: countdown-pop 0.5s ease-out; }
        @keyframes countdown-pop { 0% { transform: scale(0.3); opacity: 0; } 70% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  )
}
