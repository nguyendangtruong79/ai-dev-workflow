---
name: implementation-planning
description: Converts an approved spec into an implementation plan of small, ordered, test-first tasks and a test-case catalog traced to acceptance criteria. Use right after Gate 1 (spec approved), or when the user runs /plan.
---

# Implementation Planning (Phase 2)

Write a plan so concrete that an engineer with zero context on this codebase could execute it task by task. Every task is test-first.

Based on: obra/superpowers `writing-plans` (bite-sized, exact files, test-first steps) and GitHub spec-kit `/plan` + `/tasks` + `/analyze` (technical design, ordered tasks, cross-artifact consistency check).

## Input
- `02-spec.md` (approved), `01-discussion.md`
- `context/project/*` (stack, placement rules, conventions, commands)
- Relevant existing code (search for similar features to reuse patterns)

## Output

```
context/features/<id>/
├── 03-plan.md          # templates/plan.md
└── 04-test-cases.md    # templates/test-cases.md
```

## Process

1. **Technical design (short).** Components touched, new files and **their exact paths per `structure.md`**, data model/migration changes, API contracts, key decisions. Reuse existing patterns; justify any new dependency.
2. **Test cases first.** For every `AC-xx` (and testable `NFR-xx`/`BR-xx`), derive test cases `TC-xx`:
   - At least one happy-path and the relevant negative/edge cases per AC.
   - Choose the level: unit (logic), integration (DB/API boundaries), e2e (critical user journeys only).
   - Each TC states: preconditions, input, expected result, level, target test file path.
3. **Task breakdown.** Split into tasks `T-xx` that each:
   - Take roughly 2-15 minutes of agent work and touch a small set of files.
   - Name the TCs they make pass and the exact files to create/modify (and their test files).
   - Follow the order: foundations (types/schemas/migrations) -> domain logic -> adapters (DB/API/UI) -> wiring -> e2e.
   - Tasks run strictly one after another. Do not mark `[P]` and do not promise parallel execution.
4. **Consistency check (spec-kit /analyze).** Before presenting, verify and fix:
   - Every AC has at least one TC; every TC belongs to a task; no task without a TC (except pure scaffolding, labeled).
   - Every new file path matches a placement rule in `structure.md`.
   - No task contradicts the spec's out-of-scope list.
   - Commands in the plan match `commands.md`.
5. **GATE 2.** Show: design summary, task list (IDs + one-line titles), AC -> TC coverage table, risks. Ask the user to **approve** or adjust. On approval, follow `ai-dev-workflow`: recompute the spec hash (stop if it drifted), set `gates.plan` to `approved` with the sha256 of `03-plan.md` + `04-test-cases.md`, set `phase` to `BUILD`, set `diffBase` to current `HEAD`, mirror `STATUS.md`, and **immediately start `tdd-loop`** with the first task. No further confirmation needed. A verbal approval without the hash is not Gate 2.

## Rules

- DRY, YAGNI: plan only what the spec requires.
- No placeholder steps like "add error handling" or "write tests": say which error, which test, which file.
- If you discover a gap in the spec, stop and ask the user; update `02-spec.md` and log the change in `01-discussion.md`.
