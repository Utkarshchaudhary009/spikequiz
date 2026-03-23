import { CANVAS } from "@spikequiz/character-creator/constants";
import type { BodyType } from "@spikequiz/character-creator/types";

export interface BodyProps {
  type: BodyType;
  clothingColor: string;
  skinTone: string;
}

export function Body({ type, clothingColor, skinTone }: BodyProps) {
  const cx = CANVAS.centerX
  const bodyY = CANVAS.bodyY

  const getBodyDimensions = () => {
    switch (type) {
      case 'slim':
        return { width: 50, rx: 20 }
      case 'wide':
        return { width: 80, rx: 30 }
      default:
        return { width: 65, rx: 25 }
    }
  }

  const dims = getBodyDimensions()
  const neckWidth = 20
  const neckHeight = 15
  const torsoHeight = 70

  return (
    <g id="body">
      <rect
        x={cx - neckWidth / 2}
        y={bodyY - torsoHeight - neckHeight + 10}
        width={neckWidth}
        height={neckHeight + 10}
        rx={8}
        fill={skinTone}
      />

      <rect
        x={cx - dims.width / 2}
        y={bodyY - torsoHeight + 10}
        width={dims.width}
        height={torsoHeight}
        rx={dims.rx}
        ry={dims.rx}
        fill={clothingColor}
      />

      <ellipse cx={cx} cy={bodyY - torsoHeight + 18} rx={12} ry={8} fill={skinTone} />
    </g>
  )
}
