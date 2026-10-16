# /review

Review the current changes.

Target: the feature ID I give after this command, the active feature, or (if none) the current branch diff against the default branch.

Follow `.cursor/skills/code-review/SKILL.md`:
1. Run automated checks (tests, lint, typecheck, optional semgrep/gitleaks/dependency audit).
2. Run the `code-reviewer` and `security-reviewer` subagents in parallel on the diff.
3. Triage findings (reject false positives with reasons), write `06-review.md`.
4. If Critical/Major findings remain and this is a workflow feature, loop back into `tdd-loop` to fix them, then re-review (max 3 rounds). For ad-hoc reviews, present findings and ask whether to fix.
