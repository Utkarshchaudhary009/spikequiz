import type { Chapter } from '@spikequiz/shared'
import { Output, generateText } from 'ai'
import { model } from './provider'
import { type SecondaryClassifierOutput, secondaryClassifierOutputSchema } from './schemas'

export interface SecondaryClassifierInput {
  questionText: string
  chapter: Chapter
}

export async function classifySecondary(input: SecondaryClassifierInput): Promise<SecondaryClassifierOutput> {
  const topicList = input.chapter.topics.map((t, i) => `${i + 1}. ${t}`).join('\n')

  const { output } = await generateText({
    model,
    output: Output.object({
      schema: secondaryClassifierOutputSchema,
    }),
    prompt: `You are a question classification expert for "${input.chapter.chapter_name}".

AVAILABLE TOPICS:
${topicList}

TASK:
Classify the following question:
1. Identify the most relevant topic from the list above (use EXACT topic name)
2. Determine question type: mcq, short, long, assertion, match, or numerical
3. Generate 2-4 concept tags (each 2-3 words describing core concepts used)
4. If it's an MCQ, extract the options

QUESTION:
${input.questionText}`,
  })

  if (!output) {
    throw new Error('Failed to generate classification output')
  }

  return output
}
