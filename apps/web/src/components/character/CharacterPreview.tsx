'use client'

import { CharacterCanvas } from './CharacterCanvas'
import type { CharacterConfig } from './types'

interface Props {
  config: CharacterConfig
  size?: 'sm' | 'md' | 'lg'
  className?: string
  backgroundColor?: string
}

const sizeClasses = {
  sm: 'w-24 h-28',
  md: 'w-40 h-48',
  lg: 'w-64 h-76',
}

export function CharacterPreview({ config, size = 'md', className = '', backgroundColor }: Props) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-3xl p-4 ${sizeClasses[size]} ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="flex-1 flex items-center justify-center w-full">
        <CharacterCanvas config={config} />
      </div>
      <div
        className="absolute bottom-2 w-3/5 h-3 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, #1a1a1a 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
