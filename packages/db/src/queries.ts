import type { Database } from 'bun:sqlite'
import type { Question, QuestionInsert } from '@spikequiz/shared'

export function insertQuestion(db: Database, question: QuestionInsert): string {
  const id = crypto.randomUUID()
  const stmt = db.prepare(`
    INSERT INTO questions (
      id, source, subject, class, chapter_no, chapter_name, topic, reference,
      year, exam_type, difficulty, marks, question_type, question_text, options,
      has_solution, solved, solution, tags, images, needs_image, image_prompt, flag
    ) VALUES (
      $id, $source, $subject, $class, $chapter_no, $chapter_name, $topic, $reference,
      $year, $exam_type, $difficulty, $marks, $question_type, $question_text, $options,
      $has_solution, $solved, $solution, $tags, $images, $needs_image, $image_prompt, $flag
    )
  `)

  stmt.run({
    $id: id,
    $source: question.source,
    $subject: question.subject,
    $class: question.class,
    $chapter_no: question.chapter_no,
    $chapter_name: question.chapter_name,
    $topic: question.topic,
    $reference: question.reference,
    $year: question.year ?? null,
    $exam_type: question.exam_type ?? null,
    $difficulty: question.difficulty,
    $marks: question.marks ?? null,
    $question_type: question.question_type,
    $question_text: question.question_text,
    $options: question.options ? JSON.stringify(question.options) : null,
    $has_solution: question.has_solution ? 1 : 0,
    $solved: question.solved ? 1 : 0,
    $solution: question.solution ?? null,
    $tags: JSON.stringify(question.tags),
    $images: JSON.stringify(question.images),
    $needs_image: question.needs_image ? 1 : 0,
    $image_prompt: question.image_prompt ?? null,
    $flag: question.flag,
  })

  return id
}

export function getQuestionById(db: Database, id: string): Question | null {
  const stmt = db.prepare('SELECT * FROM questions WHERE id = $id')
  const row = stmt.get({ $id: id }) as Record<string, unknown> | null
  return row ? rowToQuestion(row) : null
}

export function getQuestionsByFilter(
  db: Database,
  filters: Partial<{
    subject: string
    class: number
    chapter_no: number
    topic: string
    exam_type: string
    difficulty_min: number
    difficulty_max: number
    flag: string
    solved: boolean
  }>,
  limit = 100,
  offset = 0,
): Question[] {
  const conditions: string[] = []
  const params: Record<string, unknown> = {}

  if (filters.subject) {
    conditions.push('subject = $subject')
    params.$subject = filters.subject
  }
  if (filters.class) {
    conditions.push('class = $class')
    params.$class = filters.class
  }
  if (filters.chapter_no) {
    conditions.push('chapter_no = $chapter_no')
    params.$chapter_no = filters.chapter_no
  }
  if (filters.topic) {
    conditions.push('topic = $topic')
    params.$topic = filters.topic
  }
  if (filters.exam_type) {
    conditions.push('exam_type = $exam_type')
    params.$exam_type = filters.exam_type
  }
  if (filters.difficulty_min !== undefined) {
    conditions.push('difficulty >= $difficulty_min')
    params.$difficulty_min = filters.difficulty_min
  }
  if (filters.difficulty_max !== undefined) {
    conditions.push('difficulty <= $difficulty_max')
    params.$difficulty_max = filters.difficulty_max
  }
  if (filters.flag) {
    conditions.push('flag = $flag')
    params.$flag = filters.flag
  }
  if (filters.solved !== undefined) {
    conditions.push('solved = $solved')
    params.$solved = filters.solved ? 1 : 0
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const query = `SELECT * FROM questions ${whereClause} LIMIT $limit OFFSET $offset`

  params.$limit = limit
  params.$offset = offset

  const stmt = db.prepare(query)
  const rows = stmt.all(params as Record<string, string | number | null>) as Record<
    string,
    unknown
  >[]
  return rows.map(rowToQuestion)
}

export function updateQuestion(
  db: Database,
  id: string,
  updates: Partial<QuestionInsert>,
): boolean {
  const setClauses: string[] = []
  const params: Record<string, unknown> = { $id: id }

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      const paramKey = `$${key}`
      setClauses.push(`${key} = ${paramKey}`)

      if (key === 'options' || key === 'tags' || key === 'images') {
        params[paramKey] = JSON.stringify(value)
      } else if (typeof value === 'boolean') {
        params[paramKey] = value ? 1 : 0
      } else {
        params[paramKey] = value
      }
    }
  }

  if (setClauses.length === 0) return false

  setClauses.push("updated_at = datetime('now')")

  const query = `UPDATE questions SET ${setClauses.join(', ')} WHERE id = $id`
  const stmt = db.prepare(query)
  const result = stmt.run(params as Record<string, string | number | null>)
  return result.changes > 0
}

