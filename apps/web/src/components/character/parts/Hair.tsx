import type { CharacterConfig } from '../types';

export function Hair({ config }: { config: CharacterConfig }) {
  const { hairStyle, hairColor, bodyShape } = config;

  // We slightly adjust Y position based on body shape if needed, but for a simple preview,
  // we can use a base position that generally fits all.
  const getOffsetY = () => {
    if (bodyShape === 'square') return -5;
    if (bodyShape === 'oval') return 5;
    return 0;
  };
  const offsetY = getOffsetY();

  if (hairStyle === 'none') {
    return null;
  }

  switch (hairStyle) {
    case 'wavy':
      return (
        <g id="hair-wavy" transform={`translate(0, ${offsetY})`}>
          <path
            d="M 50 100 C 40 70, 70 40, 100 45 C 130 40, 160 70, 150 100 C 160 120, 130 140, 140 160 C 130 160, 120 140, 110 150 C 90 140, 80 150, 70 140 C 50 140, 40 120, 50 100 Z"
            fill={hairColor}
          />
        </g>
      );
    case 'bob':
      return (
        <g id="hair-bob" transform={`translate(0, ${offsetY})`}>
          <path
            d="M 45 100 C 45 50, 155 50, 155 100 L 155 130 C 155 140, 140 145, 130 135 L 130 100 C 130 70, 70 70, 70 100 L 70 135 C 60 145, 45 140, 45 130 Z"
            fill={hairColor}
          />
          {/* Bangs */}
          <path d="M 60 70 Q 100 90 140 70 Q 100 50 60 70" fill={hairColor} opacity="0.9" />
        </g>
      );
    case 'spiky':
    default:
      return (
        <g id="hair-spiky" transform={`translate(0, ${offsetY})`}>
          <path
            d="M 55 90 L 45 60 L 70 70 L 80 40 L 100 65 L 120 40 L 130 70 L 155 60 L 145 90 Q 100 110 55 90 Z"
            fill={hairColor}
          />
        </g>
      );
  }
}
