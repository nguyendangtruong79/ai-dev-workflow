---
description: Show workflow status of active features and bugs, or resume with "continue"
argument-hint: [continue | feature-id]
---

Show the workflow status. Argument: $ARGUMENTS

Follow the "Resuming" section of the `ai-dev-workflow` skill: list active features and bugs from `context/features/*/STATUS.md` and `context/bugs/*/STATUS.md`, with phase, gate state, loop counters, next action, and blockers. If the argument is "continue", resume the active item from its `Next action`.
