import { Database } from 'bun:sqlite'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import type { QuestionInsert } from '@spikequiz/shared'
import { deleteQuestion, getQuestionById, insertQuestion, updateQuestion } from './queries'
import { createSchema } from './schema'

describe('db queries', () => {
  let db: Database

  const mockQuestion: QuestionInsert = {
    source: 'test.pdf',
    subject: 'physics',
    class: 12,
    chapter_no: 1,
    chapter_name: 'Electric Charges and Fields',
    topic: 'Coulombs law',
    reference: 'Example 1',
    difficulty: 5,
    question_type: 'mcq',
    question_text: 'What is the charge of an electron?',
    options: ['-1.6e-19 C', '1.6e-19 C', '0 C', '9.1e-31 C'],
    has_solution: true,
    solved: false,
    solution: 'The charge of electron is -1.6 × 10⁻¹⁹ C',
    tags: ['charge', 'electron'],
    images: [],
    needs_image: false,
    flag: 'none',
  }

  beforeEach(() => {
    db = new Database(':memory:')
    createSchema(db)
  })

  afterEach(() => {
    db.close()
  })

  it('should insert and retrieve a question', () => {
    const id = insertQuestion(db, mockQuestion)
    const retrieved = getQuestionById(db, id)

    expect(retrieved).not.toBeNull()
    expect(retrieved?.question_text).toBe(mockQuestion.question_text)
    expect(retrieved?.subject).toBe('physics')
    expect(retrieved?.tags).toEqual(['charge', 'electron'])
  })

  it('should update a question', () => {
    const id = insertQuestion(db, mockQuestion)
    const updated = updateQuestion(db, id, { difficulty: 8, solved: true })

    expect(updated).toBe(true)

    const retrieved = getQuestionById(db, id)
    expect(retrieved?.difficulty).toBe(8)
    expect(retrieved?.solved).toBe(true)
  })

  it('should delete a question', () => {
    const id = insertQuestion(db, mockQuestion)
    const deleted = deleteQuestion(db, id)

    expect(deleted).toBe(true)
    expect(getQuestionById(db, id)).toBeNull()
  })
})
