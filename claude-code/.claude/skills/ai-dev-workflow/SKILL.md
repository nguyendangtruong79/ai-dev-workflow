---
name: ai-dev-workflow
description: Orchestrates the end-to-end AI software development workflow (onboarding -> requirement analysis -> planning -> TDD -> review, plus bug fixing). Use when the user starts a new feature, asks "what's next", resumes work on a feature/bug, or invokes /feature, /bugfix, or /status.
---

# AI Dev Workflow (Orchestrator)

You drive a feature from raw requirement to reviewed, tested code. Each phase has a dedicated skill. This skill decides **which phase runs next**, enforces **human gates**, and keeps **state on disk** so work can be resumed by any developer or agent.

## Phases

```
Phase 0  ONBOARD    project-onboarding            (once per project)
Phase 1  REQUIRE    requirement-analysis           -> GATE 1: user approves spec
Phase 2  PLAN       implementation-planning        -> GATE 2: user approves plan
Phase 3  BUILD      tdd-loop (per task)            (autonomous)
Phase 4  REVIEW     code-review + security-review  (autonomous, loops back to BUILD)
Phase 5  DONE       verification-before-completion
Side     BUGFIX     systematic-debugging           (any time a bug appears)
```

## Rules

1. **Phase 0 first.** If `context/project/` is missing or empty, run `project-onboarding` before anything else. Every later phase reads it.
2. **Two human gates only.** Stop and wait for explicit approval after the spec (Gate 1) and after the plan (Gate 2). Between Gate 2 and DONE, proceed automatically without asking, except when a loop limit is hit or a decision is genuinely ambiguous.
3. **Automatic transitions.** When a phase's exit criteria are met, update `STATUS.md` and immediately start the next phase. Do not ask "should I continue?".
4. **State on disk.** Every feature lives in `context/features/<YYYYMMDD>-<slug>/`. Every bug lives in `context/bugs/<YYYYMMDD>-<slug>/`. Keep `STATUS.md` current (template: `templates/STATUS.md`).
5. **Loop limits** (escalate to the user when exceeded; never loop silently forever):
   | Loop | Limit |
   |---|---|
   | TDD red/green attempts per task | 5 |
   | Review -> fix rounds | 3 |
   | Bug fix attempts with no progress | 3 (then question the architecture) |
6. **Traceability.** Requirement (`AC-xx`) -> test case (`TC-xx`) -> test code -> task (`T-xx`). Never drop the IDs.
7. **Never cheat a loop.** Do not weaken, skip, or delete tests to make them pass. Do not mark something done without fresh evidence (see `verification-before-completion`).
8. **Language.** Write artifacts in English unless `context/project/conventions.md` says otherwise. Talk to the user in the user's language.

## Resuming

When asked to continue or for status:
1. List `context/features/*/STATUS.md` and `context/bugs/*/STATUS.md`.
2. Read the active one, report the phase, last step, and blockers in 3-5 lines.
3. Continue from `Next action`.

## Phase exit criteria

| Phase | Exit when |
|---|---|
| ONBOARD | `context/project/{tech-stack,structure,conventions,commands}.md` exist and the user confirmed them |
| REQUIRE | `02-spec.md` has no open `[NEEDS CLARIFICATION]` markers and the user approved it (Gate 1) |
| PLAN | `03-plan.md` and `04-test-cases.md` exist, every AC maps to at least one TC, user approved (Gate 2) |
| BUILD | every task in `03-plan.md` is checked, full test suite green, lint/typecheck clean |
| REVIEW | `06-review.md` has zero open Critical/Major findings |
| DONE | verification evidence recorded in `STATUS.md`, summary given to the user |

## Final summary to the user (DONE)

- What was built (link to spec)
- Test evidence (command + pass count)
- Review result (findings fixed / remaining minors)
- Files created/changed grouped by folder
- Follow-ups or known limitations
