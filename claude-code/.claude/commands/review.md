---
description: Phase 4 - code review (conventions, best practices, structure) plus security review
argument-hint: [feature-id or base branch]
---

Review the current changes.

Target: `$ARGUMENTS`, or the item in `context/ACTIVE.json`. If there is no workflow feature, review the current branch diff against the default branch and say the review is ad-hoc (no `diffBase`).

Use the `code-review` skill:
1. Recompute gate hashes. Stop if they drifted.
2. Run automated checks (tests, lint, typecheck, optional semgrep/gitleaks/dependency audit) and append evidence.
3. Diff only `git diff <diffBase> -- <files in the plan and implementation log>`.
4. Run the read-only `code-reviewer` and `security-reviewer` subagents in parallel on that diff. If one cannot be spawned, do that pass inline and record `mode: inline`. If a reviewer is not actually read-only, record `isolation: degraded` and do not treat it as an independent pass.
5. Triage findings (reject false positives with reasons), write `06-review.md`, increment `loops.reviewRounds` only when looping back.
6. If Critical/Major findings remain, loop back into the `tdd-loop` skill to fix them, then re-review (max 3 rounds). For ad-hoc reviews, present findings and ask whether to fix.
