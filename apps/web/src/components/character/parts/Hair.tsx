import { CANVAS } from '@spikequiz/character-creator/constants'
import type { CharacterConfig } from '@spikequiz/character-creator/types'

export type HairProps = CharacterConfig['hair']

export function Hair({ style, color, facialHair, facialHairColor }: HairProps) {
  const cx = CANVAS.centerX
  const cy = CANVAS.headY

  const renderFacialHair = () => {
    if (facialHair === 'none') return null

    const facialY = cy + 35

    switch (facialHair) {
      case 'stubble':
        return (
          <g id="facial-stubble" opacity={0.4}>
            <ellipse cx={cx} cy={facialY} rx={25} ry={12} fill={facialHairColor} />
          </g>
        )

      case 'beard':
        return (
          <g id="facial-beard">
            <path
              d={`
                M ${cx - 35} ${cy + 15}
                Q ${cx - 40} ${facialY + 5} ${cx - 30} ${facialY + 20}
                Q ${cx} ${facialY + 35} ${cx + 30} ${facialY + 20}
                Q ${cx + 40} ${facialY + 5} ${cx + 35} ${cy + 15}
                Q ${cx + 25} ${cy + 25} ${cx} ${cy + 28}
                Q ${cx - 25} ${cy + 25} ${cx - 35} ${cy + 15}
                Z
              `}
              fill={facialHairColor}
            />
          </g>
        )

      case 'goatee':
        return (
          <g id="facial-goatee">
            <ellipse cx={cx} cy={facialY + 8} rx={12} ry={18} fill={facialHairColor} />
          </g>
        )

      case 'mustache':
        return (
          <g id="facial-mustache">
            <path
              d={`
                M ${cx - 20} ${cy + 22}
                Q ${cx - 10} ${cy + 18} ${cx} ${cy + 20}
                Q ${cx + 10} ${cy + 18} ${cx + 20} ${cy + 22}
                Q ${cx + 12} ${cy + 28} ${cx} ${cy + 26}
                Q ${cx - 12} ${cy + 28} ${cx - 20} ${cy + 22}
                Z
              `}
              fill={facialHairColor}
            />
          </g>
        )
    }
  }

  const renderHairStyle = () => {
    switch (style) {
      case 'none':
        return null

      case 'buzz':
        return (
          <g id="hair-buzz">
            <ellipse cx={cx} cy={cy - 30} rx={40} ry={20} fill={color} opacity={0.6} />
          </g>
        )

      case 'curly-short':
        return (
          <g id="hair-curly-short">
            <circle cx={cx - 25} cy={cy - 40} r={15} fill={color} />
            <circle cx={cx} cy={cy - 45} r={16} fill={color} />
            <circle cx={cx + 25} cy={cy - 40} r={15} fill={color} />
            <circle cx={cx - 15} cy={cy - 35} r={12} fill={color} />
            <circle cx={cx + 15} cy={cy - 35} r={12} fill={color} />
          </g>
        )

      case 'spiky':
        return (
          <g id="hair-spiky">
            <path
              d={`
                M ${cx - 40} ${cy - 25}
                L ${cx - 50} ${cy - 60}
                L ${cx - 25} ${cy - 40}
                L ${cx - 15} ${cy - 70}
                L ${cx} ${cy - 45}
                L ${cx + 15} ${cy - 70}
                L ${cx + 25} ${cy - 40}
                L ${cx + 50} ${cy - 60}
                L ${cx + 40} ${cy - 25}
                Q ${cx} ${cy - 15} ${cx - 40} ${cy - 25}
                Z
              `}
              fill={color}
            />
          </g>
        )

      case 'slick-back':
        return (
          <g id="hair-slick-back">
            <path
              d={`
                M ${cx - 42} ${cy - 20}
                Q ${cx - 45} ${cy - 50} ${cx} ${cy - 55}
                Q ${cx + 45} ${cy - 50} ${cx + 42} ${cy - 20}
                Q ${cx} ${cy - 25} ${cx - 42} ${cy - 20}
                Z
              `}
              fill={color}
            />
          </g>
        )

      case 'pompadour':
        return (
          <g id="hair-pompadour">
            <path
              d={`
                M ${cx - 38} ${cy - 25}
                Q ${cx - 40} ${cy - 45} ${cx - 20} ${cy - 65}
                Q ${cx} ${cy - 80} ${cx + 20} ${cy - 65}
                Q ${cx + 40} ${cy - 45} ${cx + 38} ${cy - 25}
                Q ${cx} ${cy - 35} ${cx - 38} ${cy - 25}
                Z
              `}
              fill={color}
            />
          </g>
        )

      case 'mohawk':
        return (
          <g id="hair-mohawk">
            <path
              d={`
                M ${cx - 10} ${cy - 30}
                L ${cx - 12} ${cy - 80}
                Q ${cx} ${cy - 90} ${cx + 12} ${cy - 80}
                L ${cx + 10} ${cy - 30}
                Q ${cx} ${cy - 35} ${cx - 10} ${cy - 30}
                Z
              `}
              fill={color}
            />
          </g>
        )

      case 'fade':
        return (
          <g id="hair-fade">
            <ellipse cx={cx} cy={cy - 35} rx={32} ry={18} fill={color} />
            <ellipse cx={cx} cy={cy - 25} rx={38} ry={12} fill={color} opacity={0.5} />
          </g>
        )

      case 'bob':
        return (
          <g id="hair-bob">
            <path
              d={`
                M ${cx - 45} ${cy - 25}
                Q ${cx - 48} ${cy - 55} ${cx} ${cy - 58}
                Q ${cx + 48} ${cy - 55} ${cx + 45} ${cy - 25}
                L ${cx + 45} ${cy + 25}
                Q ${cx + 40} ${cy + 30} ${cx + 30} ${cy + 25}
                L ${cx + 25} ${cy - 10}
                Q ${cx} ${cy - 5} ${cx - 25} ${cy - 10}
                L ${cx - 30} ${cy + 25}
                Q ${cx - 40} ${cy + 30} ${cx - 45} ${cy + 25}
                Z
              `}
              fill={color}
            />
            <path
              d={`M ${cx - 30} ${cy - 35} Q ${cx} ${cy - 25} ${cx + 30} ${cy - 35}`}
              fill={color}
            />
          </g>
        )

      case 'long-straight':
        return (
          <g id="hair-long-straight">
            <path
              d={`
                M ${cx - 48} ${cy - 25}
                Q ${cx - 50} ${cy - 55} ${cx} ${cy - 58}
                Q ${cx + 50} ${cy - 55} ${cx + 48} ${cy - 25}
                L ${cx + 50} ${cy + 70}
                Q ${cx + 45} ${cy + 80} ${cx + 35} ${cy + 75}
                L ${cx + 30} ${cy + 10}
                Q ${cx} ${cy + 15} ${cx - 30} ${cy + 10}
                L ${cx - 35} ${cy + 75}
                Q ${cx - 45} ${cy + 80} ${cx - 50} ${cy + 70}
                Z
              `}
              fill={color}
            />
          </g>
        )

      case 'long-wavy':
        return (
          <g id="hair-long-wavy">
            <path
              d={`
                M ${cx - 48} ${cy - 25}
                Q ${cx - 50} ${cy - 55} ${cx} ${cy - 58}
                Q ${cx + 50} ${cy - 55} ${cx + 48} ${cy - 25}
                Q ${cx + 55} ${cy + 10} ${cx + 45} ${cy + 35}
                Q ${cx + 55} ${cy + 55} ${cx + 40} ${cy + 75}
                Q ${cx + 35} ${cy + 80} ${cx + 25} ${cy + 70}
                Q ${cx + 35} ${cy + 50} ${cx + 25} ${cy + 30}
                Q ${cx + 15} ${cy + 15} ${cx} ${cy + 20}
                Q ${cx - 15} ${cy + 15} ${cx - 25} ${cy + 30}
                Q ${cx - 35} ${cy + 50} ${cx - 25} ${cy + 70}
                Q ${cx - 35} ${cy + 80} ${cx - 40} ${cy + 75}
                Q ${cx - 55} ${cy + 55} ${cx - 45} ${cy + 35}
                Q ${cx - 55} ${cy + 10} ${cx - 48} ${cy - 25}
                Z
              `}
              fill={color}
            />
          </g>
        )

      case 'ponytail':
        return (
          <g id="hair-ponytail">
            <path
              d={`
                M ${cx - 42} ${cy - 25}
                Q ${cx - 45} ${cy - 55} ${cx} ${cy - 55}
                Q ${cx + 45} ${cy - 55} ${cx + 42} ${cy - 25}
                Q ${cx} ${cy - 20} ${cx - 42} ${cy - 25}
                Z
              `}
              fill={color}
            />
            <ellipse cx={cx} cy={cy - 45} rx={15} ry={10} fill={color} />
            <path
              d={`
                M ${cx - 8} ${cy - 50}
                Q ${cx + 20} ${cy - 60} ${cx + 15} ${cy - 100}
                Q ${cx + 25} ${cy - 110} ${cx + 35} ${cy - 100}
                Q ${cx + 40} ${cy - 60} ${cx + 8} ${cy - 50}
                Z
              `}
              fill={color}
            />
          </g>
        )

      case 'pigtails':
        return (
          <g id="hair-pigtails">
            <path
              d={`
                M ${cx - 42} ${cy - 25}
                Q ${cx - 45} ${cy - 55} ${cx} ${cy - 55}
                Q ${cx + 45} ${cy - 55} ${cx + 42} ${cy - 25}
                Q ${cx} ${cy - 20} ${cx - 42} ${cy - 25}
                Z
              `}
              fill={color}
            />
            <ellipse cx={cx - 40} cy={cy - 20} rx={12} ry={8} fill={color} />
            <ellipse cx={cx + 40} cy={cy - 20} rx={12} ry={8} fill={color} />
            <ellipse cx={cx - 55} cy={cy + 15} rx={15} ry={35} fill={color} />
            <ellipse cx={cx + 55} cy={cy + 15} rx={15} ry={35} fill={color} />
          </g>
        )

      case 'bun':
        return (
          <g id="hair-bun">
            <path
              d={`
                M ${cx - 42} ${cy - 25}
                Q ${cx - 45} ${cy - 55} ${cx} ${cy - 55}
                Q ${cx + 45} ${cy - 55} ${cx + 42} ${cy - 25}
                Q ${cx} ${cy - 20} ${cx - 42} ${cy - 25}
                Z
              `}
              fill={color}
            />
            <circle cx={cx} cy={cy - 70} r={20} fill={color} />
          </g>
        )
    }
  }

  return (
    <g id="hair">
      {renderHairStyle()}
      {renderFacialHair()}
    </g>
  )
}
