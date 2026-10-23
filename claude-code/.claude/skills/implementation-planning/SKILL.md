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

0. **Set `workType`** in `status.json` (and mirror STATUS): `code` | `docs` | `infra` | `config`.
   - `code`: default; TDD iron law applies.
   - `docs`: markdown/docs only; verify with link check or explicit file checklist—no fake unit tests.
   - `infra`: Terraform/CI/Docker/etc.; verify with `terraform plan`, policy check, or dry-run named in the plan.
   - `config`: config/flags only; verify with schema/validate command or dry-run.
1. **Greenfield / missing harness.** If `commands.md` has no working single-test or full-suite command (or baseline is "0 tests"), insert **T-00: Bootstrap test harness** first (scaffold runner, one smoke test, wire `commands.md`). Label it scaffolding. Gate 2 must show that T-00 will produce a runnable test command before feature TDD.
2. **Technical design (short).** Components touched, new files and **their exact paths per `structure.md`**, data model/migration changes, API contracts, key decisions. Reuse existing patterns; justify any new dependency. Flag planned risk kinds: `migration`, `public-api`, `dependency`, `authz`, `secrets`.
3. **Test cases / checks first.**
   - `code`: For every `AC-xx` (and testable `NFR-xx`/`BR-xx`), derive `TC-xx` (happy + relevant negative/edge). Level: unit / integration / e2e. Each TC: preconditions, input, expected, level, test file path.
   - `docs` / `infra` / `config`: derive check rows `CK-xx` mapped to ACs (command or checklist), not fake unit tests.
4. **Task breakdown.** Split into tasks `T-xx` that each:
   - Take roughly 2-15 minutes of agent work and touch a small set of files.
   - Name the TCs/CKs they satisfy and the exact files to create/modify.
   - Order: T-00 if any -> foundations -> domain -> adapters -> wiring -> e2e/checks.
   - Tasks run strictly one after another. Do not mark `[P]`.
5. **Consistency check.** Every AC has at least one TC or CK; every TC/CK belongs to a task; paths match `structure.md`; commands match `commands.md`; out-of-scope respected.
6. **GATE 2.** Show: `workType`, design summary, task list, coverage table, risk kinds. Ask the user to **approve** or adjust. On approval, follow `ai-dev-workflow`: recompute the spec hash (stop if drifted), set `gates.plan` approved with sha256 of plan+test-cases, set `phase` to `BUILD`, set `diffBase` to `HEAD`, mirror STATUS, append metrics `gate_plan`, and **immediately start** the BUILD loop for that `workType`.

## Rules

- DRY, YAGNI: plan only what the spec requires.
- No placeholder steps like "add error handling" or "write tests": say which error, which test, which file.
- If you discover a gap in the spec, stop and ask the user; update `02-spec.md` and log the change in `01-discussion.md`.
