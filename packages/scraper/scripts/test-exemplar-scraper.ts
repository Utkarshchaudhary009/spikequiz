import { getExemplarPdfSources, downloadExemplarPdf } from '../src/exemplar'
import { join } from 'path'
import { mkdir } from 'fs/promises'

async function run() {
  console.log('Fetching Class 10 Math Exemplar sources from NCERT...')
  const { sources: Math10, failed: f10 } = await getExemplarPdfSources(10, 'math')

  console.log(`Found ${Math10.length} valid Class 10 Math PDF sources and ${f10.length} failed.`)
  if (Math10.length > 0) {
    console.log('Sample Class 10 Math source:', Math10[0])
  }

  console.log('\nFetching Class 12 Physics Exemplar sources from NCERT...')
  const { sources: Phys12, failed: f12 } = await getExemplarPdfSources(12, 'physics')
  console.log(`Found ${Phys12.length} valid Class 12 Physics PDF sources and ${f12.length} failed.`)
  if (Phys12.length > 0) {
    console.log('Sample Class 12 Physics source:', Phys12[0])
  }

  // Test downloading one PDF
  if (Math10.length > 0) {
    const testSource = Math10[0]
    console.log(`\nTesting download for: ${testSource.filename}...`)

    // Ensure temp dir exists
    const tempDir = join(import.meta.dir, '..', 'temp')
    await mkdir(tempDir, { recursive: true })

    const destPath = join(tempDir, testSource.filename || 'test_exemplar.pdf')
    await downloadExemplarPdf(testSource.url, destPath)

    console.log(`Successfully downloaded to: ${destPath}`)

    const file = Bun.file(destPath)
    console.log(`File size: ${await file.size} bytes for ${testSource.filename}`)
  }
}

run().catch(console.error)
