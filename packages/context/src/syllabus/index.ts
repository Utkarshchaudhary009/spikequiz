import type { ClassLevel, Subject, SubjectSyllabus } from '@spikequiz/shared'
import { physics12 } from './physics-12'

const syllabusMap: Record<string, SubjectSyllabus> = {
  'physics-12': physics12,
}

export function getSyllabus(subject: Subject, classLevel: ClassLevel): SubjectSyllabus | null {
  const key = `${subject}-${classLevel}`
  return syllabusMap[key] ?? null
}

export function getChapterTopics(
  subject: Subject,
  classLevel: ClassLevel,
  chapterNo: number,
): string[] {
  const syllabus = getSyllabus(subject, classLevel)
  if (!syllabus) return []

  const chapter = syllabus.chapters.find((c) => c.chapter_no === chapterNo)
  return chapter?.topics ?? []
}

export function getAllChapterNames(subject: Subject, classLevel: ClassLevel): string[] {
  const syllabus = getSyllabus(subject, classLevel)
  if (!syllabus) return []

  return syllabus.chapters.map((c) => c.chapter_name)
}

export { physics12 }
