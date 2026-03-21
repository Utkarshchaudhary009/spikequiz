# @spikequiz/db

SQLite database layer using Bun's native `bun:sqlite`.

## Usage

```ts
import { getDb, insertQuestion, getQuestionsByFilter } from '@spikequiz/db'

const db = getDb()

// Insert
const id = insertQuestion(db, {
  source: 'ncert_12_physics.pdf',
  subject: 'physics',
  class: 12,
  // ...
})

// Query with filters
const questions = getQuestionsByFilter(db, {
  subject: 'physics',
  chapter_no: 3,
  difficulty_min: 5,
})
```

## Features

- WAL mode for better concurrency
- Indexed columns for fast filtering
- JSON storage for arrays (tags, options, images)
