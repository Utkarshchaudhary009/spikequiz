# SpikeQuiz

Question extraction & classification tool for NCERT, Exemplar, PYQs, and Sample Papers.

## Architecture

```
packages/
├── shared/        # Types, constants
├── db/            # SQLite (bun:sqlite) storage
├── context/       # Syllabus data (chapters, topics) for AI context
├── scraper/       # Auto-fetch PDF links from sources
├── classifier/    # AI-powered PDF parsing & classification (Gemini)
└── image-gen/     # AI image generation for diagrams
```

## Pipeline

```
Source PDFs → scraper → classifier (primary, PDF attachment) → classifier (secondary) → image-gen → db
```

## Setup

```bash
bun install

# Install and authenticate Gemini CLI
npm install -g @google/gemini-cli
gemini  # Follow interactive auth setup
```

## Commands

```bash
bun lint       # Check linting
bun lint:fix   # Fix linting issues
bun fmt        # Format code
bun typecheck  # Type check all packages
bun test       # Run tests
```

## AI Provider

Uses **Gemini 3.1 Pro Preview** via `ai-sdk-provider-gemini-cli` with OAuth authentication. PDFs are sent directly as file attachments to the model.
