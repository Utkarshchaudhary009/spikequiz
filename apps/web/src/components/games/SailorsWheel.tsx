'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type AngleUnit = 'deg' | 'rad'

export interface SailorsWheelProps {
  targetAngle: number
  targetUnit: AngleUnit
  tolerance?: number
  onCorrect?: () => void
  onAttempt?: (userAngle: number, isCorrect: boolean) => void
  size?: number
  showLabels?: boolean
  enableSnap?: boolean
  enableMomentum?: boolean
}

const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI
const SNAP_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]
const SNAP_THRESHOLD = 8
const FRICTION = 0.95
const MIN_VELOCITY = 0.5

function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360
}

function toDegrees(angle: number, unit: AngleUnit): number {
  return unit === 'rad' ? angle * RAD_TO_DEG : angle
}

function findNearestSnap(angle: number): number | null {
  const normalized = normalizeAngle(angle)
  for (const snap of SNAP_ANGLES) {
    let diff = Math.abs(normalized - snap)
    if (diff > 180) diff = 360 - diff
    if (diff <= SNAP_THRESHOLD) return snap
  }
  return null
}

function triggerHaptic() {
  if (navigator.vibrate) {
    navigator.vibrate(10)
  }
}

export function SailorsWheel({
  targetAngle,
  targetUnit,
  tolerance = 5,
  onCorrect,
  onAttempt,
  size = 300,
  showLabels = true,
  enableSnap = true,
  enableMomentum = true,
}: SailorsWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [swayOffset, setSwayOffset] = useState(0)

  const wheelRef = useRef<SVGSVGElement>(null)
  const startAngleRef = useRef(0)
  const startRotationRef = useRef(0)
  const lastAngleRef = useRef(0)
  const lastTimeRef = useRef(0)
  const velocityRef = useRef(0)
  const animationRef = useRef<number | null>(null)
  const lastSnapRef = useRef<number | null>(null)

  // Idle sway animation
  useEffect(() => {
    if (isDragging || animationRef.current) {
      setSwayOffset(0)
      return
    }

    let frame = 0
    const swayAnimation = () => {
      frame++
      setSwayOffset(Math.sin(frame * 0.02) * 2)
      requestAnimationFrame(swayAnimation)
    }
    const id = requestAnimationFrame(swayAnimation)
    return () => cancelAnimationFrame(id)
  }, [isDragging])

  // Momentum animation
  useEffect(() => {
    if (isDragging || !enableMomentum) return

    const animate = () => {
      if (Math.abs(velocityRef.current) < MIN_VELOCITY) {
        velocityRef.current = 0
        animationRef.current = null

        // Final snap
        if (enableSnap) {
          setRotation((prev) => {
            const snap = findNearestSnap(prev)
            return snap !== null ? snap : prev
          })
        }
        return
      }

      velocityRef.current *= FRICTION

      setRotation((prev) => {
        const newRotation = normalizeAngle(prev + velocityRef.current)

        // Snap detection with haptic
        if (enableSnap) {
          const snap = findNearestSnap(newRotation)
          if (snap !== null && snap !== lastSnapRef.current) {
            lastSnapRef.current = snap
            triggerHaptic()
          } else if (snap === null) {
            lastSnapRef.current = null
          }
        }

        return newRotation
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    if (velocityRef.current !== 0) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isDragging, enableMomentum, enableSnap])

  const getAngleFromEvent = useCallback((clientX: number, clientY: number): number => {
    if (!wheelRef.current) return 0
    const rect = wheelRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    return Math.atan2(clientY - centerY, clientX - centerX) * RAD_TO_DEG
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()

      // Stop any ongoing momentum
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      velocityRef.current = 0

      setIsDragging(true)
      setResult(null)

      const angle = getAngleFromEvent(e.clientX, e.clientY)
      startAngleRef.current = angle
      startRotationRef.current = rotation
      lastAngleRef.current = angle
      lastTimeRef.current = performance.now()
      ;(e.target as Element).setPointerCapture(e.pointerId)
    },
    [getAngleFromEvent, rotation],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return

      const currentAngle = getAngleFromEvent(e.clientX, e.clientY)
      const currentTime = performance.now()

      // Calculate delta (fixed direction)
      let delta = currentAngle - startAngleRef.current
      if (delta > 180) delta -= 360
      if (delta < -180) delta += 360

      const newRotation = normalizeAngle(startRotationRef.current + delta)
      setRotation(newRotation)

      // Track velocity for momentum
      const timeDelta = currentTime - lastTimeRef.current
      if (timeDelta > 0) {
        let angleDelta = currentAngle - lastAngleRef.current
        if (angleDelta > 180) angleDelta -= 360
        if (angleDelta < -180) angleDelta += 360
        velocityRef.current = angleDelta / Math.max(timeDelta / 16, 1)
      }

      lastAngleRef.current = currentAngle
      lastTimeRef.current = currentTime

      // Snap haptic feedback while dragging
      if (enableSnap) {
        const snap = findNearestSnap(newRotation)
        if (snap !== null && snap !== lastSnapRef.current) {
          lastSnapRef.current = snap
          triggerHaptic()
        } else if (snap === null) {
          lastSnapRef.current = null
        }
      }
    },
    [isDragging, getAngleFromEvent, enableSnap],
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const checkAnswer = useCallback(() => {
    const targetDeg = normalizeAngle(toDegrees(targetAngle, targetUnit))
    const userAngle = normalizeAngle(rotation)
    let diff = Math.abs(targetDeg - userAngle)
    if (diff > 180) diff = 360 - diff

    const isCorrect = diff <= tolerance
    setResult(isCorrect ? 'correct' : 'wrong')
    onAttempt?.(userAngle, isCorrect)
    if (isCorrect) onCorrect?.()
  }, [rotation, targetAngle, targetUnit, tolerance, onAttempt, onCorrect])

  const spokes = 8
  const spokeAngles = Array.from({ length: spokes }, (_, i) => (i * 360) / spokes)

  const outerRadius = size / 2 - 10
  const ringWidth = 35
  const innerRadius = outerRadius - ringWidth
  const center = size / 2

  const cardinals: { angle: number; label: string }[] = [
    { angle: 0, label: 'N' },
    { angle: 90, label: 'E' },
    { angle: 180, label: 'S' },
    { angle: 270, label: 'W' },
  ]

  const displayRotation = rotation + swayOffset

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Fixed outer ring with angle markings */}
        <svg
          width={size}
          height={size}
          className="absolute top-0 left-0"
          aria-label="Angle markings ring"
        >
          {/* Outer decorative ring */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke="#1e3a5f"
            strokeWidth={ringWidth}
          />
          <circle
            cx={center}
            cy={center}
            r={outerRadius - ringWidth / 2}
            fill="none"
            stroke="#2d4a6f"
            strokeWidth={ringWidth - 4}
          />

          {/* Angle markings on outer ring */}
          {SNAP_ANGLES.map((deg) => {
            const rad = (deg - 90) * DEG_TO_RAD
            const tickInner = outerRadius - ringWidth + 5
            const tickOuter = outerRadius - 5
            const labelR = outerRadius - ringWidth / 2
            const isCardinal = deg % 90 === 0

            return (
              <g key={deg}>
                <line
                  x1={center + tickInner * Math.cos(rad)}
                  y1={center + tickInner * Math.sin(rad)}
                  x2={center + tickOuter * Math.cos(rad)}
                  y2={center + tickOuter * Math.sin(rad)}
                  stroke={isCardinal ? '#fbbf24' : '#94a3b8'}
                  strokeWidth={isCardinal ? 3 : 2}
                />
                {showLabels && (
                  <text
                    x={center + labelR * Math.cos(rad)}
                    y={center + labelR * Math.sin(rad)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isCardinal ? 12 : 9}
                    fill={isCardinal ? '#fbbf24' : '#cbd5e1'}
                    fontWeight="bold"
                  >
                    {deg}°
                  </text>
                )}
              </g>
            )
          })}

          {/* Cardinal directions */}
          {cardinals.map(({ angle, label }) => {
            const rad = (angle - 90) * DEG_TO_RAD
            const labelR = outerRadius + 2
            return (
              <text
                key={label}
                x={center + labelR * Math.cos(rad)}
                y={center + labelR * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fill="#fbbf24"
                fontWeight="bold"
              >
                {label}
              </text>
            )
          })}
        </svg>

        {/* Rotatable wheel */}
        <svg
          ref={wheelRef}
          width={size}
          height={size}
          className={`absolute top-0 left-0 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: 'none' }}
          aria-label="Rotatable sailor's wheel for angle selection"
        >
          <g transform={`rotate(${displayRotation}, ${center}, ${center})`}>
            {/* Inner wheel background */}
            <circle cx={center} cy={center} r={innerRadius - 5} fill="#fef3c7" />
            <circle
              cx={center}
              cy={center}
              r={innerRadius - 5}
              fill="none"
              stroke="#92400e"
              strokeWidth="3"
            />

            {/* Wheel spokes */}
            {spokeAngles.map((deg) => {
              const rad = (deg - 90) * DEG_TO_RAD
              const spokeLength = innerRadius - 25
              return (
                <line
                  key={deg}
                  x1={center}
                  y1={center}
                  x2={center + spokeLength * Math.cos(rad)}
                  y2={center + spokeLength * Math.sin(rad)}
                  stroke="#92400e"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              )
            })}

            {/* Spoke handles */}
            {spokeAngles.map((deg) => {
              const rad = (deg - 90) * DEG_TO_RAD
              const handleDist = innerRadius - 30
              return (
                <circle
                  key={`handle-${deg}`}
                  cx={center + handleDist * Math.cos(rad)}
                  cy={center + handleDist * Math.sin(rad)}
                  r="10"
                  fill="#78350f"
                  stroke="#451a03"
                  strokeWidth="2"
                />
              )
            })}

            {/* Center hub */}
            <circle
              cx={center}
              cy={center}
              r="25"
              fill="#92400e"
              stroke="#78350f"
              strokeWidth="4"
            />
            <circle cx={center} cy={center} r="10" fill="#78350f" />

            {/* Arrow pointer on wheel (pointing up/0°) */}
            <g transform={`translate(${center}, ${center})`}>
              <polygon
                points="0,-85 -12,-55 0,-65 12,-55"
                fill="#ef4444"
                stroke="#b91c1c"
                strokeWidth="2"
              />
              <circle cx="0" cy="-75" r="4" fill="#fbbf24" />
            </g>
          </g>
        </svg>
      </div>

      {/* Info display */}
      <div className="text-center space-y-2">
        <p className="text-lg font-mono">
          Current: <span className="font-bold">{rotation.toFixed(1)}°</span>
          <span className="text-gray-500 ml-2">({(rotation * DEG_TO_RAD).toFixed(3)} rad)</span>
        </p>
        <p className="text-sm text-gray-600">
          Target:{' '}
          <span className="font-semibold">
            {targetAngle} {targetUnit}
          </span>
        </p>
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={checkAnswer}
        className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
      >
        Check Answer
      </button>

      {/* Result feedback */}
      {result && (
        <div
          className={`px-4 py-2 rounded-lg font-bold ${
            result === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {result === 'correct' ? '🎉 Correct!' : '❌ Try again!'}
        </div>
      )}
    </div>
  )
}
