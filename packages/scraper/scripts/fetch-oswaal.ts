import { write } from 'bun'

async function run() {
  const url = 'https://www.oswaal360.com/cbse/class-10/previous-year-question-papers'
  console.log(`Fetching ${url}...`)

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
  })
  const text = await res.text()
  await write('packages/scraper/temp/oswaal.html', text)
  console.log('Saved to packages/scraper/temp/oswaal.html')

  // Try to find PDF links or other links in the HTML
  const links = text.match(/href="([^"]+)"/g) || []
  const uniqueLinks = [...new Set(links)]
    .map((l) => l.replace('href="', '').replace('"', ''))
    .filter((l) => l.includes('oswaal360') || l.startsWith('/'))

  console.log(`Found ${uniqueLinks.length} internal links.`)

  const relevantLinks = uniqueLinks.filter(
    (l) => l.includes('class-10') || l.includes('previous-year') || l.includes('pdf'),
  )
  console.log('Relevant links:')
  console.log(relevantLinks.slice(0, 30))
}

run().catch(console.error)
