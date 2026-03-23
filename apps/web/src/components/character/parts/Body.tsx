import type { CharacterConfig } from '../types';

export function Body({ config }: { config: CharacterConfig }) {
  const { bodyShape, skinColor } = config;

  // Base viewbox is 200x200. Centered at (100, 100).
  switch (bodyShape) {
    case 'square':
      return (
        <g id="body-square">
          <rect x="60" y="70" width="80" height="90" rx="20" fill={skinColor} />
          {/* Neck & Shoulders placeholder */}
          <path d="M70 150 Q100 190 130 150 L140 200 L60 200 Z" fill={skinColor} opacity="0.8" />
        </g>
      );
    case 'oval':
      return (
        <g id="body-oval">
          <ellipse cx="100" cy="110" rx="40" ry="50" fill={skinColor} />
          {/* Neck & Shoulders placeholder */}
          <path d="M75 145 Q100 180 125 145 L140 200 L60 200 Z" fill={skinColor} opacity="0.8" />
        </g>
      );
    case 'round':
    default:
      return (
        <g id="body-round">
          <circle cx="100" cy="100" r="45" fill={skinColor} />
          {/* Neck & Shoulders placeholder */}
          <path d="M75 135 Q100 170 125 135 L145 200 L55 200 Z" fill={skinColor} opacity="0.8" />
        </g>
      );
  }
}
