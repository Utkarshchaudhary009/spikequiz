# @spikequiz/image-gen

AI image generation for questions that need diagrams.

## Usage

```ts
import { generateQuestionImage } from '@spikequiz/image-gen'

// Generate image for a question
const imagePath = await generateQuestionImage(
  'question-uuid',
  'A circuit diagram showing a series RLC circuit with labeled components'
)
// Returns: './images/question-uuid.png'
```

## Environment

Requires `OPENAI_API_KEY` environment variable.

## Output

- Images saved to `./images/` directory
- PNG format, 1024x1024
- Educational diagram style (clean, labeled)
