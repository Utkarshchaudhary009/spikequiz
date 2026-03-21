import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { classifyPrimary } from './src/primary'
import { classifySecondary } from './src/secondary'
import type { Subject, ClassLevel, SubjectSyllabus, Chapter } from '@spikequiz/shared'

async function runClassifier() {
  const tempDir = join(process.cwd(), '../../temp')
  let files: string[] = []
  
  try {
    files = (await readdir(tempDir)).filter((f) => f.endsWith('.pdf'))
  } catch (error) {
    console.error(`Error reading temp directory: ${tempDir}`)
    process.exit(1)
  }

  if (files.length === 0) {
    console.error('No PDF files found in temp directory')
    return
  }

  const randomFile = files[Math.floor(Math.random() * files.length)]
  const filePath = join(tempDir, randomFile)

  console.log(`\n--- Using file: ${randomFile} ---`)

  // Mock syllabus for testing
  const mockSyllabus: SubjectSyllabus = {
    subject: 'science' as Subject,
    class: 10 as ClassLevel,
    chapters: [
      { 
        chapter_no: 1, 
        chapter_name: 'Chemical Reactions and Equations', 
        topics: ['Chemical Equations', 'Balanced Chemical Equations', 'Types of Chemical Reactions', 'Oxidation and Reduction'] 
      },
      { 
        chapter_no: 2, 
        chapter_name: 'Acids, Bases and Salts', 
        topics: ['Chemical Properties of Acids and Bases', 'Strength of Acid/Base Solutions', 'Salts'] 
      },
      { 
        chapter_no: 3, 
        chapter_name: 'Metals and Non-metals', 
        topics: ['Physical Properties', 'Chemical Properties of Metals', 'Reactivity Series', 'Ionic Compounds'] 
      },
    ],
  }

  try {
    console.log('Running Primary Classifier...')
    const file = Bun.file(filePath)
    const buffer = await file.arrayBuffer()

    const primaryResult = await classifyPrimary({
      source: {
        type: 'buffer',
        data: new Uint8Array(buffer),
        mediaType: 'application/pdf',
      },
      subject: 'science' as Subject,
      classLevel: 10 as ClassLevel,
      syllabus: mockSyllabus,
    })

    console.log(`Extracted ${primaryResult.questions.length} questions.`)

    const finalResults = []

    for (const question of primaryResult.questions.slice(0, 3)) { // Limit to 3 for testing
      console.log(`\nClassifying Question: "${question.question_text.substring(0, 50)}..."`)
      
      const chapter = mockSyllabus.chapters.find(c => c.chapter_no === question.chapter_no)
      
      if (!chapter) {
        console.warn(`Warning: Could not find chapter ${question.chapter_no} in syllabus.`)
        finalResults.push({ ...question, secondary: null })
        continue
      }

      try {
        const secondaryResult = await classifySecondary({
          questionText: question.question_text,
          chapter: chapter
        })
        
        finalResults.push({
          ...question,
          secondary: secondaryResult
        })
      } catch (secError) {
        console.error(`Error in secondary classification for question:`, secError)
        finalResults.push({ ...question, secondary: null, error: 'Secondary failed' })
      }
    }

    console.log('\n--- Final Combined Result (Top 3) ---')
    console.log(JSON.stringify(finalResults, null, 2))
    console.log('\n--- End of Execution ---')
  } catch (error) {
    console.error('\n--- Execution Failed ---')
    console.error(error)
  }
}

runClassifier()
