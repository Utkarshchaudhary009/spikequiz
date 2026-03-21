import { describe, expect, it } from 'bun:test'
import { primaryClassifierOutputSchema, secondaryClassifierOutputSchema } from '../src/schemas'

describe('classifier schemas', () => {
  describe('primaryClassifierOutputSchema', () => {
    it('validates a valid question output', () => {
      const validOutput = {
        questions: [
          {
            question_text: 'Find the roots of x² - 5x + 6 = 0',
            chapter_no: 4,
            chapter_name: 'Quadratic Equations',
            reference: 'Ex 4.1 Q-1',
            difficulty: 3,
            marks: 2,
            has_solution: true,
            solution: 'x = 2, x = 3',
            needs_image: false,
          },
        ],
      }

      const result = primaryClassifierOutputSchema.safeParse(validOutput)
      expect(result.success).toBe(true)
    })

    it('validates question with image requirement', () => {
      const output = {
        questions: [
          {
            question_text: 'In the given figure, find angle ABC',
            chapter_no: 6,
            chapter_name: 'Triangles',
            reference: 'Ex 6.2 Q-3',
            difficulty: 5,
            has_solution: false,
            needs_image: true,
            image_prompt: 'A triangle ABC with angle A = 60 degrees and angle C = 40 degrees',
          },
        ],
      }

      const result = primaryClassifierOutputSchema.safeParse(output)
      expect(result.success).toBe(true)
    })

    it('rejects difficulty outside 0-10 range', () => {
      const invalidOutput = {
        questions: [
          {
            question_text: 'Test',
            chapter_no: 1,
            chapter_name: 'Test',
            reference: 'Q-1',
            difficulty: 15,
            has_solution: false,
            needs_image: false,
          },
        ],
      }

      const result = primaryClassifierOutputSchema.safeParse(invalidOutput)
      expect(result.success).toBe(false)
    })
  })

  describe('secondaryClassifierOutputSchema', () => {
    it('validates a valid MCQ classification', () => {
      const validOutput = {
        topic: 'Derivatives',
        question_type: 'mcq',
        tags: ['differentiation', 'power rule'],
        options: ['2x', 'x²', '2', 'x'],
      }

      const result = secondaryClassifierOutputSchema.safeParse(validOutput)
      expect(result.success).toBe(true)
    })

    it('validates a valid numerical classification', () => {
      const validOutput = {
        topic: 'Linear Equations',
        question_type: 'numerical',
        tags: ['solving equations', 'substitution method'],
      }

      const result = secondaryClassifierOutputSchema.safeParse(validOutput)
      expect(result.success).toBe(true)
    })

    it('rejects invalid question type', () => {
      const invalidOutput = {
        topic: 'Test',
        question_type: 'essay',
        tags: ['tag1', 'tag2'],
      }

      const result = secondaryClassifierOutputSchema.safeParse(invalidOutput)
      expect(result.success).toBe(false)
    })

    it('rejects fewer than 2 tags', () => {
      const invalidOutput = {
        topic: 'Test',
        question_type: 'short',
        tags: ['only-one'],
      }

      const result = secondaryClassifierOutputSchema.safeParse(invalidOutput)
      expect(result.success).toBe(false)
    })

    it('rejects more than 4 tags', () => {
      const invalidOutput = {
        topic: 'Test',
        question_type: 'short',
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
      }

      const result = secondaryClassifierOutputSchema.safeParse(invalidOutput)
      expect(result.success).toBe(false)
    })
  })
})
