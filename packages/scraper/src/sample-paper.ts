import type { ClassLevel } from '@spikequiz/shared'
import type { PdfSource, SourceType } from './types'
import { validatePdfUrl } from './utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AcademicYear = `${number}_${number}` // e.g., '2025_26'

export type PaperType = 'sqp' | 'ms' // Sample Question Paper or Marking Scheme

export type Language = 'en' | 'hi' // English or Hindi

export interface SamplePaperConfig {
  subject: import('@spikequiz/shared').Subject | string
  filename: string
  classLevel: 10 | 12
  availableInHindi?: boolean
}

// ---------------------------------------------------------------------------
// URL construction
// ---------------------------------------------------------------------------

const CBSE_BASE_URL = 'https://cbseacademic.nic.in'

/**
 * Build the academic year string from start year.
 * e.g., year 2025 -> '2025_26'
 */
export function formatAcademicYear(startYear: number): AcademicYear {
  return `${startYear}_${startYear + 1}` as AcademicYear
}

/**
 * Get the class directory name for URL construction.
 */
function getClassDir(classLevel: 10 | 12, year: AcademicYear): string {
  const classPrefix = classLevel === 10 ? 'ClassX' : 'ClassXII'
  return `${classPrefix}_${year}`
}

/**
 * Build a sample paper PDF URL.
 */
export function getSamplePaperUrl(params: {
  classLevel: 10 | 12
  year: AcademicYear
  filename: string
  paperType: PaperType
  language?: Language
}): string {
  const { classLevel, year, filename, paperType, language = 'en' } = params
  const classDir = getClassDir(classLevel, year)
  const suffix = paperType === 'sqp' ? 'SQP' : 'MS'
  const langSuffix = language === 'hi' ? '_hi' : ''
  return `${CBSE_BASE_URL}/web_material/SQP/${classDir}/${filename}-${suffix}${langSuffix}.pdf`
}

// ---------------------------------------------------------------------------
// Catalogs
// ---------------------------------------------------------------------------

/**
 * Class 10 sample paper subjects with their URL filename codes.
 * Note: Filename codes have some inconsistencies from CBSE.
 */
