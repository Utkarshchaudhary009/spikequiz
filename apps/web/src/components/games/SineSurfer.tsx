'use client'

import React, { useEffect, useRef, useState } from 'react'

export const BUTTON_VALUES = [
  { id: '1', label: '1', val: 1 },
  { id: 'v3', label: '√3/2', val: Math.sqrt(3) / 2 },
  { id: 'v2', label: '√2/2', val: Math.sqrt(2) / 2 },
  { id: 'v1', label: '1/2', val: 0.5 },
  { id: '0', label: '0', val: 0 },
  { id: '-v1', label: '-1/2', val: -0.5 },
  { id: '-v2', label: '-√2/2', val: -Math.sqrt(2) / 2 },
  { id: '-v3', label: '-√3/2', val: -Math.sqrt(3) / 2 },
  { id: '-1', label: '-1', val: -1 },
]

export type TargetData = {
  id: string
  x: number // radian position
  val: number // true trig value
  strVal: string // string representation for rendering
  status: 'pending' | 'hit' | 'missed'
}

type Props = {
  gameMode: 'sin' | 'cos'
  isPlaying: boolean
  onGameOver: (score: number) => void
  onScoreUpdate: (score: number) => void
  onHealthUpdate: (health: number) => void
}

const ALL_ANGLES = [
  0,
  Math.PI / 6,
  Math.PI / 4,
  Math.PI / 3,
  Math.PI / 2,
  (2 * Math.PI) / 3,
  (3 * Math.PI) / 4,
  (5 * Math.PI) / 6,
  Math.PI,
  (7 * Math.PI) / 6,
  (5 * Math.PI) / 4,
  (4 * Math.PI) / 3,
  (3 * Math.PI) / 2,
  (5 * Math.PI) / 3,
  (7 * Math.PI) / 4,
  (11 * Math.PI) / 6,
]

