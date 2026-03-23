export interface CharacterConfig {
  bodyShape: 'round' | 'square' | 'oval';
  hairStyle: 'none' | 'spiky' | 'wavy' | 'bob';
  eyeStyle: 'normal' | 'happy' | 'tired';
  mouthStyle: 'smile' | 'neutral' | 'open';
  accessory: 'none' | 'glasses' | 'headband';
  skinColor: string;
  hairColor: string;
  eyeColor: string;
}

export const DEFAULT_CHARACTER: CharacterConfig = {
  bodyShape: 'round',
  hairStyle: 'spiky',
  eyeStyle: 'normal',
  mouthStyle: 'smile',
  accessory: 'none',
  skinColor: '#FFD1B3',
  hairColor: '#4A3B32',
  eyeColor: '#1A1A1A',
};
