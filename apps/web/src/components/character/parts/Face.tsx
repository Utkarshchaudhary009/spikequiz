import { CANVAS } from '@spikequiz/character-creator/constants'
import type { FaceShape } from '@spikequiz/character-creator/types'

export interface FaceProps {
  shape: FaceShape
  skinTone: string
}

export function Face({ shape, skinTone }: FaceProps) {
  const cx = CANVAS.centerX
  const cy = CANVAS.headY
  const blushColor = '#FF8A8A'
  const blushOpacity = 0.35

  const renderFaceShape = () => {
    switch (shape) {
      case 'oval':
        return <ellipse cx={cx} cy={cy} rx={42} ry={50} fill={skinTone} />

      case 'square':
        return (
          <rect x={cx - 40} y={cy - 45} width={80} height={85} rx={18} ry={18} fill={skinTone} />
        )

      case 'heart':
        return (
          <path
            d={`
              M ${cx} ${cy + 50}
              Q ${cx - 35} ${cy + 20} ${cx - 42} ${cy - 10}
              Q ${cx - 44} ${cy - 40} ${cx - 20} ${cy - 45}
              Q ${cx} ${cy - 48} ${cx} ${cy - 35}
              Q ${cx} ${cy - 48} ${cx + 20} ${cy - 45}
              Q ${cx + 44} ${cy - 40} ${cx + 42} ${cy - 10}
              Q ${cx + 35} ${cy + 20} ${cx} ${cy + 50}
              Z
            `}
            fill={skinTone}
          />
        )

      default:
        return <circle cx={cx} cy={cy} r={46} fill={skinTone} />
    }
  }

  const getBlushPositions = () => {
    switch (shape) {
      case 'oval':
        return { leftX: cx - 32, rightX: cx + 32, y: cy + 15 }
      case 'square':
        return { leftX: cx - 28, rightX: cx + 28, y: cy + 12 }
      case 'heart':
        return { leftX: cx - 30, rightX: cx + 30, y: cy + 5 }
      default:
        return { leftX: cx - 34, rightX: cx + 34, y: cy + 12 }
    }
  }

  const blushPos = getBlushPositions()

  return (
    <g id="face">
      {renderFaceShape()}

      <ellipse
        cx={blushPos.leftX}
        cy={blushPos.y}
        rx={10}
        ry={6}
        fill={blushColor}
        opacity={blushOpacity}
      />
      <ellipse
        cx={blushPos.rightX}
        cy={blushPos.y}
        rx={10}
        ry={6}
        fill={blushColor}
        opacity={blushOpacity}
      />
    </g>
  )
}
