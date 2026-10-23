# /feature

Start a new feature with the full AI dev workflow. The requirement is the text I write after this command (ask me for it if empty).

1. Read `.cursor/skills/ai-dev-workflow/SKILL.md` (orchestrator). If `context/project/` is missing, run `/onboard` first.
2. Phase 1: follow `.cursor/skills/requirement-analysis/SKILL.md`. Batch questions that do not depend on each other, save `01-discussion.md` and `02-spec.md`, then wait for my approval (Gate 1).
3. Phase 2: follow `.cursor/skills/implementation-planning/SKILL.md`, then wait for my approval (Gate 2).
4. After Gate 2, continue automatically: BUILD (`tdd-loop` or non-code lane) -> `code-review` + `security-review` -> loop until clean -> `deliver-pr` -> `verification-before-completion` -> DONE.

When the feature folder is created: copy feature `status.json` / `STATUS.md` templates, set `branch` to `feat/<id>`, create or check out that git branch, and claim `context/ACTIVE.json`. Record gate hashes on approval. Before BUILD, refuse if the current branch is not `status.json.branch`. Keep `status.json` and `STATUS.md` updated after every step. `status.json` is authoritative.
