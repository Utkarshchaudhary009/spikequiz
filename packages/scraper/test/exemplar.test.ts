import { describe, expect, it } from 'bun:test'
import { getExemplarChapterUrl, EXEMPLAR_CATALOG } from '../src/exemplar'
import { CLASS_LEVELS, SUBJECTS } from '@spikequiz/shared'

describe('exemplar scraper', () => {
  describe('getExemplarChapterUrl', () => {
    it('constructs correct URLs with padded chapter numbers', () => {
      expect(getExemplarChapterUrl(10, 'mathematics', 'jeep2', 1)).toBe(
        'https://ncert.nic.in/pdf/publication/exemplarproblem/classX/mathematics/jeep201.pdf',
      )
      expect(getExemplarChapterUrl(12, 'biology', 'leep4', 12)).toBe(
        'https://ncert.nic.in/pdf/publication/exemplarproblem/classXII/biology/leep412.pdf',
      )
    })
  })

  describe('EXEMPLAR_CATALOG validation', () => {
    it('has entries only for valid classes and subjects', () => {
      for (const [classLevelStr, subjects] of Object.entries(EXEMPLAR_CATALOG)) {
        const classLevel = parseInt(classLevelStr, 10)
        expect(CLASS_LEVELS).toContain(classLevel as any)

        for (const [subject, book] of Object.entries((subjects as any) || {})) {
          expect(SUBJECTS).toContain(subject as any)
          expect(book).toHaveProperty('folderName')
          expect(book).toHaveProperty('code')
          expect(book).toHaveProperty('maxChapters')
        }
      }
    })
  })
})
