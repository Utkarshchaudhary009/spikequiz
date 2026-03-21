import { describe, expect, it } from 'bun:test'
import { CLASS_LEVELS, QUESTION_TYPES, SUBJECTS } from '../src/constants'

describe('constants', () => {
  it('should have correct subjects', () => {
    expect(SUBJECTS).toContain('physics')
    expect(SUBJECTS).toContain('chemistry')
    expect(SUBJECTS).toContain('social_science')
    expect(SUBJECTS).toContain('english')
  })

  it('should have correct class levels', () => {
    expect(CLASS_LEVELS).toContain(10)
    expect(CLASS_LEVELS).toContain(12)
  })

  it('should have correct question types', () => {
    expect(QUESTION_TYPES).toContain('mcq')
    expect(QUESTION_TYPES).toContain('numerical')
  })
})
