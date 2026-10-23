# context/

Persistent memory for the AI dev workflow. Commit this folder so the whole team (and every agent) shares the same context.

```
context/
├── ACTIVE.json                  # the one feature or bug in progress
├── project/                     # created by /onboard - the project's rules
│   ├── tech-stack.md
│   ├── structure.md             # placement rules enforced by code review
│   ├── conventions.md
│   └── commands.md
├── features/<YYYYMMDD>-<slug>/  # one folder per feature
│   ├── status.json              # authority: phase, gates, hashes, evidence
│   ├── STATUS.md
│   ├── 01-discussion.md
│   ├── 02-spec.md               # Gate 1
│   ├── 03-plan.md               # Gate 2
│   ├── 04-test-cases.md
│   ├── 05-implementation-log.md
│   └── 06-review.md
└── bugs/<YYYYMMDD>-<slug>/      # one folder per bug
    ├── status.json
    ├── STATUS.md
    ├── 01-report.md
    ├── 02-investigation.md
    └── 03-fix.md
```

`status.json` wins if it disagrees with `STATUS.md`. Gate approval stores a sha256 of the approved artifact. Tasks run one at a time.
