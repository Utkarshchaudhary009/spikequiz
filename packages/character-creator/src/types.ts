/** Duolingo-style character configuration */

export type Gender = 'neutral' | 'masculine' | 'feminine'

export type FaceShape = 'round' | 'oval' | 'square' | 'heart'

export type EyeStyle = 'round' | 'almond' | 'glasses' | 'linear' | 'dots'

export type HairStyle =
  // Neutral styles
  | 'none'
  | 'buzz'
  | 'curly-short'
  // Masculine-tagged (can be used by anyone)
  | 'spiky'
  | 'slick-back'
  | 'pompadour'
  | 'mohawk'
  | 'fade'
  // Feminine-tagged (can be used by anyone)
  | 'bob'
  | 'long-straight'
  | 'long-wavy'
  | 'ponytail'
  | 'pigtails'
  | 'bun'

export type FacialHairStyle = 'none' | 'stubble' | 'beard' | 'goatee' | 'mustache'

export type MouthStyle = 'smile' | 'grin' | 'neutral' | 'surprised' | 'sad' | 'tongue'

export type NoseStyle = 'small' | 'medium' | 'large' | 'wide'

export type EyebrowStyle = 'normal' | 'thick' | 'thin' | 'arched' | 'angry'

export type BodyType = 'slim' | 'medium' | 'wide'

export type AccessoryType =
  | 'none'
  | 'round-glasses'
  | 'square-glasses'
  | 'cat-eye-glasses'
  | 'headband'
  | 'cap'
  | 'beanie'
  | 'crown'
  | 'earrings'

export interface CharacterConfig {
  // Face
  face: {
    shape: FaceShape
    skinTone: string
  }

  // Eyes
  eyes: {
    style: EyeStyle
    color: string
    /** Pupil offset from center (-1 to 1) for emotion */
    pupilX: number
    pupilY: number
  }

  // Eyebrows
  eyebrows: {
    style: EyebrowStyle
    color: string
  }

  // Nose
  nose: {
    style: NoseStyle
  }

  // Mouth
  mouth: {
    style: MouthStyle
  }

  // Hair
  hair: {
    style: HairStyle
    color: string
    facialHair: FacialHairStyle
    facialHairColor: string
  }

  // Body
  body: {
    type: BodyType
    clothingColor: string
  }

  // Accessories
  accessories: {
    type: AccessoryType
    color: string
  }
}

/** Hair styles grouped by gender tag for UI filtering */
export const HAIR_STYLES_BY_GENDER: Record<Gender, HairStyle[]> = {
  neutral: ['none', 'buzz', 'curly-short'],
  masculine: ['spiky', 'slick-back', 'pompadour', 'mohawk', 'fade'],
  feminine: ['bob', 'long-straight', 'long-wavy', 'ponytail', 'pigtails', 'bun'],
}

/** All hair styles combined */
export const ALL_HAIR_STYLES: HairStyle[] = [
  ...HAIR_STYLES_BY_GENDER.neutral,
  ...HAIR_STYLES_BY_GENDER.masculine,
  ...HAIR_STYLES_BY_GENDER.feminine,
]
