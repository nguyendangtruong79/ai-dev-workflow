# /implement

Execute the approved plan with strict TDD.

Target: the feature ID I give after this command, or the active feature in `context/features/` with Gate 2 approved.

Follow `.cursor/skills/tdd-loop/SKILL.md`. Delegate each task to the `tdd-implementer` subagent (sequentially unless tasks are marked `[P]`), verify each report by checking the diff and re-running tests, update `03-plan.md`, `04-test-cases.md`, `05-implementation-log.md`, and `STATUS.md`. When all tasks are done, continue automatically into `code-review`.
