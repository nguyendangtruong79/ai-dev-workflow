# /review

Review the current changes.

Target: the feature ID I give after this command, or the item in `context/ACTIVE.json`. If there is no workflow feature, review the current branch diff against the default branch and say the review is ad-hoc (no `diffBase`).

Follow `.cursor/skills/code-review/SKILL.md`:
1. Recompute gate hashes. Stop if they drifted.
2. Reuse fresh suite, lint, typecheck, and build evidence. Run a check only when its evidence is missing or stale. On round 1, keep at most 40 scanner lines that name a file in the diff.
3. Round 1 diffs `git diff <diffBase> -- <files in the plan and implementation log>`. Later rounds diff only the fix.
4. Run the read-only `code-reviewer` and `security-reviewer` with the briefs in the code-review skill. If one cannot be spawned, do that pass inline and record `mode: inline`. If a reviewer is not read-only, record `isolation: degraded` once and do not repeat the pass.
5. Triage findings, write `06-review.md`, and increment `loops.reviewRounds` only when looping back.
6. If Critical/Major findings remain, loop back into `tdd-loop` to fix them, then re-review the fix only (max 3 rounds). For ad-hoc reviews, present findings and ask whether to fix.
