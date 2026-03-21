export {
  downloadExemplarPdf,
  EXEMPLAR_CATALOG,
  getExemplarChapterUrl,
  getExemplarPdfSources,
} from './exemplar'
export {
  downloadNcertPdf,
  getNcertChapterUrl,
  getNcertPdfSources,
  NCERT_CATALOG,
} from './ncert'
export {
  downloadOswaal360Pdf,
  getOswaal360PdfSources,
} from './oswaal360'
export type { AcademicYear, Language, PaperType, SamplePaperConfig } from './sample-paper'
export {
  CLASS_10_SUBJECTS,
  CLASS_12_SUBJECTS,
  downloadSamplePaper,
  formatAcademicYear,
  getCoreSamplePapers,
  getSamplePaperSources,
  getSamplePaperUrl,
  MARKING_SCHEME_EXCEPTIONS,
  SAMPLE_PAPER_CATALOG,
  samplePaperExists,
} from './sample-paper'
export type { PdfSource, ScraperConfig, SourceType } from './types'
export { validatePdfUrl } from './utils'
