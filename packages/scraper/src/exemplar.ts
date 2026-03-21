import type { ClassLevel, Subject } from '@spikequiz/shared'
import type { PdfSource } from './types'
import { validatePdfUrl } from './utils'

// ---------------------------------------------------------------------------
// URL construction
// ---------------------------------------------------------------------------

const NCERT_EXEMPLAR_BASE_URL = 'https://ncert.nic.in/pdf/publication/exemplarproblem'

/**
 * Maps ClassLevel to the Roman numeral folder name used by NCERT Exemplars.
 */
const CLASS_ROMAN_MAP: Record<6 | 7 | 8 | 9 | 10 | 11 | 12, string> = {
  6: 'classVI',
  7: 'classVII',
  8: 'classVIII',
  9: 'classIX',
  10: 'classX',
  11: 'classXI',
  12: 'classXII',
}

/**
 * Build a deterministic NCERT Exemplar chapter PDF URL.
 */
export function getExemplarChapterUrl(
  classLevel: ClassLevel,
  folderScore: string,
  bookCode: string,
  chapter: number,
): string {
  const ch = chapter.toString().padStart(2, '0')
  const clsRoman = CLASS_ROMAN_MAP[classLevel as keyof typeof CLASS_ROMAN_MAP]
  return `${NCERT_EXEMPLAR_BASE_URL}/${clsRoman}/${folderScore}/${bookCode}${ch}.pdf`
}

// ---------------------------------------------------------------------------
// Book catalog
// ---------------------------------------------------------------------------

interface ExemplarBook {
  /** The folder name exactly as on NCERT (e.g. "Mathematics", "science") */
  folderName: string
  /** URL book prefix, e.g. 'keep2' */
  code: string
  /** Safe max chapters to try before giving up (we stop on 404 anyway) */
  maxChapters: number
}

type ExemplarCatalog = Partial<Record<ClassLevel, Partial<Record<Subject, ExemplarBook>>>>

export const EXEMPLAR_CATALOG: ExemplarCatalog = {
  6: {
    math: { folderName: 'Mathematics', code: 'feep1', maxChapters: 15 },
    science: { folderName: 'science', code: 'feep2', maxChapters: 20 },
  },
  7: {
    math: { folderName: 'Mathematics', code: 'gemp1', maxChapters: 15 },
    science: { folderName: 'Science', code: 'geep1', maxChapters: 20 },
  },
  8: {
    math: { folderName: 'mathematics', code: 'heep2', maxChapters: 15 },
    science: { folderName: 'science', code: 'heep1', maxChapters: 20 },
  },
  9: {
    math: { folderName: 'mathematics', code: 'ieep2', maxChapters: 15 },
    science: { folderName: 'science', code: 'ieep1', maxChapters: 20 },
  },
  10: {
    math: { folderName: 'mathematics', code: 'jeep2', maxChapters: 15 },
    science: { folderName: 'science', code: 'jeep1', maxChapters: 20 },
  },
  11: {
    math: { folderName: 'mathematics', code: 'keep2', maxChapters: 20 },
    physics: { folderName: 'physics', code: 'keep3', maxChapters: 20 },
    biology: { folderName: 'biology', code: 'keep4', maxChapters: 25 },
    chemistry: { folderName: 'chemistry', code: 'keep5', maxChapters: 20 },
  },
  12: {
    math: { folderName: 'mathematics', code: 'leep2', maxChapters: 20 },
    physics: { folderName: 'physics', code: 'leep1', maxChapters: 20 },
    biology: { folderName: 'biology', code: 'leep4', maxChapters: 25 },
    chemistry: { folderName: 'chemistry', code: 'leep5', maxChapters: 20 },
  },
}

// ---------------------------------------------------------------------------
// Scraper
// ---------------------------------------------------------------------------

/**
 * Return all available PdfSource entries for a given class + subject examplar combo.
 * Probes chapter URLs via HEAD requests; stops the first time a chapter is missing.
 */
export async function getExemplarPdfSources(
  classLevel: ClassLevel,
  subject: Subject,
): Promise<{ sources: PdfSource[]; failed: import('@spikequiz/shared').FailedPdfLinkInsert[] }> {
  const classEntry = EXEMPLAR_CATALOG[classLevel]
  if (!classEntry) return { sources: [], failed: [] }

  const book = classEntry[subject]
  if (!book) return { sources: [], failed: [] }

  const sources: PdfSource[] = []
  const failed: import('@spikequiz/shared').FailedPdfLinkInsert[] = []

  // Loop sequentially because chapter 25 shouldn't be checked if chapter 12 already 404s
  for (let chapter = 1; chapter <= book.maxChapters; chapter++) {
    const url = getExemplarChapterUrl(classLevel, book.folderName, book.code, chapter)
    const exists = await validatePdfUrl(url)

    if (!exists) {
      // If chapter 1 doesn't exist, it failed from the start. Otherwise, it just means
      // we reached the end of the chapters for this valid book and should stop gracefully.
      if (chapter === 1) {
        failed.push({
          url,
          subject,
          class: classLevel,
          source_type: 'exemplar',
          reason: 'HTTP HEAD validation failed (Chapter 1 never found)',
        })
      }
      break
    }

    sources.push({
      url,
      subject,
      class: classLevel,
      source_type: 'exemplar',
      filename: `exemplar_cl${classLevel}_${subject}_${book.code}_ch${chapter.toString().padStart(2, '0')}.pdf`,
    })
  }

  return { sources, failed }
}

// ---------------------------------------------------------------------------
// Download helper
// ---------------------------------------------------------------------------

/**
 * Download a PDF from `url` and write it to `destPath`.
 * Uses native Bun APIs (Bun.file / Bun.write).
 */
export async function downloadExemplarPdf(url: string, destPath: string): Promise<void> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to download Exemplar ${url}: HTTP ${res.status}`)
  }
  const buffer = await res.arrayBuffer()
  await Bun.write(destPath, buffer)
}
