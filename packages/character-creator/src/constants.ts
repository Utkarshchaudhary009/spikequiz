import type { CharacterConfig } from './types'

/**
 * Duolingo-inspired color palettes
 * Named after animals as per Duolingo's convention
 */

// Skin tones (natural range)
export const SKIN_TONES = {
  pale: '#FFE8D6',
  light: '#FFE0BD',
  mediumLight: '#FFCDA4',
  medium: '#E5A259',
  mediumDark: '#CD7900',
  dark: '#A56644',
  deep: '#8B4513',
} as const

export const SKIN_TONE_ARRAY = Object.values(SKIN_TONES)

// Hair colors (natural + fun)
export const HAIR_COLORS = {
  // Natural
  black: '#4B4B4B',
  darkBrown: '#3D2314',
  brown: '#A56644',
  lightBrown: '#C4A484',
  blonde: '#FFC800',
  ginger: '#FF9600',
  gray: '#AFAFAF',
  white: '#E5E5E5',
  // Fun colors
  red: '#FF4B4B',
  pink: '#FFAADE',
  blue: '#1CB0F6',
  purple: '#CE82FF',
  green: '#58CC02',
  teal: '#7AF0F2',
} as const

export const HAIR_COLOR_ARRAY = Object.values(HAIR_COLORS)

// Eye colors
export const EYE_COLORS = {
  black: '#1A1A1A',
  darkBrown: '#4B4B4B',
  brown: '#A56644',
  hazel: '#CD7900',
  green: '#58A700',
  blue: '#1CB0F6',
  gray: '#777777',
  // Fun
  purple: '#9069CD',
  red: '#FF4B4B',
} as const

export const EYE_COLOR_ARRAY = Object.values(EYE_COLORS)

// Clothing/Body colors (Duolingo brand colors)
export const CLOTHING_COLORS = {
  // Primary
  cardinal: '#FF4B4B', // Red
  bee: '#FFC800', // Yellow
  owl: '#58CC02', // Green
  macaw: '#1CB0F6', // Blue

  // Secondary
  fireAnt: '#EA2B2B',
  fox: '#FF9600',
  treeFrog: '#58A700',
  whale: '#1899D6',
  beetle: '#CE82FF',
  butterfly: '#6F4EA1',
  starfish: '#FFAADE',

  // Neutrals
  polar: '#F7F7F7',
  swan: '#E5E5E5',
  wolf: '#777777',
  eel: '#4B4B4B',
} as const

export const CLOTHING_COLOR_ARRAY = Object.values(CLOTHING_COLORS)

// Accessory colors
export const ACCESSORY_COLORS = {
  black: '#1A1A1A',
  gold: '#FFC800',
  silver: '#AFAFAF',
  red: '#FF4B4B',
  blue: '#1CB0F6',
  pink: '#FFAADE',
  purple: '#CE82FF',
} as const

export const ACCESSORY_COLOR_ARRAY = Object.values(ACCESSORY_COLORS)

/** Default character configuration */
export const DEFAULT_CHARACTER: CharacterConfig = {
  face: {
    shape: 'round',
    skinTone: SKIN_TONES.light,
  },
  eyes: {
    style: 'round',
    color: EYE_COLORS.darkBrown,
    pupilX: 0,
    pupilY: 0,
  },
  eyebrows: {
    style: 'normal',
    color: HAIR_COLORS.darkBrown,
  },
  nose: {
    style: 'medium',
  },
  mouth: {
    style: 'smile',
  },
  hair: {
    style: 'spiky',
    color: HAIR_COLORS.darkBrown,
    facialHair: 'none',
    facialHairColor: HAIR_COLORS.darkBrown,
  },
  body: {
    type: 'medium',
    clothingColor: CLOTHING_COLORS.owl,
  },
  accessories: {
    type: 'none',
    color: ACCESSORY_COLORS.black,
  },
}

/** SVG viewBox dimensions */
export const CANVAS = {
  width: 200,
  height: 240,
  centerX: 100,
  headY: 70,
  bodyY: 160,
} as const
