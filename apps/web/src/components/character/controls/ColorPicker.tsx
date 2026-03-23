'use client'

import { Check } from 'lucide-react'

interface Props {
  colors: string[]
  value: string
  onChange: (color: string) => void
  label?: string
}

export function ColorPicker({ colors, value, onChange, label }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-semibold text-gray-700">{label}</span>}
      <div className="grid grid-cols-6 gap-2">
        {colors.map((color) => {
          const isSelected = value === color
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`
                w-10 h-10 rounded-xl transition-all duration-200
                flex items-center justify-center
                hover:scale-110 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isSelected ? 'ring-3 ring-blue-500 ring-offset-2 scale-110' : ''}
              `}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <Check
                  className="w-5 h-5"
                  style={{
                    color: isLightColor(color) ? '#1a1a1a' : '#ffffff',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function isLightColor(hex: string): boolean {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}
