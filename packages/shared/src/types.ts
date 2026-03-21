// Science stream (all classes)
export type ScienceSubject = 'physics' | 'chemistry' | 'math' | 'biology' | 'science'
// Humanities stream (classes 11-12)
export type HumanitiesSubject =
  | 'history'
  | 'geography'
  | 'political_science'
  | 'economics'
  | 'sociology'
  | 'social_science'
// Commerce stream (classes 11-12)
export type CommerceSubject = 'accountancy' | 'business_studies'
// Cross-stream electives (classes 11-12)
export type ElectiveSubject =
  | 'statistics'
  | 'psychology'
  | 'computer_science'
  | 'informatics_practices'
  | 'physical_education'
// Languages
export type LanguageSubject = 'english' | 'hindi'

export type Subject =
  | ScienceSubject
  | HumanitiesSubject
  | CommerceSubject
  | ElectiveSubject
  | LanguageSubject

export type ExamType = 'jee' | 'neet' | 'board'

export type QuestionType = 'mcq' | 'short' | 'long' | 'assertion' | 'match' | 'numerical'

export type Flag = 'none' | 'need_review'

export type ClassLevel = 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface Question {
  id: string
  source: string
  subject: Subject
  class: ClassLevel
  chapter_no: number
  chapter_name: string
  topic: string
  reference: string
  year?: number
  exam_type?: ExamType
  difficulty: number
  marks?: number
  question_type: QuestionType
  question_text: string
  options?: string[]
  has_solution: boolean
  solved: boolean
  solution?: string
  tags: string[]
  images: string[]
  needs_image: boolean
  image_prompt?: string
  flag: Flag
  created_at: Date
  updated_at: Date
}

export interface QuestionInsert extends Omit<Question, 'id' | 'created_at' | 'updated_at'> {}

export interface PdfSource {
  url: string
  subject: Subject
  class: ClassLevel
  source_type: 'ncert' | 'exemplar' | 'pyq' | 'sample_paper'
  year?: number
  exam_type?: ExamType
}

export interface FailedPdfLink {
  id: string
  url: string
  source_type: 'ncert' | 'exemplar' | 'pyq' | 'sample_paper'
  subject: Subject
  class: ClassLevel
  year?: number
  reason: string
  created_at: Date
}

export interface FailedPdfLinkInsert extends Omit<FailedPdfLink, 'id' | 'created_at'> {}

export interface Chapter {
  chapter_no: number
  chapter_name: string
  topics: string[]
}

export interface SubjectSyllabus {
  subject: Subject
  class: ClassLevel
  chapters: Chapter[]
}

export interface PrimaryClassifierInput {
  raw_text: string
  subject: Subject
  class: ClassLevel
  syllabus: SubjectSyllabus
}

export interface PrimaryClassifierOutput {
  questions: Array<{
    question_text: string
    chapter_no: number
    chapter_name: string
    reference: string
    difficulty: number
    marks?: number
    has_solution: boolean
    solution?: string
    needs_image: boolean
    image_prompt?: string
  }>
}

export interface SecondaryClassifierInput {
  question_text: string
  chapter: Chapter
}

export interface SecondaryClassifierOutput {
  topic: string
  question_type: QuestionType
  tags: string[]
  options?: string[]
}
