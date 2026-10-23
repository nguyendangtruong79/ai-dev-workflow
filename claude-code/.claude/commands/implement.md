---
description: Phase 3 - execute the approved plan with strict TDD, then hand off to review
argument-hint: [feature-id]
---

Execute the approved plan with strict TDD.

Target: `$ARGUMENTS`, or (if empty) the single non-DONE feature claimed in `context/ACTIVE.json`. If several are unfinished and no id was given, list them and stop.

Use the `tdd-loop` skill. Refuse to start unless `status.json` gate hashes still match the spec and plan. Run tasks strictly one at a time (ignore `[P]`). Delegate each task to `tdd-implementer` when possible; otherwise run the same loop inline and set `mode` to `inline`. Re-run tests yourself and append evidence to `status.json` before the next task. Update `03-plan.md`, `04-test-cases.md`, `05-implementation-log.md`, and `STATUS.md`. When all tasks are done, continue automatically into the `code-review` skill.
