import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import {
  downloadSamplePaper,
  getCoreSamplePapers,
  getSamplePaperSources,
  samplePaperExists,
} from '../src/sample-paper'

const TEMP_DIR = join(import.meta.dir, '..', '..', '..', 'temp')

if (!existsSync(TEMP_DIR)) {
  mkdirSync(TEMP_DIR, { recursive: true })
}

async function main() {
  console.log('=== CBSE Sample Paper Download Demo ===\n')

  // Test for academic year 2025-26
  const year = '2025_26'

  // Test Class 10 core subjects
  console.log('--- Class 10 Core Subjects ---\n')
  const class10CorePapers = getCoreSamplePapers({ classLevel: 10, year })
  console.log(`Found ${class10CorePapers.length} Class 10 core sample papers`)

  for (const paper of class10CorePapers.slice(0, 4)) {
    // Just first 4 (2 subjects with SQP + MS)
    console.log(`\nSubject: ${paper.subject}`)
    console.log(`URL: ${paper.url}`)
    console.log(`Filename: ${paper.filename}`)

    const exists = await samplePaperExists(paper.url)
    if (exists && paper.filename) {
      const destPath = join(TEMP_DIR, paper.filename)
      console.log(`Downloading to ${destPath}...`)
      try {
        await downloadSamplePaper(paper.url, destPath)
        console.log('Download successful!')
      } catch (e) {
        console.error(`Download failed: ${e}`)
      }
    } else {
      console.log('URL does not exist (skipping)')
    }
  }

  // Test Class 12 core subjects
  console.log('\n\n--- Class 12 Core Subjects ---\n')
  const class12CorePapers = getCoreSamplePapers({ classLevel: 12, year })
  console.log(`Found ${class12CorePapers.length} Class 12 core sample papers`)

  for (const paper of class12CorePapers.slice(0, 4)) {
    console.log(`\nSubject: ${paper.subject}`)
    console.log(`URL: ${paper.url}`)
    console.log(`Filename: ${paper.filename}`)

    const exists = await samplePaperExists(paper.url)
    if (exists && paper.filename) {
      const destPath = join(TEMP_DIR, paper.filename)
      console.log(`Downloading to ${destPath}...`)
      try {
        await downloadSamplePaper(paper.url, destPath)
        console.log('Download successful!')
      } catch (e) {
        console.error(`Download failed: ${e}`)
      }
    } else {
      console.log('URL does not exist (skipping)')
    }
  }

  // Test getting all papers for a specific subject
  console.log('\n\n--- Testing specific subject (Physics Class 12) ---\n')
  const physicsPapers = getSamplePaperSources({
    classLevel: 12,
    year,
    subjects: ['physics'],
    includeMarkingSchemes: true,
    includeHindi: true,
  })
  console.log(`Found ${physicsPapers.length} Physics papers (including Hindi versions)`)
  for (const paper of physicsPapers) {
    console.log(`  - ${paper.filename}: ${paper.url}`)
  }

  // Summary
  console.log('\n\n=== Summary ===')
  const allClass10 = getSamplePaperSources({ classLevel: 10, year })
  const allClass12 = getSamplePaperSources({ classLevel: 12, year })
  console.log(`Total Class 10 papers available: ${allClass10.length}`)
  console.log(`Total Class 12 papers available: ${allClass12.length}`)
  console.log(`\nDemo complete! Check the temp/ directory for downloaded files.`)
}

main().catch(console.error)
