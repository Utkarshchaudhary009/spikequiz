import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { classifyPrimary } from './src/primary'
import type { Subject, ClassLevel, SubjectSyllabus } from '@spikequiz/shared'

async function runRandomTest() {
  const tempDir = join(process.cwd(), '../../temp')
  const files = (await readdir(tempDir)).filter((f) => f.endsWith('.pdf'))

  if (files.length === 0) {
    console.error('No PDF files found in temp directory')
    return
  }

  const randomFile = files[Math.floor(Math.random() * files.length)]
  const filePath = join(tempDir, randomFile)

  console.log(`\n--- Testing with file: ${randomFile} ---`)

  // Mock syllabus for testing
  const mockSyllabus: SubjectSyllabus = {
    subject: 'science' as Subject,
    class: 10 as ClassLevel,
    chapters: [
      { chapter_no: 1, chapter_name: 'Chemical Reactions and Equations', topics: [] },
      { chapter_no: 2, chapter_name: 'Acids, Bases and Salts', topics: [] },
      { chapter_no: 3, chapter_name: 'Metals and Non-metals', topics: [] },
      { chapter_no: 4, chapter_name: 'Carbon and its Compounds', topics: [] },
      { chapter_no: 5, chapter_name: 'Life Processes', topics: [] },
    ],
  }

  try {
    const file = Bun.file(filePath)
    const buffer = await file.arrayBuffer()

    const result = await classifyPrimary({
      source: {
        type: 'buffer',
        data: new Uint8Array(buffer),
        mediaType: 'application/pdf',
      },
      subject: 'science' as Subject,
      classLevel: 10 as ClassLevel,
      syllabus: mockSyllabus,
    })

    console.log('\n--- Classification Result ---')
    console.log(JSON.stringify(result, null, 2))
    console.log('\n--- End of Result ---')
  } catch (error) {
    console.error('\n--- Test Failed ---')
    console.error(error)
  }
}

runRandomTest()
