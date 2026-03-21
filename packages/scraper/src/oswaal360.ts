import type { ClassLevel, Subject } from '@spikequiz/shared'
import type { PdfSource, ScraperConfig } from './types'
import { validatePdfUrl } from './utils'

// Map from Oswaal360 folder name to our standard Subject type
const SUBJECT_MAP: Record<string, Subject> = {
  science: 'science',
  social_science: 'social_science',
  english: 'english',
  hindi: 'hindi',
  hindi_a: 'hindi',
  hindi_b: 'hindi',
  maths_standard: 'math',
  maths_basic: 'math',
  mathematics: 'math',
  physics: 'physics',
  chemistry: 'chemistry',
  biology: 'biology',
  history: 'history',
  geography: 'geography',
  political_science: 'political_science',
  economics: 'economics',
  sociology: 'sociology',
  accountancy: 'accountancy',
  business_studies: 'business_studies',
  statistics: 'statistics',
  psychology: 'psychology',
  computer_science: 'computer_science',
  informatics_practices: 'informatics_practices',
  physical_education: 'physical_education',
}

const OSWAAL360_BASE_URL = 'https://www.oswaal360.com'

const CLASS_PAGES: Record<ClassLevel, string | null> = {
  6: null,
  7: null,
  8: null,
  9: null,
  10: `${OSWAAL360_BASE_URL}/pages/cbse-class-10-previous-year-question-papers-with-solution-free-pdf-download`,
  11: null,
  12: `${OSWAAL360_BASE_URL}/pages/cbse-class-12-previous-year-question-papers-with-solution-free-pdf-download`,
}

/**
 * Extracts the 4-digit year from an Oswaal360 filename.
 * E.g. "Solved Paper 2018.pdf" -> 2018
 * "Solved%20paper%202019" -> 2019
 */
function extractYearFromFilename(filename: string): number | undefined {
  const match = filename.match(/\b(20\d{2})\b/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return undefined
}

/**
 * Parses an Oswaal PDF URL to determine class, subject, year.
 * URL shape: /pluginfile.php/.../cbse/class10/maths_standard/Solved%20Paper%202016.pdf
 */
function parsePdfUrl(
  url: string,
): { classLvl: ClassLevel; subject: Subject; year: number | undefined; filename: string } | null {
  try {
    const decodedUrl = decodeURI(url)
    const urlParts = decodedUrl.split('/')
    const filename = urlParts[urlParts.length - 1]

    // Check if it's a CBSE PYQ PDF
    const cbseIndex = urlParts.indexOf('cbse')
    if (cbseIndex === -1 || cbseIndex + 2 >= urlParts.length) return null

    const classFolder = urlParts[cbseIndex + 1] // e.g., "class10"
    const subjectFolder = urlParts[cbseIndex + 2].toLowerCase()

    // Must be "class" + number
    const classMatch = classFolder.match(/^class(\d+)$/)
    if (!classMatch) return null
    const classLvl = parseInt(classMatch[1], 10) as ClassLevel

    const mappedSubject = SUBJECT_MAP[subjectFolder]
    if (!mappedSubject) {
      console.warn(`[Oswaal Scraper] Unmapped subject folder: ${subjectFolder}`)
      return null
    }

    const year = extractYearFromFilename(filename)

    return { classLvl, subject: mappedSubject, year, filename }
  } catch (err) {
    return null
  }
}

/**
 * Fetch and extract all valid PdfSource entries for a given class from Oswaal360.
 */
export async function getOswaal360PdfSources(
  classLevel: ClassLevel,
  filterSubject?: Subject,
): Promise<{ sources: PdfSource[]; failed: import('@spikequiz/shared').FailedPdfLinkInsert[] }> {
  const pageUrl = CLASS_PAGES[classLevel]
  if (!pageUrl) {
    return { sources: [], failed: [] } // Class not supported for Oswaal360 PYQs in our map
  }

  const res = await fetch(pageUrl)
  if (!res.ok) {
    throw new Error(`Failed to fetch Oswaal360 landing page: HTTP ${res.status}`)
  }

  const html = await res.text()

  // Match all hrefs ending with .pdf
  // Using a broad regex since we'll filter them later
  const hrefRegex = /href="([^"]+\.pdf)"/gi
  const matches = [...html.matchAll(hrefRegex)]

  const rawUrls = matches.map((m) => m[1]).filter((url) => url.includes('pyp/cbse/class'))

  // Deduplicate URL list
  const uniqueUrls = [...new Set(rawUrls)]

  const potentialSources: PdfSource[] = []

  for (const rawUrl of uniqueUrls) {
    const fullUrl = rawUrl.startsWith('http') ? rawUrl : `${OSWAAL360_BASE_URL}${rawUrl}`
    const parsed = parsePdfUrl(rawUrl)

    if (parsed) {
      if (parsed.classLvl === classLevel && (!filterSubject || filterSubject === parsed.subject)) {
        potentialSources.push({
          url: fullUrl,
          subject: parsed.subject,
          class: parsed.classLvl,
          source_type: 'pyq',
          year: parsed.year,
          filename: parsed.filename,
        })
      }
    }
  }

  const sources: PdfSource[] = []
  const failed: import('@spikequiz/shared').FailedPdfLinkInsert[] = []

  // Validate all potential sources concurrently
  await Promise.all(
    potentialSources.map(async (source) => {
      const isValid = await validatePdfUrl(source.url)
      if (isValid) {
        sources.push(source)
      } else {
        failed.push({
          url: source.url,
          subject: source.subject as Subject,
          class: source.class,
          year: source.year,
          source_type: 'pyq',
          reason: 'HTTP HEAD validation failed',
        })
      }
    }),
  )

  return { sources, failed }
}

/**
 * Download an Oswaal360 PDF from `url` and write it to `destPath`.
 * Uses native Bun APIs (Bun.file / Bun.write).
 */
export async function downloadOswaal360Pdf(url: string, destPath: string): Promise<void> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to download Oswaal PDF ${url}: HTTP ${res.status}`)
  }
  const buffer = await res.arrayBuffer()
  await Bun.write(destPath, buffer)
}
