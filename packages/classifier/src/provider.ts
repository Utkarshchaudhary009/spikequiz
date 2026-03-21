import { createGeminiProvider } from 'ai-sdk-provider-gemini-cli'

export const gemini = createGeminiProvider({
  authType: 'oauth-personal',
})

export const model = gemini('gemini-3.1-pro-preview')
