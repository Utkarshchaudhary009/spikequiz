import { CANVAS } from '@spikequiz/character-creator/constants'
import type { NoseStyle } from '@spikequiz/character-creator/types'

export interface NoseProps {
  style: NoseStyle
  skinTone: string
}

function darkenColor(hex: string, amount: number): string {
  const num = Number.parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount)
  const b = Math.max(0, (num & 0x0000ff) - amount)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export function Nose({ style, skinTone }: NoseProps) {
  const cx = CANVAS.centerX
  const cy = CANVAS.headY

  const noseY = cy + 5
  const noseColor = darkenColor(skinTone, 30)

  switch (style) {
    case 'small':
      return (
        <g id="nose-small">
          <rect
            x={cx - 4}
            y={noseY}
            width={8}
            height={10}
            rx={4}
            fill="none"
            stroke={noseColor}
            strokeWidth={2}
            opacity={0.7}
          />
        </g>
      )

    case 'large':
      return (
        <g id="nose-large">
          <rect
            x={cx - 8}
            y={noseY - 3}
            width={16}
            height={20}
            rx={8}
            fill="none"
            stroke={noseColor}
            strokeWidth={2.5}
            opacity={0.7}
          />
        </g>
      )

    case 'wide':
      return (
        <g id="nose-wide">
          <rect
            x={cx - 10}
            y={noseY}
            width={20}
            height={12}
            rx={6}
            fill="none"
            stroke={noseColor}
            strokeWidth={2.5}
            opacity={0.7}
          />
          <circle cx={cx - 5} cy={noseY + 10} r={3} fill={noseColor} opacity={0.5} />
          <circle cx={cx + 5} cy={noseY + 10} r={3} fill={noseColor} opacity={0.5} />
        </g>
      )

    default:
      return (
        <g id="nose-medium">
          <rect
            x={cx - 6}
            y={noseY - 2}
            width={12}
            height={16}
            rx={6}
            fill="none"
            stroke={noseColor}
            strokeWidth={2.5}
            opacity={0.7}
          />
        </g>
      )
  }
}
