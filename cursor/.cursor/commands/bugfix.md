# /bugfix

Investigate and fix a bug. The bug description is the text I write after this command (ask me if empty).

Follow `.cursor/skills/systematic-debugging/SKILL.md`:
1. Create `context/bugs/<YYYYMMDD>-<slug>/`, capture the report with me (one question at a time).
2. Reproduce with a failing automated test.
3. Delegate investigation to the `bug-investigator` subagent; present the evidence and ranked hypotheses.
4. Discuss the root cause and fix options with me, and wait for my agreement.
5. Fix, then loop tests until the reproduction test and full suite pass (max 3 failed attempts, then escalate).
6. Run `/review` on the fix, record `03-fix.md`, and update `STATUS.md`.
