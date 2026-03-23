'use client'

import type { CharacterConfig } from '@spikequiz/character-creator/types'
import { CANVAS } from '@spikequiz/character-creator/constants'
import { Body, Eyebrows, Eyes, Face, Hair, Mouth, Nose } from './parts'

interface Props {
  config: CharacterConfig
  className?: string
  animated?: boolean
}

export function CharacterCanvas({ config, className = '', animated = true }: Props) {
  return (
    <div
      className={`relative w-full aspect-[200/240] flex items-center justify-center ${className}`}
    >
      <svg
        viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Character avatar"
        className={`w-full h-full max-w-[400px] max-h-[480px] drop-shadow-md transition-all duration-300 ease-in-out ${animated ? 'animate-breathe' : ''}`}
        style={
          animated
            ? {
                animation: 'breathe 3s ease-in-out infinite',
                transformOrigin: 'center bottom',
              }
            : undefined
        }
      >
        <Body
          type={config.body.type}
          clothingColor={config.body.clothingColor}
          skinTone={config.face.skinTone}
        />
        <Face shape={config.face.shape} skinTone={config.face.skinTone} />
        <Hair {...config.hair} />
        <Nose style={config.nose.style} skinTone={config.face.skinTone} />
        <Eyes {...config.eyes} />
        <Eyebrows style={config.eyebrows.style} color={config.eyebrows.color} />
        <Mouth style={config.mouth.style} />
      </svg>
      <style>
        {`
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
        `}
      </style>
    </div>
  )
}
