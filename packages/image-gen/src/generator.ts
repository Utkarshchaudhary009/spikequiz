import { join } from 'node:path'
import OpenAI from 'openai'

const openai = new OpenAI()

export interface GeneratedImage {
  localPath: string
  prompt: string
}

export async function generateImage(
  prompt: string,
  outputDir: string,
  filename: string,
): Promise<GeneratedImage> {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `Educational diagram for physics/chemistry/math question: ${prompt}. 
Style: Clean, minimalist, black lines on white background, suitable for textbook. 
Include labels and annotations where needed.`,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
  })

  const imageUrl = response.data?.[0]?.url
  if (!imageUrl) {
    throw new Error('No image URL returned from OpenAI')
  }

  const imageResponse = await fetch(imageUrl)
  const imageBuffer = await imageResponse.arrayBuffer()

  const localPath = join(outputDir, filename)
  await Bun.write(localPath, imageBuffer)

  return {
    localPath,
    prompt,
  }
}

export async function generateQuestionImage(
  questionId: string,
  imagePrompt: string,
  outputDir = './images',
): Promise<string> {
  await Bun.write(join(outputDir, '.gitkeep'), '')

  const filename = `${questionId}.png`
  const result = await generateImage(imagePrompt, outputDir, filename)
  return result.localPath
}