export function deleteQuestion(db: Database, id: string): boolean {
  const stmt = db.prepare('DELETE FROM questions WHERE id = $id')
  const result = stmt.run({ $id: id })
  return result.changes > 0
}

function rowToQuestion(row: Record<string, unknown>): Question {
  return {
    id: row.id as string,
    source: row.source as string,
    subject: row.subject as Question['subject'],
    class: row.class as Question['class'],
    chapter_no: row.chapter_no as number,
    chapter_name: row.chapter_name as string,
    topic: row.topic as string,
    reference: row.reference as string,
    year: row.year as number | undefined,
    exam_type: row.exam_type as Question['exam_type'],
    difficulty: row.difficulty as number,
    marks: row.marks as number | undefined,
    question_type: row.question_type as Question['question_type'],
    question_text: row.question_text as string,
    options: row.options ? JSON.parse(row.options as string) : undefined,
    has_solution: Boolean(row.has_solution),
    solved: Boolean(row.solved),
    solution: row.solution as string | undefined,
    tags: JSON.parse(row.tags as string),
    images: JSON.parse(row.images as string),
    needs_image: Boolean(row.needs_image),
    image_prompt: row.image_prompt as string | undefined,
    flag: row.flag as Question['flag'],
    created_at: new Date(row.created_at as string),
    updated_at: new Date(row.updated_at as string),
  }
}

export function insertFailedPdfLink(
  db: Database,
  link: import('@spikequiz/shared').FailedPdfLinkInsert,
): string {
  const id = crypto.randomUUID()
  const stmt = db.prepare(`
    INSERT INTO failed_pdf_links (
      id, url, source_type, subject, class, year, reason
    ) VALUES (
      $id, $url, $source_type, $subject, $class, $year, $reason
    )
  `)

  stmt.run({
    $id: id,
    $url: link.url,
    $source_type: link.source_type,
    $subject: link.subject,
    $class: link.class,
    $year: link.year ?? null,
    $reason: link.reason,
  })

  return id
}

export function getFailedPdfLinks(
  db: Database,
  limit = 100,
  offset = 0,
): import('@spikequiz/shared').FailedPdfLink[] {
  const query = `SELECT * FROM failed_pdf_links ORDER BY created_at DESC LIMIT $limit OFFSET $offset`
  const stmt = db.prepare(query)
  const rows = stmt.all({ $limit: limit, $offset: offset }) as Record<string, unknown>[]

  return rows.map((row) => ({
    id: row.id as string,
    url: row.url as string,
    source_type: row.source_type as import('@spikequiz/shared').FailedPdfLink['source_type'],
    subject: row.subject as import('@spikequiz/shared').Subject,
    class: row.class as import('@spikequiz/shared').ClassLevel,
    year: row.year as number | undefined,
    reason: row.reason as string,
    created_at: new Date(row.created_at as string),
  }))
}

export function deleteFailedPdfLink(db: Database, id: string): boolean {
  const stmt = db.prepare('DELETE FROM failed_pdf_links WHERE id = $id')
  const result = stmt.run({ $id: id })
  return result.changes > 0
}