export const CLASS_10_SUBJECTS: SamplePaperConfig[] = [
  // Core subjects
  { subject: 'science', filename: 'Science', classLevel: 10, availableInHindi: true },
  { subject: 'math_basic', filename: 'MathsBasic', classLevel: 10, availableInHindi: true },
  { subject: 'math_standard', filename: 'MathsStandard', classLevel: 10, availableInHindi: true },
  { subject: 'social_science', filename: 'SocialScience', classLevel: 10, availableInHindi: true },
  { subject: 'english_ll', filename: 'EnglishL', classLevel: 10 },
  { subject: 'english_comm', filename: 'EnglishComm', classLevel: 10 },
  { subject: 'hindi_a', filename: 'HindiCourseA', classLevel: 10 },
  { subject: 'hindi_b', filename: 'HindiCourseB', classLevel: 10 },

  // Other subjects
  { subject: 'home_science', filename: 'HomeScience', classLevel: 10, availableInHindi: true },
  { subject: 'computer_applications', filename: 'ComputerApplication', classLevel: 10 },
  { subject: 'elements_business', filename: 'ElementsBusiness', classLevel: 10 },
  { subject: 'elements_accountancy', filename: 'ElementsBookKeepingAccountancy', classLevel: 10 },
  { subject: 'ncc', filename: 'NCC', classLevel: 10 },
  { subject: 'painting', filename: 'Painting', classLevel: 10, availableInHindi: true },

  // Music
  { subject: 'hindustani_melodic', filename: 'HindustaniMelodic', classLevel: 10 },
  { subject: 'hindustani_percussion', filename: 'HindustaniMusicPercussion', classLevel: 10 },
  { subject: 'hindustani_vocal', filename: 'HindustaniVocal', classLevel: 10 },
  { subject: 'carnatic_melodic', filename: 'CarnaticMelodicInstrument', classLevel: 10 },
  { subject: 'carnatic_percussion', filename: 'CarnaticMusicPercussion', classLevel: 10 },
  { subject: 'carnatic_vocal', filename: 'CarnaticMusicVocal', classLevel: 10 },

  // Languages
  { subject: 'arabic', filename: 'Arabic', classLevel: 10 },
  { subject: 'assamese', filename: 'Assamese', classLevel: 10 },
  { subject: 'bengali', filename: 'Bengali', classLevel: 10 },
  { subject: 'bhoti', filename: 'Bhoti', classLevel: 10 }, // Note: sometimes uses underscore
  { subject: 'bhutia', filename: 'Bhutia', classLevel: 10 },
  { subject: 'bodo', filename: 'Bodo', classLevel: 10 },
  { subject: 'bahasa_melayu', filename: 'BhashaMalyeu', classLevel: 10 },
  { subject: 'french', filename: 'French', classLevel: 10 },
  { subject: 'german', filename: 'German', classLevel: 10 },
  { subject: 'gujarati', filename: 'Gujarati', classLevel: 10 },
  { subject: 'gurung', filename: 'Gurung', classLevel: 10 },
  { subject: 'japanese', filename: 'Japanese', classLevel: 10 },
  { subject: 'kannada', filename: 'Kannada', classLevel: 10 },
  { subject: 'kashmiri', filename: 'Kashmiri', classLevel: 10 },
  { subject: 'kokborok', filename: 'Kokborok', classLevel: 10 }, // Note: uses underscore
  { subject: 'lepcha', filename: 'Lepcha', classLevel: 10 },
  { subject: 'limboo', filename: 'Limboo', classLevel: 10 },
  { subject: 'malayalam', filename: 'Malayalam', classLevel: 10 },
  { subject: 'manipuri', filename: 'Manipuri', classLevel: 10 },
  { subject: 'marathi', filename: 'Marathi', classLevel: 10 },
  { subject: 'mizo', filename: 'Mizo', classLevel: 10 },
  { subject: 'nepali', filename: 'Nepali', classLevel: 10 },
  { subject: 'odia', filename: 'Odia', classLevel: 10 },
  { subject: 'persian', filename: 'Persian', classLevel: 10 },
  { subject: 'punjabi', filename: 'Punjabi', classLevel: 10 },
  { subject: 'rai', filename: 'RAI', classLevel: 10 },
  { subject: 'russian', filename: 'Russian', classLevel: 10 },
  { subject: 'sanskrit', filename: 'Sanskrit', classLevel: 10 },
  { subject: 'sanskrit_comm', filename: 'Sanskrit-Comm', classLevel: 10 },
  { subject: 'sherpa', filename: 'Sherpa', classLevel: 10 },
  { subject: 'sindhi', filename: 'Sindhi', classLevel: 10 },
  { subject: 'spanish', filename: 'Spanish', classLevel: 10 },
  { subject: 'tamil', filename: 'Tamil', classLevel: 10 },
  { subject: 'tamang', filename: 'Tamang', classLevel: 10 },
  { subject: 'tangkhul', filename: 'Tangkhul', classLevel: 10 },
  { subject: 'telugu_ap', filename: 'TeluguAndhra', classLevel: 10 },
  { subject: 'telugu_telangana', filename: 'TeluguTelengana', classLevel: 10 },
  { subject: 'thai', filename: 'Thai', classLevel: 10 },
  { subject: 'tibetan', filename: 'Tibetan', classLevel: 10 },
  { subject: 'urdu_a', filename: 'UrduCourseA', classLevel: 10 },
  { subject: 'urdu_b', filename: 'UrduCourseB', classLevel: 10 },
]

/**
 * Class 12 sample paper subjects with their URL filename codes.
 */
