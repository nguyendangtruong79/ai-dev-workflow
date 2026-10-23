# AI Dev Workflow

This project uses a structured AI workflow. Skills live in `.claude/skills/`, subagents in `.claude/agents/`, commands in `.claude/commands/`.

## Flow

```
/onboard (once) -> /feature: requirement-analysis -> [GATE 1: approve spec]
  -> implementation-planning -> [GATE 2: approve plan]
  -> tdd-loop -> code-review + security-review -> (loop until clean) -> DONE
/bugfix: systematic-debugging -> discuss root cause with user -> fix -> test loop -> review
```

- The `ai-dev-workflow` skill is the orchestrator: use it whenever starting, resuming, or transitioning phases.
- Stop for user approval **only** at Gate 1 and Gate 2, or when a loop limit is reached. Otherwise transition automatically.
- Loop limits: 5 TDD attempts per task, 3 review rounds, 3 failed bug-fix attempts. Escalate to the user when exceeded.

## Context folder

- `context/project/` - tech stack, structure/placement rules, conventions, commands. **Read before planning, coding, or reviewing.** Create via `/onboard` if missing.
- `context/features/<YYYYMMDD>-<slug>/` - STATUS, discussion, spec, plan, test cases, implementation log, review.
- `context/bugs/<YYYYMMDD>-<slug>/` - STATUS, report, investigation, fix.
- `context/ACTIVE.json` names the single item in progress. If several are unfinished, commands require an id.
- Each feature and bug has `status.json` (authority: phase, gate hashes, loop counters, evidence) and `STATUS.md` (human mirror).
- Tasks run one at a time. Do not parallelize implementation.
- Read-only subagents use Read, Grep, and Glob only. If a review cannot stay read-only, record `isolation: degraded`.
- Keep both status files current after every step so any developer or agent can resume.

## Non-negotiables

1. No production code without a failing test first (TDD).
2. Never weaken, skip, or delete tests to make them pass.
3. No bug fix without a confirmed root cause discussed with the user.
4. New files go where `context/project/structure.md` says.
5. No secrets or real PII in code, tests, fixtures, or logs.
6. No completion claims without fresh command output as evidence.
7. Ask one question at a time when clarifying; prefer multiple choice with a recommendation.
8. Write artifacts in English; talk to the user in their language.
