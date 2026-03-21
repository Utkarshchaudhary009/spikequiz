# @spikequiz/scraper

NCERT chapter PDF scraper/URL generator for `@spikequiz`.

## Features

- **Zero-Dependency URL Construction:** Pure deterministic extraction of chapter URLs without fetching entire pages.
- **Comprehensive NCERT Catalog:** Full support for Classes 6-12 across all major streams:
  - **Science:** Physics, Chemistry, Math, Biology, Science (Classes 6-10)
  - **Humanities:** History, Geography, Political Science, Economics, Sociology
  - **Commerce:** Accountancy, Business Studies
  - **Electives:** Computer Science, Informatics Practices, Physical Education, Psychology, Statistics
- **Smart Runtime Probing:** Validates chapter existence via HTTP `HEAD` requests to gracefully stop at the actual end of a book.
- **NEP 2023-24 Support:** Automatically maps to new NEP books like *Curiosity* (Class 6 Science) and *Ganita Prakash* (Class 6 Math).

## Usage

```ts
import { getNcertPdfSources, downloadNcertPdf } from '@spikequiz/scraper';

// 1. Get all chapters for a specific class & subject
const sources = await getNcertPdfSources(11, 'physics');
console.log(sources);
// [
//   { url: 'https://ncert.nic.in/textbook/pdf/keph101.pdf', filename: 'ncert_cl11_physics_keph1_ch01.pdf', ... },
//   ...
// ]

// 2. Download a specific PDF
await downloadNcertPdf(sources[0].url, './temp/chapter1.pdf');
```

## Supported Sources

- [x] NCERT Textbooks
- [x] NCERT Exemplar
- [ ] JEE PYQs (TODO)
- [ ] NEET PYQs (TODO)
- [x] Board Sample Papers (TODO)

## Adding New Sources

1. Create `src/{source}.ts` with fetcher function
2. Export from `src/index.ts`