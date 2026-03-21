import { z } from 'zod'

export const primaryClassifierOutputSchema = z.object({
  questions: z.array(
    z.object({
      question_text: z.string().describe('The full question text'),
      chapter_no: z.number().describe('Chapter number from syllabus'),
      chapter_name: z.string().describe('Chapter name from syllabus'),
      reference: z.string().describe('Reference like "Example 6", "Ex 3.2 Q-2", "Q-4"'),
      difficulty: z.number().min(0).max(10).describe('Difficulty 0-10'),
      marks: z.number().optional().describe('Marks if mentioned'),
      has_solution: z.boolean().describe('Whether solution is present in source'),
      solution: z.string().optional().describe('Solution text if present'),
      needs_image: z.boolean().describe('Whether question requires a diagram/image to understand'),
      image_prompt: z
        .string()
        .optional()
        .describe('Prompt to generate the required image if needs_image is true'),
    }),
  ),
})

export const secondaryClassifierOutputSchema = z.object({
  topic: z.string().describe('Specific topic from chapter topics list'),
  question_type: z
    .enum(['mcq', 'short', 'long', 'assertion', 'match', 'numerical'])
    .describe('Type of question'),
  tags: z.array(z.string()).min(2).max(4).describe('2-4 concept tags, each 2-3 words'),
  options: z.array(z.string()).optional().describe('MCQ options if question_type is mcq'),
})

export type PrimaryClassifierOutput = z.infer<typeof primaryClassifierOutputSchema>
export type SecondaryClassifierOutput = z.infer<typeof secondaryClassifierOutputSchema>
