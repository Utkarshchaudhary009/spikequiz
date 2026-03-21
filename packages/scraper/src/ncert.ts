import type { ClassLevel, Subject } from '@spikequiz/shared'
import type { PdfSource } from './types'
import { validatePdfUrl } from './utils'

// ---------------------------------------------------------------------------
// URL construction
// ---------------------------------------------------------------------------

const NCERT_BASE_URL = 'https://ncert.nic.in/textbook/pdf'

/**
 * Build a deterministic NCERT chapter PDF URL.
 * @param bookCode  e.g. 'keph1' (Class 11 Physics Part I)
 * @param chapter   1-based chapter number
 */
export function getNcertChapterUrl(bookCode: string, chapter: number): string {
  const ch = chapter.toString().padStart(2, '0')
  return `${NCERT_BASE_URL}/${bookCode}${ch}.pdf`
}

// ---------------------------------------------------------------------------
// Book catalog
// ---------------------------------------------------------------------------

/**
 * Represents one NCERT textbook (one book code = one bound volume).
 */
interface NcertBook {
  /** URL book code, e.g. 'keph1' */
  code: string
  /** Hint for maximum chapter count (scraper stops on first 404/non-OK) */
  maxChapters: number
  /** Human-readable title for logging/debugging */
  title: string
}

type Catalog = Partial<Record<ClassLevel, Partial<Record<Subject, NcertBook[]>>>>

/**
 * Complete catalog of English-medium NCERT textbooks.
 *
 * Class prefix letters: f=6, g=7, h=8, i=9, j=10, k=11, l=12
 * Language letter:      e=English
 *
 * All book codes verified against live NCERT URLs.
 */
export const NCERT_CATALOG: Catalog = {
  // ── Class 6 (New NEP curriculum) ─────────────────────────────────────────
  6: {
    science: [{ code: 'fecu1', maxChapters: 12, title: 'Curiosity (Science)' }],
    math: [{ code: 'fegp1', maxChapters: 14, title: 'Ganita Prakash (Mathematics)' }],
  },

  // ── Class 7 ──────────────────────────────────────────────────────────────
  7: {
    science: [{ code: 'gesc1', maxChapters: 18, title: 'Science' }],
    math: [{ code: 'gemh1', maxChapters: 15, title: 'Mathematics' }],
  },

  // ── Class 8 ──────────────────────────────────────────────────────────────
  8: {
    science: [{ code: 'hesc1', maxChapters: 18, title: 'Science' }],
    math: [{ code: 'hemh1', maxChapters: 16, title: 'Mathematics' }],
  },

  // ── Class 9 ──────────────────────────────────────────────────────────────
  9: {
    science: [{ code: 'iesc1', maxChapters: 15, title: 'Science' }],
    math: [{ code: 'iemh1', maxChapters: 15, title: 'Mathematics' }],
  },

  // ── Class 10 ─────────────────────────────────────────────────────────────
  10: {
    science: [{ code: 'jesc1', maxChapters: 16, title: 'Science' }],
    math: [{ code: 'jemh1', maxChapters: 15, title: 'Mathematics' }],
  },

  // ── Class 11 ─────────────────────────────────────────────────────────────
  11: {
    // Science
    physics: [
      { code: 'keph1', maxChapters: 8, title: 'Physics Part I' },
      { code: 'keph2', maxChapters: 7, title: 'Physics Part II' },
    ],
    chemistry: [
      { code: 'kech1', maxChapters: 7, title: 'Chemistry Part I' },
      { code: 'kech2', maxChapters: 7, title: 'Chemistry Part II' },
    ],
    math: [{ code: 'kemh1', maxChapters: 16, title: 'Mathematics' }],
    biology: [{ code: 'kebo1', maxChapters: 22, title: 'Biology' }],
    // Humanities
    history: [{ code: 'keta1', maxChapters: 6, title: 'Themes in World History' }],
    geography: [
      { code: 'kegy1', maxChapters: 8, title: 'India: Physical Environment' },
      { code: 'kegy2', maxChapters: 8, title: 'Fundamentals of Physical Geography' },
      { code: 'kegy3', maxChapters: 6, title: 'Practical Work in Geography Part I' },
    ],
    political_science: [
      { code: 'keps1', maxChapters: 9, title: 'Political Theory' },
      { code: 'keps2', maxChapters: 9, title: 'Indian Constitution at Work' },
    ],
    economics: [{ code: 'keec1', maxChapters: 9, title: 'Indian Economic Development' }],
    sociology: [
      { code: 'kesy1', maxChapters: 7, title: 'Introducing Sociology' },
      { code: 'kesy2', maxChapters: 6, title: 'Understanding Society' },
    ],
    // Commerce
    accountancy: [
      { code: 'keac1', maxChapters: 9, title: 'Financial Accounting Part I' },
      { code: 'keac2', maxChapters: 5, title: 'Financial Accounting Part II' },
    ],
    business_studies: [{ code: 'kebs1', maxChapters: 11, title: 'Business Studies' }],
    // Electives
    statistics: [{ code: 'kest1', maxChapters: 9, title: 'Statistics for Economics' }],
    psychology: [{ code: 'kepy1', maxChapters: 9, title: 'Introduction to Psychology' }],
    computer_science: [{ code: 'kecs1', maxChapters: 8, title: 'Computer Science' }],
    informatics_practices: [{ code: 'keip1', maxChapters: 7, title: 'Informatics Practices' }],
    physical_education: [
      { code: 'kehp1', maxChapters: 12, title: 'Health and Physical Education' },
    ],
  },

  // ── Class 12 ─────────────────────────────────────────────────────────────
  12: {
    // Science
    physics: [
      { code: 'leph1', maxChapters: 8, title: 'Physics Part I' },
      { code: 'leph2', maxChapters: 7, title: 'Physics Part II' },
    ],
    chemistry: [
      { code: 'lech1', maxChapters: 9, title: 'Chemistry Part I' },
      { code: 'lech2', maxChapters: 7, title: 'Chemistry Part II' },
    ],
    math: [
      { code: 'lemh1', maxChapters: 7, title: 'Mathematics Part I' },
      { code: 'lemh2', maxChapters: 6, title: 'Mathematics Part II' },
    ],
    biology: [{ code: 'lebo1', maxChapters: 16, title: 'Biology' }],
    // Humanities
    history: [
      { code: 'lehs1', maxChapters: 4, title: 'Themes in Indian History Part I' },
      { code: 'lehs2', maxChapters: 4, title: 'Themes in Indian History Part II' },
      { code: 'lehs3', maxChapters: 4, title: 'Themes in Indian History Part III' },
    ],
    geography: [
      { code: 'legy1', maxChapters: 8, title: 'Fundamentals of Human Geography' },
      { code: 'legy2', maxChapters: 12, title: 'India: People and Economy' },
      { code: 'legy3', maxChapters: 7, title: 'Practical Work in Geography Part II' },
    ],
    political_science: [
      { code: 'leps1', maxChapters: 9, title: 'Contemporary World Politics' },
      { code: 'leps2', maxChapters: 9, title: 'Politics in India since Independence' },
    ],
    economics: [
      { code: 'leec1', maxChapters: 6, title: 'Introductory Macroeconomics' },
      { code: 'leec2', maxChapters: 6, title: 'Introductory Microeconomics' },
    ],
    sociology: [
      { code: 'lesy1', maxChapters: 6, title: 'Indian Society' },
      { code: 'lesy2', maxChapters: 8, title: 'Social Change and Development in India' },
    ],
    // Commerce
    accountancy: [
      { code: 'leac1', maxChapters: 9, title: 'Accountancy Part I' },
      { code: 'leac2', maxChapters: 4, title: 'Accountancy Part II' },
    ],
    business_studies: [
      { code: 'lebs1', maxChapters: 7, title: 'Business Studies Part I' },
      { code: 'lebs2', maxChapters: 6, title: 'Business Studies Part II' },
    ],
    // Electives
    psychology: [{ code: 'lepy1', maxChapters: 10, title: 'Psychology' }],
    computer_science: [{ code: 'lecs1', maxChapters: 8, title: 'Computer Science' }],
    informatics_practices: [{ code: 'leip1', maxChapters: 7, title: 'Informatics Practices' }],
    physical_education: [
      { code: 'lehp1', maxChapters: 12, title: 'Health and Physical Education' },
    ],
  },
}

