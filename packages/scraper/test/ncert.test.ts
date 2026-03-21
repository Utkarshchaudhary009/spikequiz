import { describe, expect, it } from 'bun:test'
import { CLASS_LEVELS, SUBJECTS } from '@spikequiz/shared'
import { getNcertChapterUrl, NCERT_CATALOG } from '../src/ncert'

describe('ncert scraper', () => {
  describe('getNcertChapterUrl', () => {
    it('constructs correct URLs with padded chapter numbers', () => {
      expect(getNcertChapterUrl('keph1', 1)).toBe('https://ncert.nic.in/textbook/pdf/keph101.pdf')
      expect(getNcertChapterUrl('fecu1', 12)).toBe('https://ncert.nic.in/textbook/pdf/fecu112.pdf')
      expect(getNcertChapterUrl('leec1', 9)).toBe('https://ncert.nic.in/textbook/pdf/leec109.pdf')
    })
  })

  describe('NCERT_CATALOG validation', () => {
    it('has entries only for valid classes and subjects', () => {
      for (const [classLevelStr, subjects] of Object.entries(NCERT_CATALOG)) {
        const classLevel = parseInt(classLevelStr, 10)
        expect(CLASS_LEVELS).toContain(classLevel as any)

        for (const [subject, books] of Object.entries(subjects as any)) {
          expect(SUBJECTS).toContain(subject as any)
          expect(Array.isArray(books)).toBe(true)
          expect(books.length).toBeGreaterThan(0)

          for (const book of books) {
            expect(book).toHaveProperty('code')
            expect(book).toHaveProperty('maxChapters')
            expect(book).toHaveProperty('title')
            expect(typeof book.code).toBe('string')
            expect(typeof book.maxChapters).toBe('number')
          }
        }
      }
    })

    it('has Class 6 specific NEP books', () => {
      const cls6 = NCERT_CATALOG[6]
      expect(cls6?.science?.[0].code).toBe('fecu1') // Curiosity
      expect(cls6?.math?.[0].code).toBe('fegp1') // Ganita Prakash
    })

    it('has all three streams for Class 11 and 12', () => {
      const streams = ['physics', 'history', 'accountancy', 'psychology'] as const
      for (const cl of [11, 12] as const) {
        for (const subject of streams) {
          expect(NCERT_CATALOG[cl]?.[subject]).toBeDefined()
        }
      }
    })
  })
})
