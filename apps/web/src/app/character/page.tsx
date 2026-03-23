'use client'

import { CheckCircle2, Gift, Palette, Scissors, Smile, User } from 'lucide-react'
import { useState } from 'react'
import { CharacterCanvas } from '@/components/character/CharacterCanvas'
import {
  type AccessoryType,
  type BodyType,
  type CharacterConfig,
  DEFAULT_CHARACTER,
  type EyebrowStyle,
  type EyeStyle,
  type FaceShape,
  type FacialHairStyle,
  type HairStyle,
  type MouthStyle,
  type NoseStyle,
} from '@/components/character/types'

const TABS = [
  { id: 'shape', label: 'Body', icon: User },
  { id: 'hair', label: 'Hair', icon: Scissors },
  { id: 'face', label: 'Face', icon: Smile },
  { id: 'accessories', label: 'Extras', icon: Gift },
  { id: 'colors', label: 'Colors', icon: Palette },
] as const

export default function CharacterCreatorPage() {
  const [config, setConfig] = useState<CharacterConfig>(DEFAULT_CHARACTER)
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('shape')

  const updateFaceShape = (shape: FaceShape) => {
    setConfig((prev) => ({ ...prev, face: { ...prev.face, shape } }))
  }

  const updateSkinTone = (skinTone: string) => {
    setConfig((prev) => ({ ...prev, face: { ...prev.face, skinTone } }))
  }

  const updateEyeStyle = (style: EyeStyle) => {
    setConfig((prev) => ({ ...prev, eyes: { ...prev.eyes, style } }))
  }

  const updateEyeColor = (color: string) => {
    setConfig((prev) => ({ ...prev, eyes: { ...prev.eyes, color } }))
  }

  const updatePupilX = (pupilX: number) => {
    setConfig((prev) => ({ ...prev, eyes: { ...prev.eyes, pupilX } }))
  }

  const updatePupilY = (pupilY: number) => {
    setConfig((prev) => ({ ...prev, eyes: { ...prev.eyes, pupilY } }))
  }

  const updateEyebrowStyle = (style: EyebrowStyle) => {
    setConfig((prev) => ({ ...prev, eyebrows: { ...prev.eyebrows, style } }))
  }

  const updateEyebrowColor = (color: string) => {
    setConfig((prev) => ({ ...prev, eyebrows: { ...prev.eyebrows, color } }))
  }

  const updateNoseStyle = (style: NoseStyle) => {
    setConfig((prev) => ({ ...prev, nose: { ...prev.nose, style } }))
  }

  const updateMouthStyle = (style: MouthStyle) => {
    setConfig((prev) => ({ ...prev, mouth: { ...prev.mouth, style } }))
  }

  const updateHairStyle = (style: HairStyle) => {
    setConfig((prev) => ({ ...prev, hair: { ...prev.hair, style } }))
  }

  const updateHairColor = (color: string) => {
    setConfig((prev) => ({ ...prev, hair: { ...prev.hair, color } }))
  }

  const updateFacialHair = (facialHair: FacialHairStyle) => {
    setConfig((prev) => ({ ...prev, hair: { ...prev.hair, facialHair } }))
  }

  const updateFacialHairColor = (facialHairColor: string) => {
    setConfig((prev) => ({ ...prev, hair: { ...prev.hair, facialHairColor } }))
  }

  const updateBodyType = (type: BodyType) => {
    setConfig((prev) => ({ ...prev, body: { ...prev.body, type } }))
  }

  const updateClothingColor = (clothingColor: string) => {
    setConfig((prev) => ({ ...prev, body: { ...prev.body, clothingColor } }))
  }

  const updateAccessoryType = (type: AccessoryType) => {
    setConfig((prev) => ({ ...prev, accessories: { ...prev.accessories, type } }))
  }

  const updateAccessoryColor = (color: string) => {
    setConfig((prev) => ({ ...prev, accessories: { ...prev.accessories, color } }))
  }

  const renderShapeOptions = () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        {['round', 'oval', 'square', 'heart'].map((shape) => (
          <button
            key={shape}
            onClick={() => updateFaceShape(shape as FaceShape)}
            className={`p-4 rounded-2xl border-2 transition-all font-bold text-lg capitalize ${
              config.face.shape === shape
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            {shape}
          </button>
        ))}
      </div>
    )
  }

  const renderHairOptions = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        {['none', 'spiky', 'bob'].map((style) => (
          <button
            key={style}
            onClick={() => updateHairStyle(style as HairStyle)}
            className={`p-4 rounded-2xl border-2 transition-all font-bold text-lg capitalize ${
              config.hair.style === style
                ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    )
  }

  const renderFaceOptions = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Eyes</h3>
          <div className="grid grid-cols-3 gap-4">
            {['round', 'almond', 'glasses'].map((style) => (
              <button
                key={style}
                onClick={() => updateEyeStyle(style as EyeStyle)}
                className={`p-4 rounded-2xl border-2 transition-all font-bold text-lg capitalize ${
                  config.eyes.style === style
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Mouth</h3>
          <div className="grid grid-cols-3 gap-4">
            {['smile', 'neutral', 'surprised'].map((style) => (
              <button
                key={style}
                onClick={() => updateMouthStyle(style as MouthStyle)}
                className={`p-4 rounded-2xl border-2 transition-all font-bold text-lg capitalize ${
                  config.mouth.style === style
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderAccessoriesOptions = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        {['none', 'round-glasses', 'headband'].map((item) => (
          <button
            key={item}
            onClick={() => updateAccessoryType(item as AccessoryType)}
            className={`p-4 rounded-2xl border-2 transition-all font-bold text-lg capitalize ${
              config.accessories.type === item
                ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    )
  }

  const renderColorOptions = () => {
    return (
      <div className="space-y-6">
        {[
          {
            key: 'skinColor',
            label: 'Skin Tone',
            colors: ['#FFD1B3', '#E0AC69', '#8D5524', '#C68642', '#F1C27D', '#FFDBAC'],
          },
          {
            key: 'hairColor',
            label: 'Hair Color',
            colors: ['#4A3B32', '#1A1A1A', '#A52A2A', '#E2A958', '#4285F4', '#E91E63'],
          },
          {
            key: 'eyeColor',
            label: 'Eye Color',
            colors: ['#1A1A1A', '#2D5A27', '#2563EB', '#8B4513', '#6B7280'],
          },
        ].map((group) => (
          <div key={group.key}>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-3">
              {group.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    if (group.key === 'skinColor') updateSkinTone(color)
                    else if (group.key === 'hairColor') updateHairColor(color)
                    else if (group.key === 'eyeColor') updateEyeColor(color)
                  }}
                  className={`w-12 h-12 rounded-full border-4 transition-transform flex items-center justify-center ${
                    group.key === 'skinColor'
                      ? config.face.skinTone === color
                        ? 'border-blue-500 scale-110 shadow-md'
                        : 'border-white hover:scale-105'
                      : group.key === 'hairColor'
                        ? config.hair.color === color
                          ? 'border-blue-500 scale-110 shadow-md'
                          : 'border-white hover:scale-105'
                        : config.eyes.color === color
                          ? 'border-blue-500 scale-110 shadow-md'
                          : 'border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color}`}
                >
                  {(group.key === 'skinColor' && config.face.skinTone === color) ||
                    (group.key === 'hairColor' && config.hair.color === color) ||
                    (group.key === 'eyeColor' && config.eyes.color === color && (
                      <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />
                    ))}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left/Top Canvas Area */}
      <div className="w-full md:w-1/2 lg:w-2/5 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-full max-w-sm aspect-square bg-white rounded-[40px] shadow-xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 to-transparent"></div>
          <CharacterCanvas config={config} />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-800">Your Avatar</h1>
          <p className="text-gray-500 font-medium">Customize to match your style!</p>
        </div>
      </div>

      {/* Right/Bottom Controls Area */}
      <div className="w-full md:w-1/2 lg:w-3/5 p-6 md:p-10 bg-white flex flex-col h-screen overflow-hidden">
        {/* Tabs */}
        <div className="flex space-x-2 p-2 bg-gray-100 rounded-2xl mb-8 overflow-x-auto custom-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-fit flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : ''}`} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-2 pb-20 custom-scrollbar">
          {activeTab === 'shape' && renderShapeOptions()}
          {activeTab === 'hair' && renderHairOptions()}
          {activeTab === 'face' && renderFaceOptions()}
          {activeTab === 'accessories' && renderAccessoriesOptions()}
          {activeTab === 'colors' && renderColorOptions()}
        </div>

        {/* Save/Action Button */}
        <div className="pt-6 mt-auto border-t border-gray-100">
          <button className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-lg transition-colors shadow-[0_4px_0_rgb(37,99,235)] hover:shadow-[0_2px_0_rgb(37,99,235)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]">
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  )
}
