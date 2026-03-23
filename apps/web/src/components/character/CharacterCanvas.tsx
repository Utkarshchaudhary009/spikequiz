import type { CharacterConfig } from './types';
import { Body } from './parts/Body';
import { Hair } from './parts/Hair';
import { Face } from './parts/Face';
import { Accessories } from './parts/Accessories';

interface Props {
  config: CharacterConfig;
  className?: string;
}

export function CharacterCanvas({ config, className = '' }: Props) {
  return (
    <div className={`relative w-full aspect-square flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[400px] max-h-[400px] drop-shadow-md transition-all duration-300 ease-in-out"
      >
        {/* Layer 1: Body (Base) */}
        <Body config={config} />
        
        {/* Layer 2: Face (Eyes, Mouth, Nose) */}
        <Face config={config} />
        
        {/* Layer 3: Accessories (Glasses, etc.) */}
        <Accessories config={config} />
        
        {/* Layer 4: Hair (Foreground) */}
        <Hair config={config} />
      </svg>
    </div>
  );
}
