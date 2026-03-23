import { CANVAS } from '@spikequiz/character-creator/constants'
import type { CharacterConfig } from '@spikequiz/character-creator/types'

export type EyesProps = CharacterConfig['eyes']

export function Eyes({ style, color, pupilX, pupilY }: EyesProps) {
  const cx = CANVAS.centerX
  const cy = CANVAS.headY

  const leftEyeX = cx - 20
  const rightEyeX = cx + 20
  const eyeY = cy - 5

  const pupilOffsetX = pupilX * 3
  const pupilOffsetY = pupilY * 3

  switch (style) {
    case 'almond':
      return (
        <g id="eyes-almond">
          <ellipse cx={leftEyeX} cy={eyeY} rx={10} ry={7} fill="white" />
          <ellipse cx={rightEyeX} cy={eyeY} rx={10} ry={7} fill="white" />

          <circle cx={leftEyeX + pupilOffsetX} cy={eyeY + pupilOffsetY} r={4} fill={color} />
          <circle cx={rightEyeX + pupilOffsetX} cy={eyeY + pupilOffsetY} r={4} fill={color} />

          <circle
            cx={leftEyeX + pupilOffsetX + 1.5}
            cy={eyeY + pupilOffsetY - 1.5}
            r={1.2}
            fill="white"
          />
          <circle
            cx={rightEyeX + pupilOffsetX + 1.5}
            cy={eyeY + pupilOffsetY - 1.5}
            r={1.2}
            fill="white"
          />
        </g>
      )

    case 'glasses':
      return (
        <g id="eyes-glasses">
          <circle cx={leftEyeX} cy={eyeY} rx={14} ry={14} fill="white" />
          <circle cx={rightEyeX} cy={eyeY} rx={14} ry={14} fill="white" />

          <circle cx={leftEyeX + pupilOffsetX} cy={eyeY + pupilOffsetY} r={5} fill={color} />
          <circle cx={rightEyeX + pupilOffsetX} cy={eyeY + pupilOffsetY} r={5} fill={color} />

          <circle
            cx={leftEyeX + pupilOffsetX + 1.5}
            cy={eyeY + pupilOffsetY - 1.5}
            r={1.5}
            fill="white"
          />
          <circle
            cx={rightEyeX + pupilOffsetX + 1.5}
            cy={eyeY + pupilOffsetY - 1.5}
            r={1.5}
            fill="white"
          />

          <circle cx={leftEyeX} cy={eyeY} r={16} fill="none" stroke="#4B4B4B" strokeWidth={2.5} />
          <circle cx={rightEyeX} cy={eyeY} r={16} fill="none" stroke="#4B4B4B" strokeWidth={2.5} />

          <path
            d={`M ${leftEyeX + 16} ${eyeY} Q ${cx} ${eyeY - 8} ${rightEyeX - 16} ${eyeY}`}
            fill="none"
            stroke="#4B4B4B"
            strokeWidth={2.5}
          />
        </g>
      )

    case 'linear':
      return (
        <g id="eyes-linear">
          <path
            d={`M ${leftEyeX - 8} ${eyeY + 2} Q ${leftEyeX} ${eyeY - 6} ${leftEyeX + 8} ${eyeY + 2}`}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d={`M ${rightEyeX - 8} ${eyeY + 2} Q ${rightEyeX} ${eyeY - 6} ${rightEyeX + 8} ${eyeY + 2}`}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      )

    case 'dots':
      return (
        <g id="eyes-dots">
          <circle cx={leftEyeX} cy={eyeY} r={4} fill={color} />
          <circle cx={rightEyeX} cy={eyeY} r={4} fill={color} />
        </g>
      )

    default:
      return (
        <g id="eyes-round">
          <circle cx={leftEyeX} cy={eyeY} r={10} fill="white" />
          <circle cx={rightEyeX} cy={eyeY} r={10} fill="white" />

          <circle cx={leftEyeX + pupilOffsetX} cy={eyeY + pupilOffsetY} r={5} fill={color} />
          <circle cx={rightEyeX + pupilOffsetX} cy={eyeY + pupilOffsetY} r={5} fill={color} />

          <circle
            cx={leftEyeX + pupilOffsetX + 2}
            cy={eyeY + pupilOffsetY - 2}
            r={1.5}
            fill="white"
          />
          <circle
            cx={rightEyeX + pupilOffsetX + 2}
            cy={eyeY + pupilOffsetY - 2}
            r={1.5}
            fill="white"
          />
        </g>
      )
  }
}
