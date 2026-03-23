import type { MouthStyle } from "@spikequiz/character-creator/types";
import { CANVAS } from "@spikequiz/character-creator/constants";

export interface MouthProps {
  style: MouthStyle;
}

export function Mouth({ style }: MouthProps) {
  const cx = CANVAS.centerX;
  const cy = CANVAS.headY;

  const mouthY = cy + 20;
  const mouthColor = "#4A3B32";
  const tongueColor = "#FF8A8A";

  switch (style) {
    case "grin":
      return (
        <g id="mouth-grin">
          <path
            d={`
              M ${cx - 18} ${mouthY - 2}
              Q ${cx - 5} ${mouthY + 18} ${cx + 20} ${mouthY}
            `}
            fill="none"
            stroke={mouthColor}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <ellipse
            cx={cx + 2}
            cy={mouthY + 8}
            rx={12}
            ry={8}
            fill="white"
            opacity={0.9}
          />
        </g>
      );

    case "neutral":
      return (
        <g id="mouth-neutral">
          <path
            d={`M ${cx - 12} ${mouthY + 2} Q ${cx} ${mouthY + 5} ${cx + 14} ${mouthY}`}
            fill="none"
            stroke={mouthColor}
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        </g>
      );

    case "surprised":
      return (
        <g id="mouth-surprised">
          <ellipse
            cx={cx + 2}
            cy={mouthY + 5}
            rx={10}
            ry={14}
            fill={mouthColor}
          />
        </g>
      );

    case "sad":
      return (
        <g id="mouth-sad">
          <path
            d={`
              M ${cx - 15} ${mouthY + 8}
              Q ${cx} ${mouthY - 5} ${cx + 18} ${mouthY + 6}
            `}
            fill="none"
            stroke={mouthColor}
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        </g>
      );

    case "tongue":
      return (
        <g id="mouth-tongue">
          <path
            d={`
              M ${cx - 15} ${mouthY}
              Q ${cx - 2} ${mouthY + 16} ${cx + 18} ${mouthY - 2}
            `}
            fill="none"
            stroke={mouthColor}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <ellipse
            cx={cx + 5}
            cy={mouthY + 12}
            rx={8}
            ry={10}
            fill={tongueColor}
          />
        </g>
      );

    default:
      return (
        <g id="mouth-smile">
          <path
            d={`
              M ${cx - 15} ${mouthY - 2}
              Q ${cx - 3} ${mouthY + 15} ${cx + 18} ${mouthY - 3}
            `}
            fill="none"
            stroke={mouthColor}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
      );
  }
}
