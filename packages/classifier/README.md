# @spikequiz/classifier

AI-powered question extraction and classification using Gemini via AI SDK 6.

## Features

- **Primary Classification**: Extracts questions from PDF documents (via URL, base64, or buffer)
- **Secondary Classification**: Classifies questions by topic, type, and generates concept tags

## Installation

```bash
bun add @spikequiz/classifier
```

## Prerequisites

Install and authenticate the Gemini CLI globally:

```bash
npm install -g @google/gemini-cli
gemini  # Follow the interactive authentication setup
```

## Usage

### Primary Classification (PDF → Questions)

```typescript
import { classifyPrimary, type FileSource } from '@spikequiz/classifier'

// From URL
const result = await classifyPrimary({
  source: { type: 'url', url: 'https://example.com/paper.pdf' },
  subject: 'mathematics',
  classLevel: '10',
  syllabus: { chapters: [...] },
})

// From base64
const result = await classifyPrimary({
  source: { type: 'base64', data: base64String, mediaType: 'application/pdf' },
  subject: 'physics',
  classLevel: '12',
  syllabus: { chapters: [...] },
})

// From buffer
const result = await classifyPrimary({
  source: { type: 'buffer', data: buffer, mediaType: 'application/pdf' },
  subject: 'chemistry',
  classLevel: '11',
  syllabus: { chapters: [...] },
})
```

### Secondary Classification (Question → Topic/Type)

```typescript
import { classifySecondary } from '@spikequiz/classifier'

const result = await classifySecondary({
  questionText: 'Find the derivative of f(x) = x² + 3x',
  chapter: {
    chapter_no: 5,
    chapter_name: 'Continuity and Differentiability',
    topics: ['Derivatives', 'Chain Rule', 'Implicit Differentiation'],
  },
})
```

## File Sources

The classifier supports three ways to provide PDF files:

| Type | Description |
|------|-------------|
| `url` | HTTP(S) URL to a PDF file |
| `base64` | Base64-encoded PDF data |
| `buffer` | Node.js Buffer containing PDF data |

## Model Configuration

Uses `gemini-2.5-flash` by default via OAuth authentication. The model and provider can be customized by modifying `src/provider.ts`.
