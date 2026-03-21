import type { Subject } from './types'

export const SUBJECTS: Subject[] = [
  // Science stream
  'physics',
  'chemistry',
  'math',
  'biology',
  'science',
  // Humanities stream
  'history',
  'geography',
  'political_science',
  'economics',
  'sociology',
  'social_science',
  // Commerce stream
  'accountancy',
  'business_studies',
  // Electives / Cross-stream
  'statistics',
  'psychology',
  'computer_science',
  'informatics_practices',
  'physical_education',
  'english',
  'hindi',
] as const

export const EXAM_TYPES = ['jee', 'neet', 'board'] as const

export const QUESTION_TYPES = ['mcq', 'short', 'long', 'assertion', 'match', 'numerical'] as const

export const CLASS_LEVELS = [6, 7, 8, 9, 10, 11, 12] as const

export const DIFFICULTY_RANGE = { min: 0, max: 10 } as const

export const SOURCE_TYPES = ['ncert', 'exemplar', 'pyq', 'sample_paper'] as const
