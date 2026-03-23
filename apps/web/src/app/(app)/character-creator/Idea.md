# Bitmoji Character Creator - Design & Implementation Plan

## Design Philosophy (Duolingo-Inspired)

### Core Principles
1. **Simple Shapes** - Use only 3 basic shapes: rounded rectangles, circles, rounded triangles
2. **No Pointy Edges** - Everything has rounded corners (Duolingo brand rule)
3. **Bold & Bouncy** - Vibrant colors, playful aesthetic
4. **Shape Rhythm** - Mix large and small shapes for visual interest
5. **Minimalism** - 10-15 shapes max per character component

### Color Palette (from Duolingo)
```
Skin Tones:
- #FFE0BD (Light)
- #FFCDA4 (Medium Light)
- #E5A259 (Medium)
- #CD7900 (Medium Dark)
- #A56644 (Dark)

Hair Colors:
- #4B4B4B (Black)
- #A56644 (Brown)
- #FFC800 (Blonde)
- #FF4B4B (Red)
- #1CB0F6 (Blue - fun)
- #CE82FF (Purple - fun)

Eye Colors:
- #4B4B4B (Black)
- #A56644 (Brown)
- #1CB0F6 (Blue)
- #58CC02 (Green)
- #777777 (Gray)

Body/Clothing Colors:
- #FF4B4B (Cardinal Red)
- #FFC800 (Bee Yellow)
- #58CC02 (Owl Green)
- #1CB0F6 (Macaw Blue)
- #CE82FF (Beetle Purple)
- #FF9600 (Fox Orange)
- #FFAADE (Starfish Pink)
```

---

## Component Architecture

```
packages/
  character-creator/           # New shared package
    src/
      types.ts                 # Character configuration types
      constants.ts             # Color palettes, shape configs
      utils.ts                 # SVG path generators
      index.ts                 # Exports

apps/web/src/
  app/(app)/character-creator/
    page.tsx                   # Main creator page
    Idea.md                    # This file
  
  components/character/
    CharacterPreview.tsx       # Full assembled character
    CharacterCanvas.tsx        # SVG canvas wrapper
    
    parts/
      Face.tsx                 # Head shape + skin
      Eyes.tsx                 # Eye shapes (5 styles)
      Eyebrows.tsx             # Eyebrow variations
      Nose.tsx                 # Nose styles (1-2 rounded rects)
      Mouth.tsx                # Mouth expressions
      Hair.tsx                 # Hair styles
      Ears.tsx                 # Ear shapes
      Body.tsx                 # Body/torso shapes
      Arms.tsx                 # Arm positions
      Accessories.tsx          # Glasses, hats, etc.
    
    controls/
      ColorPicker.tsx          # Palette-based color picker
      StyleSelector.tsx        # Grid of style options
      TabPanel.tsx             # Category tabs
      SliderControl.tsx        # Size adjustments
```

---

## Feature Breakdown

### Phase 1: Core Components (MVP)

#### 1. Face/Head
- 4 head shapes: round, oval, square-ish, heart
- Skin tone picker (5 tones)
- Face composed of 1-2 basic shapes

#### 2. Eyes (5 Duolingo Styles)
- Round (circles)
- Glasses (round with frames)
- Almond (rounded pill shape)
- Linear (simple lines)
- Dots (for small scale)
- Eye color picker
- Pupil position (emotion)

#### 3. Hair
- 8-10 hairstyles per gender
- Hair color picker (natural + fun colors)
- Keep to 1-2 large shapes as per Duolingo guidelines
- Facial hair options (beard, mustache)

#### 4. Body
- 3 body types (slim, medium, wide)
- Clothing base shapes
- Clothing color picker

### Phase 2: Expressions & Details

#### 5. Mouth
- 6 expressions: smile, grin, neutral, surprised, sad, tongue out
- Asymmetric shapes (Duolingo style)
- Can break face boundary for extreme emotions

#### 6. Nose
- 4 nose sizes/styles
- 1-2 rounded rectangles
- Color matches skin in profile

#### 7. Eyebrows
- 5 styles: thick, thin, arched, straight, angry
- Color matches or contrasts hair

### Phase 3: Accessories

#### 8. Accessories
- Glasses (round, square, cat-eye)
- Hats (cap, beanie, crown)
- Earrings
- Headbands

