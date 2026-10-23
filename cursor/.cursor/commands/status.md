# /status

Show the workflow status.

Follow the "Resuming" section of `.cursor/skills/ai-dev-workflow/SKILL.md`. Read `context/ACTIVE.json` and every `status.json`. Report phase, gate state (including whether hashes still match), loop counters, last evidence line, next action, and blockers. If I say "continue", resume only when a single non-DONE item exists or I named an id. Recompute gate hashes before continuing BUILD or later.
