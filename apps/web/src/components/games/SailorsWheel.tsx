'use client'

import { useCallback, useRef, useState } from 'react'

export type AngleUnit = 'deg' | 'rad'

export interface SailorsWheelProps {
  targetAngle: number
  targetUnit: AngleUnit
  tolerance?: number
  onCorrect?: () => void
  onAttempt?: (userAngle: number, isCorrect: boolean) => void
  size?: number
  showLabels?: boolean
}

const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360
}

function toDegrees(angle: number, unit: AngleUnit): number {
  return unit === 'rad' ? angle * RAD_TO_DEG : angle
}

export function SailorsWheel({
  targetAngle,
  targetUnit,
  tolerance = 5,
  onCorrect,
  onAttempt,
  size = 300,
  showLabels = true,
}: SailorsWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const wheelRef = useRef<SVGSVGElement>(null)
  const startAngleRef = useRef(0)
  const startRotationRef = useRef(0)

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
      setIsDragging(true)
      setResult(null)
      startAngleRef.current = getAngleFromEvent(e.clientX, e.clientY)
      startRotationRef.current = rotation
      ;(e.target as Element).setPointerCapture(e.pointerId)
    },
    [getAngleFromEvent, rotation],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      const currentAngle = getAngleFromEvent(e.clientX, e.clientY)
      const delta = currentAngle - startAngleRef.current
      setRotation(normalizeAngle(startRotationRef.current + delta))
    },
    [isDragging, getAngleFromEvent],
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
  const majorAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]

  const radius = size / 2 - 20
  const center = size / 2

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Fixed indicator arrow at top */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-2 z-10"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        >
          <svg width="24" height="32" viewBox="0 0 24 32" aria-label="Indicator arrow">
            <polygon points="12,32 0,0 24,0" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
          </svg>
        </div>

        {/* Rotatable wheel */}
        <svg
          ref={wheelRef}
          width={size}
          height={size}
          className={`cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: 'none' }}
          aria-label="Rotatable sailor's wheel for angle selection"
        >
          <g transform={`rotate(${-rotation}, ${center}, ${center})`}>
            {/* Outer ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#78350f"
              strokeWidth="12"
            />
            <circle
              cx={center}
              cy={center}
              r={radius - 8}
              fill="#fef3c7"
              stroke="#92400e"
              strokeWidth="2"
            />

            {/* Degree markings */}
            {majorAngles.map((deg) => {
              const rad = (deg - 90) * DEG_TO_RAD
              const innerR = radius - 25
              const outerR = radius - 10
              return (
                <g key={deg}>
                  <line
                    x1={center + innerR * Math.cos(rad)}
                    y1={center + innerR * Math.sin(rad)}
                    x2={center + outerR * Math.cos(rad)}
                    y2={center + outerR * Math.sin(rad)}
                    stroke="#78350f"
                    strokeWidth="2"
                  />
                  {showLabels && (
                    <text
                      x={center + (innerR - 15) * Math.cos(rad)}
                      y={center + (innerR - 15) * Math.sin(rad)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="10"
                      fill="#78350f"
                      fontWeight="bold"
                    >
                      {deg}°
                    </text>
                  )}
                </g>
              )
            })}

            {/* Wheel spokes */}
            {spokeAngles.map((deg) => {
              const rad = (deg - 90) * DEG_TO_RAD
              return (
                <line
                  key={deg}
                  x1={center}
                  y1={center}
                  x2={center + (radius - 30) * Math.cos(rad)}
                  y2={center + (radius - 30) * Math.sin(rad)}
                  stroke="#92400e"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              )
            })}

            {/* Spoke handles */}
            {spokeAngles.map((deg) => {
              const rad = (deg - 90) * DEG_TO_RAD
              return (
                <circle
                  key={`handle-${deg}`}
                  cx={center + (radius - 35) * Math.cos(rad)}
                  cy={center + (radius - 35) * Math.sin(rad)}
                  r="8"
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
              r="20"
              fill="#92400e"
              stroke="#78350f"
              strokeWidth="3"
            />
            <circle cx={center} cy={center} r="8" fill="#78350f" />
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