---

## Technical Implementation

### SVG-Based Rendering
```tsx
// All parts use SVG for:
// - Crisp scaling at any size
// - Easy color manipulation
// - Animation support
// - Export capability

interface CharacterConfig {
  face: {
    shape: 'round' | 'oval' | 'square' | 'heart';
    skinTone: string;
  };
  eyes: {
    style: 'round' | 'glasses' | 'almond' | 'linear' | 'dots';
    color: string;
    pupilPosition: { x: number; y: number };
  };
  hair: {
    style: string;
    color: string;
    facialHair?: string;
  };
  body: {
    type: 'slim' | 'medium' | 'wide';
    clothingColor: string;
  };
  // ... more
}
```

### State Management
- Use React Context for character state
- Persist to localStorage
- Save to database on "Save Avatar"

### UI/UX Flow
```
┌─────────────────────────────────────────────┐
│  Character Preview (large, center)          │
│         ┌───────────┐                       │
│         │   👤      │                       │
│         │  Avatar   │                       │
│         └───────────┘                       │
├─────────────────────────────────────────────┤
│  [Face] [Eyes] [Hair] [Body] [Extras]       │  ← Tab navigation
├─────────────────────────────────────────────┤
│  Style Options Grid                         │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐                       │
│  │😊│ │😎│ │🥸│ │😐│                       │
│  └──┘ └──┘ └──┘ └──┘                       │
├─────────────────────────────────────────────┤
│  Color Palette                              │
│  ⚫ 🟤 🟡 🔴 🔵 🟣                          │
└─────────────────────────────────────────────┘
```

---

## Implementation Order

### Week 1: Foundation
1. Create `packages/character-creator` with types & constants
2. Build SVG shape primitives (rounded rect, circle, pill)
3. Implement Face component with skin tones
4. Implement Eyes with 5 styles + colors

### Week 2: Features
5. Implement Hair with 6+ styles
6. Implement Body with clothing
7. Build control components (ColorPicker, StyleSelector)
8. Create main CharacterCreator page

### Week 3: Polish
9. Add expressions (mouth, eyebrows)
10. Add accessories
11. Add animations (hover, selection)
12. Save/export functionality

---

## Unique Ideas for SpikeQuiz

### 1. Subject-Themed Accessories
- 🔬 Lab coat + goggles for Science
- 📐 Protractor hat for Math
- 📚 Book stack hair accessory for Literature
- 🎨 Paint splatter clothing for Art

### 2. Achievement Unlocks
- Unlock rare hair colors after streaks
- Special glasses for quiz milestones
- Crown for leaderboard winners

### 3. Emotion Reactions
- Character reacts during quizzes:
  - Happy bounce on correct answer
  - Sad droop on wrong answer
  - Excited jump on streak

### 4. Study Buddy Mode
- Character appears as floating helper
- Gives encouragement during sessions
- Shows expressions based on performance

---

## Files to Create

```
apps/web/src/
├── app/(app)/character-creator/
│   └── page.tsx
├── components/character/
│   ├── index.ts
│   ├── CharacterPreview.tsx
│   ├── CharacterCanvas.tsx
│   ├── parts/
│   │   ├── index.ts
│   │   ├── Face.tsx
│   │   ├── Eyes.tsx
│   │   ├── Hair.tsx
│   │   ├── Mouth.tsx
│   │   ├── Nose.tsx
│   │   ├── Body.tsx
│   │   └── Eyebrows.tsx
│   └── controls/
│       ├── index.ts
│       ├── ColorPicker.tsx
│       ├── StyleSelector.tsx
│       └── TabPanel.tsx

packages/character-creator/
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── constants.ts
│   └── utils.ts
├── package.json
└── tsconfig.json
```

---

## Decisions Made

1. **Gender**: Neutral base + gender-tagged hair options user can freely choose
2. **Idle Animation**: Yes - subtle breathing/blinking for "alive" feel
3. **Export**: PNG + SVG support
4. **Save**: Auto-save to user profile

---

## Next Steps

1. ✅ Plan created
2. ✅ Decisions finalized
3. ⏳ Create `packages/character-creator` package
4. ⏳ Build Face + Eyes components first (most impactful)
5. ⏳ Build the creator page with tab navigation
