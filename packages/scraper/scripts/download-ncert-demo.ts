import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { ClassLevel, Subject } from '@spikequiz/shared'
import { downloadNcertPdf, getNcertChapterUrl, NCERT_CATALOG } from '../src/ncert'

const TEMP_DIR = join(import.meta.dir, 'D://code//bun_projects//spikequiz//temp')

if (!existsSync(TEMP_DIR)) {
  mkdirSync(TEMP_DIR, { recursive: true })
}

// Map of interesting samples to download across streams and classes
const SAMPLES: Array<{ class: ClassLevel; subject: Subject }> = [
  { class: 6, subject: 'science' }, // New NEP (Curiosity)
  { class: 6, subject: 'math' }, // New NEP (Ganita Prakash)
  { class: 9, subject: 'science' }, // Standard secondary Science
  { class: 10, subject: 'math' }, // Standard secondary Math
  { class: 11, subject: 'physics' }, // Sr Sec Science part I
  { class: 12, subject: 'history' }, // Humanities
  { class: 11, subject: 'accountancy' }, // Commerce
  { class: 12, subject: 'psychology' }, // Electives
]

async function main() {
  console.log(`Downloading ${SAMPLES.length} sample chapters to ${TEMP_DIR}...\n`)

  for (const sample of SAMPLES) {
    const books = NCERT_CATALOG[sample.class]?.[sample.subject]
    if (!books || books.length === 0) {
      console.warn(`[SKIP] No books found for Class ${sample.class} ${sample.subject}`)
      continue
    }

    const firstBook = books[0]
    const chapterUrl = getNcertChapterUrl(firstBook.code, 1) // Always download Ch 1
    const filename = `ncert_cl${sample.class}_${sample.subject}_${firstBook.code}_ch01.pdf`
    const destPath = join(TEMP_DIR, filename)

    console.log(
      `[START] Class ${sample.class} ${sample.subject.padEnd(14)} -> ${firstBook.code} ch01`,
    )
    console.log(`        URL: ${chapterUrl}`)

    try {
      await downloadNcertPdf(chapterUrl, destPath)
      console.log(`[ OK  ] Saved as ${filename}\n`)
    } catch (e) {
      console.error(`[FAIL ] ${e}\n`)
    }
  }

  console.log('Demo complete! Check the temp/ directory.')
}

main().catch(console.error)
