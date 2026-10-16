---
name: tdd-loop
description: Executes an approved plan task by task with strict test-driven development (red -> green -> refactor), looping until every test case passes, then hands off to code review automatically. Use after Gate 2 (plan approved), when the user runs /implement, or when fixing review findings.
---

# TDD Loop (Phase 3)

Based on: obra/superpowers `test-driven-development` (the iron law) and `subagent-driven-development` / `executing-plans` (one task at a time, fresh context, check after each).

## The iron law

**No production code without a failing test first.** If you wrote code before the test, delete it and start from the test. A test you never saw fail proves nothing.

## Loop per task

For each unchecked task `T-xx` in `03-plan.md`, in order (delegate a task to the `tdd-implementer` subagent if available, passing the task text, the TCs, and `context/project/*`):

```
attempts = 0
RED      Write the test(s) for the task's TCs, in the path required by structure.md.
         Run only those tests. They MUST fail, and fail for the expected reason
         (assertion on missing behavior, not a typo/import error).
         -> mark TC status "red" in 04-test-cases.md
GREEN    Write the minimal production code to pass. No extra features.
         Run the task's tests.
         If failing: attempts += 1; read the actual error; fix code (not the test); repeat.
         If attempts == 5: STOP, switch to systematic-debugging and ask the user.
         -> mark TC status "green"
REFACTOR Remove duplication, improve names, follow conventions.md. Tests stay green.
CHECK    Run the full test suite + lint + typecheck (commands.md).
         Any regression -> fix before moving on.
RECORD   Check the task in 03-plan.md, append to 05-implementation-log.md
         (task, files changed, test command + result, notes). Update STATUS.md.
```

Then move straight to the next task. No confirmation needed between tasks.

## Exit -> REVIEW

When all tasks are checked:
1. Run the full suite, lint, typecheck, build. Record the exact output summary in `STATUS.md`.
2. Set Phase = REVIEW and **immediately start `code-review`**.

## When returning from review

Treat each Critical/Major finding as a mini-task: write or adjust a test that exposes the problem (when testable), fix, run the full suite, then mark the finding `fixed` in `06-review.md`. Return to `code-review` for the next round.

## Rules

- **Never** edit, skip (`.skip`, `xit`, `@Ignore`, `t.Skip`), or delete a test to make it pass. If a test is genuinely wrong (contradicts the spec), stop and ask the user; record the decision in `01-discussion.md`.
- Test behavior through public interfaces, not implementation details. Mock only at system boundaries (network, clock, randomness, external services).
- One logical change per green step. Keep diffs small.
- New files go exactly where the plan / `structure.md` says. If the plan's path seems wrong, fix the plan first.
- No secrets, credentials, or real PII in code or fixtures.
- If you need to deviate from the plan (missing step, wrong assumption), update `03-plan.md` and note why in the implementation log. Ask the user only if the deviation changes spec behavior.
