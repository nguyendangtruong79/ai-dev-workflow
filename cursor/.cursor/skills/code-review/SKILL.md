---
name: code-review
description: Rigorous multi-dimension review of the feature's changes - spec compliance, coding conventions, stack best practices, file placement per project structure, test quality - combined with automated linters and the security-review skill. Loops back to TDD until no Critical/Major findings remain. Use automatically after the TDD phase, or when the user runs /review.
---

# Code Review (Phase 4)

Based on: obra/superpowers `requesting-code-review` + `receiving-code-review` (independent reviewer, severity triage, verify feedback before acting) and Google's engineering code review guidelines.

## Scope

Review the diff of this feature only: `git diff <base>...HEAD` plus uncommitted changes (`git status`, `git diff`). Read surrounding code when needed for context.

## Process

### 1. Automated checks first (cheap, objective)
Run what exists in `commands.md`: full tests, lint, format check, typecheck, build. Optional if installed: `semgrep scan --config auto`, `gitleaks detect --no-git -v`, dependency audit (`npm audit`, `pip-audit`, `govulncheck`, `mvn dependency-check`...). Any failure is automatically a **Major** finding.

### 2. Independent reviewers (in parallel when subagents are available)
Launch with fresh context (they must not rely on the implementer's reasoning), giving each the diff, `02-spec.md`, `04-test-cases.md`, and `context/project/*`:
- `code-reviewer` subagent: dimensions A-E below.
- `security-reviewer` subagent: follows the `security-review` skill.

If subagents are unavailable, do both passes yourself, one after the other, re-reading the diff for each.

### 3. Review dimensions

**A. Spec compliance**
- Every AC implemented; nothing outside scope added (scope creep is a finding).
- Every TC has a real test that asserts the expected result.

**B. Structure and placement** (enforce `structure.md`)
- Every new/changed file is in the correct folder with the correct naming.
- Layering rules respected (no forbidden imports, no business logic in controllers/views, no data access from UI).
- Tests mirror source location per convention. No stray files (debug scripts, `.bak`, commented-out blocks, TODO without ticket).

**C. Conventions** (enforce `conventions.md`)
- Naming, error handling, logging, config access, DI patterns match the project's established style.
- Consistent with neighboring code; no new pattern introduced where one exists.

**D. Stack best practices** (from `tech-stack.md` + official framework guidance)
- Correct framework idioms; no deprecated APIs.
- Resource handling (connections, files, subscriptions closed), async correctness (unawaited promises, race conditions, blocking calls in async code).
- Performance traps: N+1 queries, unbounded loops/queries, missing pagination, needless re-renders, missing indexes for new queries.
- Readability: function size, cyclomatic complexity, duplication (DRY), dead code, magic numbers.

**E. Test quality**
- Tests assert behavior, not implementation; meaningful names; no sleeps/flakiness; mocks only at boundaries.
- Edge and error cases covered; no skipped/disabled tests; no assertions removed.

### 4. Severity

| Severity | Meaning | Action |
|---|---|---|
| Critical | Security vulnerability, data loss/corruption, broken AC, crash | Must fix |
| Major | Wrong placement/layering, convention violation, failing automated check, missing test for an AC, significant perf issue | Must fix |
| Minor | Readability, naming nit, small refactor | Fix if cheap, else list as follow-up |
| Info | Observations, praise | none |

Each finding: ID (`R-xx` or `S-xx`), severity, `file:line`, problem, why it matters, concrete fix.

### 5. Triage (receiving-code-review)
Before fixing, verify each finding against the code. Reject false positives with a one-line reason (recorded in the report), do not fix blindly.

### 6. Loop
- Write all findings into `06-review.md` (`templates/review.md`), with a section per round.
- If any Critical/Major remains open: increment the review round in `STATUS.md`, go back to `tdd-loop` (fix mode), then review again (only the new diff + previously failed items).
- Round limit: **3**. If still failing after 3 rounds, stop and present the remaining findings to the user with options.
- When zero Critical/Major remain: Phase = DONE, run `verification-before-completion`, then give the final summary.
