---
name: verification-before-completion
description: Requires fresh, command-based evidence before claiming any work is done, fixed, or passing. Use before marking a task, review round, feature, or bug as complete, and before telling the user something works.
---

# Verification Before Completion

Based on: obra/superpowers `verification-before-completion`.

## Rule

**Evidence before claims.** Never say "done", "fixed", "tests pass", or "should work" without having run the verifying command **in this session, after the last code change**, and read its output.

## Gate

Before any completion claim:
1. Identify the command that proves the claim (from `context/project/commands.md`).
2. Run it fully (not a subset, unless the claim is about a subset).
3. Read the output: exit code, pass/fail counts, warnings.
4. Only then state the claim, quoting the evidence (e.g. "`npm test` -> 148 passed, 0 failed").

| Claim | Required evidence |
|---|---|
| Task done | Task's tests pass + full suite green |
| Feature done | Full suite, lint, typecheck, build all green; review has 0 Critical/Major |
| Bug fixed | Reproduction test passes; full suite green |
| Requirement met | Each AC maps to a passing TC (check `04-test-cases.md`) |

## Forbidden

- "Should pass now", "probably fixed", "looks good" without a run.
- Trusting a subagent's "success" report without checking the diff and re-running tests.
- Claiming success from a partial run or a previous run before the last edit.

If verification fails, report the actual state honestly and continue the relevant loop.
