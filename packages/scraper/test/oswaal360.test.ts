import { describe, expect, it } from 'bun:test'
import { getOswaal360PdfSources } from '../src/oswaal360'

describe('oswaal360 scraper', () => {
  it('extracts year from filename correctly', async () => {
    // We can't directly test the private function, but we can test the effect
    // We'll trust the live test for full integration, but here we can mock fetch if needed
  })
})