export const CLASS_12_SUBJECTS: SamplePaperConfig[] = [
  // Science stream
  { subject: 'physics', filename: 'Physics', classLevel: 12, availableInHindi: true },
  { subject: 'chemistry', filename: 'Chemistry', classLevel: 12, availableInHindi: true },
  { subject: 'biology', filename: 'Biology', classLevel: 12, availableInHindi: true },
  { subject: 'biotechnology', filename: 'Biotechnology', classLevel: 12, availableInHindi: true },
  { subject: 'math', filename: 'Maths', classLevel: 12, availableInHindi: true },
  { subject: 'applied_math', filename: 'Applied-Maths', classLevel: 12, availableInHindi: true },
  { subject: 'computer_science', filename: 'ComputerScience', classLevel: 12 },
  { subject: 'informatics_practices', filename: 'InformaticsPractices', classLevel: 12 },

  // Commerce stream
  { subject: 'accountancy', filename: 'Accountancy', classLevel: 12 },
  { subject: 'business_studies', filename: 'BusinessStudies', classLevel: 12 },
  { subject: 'economics', filename: 'Economics', classLevel: 12 },
  { subject: 'entrepreneurship', filename: 'Entrepreneurship', classLevel: 12 },

  // Humanities stream
  { subject: 'history', filename: 'History', classLevel: 12 },
  { subject: 'geography', filename: 'Geography', classLevel: 12 },
  { subject: 'political_science', filename: 'PolSci', classLevel: 12, availableInHindi: true },
  { subject: 'psychology', filename: 'Psychology', classLevel: 12 },
  { subject: 'sociology', filename: 'Sociology', classLevel: 12, availableInHindi: true },
  { subject: 'home_science', filename: 'HomeScience', classLevel: 12 },
  { subject: 'legal_studies', filename: 'LegalStudies', classLevel: 12 },

  // Languages
  { subject: 'english_core', filename: 'EnglishCore', classLevel: 12 },
  { subject: 'english_elective', filename: 'EnglishElective', classLevel: 12 },
  { subject: 'hindi_core', filename: 'HindiCore', classLevel: 12 },
  { subject: 'hindi_elective', filename: 'HindiElective', classLevel: 12 },
  { subject: 'sanskrit_core', filename: 'SanskritCore', classLevel: 12 },
  { subject: 'sanskrit_elective', filename: 'SanskritElective', classLevel: 12 },
  { subject: 'urdu_core', filename: 'UrduCore', classLevel: 12 },
  { subject: 'urdu_elective', filename: 'UrduElective', classLevel: 12 },

  // Regional languages
  { subject: 'arabic', filename: 'Arabic', classLevel: 12 },
  { subject: 'assamese', filename: 'Assamese', classLevel: 12 },
  { subject: 'bengali', filename: 'Bengali', classLevel: 12 },
  { subject: 'bhoti', filename: 'Bhoti', classLevel: 12 },
  { subject: 'bhutia', filename: 'Bhutia', classLevel: 12 },
  { subject: 'bodo', filename: 'Bodo', classLevel: 12 },
  { subject: 'french', filename: 'French', classLevel: 12 },
  { subject: 'german', filename: 'German', classLevel: 12 },
  { subject: 'gujarati', filename: 'Gujarati', classLevel: 12 },
  { subject: 'japanese', filename: 'Japanese', classLevel: 12 },
  { subject: 'kannada', filename: 'Kannada', classLevel: 12 },
  { subject: 'kashmiri', filename: 'Kashmiri', classLevel: 12 },
  { subject: 'kokborok', filename: 'Kokborok', classLevel: 12 }, // Note: uses underscore
  { subject: 'lepcha', filename: 'Lepcha', classLevel: 12 },
  { subject: 'limboo', filename: 'Limboo', classLevel: 12 },
  { subject: 'malayalam', filename: 'Malayalam', classLevel: 12 },
  { subject: 'manipuri', filename: 'Manipuri', classLevel: 12 },
  { subject: 'marathi', filename: 'Marathi', classLevel: 12 },
  { subject: 'mizo', filename: 'Mizo', classLevel: 12 },
  { subject: 'nepali', filename: 'Nepali', classLevel: 12 },
  { subject: 'odia', filename: 'ODIA', classLevel: 12 },
  { subject: 'persian', filename: 'Persian', classLevel: 12 },
  { subject: 'punjabi', filename: 'Punjabi', classLevel: 12 },
  { subject: 'russian', filename: 'Russian', classLevel: 12 },
  { subject: 'sindhi', filename: 'Sindhi', classLevel: 12 },
  { subject: 'spanish', filename: 'Spanish', classLevel: 12 },
  { subject: 'tamil', filename: 'Tamil', classLevel: 12 },
  { subject: 'tangkhul', filename: 'TangkhulMIL', classLevel: 12 },
  { subject: 'telugu_ap', filename: 'TeluguAP', classLevel: 12 },
  { subject: 'telugu_telangana', filename: 'TeluguTL', classLevel: 12 },
  { subject: 'tibetan', filename: 'Tibetan', classLevel: 12 },

  // Fine Arts
  { subject: 'painting', filename: 'Painting', classLevel: 12, availableInHindi: true },
  { subject: 'graphic', filename: 'Graphic', classLevel: 12, availableInHindi: true },
  { subject: 'sculpture', filename: 'Sculpture', classLevel: 12, availableInHindi: true },
  { subject: 'applied_arts', filename: 'Applied_Arts', classLevel: 12, availableInHindi: true }, // Note: uses underscore

  // Dance
  { subject: 'bharatanatyam', filename: 'Bharatnatyam', classLevel: 12, availableInHindi: true },
  { subject: 'kathak', filename: 'Kathak', classLevel: 12, availableInHindi: true },
  { subject: 'kathakali', filename: 'Kathakali', classLevel: 12, availableInHindi: true },
  { subject: 'kuchipudi', filename: 'Kuchipudi', classLevel: 12, availableInHindi: true },
  { subject: 'manipuri_dance', filename: 'ManipuriDance', classLevel: 12, availableInHindi: true },
  { subject: 'odissi', filename: 'Odissi', classLevel: 12, availableInHindi: true },

  // Music
  { subject: 'hindustani_melodic', filename: 'HindustaniMelodic', classLevel: 12 },
  { subject: 'hindustani_percussion', filename: 'HindustaniPercussion', classLevel: 12 },
  { subject: 'hindustani_vocal', filename: 'HindustaniVocal', classLevel: 12 },
  { subject: 'carnatic_melodic', filename: 'CarnaticMusicMelodicInstrument', classLevel: 12 },
  { subject: 'carnatic_percussion', filename: 'CarnaticMusicPercussion', classLevel: 12 },
  { subject: 'carnatic_vocal', filename: 'CarnaticMusicVocal', classLevel: 12 },

  // Other subjects
  { subject: 'physical_education', filename: 'PhysicalEducation', classLevel: 12 },
  { subject: 'ncc', filename: 'NCC', classLevel: 12 },
  { subject: 'engineering_graphics', filename: 'EnggGraphics', classLevel: 12 },
  { subject: 'ktpi', filename: 'KTPI', classLevel: 12 },
]

