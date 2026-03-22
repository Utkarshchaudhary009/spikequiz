'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Props {
  gameMode?: 'sin' | 'cos'
  difficultyLevel: number
  isPlaying: boolean
  onGameOver: (score: number) => void
  onScoreUpdate: (score: number) => void
  onHealthUpdate: (health: number) => void
  onLevelComplete: () => void
}

const COMMON_ANGLES = [
  { rad: '0', deg: 0 },
  { rad: 'π/6', deg: 30 },
  { rad: 'π/4', deg: 45 },
  { rad: 'π/3', deg: 60 },
  { rad: 'π/2', deg: 90 },
  { rad: '2π/3', deg: 120 },
  { rad: '3π/4', deg: 135 },
  { rad: '5π/6', deg: 150 },
  { rad: 'π', deg: 180 },
  { rad: '7π/6', deg: 210 },
  { rad: '5π/4', deg: 225 },
  { rad: '4π/3', deg: 240 },
  { rad: '3π/2', deg: 270 },
  { rad: '5π/3', deg: 300 },
  { rad: '7π/4', deg: 315 },
  { rad: '11π/6', deg: 330 },
]

export function DualDial({
  difficultyLevel,
  isPlaying,
  onGameOver,
  onScoreUpdate,
  onHealthUpdate,
  onLevelComplete,
}: Props) {
  const [targetAngle, setTargetAngle] = useState(COMMON_ANGLES[0])
  const [currentRotation, setCurrentRotation] = useState(0) // Degrees
  const [isDragging, setIsDragging] = useState(false)
  const [feedback, setFeedback] = useState<'none' | 'success' | 'error'>('none')

  const containerRef = useRef<HTMLDivElement>(null)
  const gameState = useRef({
    health: 3,
    score: 0,
    roundsCompleted: 0,
  })

  useEffect(() => {
    if (!isPlaying) return

    gameState.current.health = 3
    gameState.current.score = 0
    gameState.current.roundsCompleted = 0
    onHealthUpdate(3)
    onScoreUpdate(0)

    startRound()
  }, [isPlaying])

  const startRound = () => {
    const randomAngle = COMMON_ANGLES[Math.floor(Math.random() * COMMON_ANGLES.length)]
    setTargetAngle(randomAngle)
    setCurrentRotation(Math.floor(Math.random() * 360)) // Random starting position
    setFeedback('none')
  }

  const getAngleFromCenter = (clientX: number, clientY: number) => {
    if (!containerRef.current) return 0
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const dx = clientX - centerX
    const dy = clientY - centerY

    // atan2 gives -PI to PI. Convert to 0-360 degrees.
    let angle = Math.atan2(dy, dx) * (180 / Math.PI)
    // Adjust so 0 is at the top (like a compass/clock) if desired,
    // or keep standard math notation where 0 is right. Let's keep math notation.
    if (angle < 0) angle += 360
    return angle
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isPlaying) return
    setIsDragging(true)
    const angle = getAngleFromCenter(e.clientX, e.clientY)
    // We could track offset, but direct mapping to cursor angle is easier for a dial
    setCurrentRotation(angle)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isPlaying) return
    const angle = getAngleFromCenter(e.clientX, e.clientY)
    setCurrentRotation(angle)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
  }

  const checkUnlock = () => {
    if (!isPlaying) return

    // Normalize both to 0-360
    const normalizedRot = ((currentRotation % 360) + 360) % 360
    // Allow small margin of error (e.g., 5 degrees)
    const errorMargin = Math.max(2, 10 - difficultyLevel)

    const diff = Math.abs(normalizedRot - targetAngle.deg)
    const isCorrect = diff <= errorMargin || diff >= 360 - errorMargin

    if (isCorrect) {
      setFeedback('success')
      gameState.current.score += 100
      gameState.current.roundsCompleted += 1
      onScoreUpdate(gameState.current.score)

      // Snap to exact correct angle
      setCurrentRotation(targetAngle.deg)

      setTimeout(() => {
        if (gameState.current.roundsCompleted >= 3 + Math.floor(difficultyLevel / 2)) {
          onLevelComplete()
        } else {
          startRound()
        }
      }, 1000)
    } else {
      setFeedback('error')
      gameState.current.health -= 1
      onHealthUpdate(gameState.current.health)

      setTimeout(() => setFeedback('none'), 500)

      if (gameState.current.health <= 0) {
        onGameOver(gameState.current.score)
      }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8 select-none">
      {/* Target Display */}
      <div className="bg-amber-950/50 border border-amber-500/30 px-8 py-4 rounded-2xl shadow-[0_0_20px_rgba(217,119,6,0.2)] backdrop-blur-md">
        <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm text-center mb-1">
          Target Radian
        </h3>
        <div className="text-5xl font-black text-amber-100 font-mono tracking-tighter">
          {targetAngle.rad}
        </div>
      </div>

      {/* The Dial */}
      <div
        ref={containerRef}
        className="relative w-80 h-80 rounded-full bg-slate-900 border-4 border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Inner static core */}
        <div className="absolute inset-[15%] rounded-full bg-slate-800 border-[8px] border-slate-950 shadow-inner flex items-center justify-center pointer-events-none">
          <div
            className={`w-full h-full rounded-full transition-colors duration-300 flex items-center justify-center
            ${feedback === 'success' ? 'bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.5)]' : ''}
            ${feedback === 'error' ? 'bg-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.5)]' : ''}
           `}
          >
            <div className="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div>
          </div>
        </div>

        {/* The Rotatable Outer Dial (Degrees) */}
        <div
          className="absolute inset-0 transition-transform pointer-events-none"
          style={{ transform: `rotate(${currentRotation}deg)` }}
        >
          {/* Marks & Numbers on Dial */}
          {[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].map((deg) => {
            const isMajor = deg % 90 === 0
            return (
              <div
                key={deg}
                className="absolute top-1/2 left-1/2 w-full h-[2px] -translate-y-1/2 origin-left"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <div
                  className={`absolute right-2 h-[2px] bg-slate-400 ${isMajor ? 'w-6 bg-amber-400' : 'w-3'}`}
                />
                {isMajor && (
                  <div
                    className="absolute right-10 top-1/2 -translate-y-1/2 font-mono font-bold text-amber-200/80 text-sm transform rotate-90"
                    style={{ transform: `translateY(-50%) rotate(${-deg}deg)` }}
                  >
                    {deg}°
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Readout Indicator (Fixed at 0 degrees - right side) */}
        <div className="absolute top-1/2 right-0 w-8 h-[2px] bg-rose-500 shadow-[0_0_10px_#f43f5e] z-10 pointer-events-none -translate-y-1/2 translate-x-4"></div>
        {/* Indicator Triangle */}
        <div className="absolute top-1/2 -right-6 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-rose-500 -translate-y-1/2 z-10 pointer-events-none"></div>
      </div>

      {/* Unlock Button */}
      <button
        onClick={checkUnlock}
        disabled={!isPlaying || feedback === 'success'}
        className="mt-4 px-12 py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-xl rounded-2xl shadow-[0_10px_0_#92400e] active:shadow-[0_0px_0_#92400e] active:translate-y-[10px] transition-all"
      >
        ATTEMPT UNLOCK
      </button>

      <div className="text-slate-400 font-mono">
        Current Alignment: {Math.round(currentRotation % 360)}°
      </div>
    </div>
  )
}
