import type { Database } from 'bun:sqlite'

export function createSchema(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      subject TEXT NOT NULL CHECK(subject IN ('physics', 'chemistry', 'math', 'biology')),
      class INTEGER NOT NULL CHECK(class IN (11, 12)),
      chapter_no INTEGER NOT NULL,
      chapter_name TEXT NOT NULL,
      topic TEXT NOT NULL,
      reference TEXT NOT NULL,
      year INTEGER,
      exam_type TEXT CHECK(exam_type IN ('jee', 'neet', 'board')),
      difficulty INTEGER NOT NULL CHECK(difficulty >= 0 AND difficulty <= 10),
      marks INTEGER,
      question_type TEXT NOT NULL CHECK(question_type IN ('mcq', 'short', 'long', 'assertion', 'match', 'numerical')),
      question_text TEXT NOT NULL,
      options TEXT,
      has_solution INTEGER NOT NULL DEFAULT 0,
      solved INTEGER NOT NULL DEFAULT 0,
      solution TEXT,
      tags TEXT NOT NULL DEFAULT '[]',
      images TEXT NOT NULL DEFAULT '[]',
      needs_image INTEGER NOT NULL DEFAULT 0,
      image_prompt TEXT,
      flag TEXT NOT NULL DEFAULT 'none' CHECK(flag IN ('none', 'need_review')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject)
  `)
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_questions_class ON questions(class)
  `)
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_questions_chapter ON questions(chapter_no)
  `)
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic)
  `)
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_questions_exam_type ON questions(exam_type)
  `)
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty)
  `)
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_questions_flag ON questions(flag)
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS failed_pdf_links (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      source_type TEXT NOT NULL,
      subject TEXT NOT NULL,
      class INTEGER NOT NULL,
      year INTEGER,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_failed_links_lookup ON failed_pdf_links(source_type, subject, class)
  `)
}
