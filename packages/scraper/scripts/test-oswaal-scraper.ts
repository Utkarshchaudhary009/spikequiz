import { getOswaal360PdfSources, downloadOswaal360Pdf } from '../src/oswaal360'
import { join } from 'path'
import { mkdir } from 'fs/promises'

async function run() {
  console.log('Fetching Class 10 sources from Oswaal360...')
  const { sources: sourcesClass10, failed: failedClass10 } = await getOswaal360PdfSources(10)

  console.log(
    `Found ${sourcesClass10.length} valid Class 10 PDF sources and ${failedClass10.length} failed.`,
  )
  if (sourcesClass10.length > 0) {
    console.log('Sample Class 10 source:', sourcesClass10[0])
  }

  console.log('\nFetching Class 12 sources from Oswaal360...')
  const { sources: sourcesClass12, failed: failedClass12 } = await getOswaal360PdfSources(12)
  console.log(
    `Found ${sourcesClass12.length} valid Class 12 PDF sources and ${failedClass12.length} failed.`,
  )
  if (sourcesClass12.length > 0) {
    console.log('Sample Class 12 source:', sourcesClass12[0])
  }

  // Test downloading one PDF
  if (sourcesClass10.length > 0) {
    const testSource = sourcesClass10[0]
    console.log(`\nTesting download for: ${testSource.filename}...`)

    // Ensure temp dir exists
    const tempDir = join(import.meta.dir, '..', 'temp')
    await mkdir(tempDir, { recursive: true })

    const destPath = join(tempDir, testSource.filename || 'test.pdf')
    await downloadOswaal360Pdf(testSource.url, destPath)

    console.log(`Successfully downloaded to: ${destPath}`)

    const file = Bun.file(destPath)
    console.log(`File size: ${await file.size()} bytes for ${testSource.filename}`)
  }
}

run().catch(console.error)
