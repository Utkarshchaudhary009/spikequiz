import type { ClassLevel, Subject, SubjectSyllabus } from '@spikequiz/shared'
import { Output, generateText } from 'ai'
import { model } from './provider'
import { type PrimaryClassifierOutput, primaryClassifierOutputSchema } from './schemas'

export type FileSource =
  | { type: 'url'; url: string }
  | { type: 'base64'; data: string; mediaType: string }
  | { type: 'buffer'; data: ArrayBuffer | Uint8Array; mediaType: string }

export interface PrimaryClassifierInput {
  source: FileSource
  subject: Subject
  classLevel: ClassLevel
  syllabus: SubjectSyllabus
}

export async function classifyPrimary(
  input: PrimaryClassifierInput,
): Promise<PrimaryClassifierOutput> {
  const chapterList = input.syllabus.chapters
    .map((c) => `${c.chapter_no}. ${c.chapter_name}`)
    .join('\n')

  let fileData: string | Uint8Array | ArrayBuffer | URL
  let mediaType: string = 'application/pdf'

  if (input.source.type === 'url') {
    fileData = new URL(input.source.url)
  } else if (input.source.type === 'base64') {
    fileData = input.source.data
    mediaType = input.source.mediaType
  } else {
    fileData = input.source.data
    mediaType = input.source.mediaType
  }

  try {
    const { output } = await generateText({
      model,
      output: Output.object({
        schema: primaryClassifierOutputSchema,
      }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a question extraction and classification expert for ${input.subject.toUpperCase()} Class ${input.classLevel}.

            SYLLABUS CHAPTERS:
            ${chapterList}

            TASK:
            Extract all questions from the attached PDF document. For each question:
            1. Identify which chapter it belongs to (use EXACT chapter number and name from syllabus)
            2. Extract the reference (e.g., "Example 6", "Exercise 3.2 Q-2", "Q-4", etc.)
            3. Rate difficulty 0-10 based on concept complexity
            4. Extract marks if mentioned
            5. Check if solution is present and extract it
            6. Determine if the question needs a diagram/image to be understood
            7. If needs_image is true, write a clear prompt to generate that image`,
            },
            {
              type: 'file',
              data: fileData,
              mediaType: mediaType as any,
            },
          ],
        },
      ],
    })

    return output
  } catch (error) {
    console.error('Error in primary classifier:', error)
    throw error
  }
}
