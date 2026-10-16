---
description: Phase 3 - execute the approved plan with strict TDD, then hand off to review
argument-hint: [feature-id]
---

Execute the approved plan with strict TDD.

Target: `$ARGUMENTS`, or (if empty) the active feature in `context/features/` with Gate 2 approved.

Use the `tdd-loop` skill. Delegate each task to the `tdd-implementer` subagent (sequentially unless tasks are marked `[P]`), verify each report by checking the diff and re-running tests, and update `03-plan.md`, `04-test-cases.md`, `05-implementation-log.md`, and `STATUS.md`. When all tasks are done, continue automatically into the `code-review` skill.
