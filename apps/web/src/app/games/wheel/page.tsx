'use client'

import { useState } from 'react'
import { type AngleUnit, SailorsWheel } from '@/components/games/SailorsWheel'

type GameMode = 'deg-to-rad' | 'rad-to-deg' | 'allied' | 'trig-ratio'

const GAME_MODES: { id: GameMode; label: string }[] = [
  { id: 'deg-to-rad', label: 'Degree → Radian' },
  { id: 'rad-to-deg', label: 'Radian → Degree' },
  { id: 'allied', label: 'Allied Angles' },
  { id: 'trig-ratio', label: 'Trig Ratio → Angle' },
]

function generateQuestion(mode: GameMode): {
  prompt: string
  targetAngle: number
  targetUnit: AngleUnit
  displayUnit: AngleUnit
} {
  const commonAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]
  const randomAngle = commonAngles[Math.floor(Math.random() * commonAngles.length)]
  const radValue = (randomAngle * Math.PI) / 180

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

  switch (mode) {
    case 'deg-to-rad':
      return {
        prompt: `Point to ${RADIAN_LABELS[randomAngle] || radValue.toFixed(4)} rad`,
        targetAngle: randomAngle,
        targetUnit: 'deg',
        displayUnit: 'rad',
      }
    case 'rad-to-deg':
      return {
        prompt: `Point to ${randomAngle}°`,
        targetAngle: randomAngle,
        targetUnit: 'deg',
        displayUnit: 'deg',
      }
    case 'allied': {
      const baseAngle = [30, 45, 60][Math.floor(Math.random() * 3)]
      const quadrant = Math.floor(Math.random() * 4)
      const alliedAngle =
        quadrant === 0
          ? baseAngle
          : quadrant === 1
            ? 180 - baseAngle
            : quadrant === 2
              ? 180 + baseAngle
              : 360 - baseAngle
      return {
        prompt: `Point to the allied angle of ${baseAngle}° in Q${quadrant + 1}`,
        targetAngle: alliedAngle,
        targetUnit: 'deg',
        displayUnit: 'deg',
      }
    }
    case 'trig-ratio': {
      const angles = [30, 45, 60]
      const angle = angles[Math.floor(Math.random() * angles.length)]
      const funcs = ['sin', 'cos', 'tan'] as const
      const func = funcs[Math.floor(Math.random() * funcs.length)]
      const values: Record<typeof func, Record<number, string>> = {
        sin: { 30: '1/2', 45: '√2/2', 60: '√3/2' },
        cos: { 30: '√3/2', 45: '√2/2', 60: '1/2' },
        tan: { 30: '1/√3', 45: '1', 60: '√3' },
      }
      return {
        prompt: `${func}(θ) = ${values[func][angle]}. Point to θ`,
        targetAngle: angle,
        targetUnit: 'deg',
        displayUnit: 'deg',
      }
    }
  }
}

export default function WheelGamePage() {
  const [mode, setMode] = useState<GameMode>('deg-to-rad')
  const [question, setQuestion] = useState(() => generateQuestion(mode))
  const [score, setScore] = useState(0)

  const handleCorrect = () => {
    setScore((s) => s + 1)
    setTimeout(() => {
      setQuestion(generateQuestion(mode))
    }, 1000)
  }

  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode)
    setQuestion(generateQuestion(newMode))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-amber-900 dark:text-amber-100">
          🧭 Sailor's Wheel
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Rotate the wheel to point to the correct angle!
        </p>

        {/* Mode selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {GAME_MODES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleModeChange(id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                mode === id
                  ? 'bg-amber-600 text-white'
                  : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-amber-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Score */}
        <div className="text-center mb-4">
          <span className="text-lg font-bold text-amber-800 dark:text-amber-200">
            Score: {score}
          </span>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 shadow-lg">
          <p className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">
            {question.prompt}
          </p>
        </div>

        {/* Wheel */}
        <div className="flex justify-center">
          <SailorsWheel
            key={question.prompt}
            targetAngle={question.targetAngle}
            targetUnit={question.targetUnit}
            displayUnit={question.displayUnit}
            tolerance={8}
            onCorrect={handleCorrect}
            size={320}
          />
        </div>
      </div>
    </div>
  )
}
