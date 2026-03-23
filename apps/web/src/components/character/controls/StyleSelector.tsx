'use client'

import type { ReactNode } from 'react'

interface Option {
  value: string
  label: string
  icon?: ReactNode
}

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
  label?: string
}

export function StyleSelector({ options, value, onChange, label }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-semibold text-gray-700">{label}</span>}
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                flex flex-col items-center justify-center
                p-3 rounded-2xl transition-all duration-200
                border-2 
                hover:scale-105 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
              aria-pressed={isSelected}
            >
              {option.icon && <div className="mb-1 text-lg">{option.icon}</div>}
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
