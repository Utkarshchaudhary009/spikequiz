import { CANVAS } from '@spikequiz/character-creator/constants'
import type { EyebrowStyle } from '@spikequiz/character-creator/types'

export interface EyebrowsProps {
  style: EyebrowStyle
  color: string
}

export function Eyebrows({ style, color }: EyebrowsProps) {
  const cx = CANVAS.centerX
  const cy = CANVAS.headY

  const leftX = cx - 20
  const rightX = cx + 20
  const browY = cy - 20

  switch (style) {
    case 'thick':
      return (
        <g id="eyebrows-thick">
          <path
            d={`M ${leftX - 10} ${browY + 2} Q ${leftX} ${browY - 4} ${leftX + 12} ${browY}`}
            fill="none"
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
          />
          <path
            d={`M ${rightX - 12} ${browY} Q ${rightX} ${browY - 4} ${rightX + 10} ${browY + 2}`}
            fill="none"
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
          />
        </g>
      )

    case 'thin':
      return (
        <g id="eyebrows-thin">
          <path
            d={`M ${leftX - 8} ${browY} Q ${leftX} ${browY - 3} ${leftX + 10} ${browY - 1}`}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <path
            d={`M ${rightX - 10} ${browY - 1} Q ${rightX} ${browY - 3} ${rightX + 8} ${browY}`}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </g>
      )

    case 'arched':
      return (
        <g id="eyebrows-arched">
          <path
            d={`M ${leftX - 10} ${browY + 4} Q ${leftX - 2} ${browY - 8} ${leftX + 10} ${browY + 2}`}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d={`M ${rightX - 10} ${browY + 2} Q ${rightX + 2} ${browY - 8} ${rightX + 10} ${browY + 4}`}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      )

    case 'angry':
      return (
        <g id="eyebrows-angry">
          <path
            d={`M ${leftX - 10} ${browY - 3} L ${leftX + 10} ${browY + 5}`}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <path
            d={`M ${rightX - 10} ${browY + 5} L ${rightX + 10} ${browY - 3}`}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
      )

    default:
      return (
        <g id="eyebrows-normal">
          <path
            d={`M ${leftX - 10} ${browY + 1} Q ${leftX} ${browY - 3} ${leftX + 10} ${browY}`}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d={`M ${rightX - 10} ${browY} Q ${rightX} ${browY - 3} ${rightX + 10} ${browY + 1}`}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      )
  }
}
