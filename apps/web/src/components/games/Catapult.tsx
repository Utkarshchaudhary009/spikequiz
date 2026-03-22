'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Props {
  gameMode?: 'sin' | 'cos' // just to maintain standard interface, though catapult is mostly sin
  difficultyLevel: number
  isPlaying: boolean
  onGameOver: (score: number) => void
  onScoreUpdate: (score: number) => void
  onHealthUpdate: (health: number) => void
  onLevelComplete: () => void
}

const G = 9.8
const V = 70 // Launch velocity
const MAX_RANGE = (V * V) / G

export function Catapult({
  difficultyLevel,
  isPlaying,
  onGameOver,
  onScoreUpdate,
  onHealthUpdate,
  onLevelComplete,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  const [angle, setAngle] = useState(45) // Degrees
  const [isFiring, setIsFiring] = useState(false)
  const [targetDistance, setTargetDistance] = useState(MAX_RANGE * 0.8)

  const gameState = useRef({
    health: 3,
    score: 0,
    projectile: { x: 0, y: 0, vx: 0, vy: 0, active: false, time: 0 },
    target: { x: 0, width: 60 },
  })

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      return
    }

    gameState.current.health = 3
    gameState.current.score = 0
    onHealthUpdate(3)
    onScoreUpdate(0)

    startLevel(difficultyLevel)

    let lastTime = performance.now()
    const render = (time: number) => {
      const dt = (time - lastTime) / 1000
      lastTime = time

      updatePhysics(dt)
      drawCanvas()

      animationRef.current = requestAnimationFrame(render)
    }

    animationRef.current = requestAnimationFrame(render)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, difficultyLevel])

  const startLevel = (diff: number) => {
    // Generate new target distance based on difficulty
    const newDist = (0.2 + Math.random() * 0.7) * MAX_RANGE
    setTargetDistance(newDist)

    // Narrower target based on difficulty
    const newWidth = Math.max(20, 80 - diff * 5)

    gameState.current.target = { x: newDist, width: newWidth }
    gameState.current.projectile.active = false
    setIsFiring(false)
  }

  const fire = () => {
    if (isFiring || !isPlaying) return

    const rad = (angle * Math.PI) / 180
    gameState.current.projectile = {
      x: 0,
      y: 0,
      vx: V * Math.cos(rad),
      vy: V * Math.sin(rad),
      active: true,
      time: 0,
    }
    setIsFiring(true)
  }

  const updatePhysics = (dt: number) => {
    const proj = gameState.current.projectile
    if (!proj.active) return

    // Standard projectile motion
    proj.time += dt * 3 // speed up simulation
    proj.x = proj.vx * proj.time
    proj.y = proj.vy * proj.time - 0.5 * G * proj.time * proj.time

    // Hit ground
    if (proj.y <= 0 && proj.time > 0.1) {
      proj.y = 0
      proj.active = false
      setIsFiring(false)

      const target = gameState.current.target

      // Check hit
      if (Math.abs(proj.x - target.x) < target.width / 2) {
        // Hit!
        gameState.current.score += 100
        onScoreUpdate(gameState.current.score)
        setTimeout(() => onLevelComplete(), 500)
      } else {
        // Miss!
        gameState.current.health -= 1
        onHealthUpdate(gameState.current.health)
        if (gameState.current.health <= 0) {
          onGameOver(gameState.current.score)
        }
      }
    }
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear
    ctx.clearRect(0, 0, width, height)

    // Coordinate transform: origin at bottom left (50, height - 50)
    const originX = 50
    const originY = height - 50
    const scaleX = (width - 100) / MAX_RANGE
    const scaleY = (height - 100) / (MAX_RANGE / 2) // Max height is V^2/(2g)

    ctx.save()
    ctx.translate(originX, originY)
    ctx.scale(1, -1) // Flip Y

    // Draw trajectory prediction line (dashed)
    if (!isFiring) {
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.4)'
      ctx.setLineDash([5, 5])
      ctx.lineWidth = 2
      const rad = (angle * Math.PI) / 180
      for (let t = 0; t < 20; t += 0.2) {
        const x = V * Math.cos(rad) * t
        const y = V * Math.sin(rad) * t - 0.5 * G * t * t
        if (y < 0 && t > 0) break
        ctx.lineTo(x * scaleX, y * scaleY)
      }
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw Target
    const target = gameState.current.target
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'
    ctx.fillRect((target.x - target.width / 2) * scaleX, 0, target.width * scaleX, 20)

    ctx.fillStyle = 'white'
    ctx.font = '14px Arial'
    ctx.scale(1, -1)
    ctx.fillText(`Target`, (target.x - target.width / 2) * scaleX, -30)
    ctx.scale(1, -1)

    // Draw Catapult/Cannon base
    ctx.fillStyle = '#4f46e5'
    ctx.beginPath()
    ctx.arc(0, 0, 20, 0, Math.PI)
    ctx.fill()

    // Draw Barrel
    ctx.save()
    ctx.rotate((angle * Math.PI) / 180)
    ctx.fillStyle = '#818cf8'
    ctx.fillRect(0, -5, 40, 10)
    ctx.restore()

    // Draw Projectile
    const proj = gameState.current.projectile
    if (proj.active || (!proj.active && isFiring)) {
      ctx.beginPath()
      ctx.arc(proj.x * scaleX, proj.y * scaleY, 6, 0, 2 * Math.PI)
      ctx.fillStyle = '#fde047' // yellow
      ctx.fill()
      ctx.shadowBlur = 10
      ctx.shadowColor = '#fde047'
    }

    ctx.restore()
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
      <div className="w-full aspect-video bg-indigo-950/40 backdrop-blur-md border border-indigo-900 rounded-2xl shadow-[0_0_40px_rgba(30,27,75,0.8)] overflow-hidden relative">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />

        {/* Ground overlay visual */}
        <div className="absolute bottom-0 w-full h-[50px] bg-emerald-950/60 border-t border-emerald-900/50" />
      </div>

      <div className="w-full max-w-md bg-indigo-950/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-800 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-indigo-200 font-bold">Launch Angle (θ)</span>
          <span className="text-sky-400 font-mono text-xl">{angle}°</span>
        </div>

        <input
          type="range"
          min="0"
          max="90"
          step="1"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          disabled={isFiring || !isPlaying}
          className="w-full h-2 bg-indigo-900 rounded-lg appearance-none cursor-pointer accent-sky-400"
        />

        <div className="text-center mt-2">
          <p className="text-sm text-indigo-400 mb-2 font-mono">Range ∝ sin(2θ)</p>
          <button
            onClick={fire}
            disabled={isFiring || !isPlaying}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-black rounded-xl shadow-lg transition-colors active:scale-95"
          >
            {isFiring ? 'TRAJECTORY IN PROGRESS...' : 'FIRE PROJECTILE'}
          </button>
        </div>
      </div>
    </div>
  )
}
