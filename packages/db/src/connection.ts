import { Database } from 'bun:sqlite'
import { createSchema } from './schema'

let db: Database | null = null

export function getDb(dbPath = 'spikequiz.db'): Database {
  if (!db) {
    db = new Database(dbPath, { create: true })
    db.run('PRAGMA journal_mode = WAL')
    db.run('PRAGMA foreign_keys = ON')
    createSchema(db)
  }
  return db
}

export function closeDb(): void {
  if (db) {
    db.close()
    db = null
  }
}
