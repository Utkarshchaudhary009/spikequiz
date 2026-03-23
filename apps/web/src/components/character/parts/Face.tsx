import type { CharacterConfig } from '../types';

export function Face({ config }: { config: CharacterConfig }) {
  const { eyeStyle, eyeColor, mouthStyle, bodyShape } = config;

  // Adjust face position slightly based on body shape
  const getOffsetY = () => {
    if (bodyShape === 'square') return -5;
    if (bodyShape === 'oval') return 5;
    return 0;
  };
  const offsetY = getOffsetY();

  const renderEyes = () => {
    switch (eyeStyle) {
      case 'happy':
        return (
          <g id="eyes-happy">
            <path d="M 70 100 Q 80 85 90 100" fill="none" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" />
            <path d="M 110 100 Q 120 85 130 100" fill="none" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'tired':
        return (
          <g id="eyes-tired">
            <line x1="70" y1="95" x2="90" y2="95" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" />
            <path d="M 70 100 Q 80 110 90 100" fill="none" stroke={eyeColor} strokeWidth="2" opacity="0.3" />
            <line x1="110" y1="95" x2="130" y2="95" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" />
            <path d="M 110 100 Q 120 110 130 100" fill="none" stroke={eyeColor} strokeWidth="2" opacity="0.3" />
          </g>
        );
      case 'normal':
      default:
        return (
          <g id="eyes-normal">
            <circle cx="80" cy="95" r="6" fill={eyeColor} />
            <circle cx="120" cy="95" r="6" fill={eyeColor} />
          </g>
        );
    }
  };

  const renderMouth = () => {
    switch (mouthStyle) {
      case 'neutral':
        return <line x1="85" y1="120" x2="115" y2="120" stroke="#4A3B32" strokeWidth="4" strokeLinecap="round" />;
      case 'open':
        return <ellipse cx="100" cy="120" rx="10" ry="12" fill="#4A3B32" />;
      case 'smile':
      default:
        return (
          <path
            d="M 85 115 Q 95 135 118 112"
            fill="none"
            stroke="#4A3B32"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
    }
  };

  return (
    <g id="face" transform={`translate(0, ${offsetY})`}>
      {/* Cheeks */}
      <circle cx="65" cy="110" r="8" fill="#FF8A8A" opacity="0.4" />
      <circle cx="135" cy="110" r="8" fill="#FF8A8A" opacity="0.4" />
      
      {/* Nose (Geometric rounded rectangle per Duolingo guidelines) */}
      <rect x="94" y="98" width="12" height="16" rx="6" fill="none" stroke="#D19E82" strokeWidth="3" opacity="0.7" />

      {renderEyes()}
      {renderMouth()}
    </g>
  );
}
