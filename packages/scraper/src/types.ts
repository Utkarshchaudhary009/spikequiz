import type { ClassLevel, ExamType, Subject } from '@spikequiz/shared'

export type SourceType = 'ncert' | 'exemplar' | 'pyq' | 'sample_paper'

export interface PdfSource {
  url: string
  subject: Subject | string
  class: ClassLevel
  source_type: SourceType
  year?: number
  exam_type?: ExamType
  filename?: string
}

export interface ScraperConfig {
  subject: Subject | string
  class: ClassLevel
  source_type: SourceType
  year?: number
  exam_type?: ExamType
}
