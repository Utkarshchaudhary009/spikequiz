# AGENTS.md

## Task Completion Requirements

- All of  `bun lint`, `bun fmt`, `bun typecheck` and `bun test` must pass before considering tasks completed.

## Project Snapshot

spikequiz is a Question extractor tool written in turborepo and bun. It take various sources like ncert pdfs, exampler pdfs, sample papers, pyqs(ALL SETS) to classify and store question for ease of access, filter and CRUD.

This repository is a VERY EARLY WIP. Proposing sweeping changes that improve long-term maintainability is encouraged.

## Core Priorities

1. Performance first.
2. Reliability first.
3. Keep behavior predictable under load and during failures.

If a tradeoff is required, choose correctness and robustness over short-term convenience.

## Maintainability

Long term maintainability is a core priority. If you add new functionality, first check if there are shared logic that can be extracted to a separate module. Duplicate logic across mulitple files is a code smell and should be avoided. Don't be afraid to change existing code. Don't take shortcuts by just adding local logic to solve a problem.

Prefer native Bun APIs(Bun.file,Bun.serve,bun:sqlite).
Keep packages small, clean, & pure for perfet turborepo caching.
For every New code you add, It is must to add new unit test(in test dir in that package) or update old as per need.

## Documentation
Maintain A clear, clean and easy to grasp READMEs for `apps/` and `packages/`
It is Must to update relevent `README.md` for any changes in code.