export function SineSurfer({
  gameMode,
  isPlaying,
  onGameOver,
  onScoreUpdate,
  onHealthUpdate,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reqRef = useRef<number | null>(null)

  const targetIndexCountRef = useRef(4) // Start at PI/2

  const gameState = useRef({
    x: 0,
    speed: 1.2, // radians per second
    targets: [] as TargetData[],
    lastTime: performance.now(),
    health: 3,
    score: 0,
    combo: 0,
    gameOver: false,
  })

  // Refill targets queue when low
  const fillTargets = (state: typeof gameState.current) => {
    while (state.targets.filter((t) => t.status === 'pending').length < 6) {
      targetIndexCountRef.current += Math.floor(Math.random() * 3) + 3 // Advance by 3 to 5 slots
      const cycle = Math.floor(targetIndexCountRef.current / 16)
      const ang = ALL_ANGLES[targetIndexCountRef.current % 16]
      const nextX = cycle * 2 * Math.PI + ang

      const trueVal = gameMode === 'sin' ? Math.sin(ang) : Math.cos(ang)

      // Snap to closest discrete button value
      let bestBtn = BUTTON_VALUES[0]
      let minErr = Infinity
      for (const b of BUTTON_VALUES) {
        if (Math.abs(b.val - trueVal) < minErr) {
          minErr = Math.abs(b.val - trueVal)
          bestBtn = b
        }
      }

      state.targets.push({
        id: Math.random().toString(36).substring(2, 9),
        x: nextX,
        val: bestBtn.val,
        strVal: bestBtn.label,
        status: 'pending',
      })
    }
  }

  // Handle player inputs
  const handleInput = (val: number) => {
    if (!isPlaying || gameState.current.gameOver) return

    const state = gameState.current

    // Find first pending target
    const target = state.targets.find((t) => t.status === 'pending')
    if (!target) return

    // Allow hitting slightly early or late
    const distance = Math.abs(target.x - state.x)
    const HIT_TOLERANCE = 0.5 // radians

    if (distance < HIT_TOLERANCE) {
      // Meaningful input! Check correct value
      if (Math.abs(target.val - val) < 0.05) {
        // Hit
        target.status = 'hit'
        state.combo += 1
        state.score += 10 * state.combo
        onScoreUpdate(state.score)
      } else {
        // Punish Miss in tolerance
        target.status = 'missed'
        state.combo = 0
        state.health -= 1
        onHealthUpdate(state.health)
        if (state.health <= 0) {
          state.gameOver = true
          onGameOver(state.score)
        }
      }
    }
    // If input is pressed but no target is near, do nothing to avoid double punishment for spamming.
  }

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!isPlaying) {
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
      return
    }

    // Initialize Game state
    gameState.current = {
      x: 0,
      speed: 1.0,
      targets: [],
      lastTime: performance.now(),
      health: 3,
      score: 0,
      combo: 0,
      gameOver: false,
    }
    targetIndexCountRef.current = 2 // Start slightly ahead initially

    onScoreUpdate(0)
    onHealthUpdate(3)

    const loop = (time: number) => {
      if (gameState.current.gameOver) return

      const state = gameState.current
      const dt = (time - state.lastTime) / 1000
      state.lastTime = time

      // Update X based on speed. Speed slowly ramps up!
      state.speed += dt * 0.01 // Acceleration
      state.x += state.speed * dt

      fillTargets(state)

      const width = canvas.width
      const height = canvas.height
      const centerY = height / 2
      const amplitude = centerY * 0.7
      const pixelsPerRad = 150
      const playerScreenX = width * 0.2 // Fixed player horizontal line

      // Check for targets moving past player un-hit
      for (const t of state.targets) {
        if (t.status === 'pending' && state.x > t.x + 0.3) {
          // Passed player without hit!
          t.status = 'missed'
          state.combo = 0
          state.health -= 1
          onHealthUpdate(state.health)
          if (state.health <= 0) {
            state.gameOver = true
            onGameOver(state.score)
            return
          }
        }
      }

      // Render
      ctx.clearRect(0, 0, width, height)

      // Draw horizontal axis
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      ctx.lineTo(width, centerY)
      ctx.strokeStyle = '#475569' // slate-600
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw Grid specific to PI/2
      const firstGridRad = Math.floor(state.x / (Math.PI / 2)) * (Math.PI / 2)
      for (let g = firstGridRad; g < state.x + width / pixelsPerRad; g += Math.PI / 2) {
        const gridX = playerScreenX + (g - state.x) * pixelsPerRad
        ctx.beginPath()
        ctx.moveTo(gridX, 0)
        ctx.lineTo(gridX, height)
        ctx.strokeStyle = '#334155' // slate-700
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw Wave Path
      ctx.beginPath()
      for (let px = 0; px < width; px += 4) {
        const rad = state.x + (px - playerScreenX) / pixelsPerRad
        const y = centerY - (gameMode === 'sin' ? Math.sin(rad) : Math.cos(rad)) * amplitude
        if (px === 0) ctx.moveTo(px, y)
        else ctx.lineTo(px, y)
      }
      ctx.strokeStyle = gameMode === 'sin' ? '#3b82f6' : '#ef4444' // blue or red
      ctx.lineWidth = 4
      ctx.stroke()

      // Draw Player Line
      ctx.beginPath()
      ctx.moveTo(playerScreenX, 0)
      ctx.lineTo(playerScreenX, height)
      ctx.strokeStyle = '#facc15' // yellow-400
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])

      // Draw Player Character (dot on the wave)
      const currentWaveY =
        centerY - (gameMode === 'sin' ? Math.sin(state.x) : Math.cos(state.x)) * amplitude
      ctx.beginPath()
      ctx.arc(playerScreenX, currentWaveY, 12, 0, Math.PI * 2)
      ctx.fillStyle = '#facc15'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw Targets
      for (const t of state.targets) {
        const px = playerScreenX + (t.x - state.x) * pixelsPerRad
        // Only draw targets in view
        if (px < -50 || px > width + 50) continue

        const ty = centerY - (gameMode === 'sin' ? Math.sin(t.x) : Math.cos(t.x)) * amplitude

        ctx.beginPath()
        ctx.arc(px, ty, 16, 0, Math.PI * 2)

        if (t.status === 'hit') {
          ctx.fillStyle = '#10b981' // emerald-500
        } else if (t.status === 'missed') {
          ctx.fillStyle = '#ef4444' // red-500
        } else {
          // Highlight pending target if close
          if (Math.abs(t.x - state.x) < 0.5) {
            ctx.fillStyle = '#f59e0b' // amber-500 (active)
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 3
            ctx.stroke()
          } else {
            ctx.fillStyle = '#64748b' // slate-500 (idle)
          }
        }
        ctx.fill()

        // Draw hit feedback if hit recently
        // Simple pop effect by drawing thin outer ring
        if (t.status === 'hit') {
          ctx.beginPath()
          ctx.arc(px, ty, 24, 0, Math.PI * 2)
          ctx.strokeStyle = '#10b981'
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }

      reqRef.current = requestAnimationFrame(loop)
    }

    reqRef.current = requestAnimationFrame(loop)

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
    }
  }, [isPlaying, gameMode, onGameOver, onScoreUpdate, onHealthUpdate])

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="w-full aspect-[21/9] bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative mb-8 border-4 border-slate-700">
        <canvas ref={canvasRef} width={840} height={360} className="w-full h-full block" />
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-white text-xl font-bold tracking-widest text-slate-300">
              {gameState.current.gameOver ? 'GAME OVER' : 'PRESS START TO SURF'}
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-xl">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {BUTTON_VALUES.map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleInput(btn.val)}
              // Extra styling for empty space buttons to center the row if we want
              className={`
                col-span-1 py-3 sm:py-4 bg-sky-600 hover:bg-sky-500 active:bg-sky-800 
                text-white font-bold rounded-xl shadow-md transition-all active:scale-95
                text-sm sm:text-lg flex items-center justify-center border-b-4 border-sky-800 active:border-b-0 active:translate-y-1
              `}
              aria-label={`Select ${btn.label}`}
              type="button"
            >
              {btn.label}
            </button>
          ))}
        </div>
        <p className="text-center text-slate-500 mt-4 text-sm font-medium">
          Select the correct Y value as you pass through targets!
        </p>
      </div>
    </div>
  )
}
