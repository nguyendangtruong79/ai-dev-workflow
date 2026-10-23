---
description: Start a new feature with the full AI dev workflow (requirement -> spec -> plan -> TDD -> review)
argument-hint: <feature requirement>
---

Start a new feature with the full AI dev workflow.

Requirement: $ARGUMENTS

(If the requirement is empty, ask me for it.)

1. Use the `ai-dev-workflow` skill (orchestrator). If `context/project/` is missing, run the `project-onboarding` skill first.
2. Phase 1: use the `requirement-analysis` skill. Batch questions that do not depend on each other, save `01-discussion.md` and `02-spec.md`, then wait for my approval (Gate 1).
3. Phase 2: use the `implementation-planning` skill, then wait for my approval (Gate 2).
4. After Gate 2, continue automatically: `tdd-loop` -> `code-review` + `security-review` -> loop until no Critical/Major -> `verification-before-completion` -> final summary.

Create `status.json` from the workflow template and claim `context/ACTIVE.json` when the feature folder is created. Record gate hashes on approval. Keep `status.json` and `STATUS.md` updated after every step. `status.json` is authoritative.
