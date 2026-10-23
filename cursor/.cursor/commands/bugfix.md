# /bugfix

Investigate and fix a bug. The bug description is the text I write after this command (ask me if empty).

Follow `.cursor/skills/systematic-debugging/SKILL.md`:
1. Create `context/bugs/<YYYYMMDD>-<slug>/` with `status.json` (phase `BUGFIX`) and claim `context/ACTIVE.json`. Capture the report with me, batching questions that do not depend on each other.
2. Reproduce with a failing automated test and record that failure as evidence.
3. Delegate investigation to the read-only `bug-investigator` subagent (inline + `mode: inline` if it cannot be spawned). Present the evidence and ranked hypotheses.
4. Discuss the root cause and fix options with me, and wait for my agreement.
5. Fix via `tdd-implementer` when possible. Run the reproduction test on each attempt, and the full suite once after it passes. Increment `loops.bugFixAttempts` on each failed fix (max 3, then escalate).
6. Run `/review` on the fix, record `03-fix.md`, and update `status.json` plus `STATUS.md`.