/**
 * Combined catalog for both classes.
 */
export const SAMPLE_PAPER_CATALOG: Record<10 | 12, SamplePaperConfig[]> = {
  10: CLASS_10_SUBJECTS,
  12: CLASS_12_SUBJECTS,
}

// ---------------------------------------------------------------------------
// Exceptions catalog (URL naming inconsistencies)
// ---------------------------------------------------------------------------

/**
 * Known exceptions where the marking scheme filename differs from the SQP filename.
 * These are due to CBSE typos/inconsistencies.
 */
export const MARKING_SCHEME_EXCEPTIONS: Record<string, string> = {
  // Class 12 exceptions
  'Sculpture-MS': 'Scluputre-MS', // typo in CBSE URL
  'PhysicalEducation-MS': 'PhyscalEducation-MS', // typo in CBSE URL
}

// ---------------------------------------------------------------------------
// Scraper functions
// ---------------------------------------------------------------------------

/**
 * Get all available sample papers for a given class and year.
 */
export async function getSamplePaperSources(params: {
  classLevel: 10 | 12
  year: AcademicYear | number
  subjects?: string[]
  includeHindi?: boolean
  includeMarkingSchemes?: boolean
}): Promise<{ sources: PdfSource[]; failed: import('@spikequiz/shared').FailedPdfLinkInsert[] }> {
  const { classLevel, subjects, includeHindi = false, includeMarkingSchemes = true } = params
  const year = typeof params.year === 'number' ? formatAcademicYear(params.year) : params.year

  const catalog = SAMPLE_PAPER_CATALOG[classLevel]
  const filteredSubjects = subjects ? catalog.filter((s) => subjects.includes(s.subject)) : catalog

  const potentialSources: PdfSource[] = []

  for (const config of filteredSubjects) {
    // Add sample question paper (English)
    potentialSources.push({
      url: getSamplePaperUrl({ classLevel, year, filename: config.filename, paperType: 'sqp' }),
      subject: config.subject,
      class: classLevel,
      source_type: 'sample_paper',
      year: parseInt(year.split('_')[0], 10),
      filename: `${config.subject}_${year}_sqp.pdf`,
    })

    // Add marking scheme (English)
    if (includeMarkingSchemes) {
      const msFilename =
        MARKING_SCHEME_EXCEPTIONS[`${config.filename}-MS`] || `${config.filename}-MS`
      potentialSources.push({
        url: getSamplePaperUrl({
          classLevel,
          year,
          filename: msFilename.replace('-MS', ''),
          paperType: 'ms',
        }),
        subject: config.subject,
        class: classLevel,
        source_type: 'sample_paper',
        year: parseInt(year.split('_')[0], 10),
        filename: `${config.subject}_${year}_ms.pdf`,
      })
    }

    // Add Hindi versions if available
    if (includeHindi && config.availableInHindi) {
      potentialSources.push({
        url: getSamplePaperUrl({
          classLevel,
          year,
          filename: config.filename,
          paperType: 'sqp',
          language: 'hi',
        }),
        subject: config.subject,
        class: classLevel,
        source_type: 'sample_paper',
        year: parseInt(year.split('_')[0], 10),
        filename: `${config.subject}_${year}_sqp_hi.pdf`,
      })

      if (includeMarkingSchemes) {
        const msFilename =
          MARKING_SCHEME_EXCEPTIONS[`${config.filename}-MS`] || `${config.filename}-MS`
        potentialSources.push({
          url: getSamplePaperUrl({
            classLevel,
            year,
            filename: msFilename.replace('-MS', ''),
            paperType: 'ms',
            language: 'hi',
          }),
          subject: config.subject,
          class: classLevel,
          source_type: 'sample_paper',
          year: parseInt(year.split('_')[0], 10),
          filename: `${config.subject}_${year}_ms_hi.pdf`,
        })
      }
    }
  }

  const sources: PdfSource[] = []
  const failed: import('@spikequiz/shared').FailedPdfLinkInsert[] = []

  // Validate all potential sources concurrently
  await Promise.all(
    potentialSources.map(async (source) => {
      const isValid = await validatePdfUrl(source.url)
      if (isValid) {
        sources.push(source)
      } else {
        failed.push({
          url: source.url,
          subject: source.subject as import('@spikequiz/shared').Subject,
          class: source.class,
          year: source.year,
          source_type: 'sample_paper',
          reason: 'HTTP HEAD validation failed',
        })
      }
    }),
  )

  return { sources, failed }
}

/**
 * Download a sample paper PDF to the specified path.
 */
export async function downloadSamplePaper(url: string, destPath: string): Promise<void> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${res.status}`)
  }
  const buffer = await res.arrayBuffer()
  await Bun.write(destPath, buffer)
}

/**
 * Check if a sample paper URL exists (returns 200 OK).
 */
export async function samplePaperExists(url: string): Promise<boolean> {
  return validatePdfUrl(url)
}

/**
 * Get available sample papers for core subjects only.
 * Core subjects: Science, Math, Social Science (Class 10), Physics, Chemistry, Biology, Math (Class 12)
 */
export async function getCoreSamplePapers(params: {
  classLevel: 10 | 12
  year: AcademicYear | number
  includeMarkingSchemes?: boolean
}): Promise<{ sources: PdfSource[]; failed: import('@spikequiz/shared').FailedPdfLinkInsert[] }> {
  const coreSubjects10 = ['science', 'math_basic', 'math_standard', 'social_science']
  const coreSubjects12 = ['physics', 'chemistry', 'biology', 'math']

  return getSamplePaperSources({
    ...params,
    subjects: params.classLevel === 10 ? coreSubjects10 : coreSubjects12,
  })
}
