'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type AngleUnit = 'deg' | 'rad'

export interface SailorsWheelProps {
  targetAngle: number
  targetUnit: AngleUnit
  displayUnit?: AngleUnit
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
const SNAP_THRESHOLD = 12
const FRICTION = 0.95
const MIN_VELOCITY = 0.5

const RADIAN_LABELS: Record<number, string> = {
  0: '0',
  30: 'π/6',
  45: 'π/4',
  60: 'π/3',
  90: 'π/2',
  120: '2π/3',
  135: '3π/4',
  150: '5π/6',
  180: 'π',
  210: '7π/6',
  225: '5π/4',
  240: '4π/3',
  270: '3π/2',
  300: '5π/3',
  315: '7π/4',
  330: '11π/6',
}

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

function getDistanceToNearestSnap(angle: number): { snap: number; distance: number } | null {
  const normalized = normalizeAngle(angle)
  let nearest: { snap: number; distance: number } | null = null

  for (const snap of SNAP_ANGLES) {
    let diff = Math.abs(normalized - snap)
    if (diff > 180) diff = 360 - diff
    if (nearest === null || diff < nearest.distance) {
      nearest = { snap, distance: diff }
    }
  }
  return nearest
}

function triggerHaptic() {
  if (navigator.vibrate) {
    navigator.vibrate(10)
  }
}

export function SailorsWheel({
  targetAngle,
  targetUnit,
  displayUnit = 'deg',
  tolerance = 8,
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

  const nearestSnapInfo = getDistanceToNearestSnap(rotation)
  const isNearSnap = nearestSnapInfo && nearestSnapInfo.distance <= SNAP_THRESHOLD
  const snappedAngle = isNearSnap ? nearestSnapInfo.snap : rotation

  // Idle sway animation
  useEffect(() => {
    if (isDragging || animationRef.current) {
      setSwayOffset(0)
      return
    }

    let frame = 0
    const swayAnimation = () => {
      frame++
      setSwayOffset(Math.sin(frame * 0.02) * 1.5)
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

      let delta = currentAngle - startAngleRef.current
      if (delta > 180) delta -= 360
      if (delta < -180) delta += 360

      // Negate delta: screen coordinates have Y inverted, so we flip to match standard math
      const newRotation = normalizeAngle(startRotationRef.current - delta)
      setRotation(newRotation)

      const timeDelta = currentTime - lastTimeRef.current
      if (timeDelta > 0) {
        let angleDelta = currentAngle - lastAngleRef.current
        if (angleDelta > 180) angleDelta -= 360
        if (angleDelta < -180) angleDelta += 360
        velocityRef.current = -angleDelta / Math.max(timeDelta / 16, 1)
      }

      lastAngleRef.current = currentAngle
      lastTimeRef.current = currentTime

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
    // Auto-snap on release
    if (enableSnap) {
      const snap = findNearestSnap(rotation)
      if (snap !== null) {
        setRotation(snap)
        triggerHaptic()
      }
    }
  }, [enableSnap, rotation])

  const checkAnswer = useCallback(() => {
    const targetDeg = normalizeAngle(toDegrees(targetAngle, targetUnit))
    const userAngle = normalizeAngle(snappedAngle)
    let diff = Math.abs(targetDeg - userAngle)
    if (diff > 180) diff = 360 - diff

    const isCorrect = diff <= tolerance
    setResult(isCorrect ? 'correct' : 'wrong')
    onAttempt?.(userAngle, isCorrect)
    if (isCorrect) onCorrect?.()
  }, [snappedAngle, targetAngle, targetUnit, tolerance, onAttempt, onCorrect])

  const spokes = 8
  const spokeAngles = Array.from({ length: spokes }, (_, i) => (i * 360) / spokes)

  const outerRadius = size / 2 - 10
  const ringWidth = 40
  const innerRadius = outerRadius - ringWidth
  const center = size / 2

  const displayRotation = rotation + swayOffset

  // Format angle for display
  const formatAngle = (deg: number, unit: AngleUnit) => {
    if (unit === 'rad') {
      const snapLabel = RADIAN_LABELS[Math.round(deg)]
      if (snapLabel) return snapLabel
      return `${(deg * DEG_TO_RAD).toFixed(2)}`
    }
    return `${deg.toFixed(0)}°`
  }

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
          <defs>
            {/* Glow filter for active angle */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

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

          {/* Angle markings - tick lines with gaps for labels */}
          {SNAP_ANGLES.map((deg) => {
            const rad = -deg * DEG_TO_RAD
            const isQuadrant = deg % 90 === 0
            const isActive = isNearSnap && nearestSnapInfo?.snap === deg

            // Split tick into outer and inner parts with gap for label
            const tickOuterStart = outerRadius - 4
            const tickOuterEnd = outerRadius - 12
            const tickInnerStart = outerRadius - ringWidth + 12
            const tickInnerEnd = outerRadius - ringWidth + 4

            const tickColor = isActive ? '#22c55e' : isQuadrant ? '#fbbf24' : '#64748b'
            const tickWidth = isActive ? 3 : isQuadrant ? 2.5 : 1.5

            return (
              <g key={deg} filter={isActive ? 'url(#glow)' : undefined}>
                {/* Outer tick segment */}
                <line
                  x1={center + tickOuterEnd * Math.cos(rad)}
                  y1={center + tickOuterEnd * Math.sin(rad)}
                  x2={center + tickOuterStart * Math.cos(rad)}
                  y2={center + tickOuterStart * Math.sin(rad)}
                  stroke={tickColor}
                  strokeWidth={tickWidth}
                  strokeLinecap="round"
                />
                {/* Inner tick segment */}
                <line
                  x1={center + tickInnerEnd * Math.cos(rad)}
                  y1={center + tickInnerEnd * Math.sin(rad)}
                  x2={center + tickInnerStart * Math.cos(rad)}
                  y2={center + tickInnerStart * Math.sin(rad)}
                  stroke={tickColor}
                  strokeWidth={tickWidth}
                  strokeLinecap="round"
                />
                {/* Label in the gap */}
                {showLabels && (
                  <text
                    x={center + (outerRadius - ringWidth / 2) * Math.cos(rad)}
                    y={center + (outerRadius - ringWidth / 2) * Math.sin(rad)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isQuadrant ? 11 : 9}
                    fill={isActive ? '#22c55e' : isQuadrant ? '#fbbf24' : '#94a3b8'}
                    fontWeight="bold"
                  >
                    {displayUnit === 'rad' ? RADIAN_LABELS[deg] : `${deg}°`}
                  </text>
                )}
              </g>
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
              const rad = deg * DEG_TO_RAD
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
              const rad = deg * DEG_TO_RAD
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

            {/* Arrow pointer pointing right (0° in standard position) */}
            <g transform={`translate(${center}, ${center})`}>
              <polygon
                points="90,0 60,-14 68,0 60,14"
                fill="#ef4444"
                stroke="#b91c1c"
                strokeWidth="2"
              />
              <circle cx="78" cy="0" r="5" fill="#fbbf24" />
            </g>
          </g>
        </svg>
      </div>

      {/* Info display */}
      <div className="text-center space-y-2">
        <p className="text-xl font-mono">
          <span
            className={`font-bold transition-colors ${isNearSnap ? 'text-green-500' : 'text-gray-800 dark:text-gray-200'}`}
          >
            {formatAngle(snappedAngle, displayUnit)}
          </span>
          {displayUnit === 'deg' && (
            <span className="text-gray-400 ml-2 text-sm">
              ({RADIAN_LABELS[snappedAngle] || `${(snappedAngle * DEG_TO_RAD).toFixed(2)} rad`})
            </span>
          )}
          {displayUnit === 'rad' && (
            <span className="text-gray-400 ml-2 text-sm">({snappedAngle}°)</span>
          )}
        </p>
        <p className="text-sm text-gray-500">
          Target:{' '}
          <span className="font-semibold text-amber-600">
            {targetAngle} {targetUnit}
          </span>
        </p>
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={checkAnswer}
        className={`px-6 py-2 font-bold rounded-lg transition-all ${
          isNearSnap
            ? 'bg-green-500 hover:bg-green-600 text-white scale-105'
            : 'bg-amber-600 hover:bg-amber-700 text-white'
        }`}
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
          {result === 'correct' ? 'Correct!' : 'Try again!'}
        </div>
      )}
    </div>
  )
}
