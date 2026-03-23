import type { CharacterConfig } from '../types';

export function Accessories({ config }: { config: CharacterConfig }) {
  const { accessory, bodyShape } = config;

  // Adjust Y position based on body shape to align correctly with the face/head
  const getOffsetY = () => {
    if (bodyShape === 'square') return -5;
    if (bodyShape === 'oval') return 5;
    return 0;
  };
  const offsetY = getOffsetY();

  if (accessory === 'none') {
    return null;
  }

  switch (accessory) {
    case 'glasses':
      return (
        <g id="accessory-glasses" transform={`translate(0, ${offsetY})`}>
          {/* Bridge */}
          <path d="M 90 95 Q 100 90 110 95" fill="none" stroke="#2D3748" strokeWidth="4" strokeLinecap="round" />
          {/* Left Lens Frame (Geometric) */}
          <rect x="65" y="85" width="28" height="24" rx="8" fill="none" stroke="#2D3748" strokeWidth="5" />
          {/* Right Lens Frame (Geometric) */}
          <rect x="107" y="85" width="28" height="24" rx="8" fill="none" stroke="#2D3748" strokeWidth="5" />
          {/* Arms */}
          <line x1="65" y1="92" x2="55" y2="90" stroke="#2D3748" strokeWidth="4" strokeLinecap="round" />
          <line x1="135" y1="92" x2="145" y2="90" stroke="#2D3748" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case 'headband':
      return (
        <g id="accessory-headband" transform={`translate(0, ${offsetY})`}>
          {/* Main band wrapping the forehead */}
          <path
            d="M 50 80 Q 100 65 150 80"
            fill="none"
            stroke="#EF4444"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Details (sweatband lines) */}
          <line x1="90" y1="73" x2="90" y2="81" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" />
          <line x1="100" y1="72" x2="100" y2="80" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" />
          <line x1="110" y1="73" x2="110" y2="81" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}
