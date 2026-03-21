# @spikequiz/context

Syllabus data (chapters, topics) used as AI classifier context.

## Usage

```ts
import { getSyllabus, getChapterTopics } from '@spikequiz/context'

// Get full syllabus for AI context injection
const syllabus = getSyllabus('physics', 12)

// Get topics for a specific chapter (for secondary classifier)
const topics = getChapterTopics('physics', 12, 3) // Current Electricity topics
```

## Adding New Syllabi

1. Create `src/syllabus/{subject}-{class}.ts`
2. Export in `src/syllabus/index.ts`
3. Add to `syllabusMap`
