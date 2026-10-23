---
description: Bug flow - reproduce, find root cause with the user, fix, loop tests until green
argument-hint: <bug description>
---

Investigate and fix a bug.

Bug: $ARGUMENTS

(If empty, ask me for the description.)

Use the `systematic-debugging` skill:
1. Create `context/bugs/<YYYYMMDD>-<slug>/` with `status.json` (phase `BUGFIX`) and claim `context/ACTIVE.json`. Capture the report with me (one question at a time).
2. Reproduce with a failing automated test and record that failure as evidence.
3. Delegate investigation to the read-only `bug-investigator` subagent (inline + `mode: inline` if it cannot be spawned). Present the evidence and ranked hypotheses.
4. Discuss the root cause and fix options with me, and wait for my agreement.
5. Fix via `tdd-implementer` when possible, then loop tests until the reproduction test and full suite pass. Increment `loops.bugFixAttempts` on each failed fix (max 3, then escalate).
6. Run `/review` on the fix, record `03-fix.md`, and update `status.json` plus `STATUS.md`.