// ---------------------------------------------------------------------------
// Scraper
// ---------------------------------------------------------------------------

/**
 * Return all available PdfSource entries for a given class + subject combo.
 * Probes chapter URLs via HEAD requests; stops the first time a chapter is missing.
 */
export async function getNcertPdfSources(
  classLevel: ClassLevel,
  subject: Subject,
): Promise<{ sources: PdfSource[]; failed: import('@spikequiz/shared').FailedPdfLinkInsert[] }> {
  const classEntry = NCERT_CATALOG[classLevel]
  if (!classEntry) return { sources: [], failed: [] }

  const books = classEntry[subject]
  if (!books || books.length === 0) return { sources: [], failed: [] }

  const sources: PdfSource[] = []
  const failed: import('@spikequiz/shared').FailedPdfLinkInsert[] = []

  for (const book of books) {
    for (let chapter = 1; chapter <= book.maxChapters; chapter++) {
      const url = getNcertChapterUrl(book.code, chapter)
      const exists = await validatePdfUrl(url)
      if (!exists) {
        failed.push({
          url,
          subject,
          class: classLevel,
          source_type: 'ncert',
          reason: 'HTTP HEAD validation failed',
        })
        break
      }

      sources.push({
        url,
        subject,
        class: classLevel,
        source_type: 'ncert',
        filename: `ncert_cl${classLevel}_${subject}_${book.code}_ch${chapter.toString().padStart(2, '0')}.pdf`,
      })
    }
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
export async function downloadNcertPdf(url: string, destPath: string): Promise<void> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${res.status}`)
  }
  const buffer = await res.arrayBuffer()
  await Bun.write(destPath, buffer)
}
