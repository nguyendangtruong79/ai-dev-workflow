---
name: project-onboarding
description: Scans the codebase once to capture the project's tech stack, folder structure, coding conventions, and build/test commands into context/project/. Use on first use of the workflow in a repository, when context/project/ is missing or stale, or when the user runs /onboard.
---

# Project Onboarding (Phase 0)

Every later phase (planning, TDD, review) depends on knowing *how this project works*. This skill produces the project's "constitution": the facts and rules that reviewers will enforce.

Inspired by GitHub spec-kit `/constitution`.

## Output

```
context/project/
├── tech-stack.md     # languages, frameworks, versions, key libraries
├── structure.md      # folder layout and WHERE each kind of file belongs
├── conventions.md    # naming, style, patterns, error handling, logging, testing rules
└── commands.md       # install / build / test / lint / typecheck / run commands
```

Templates are in `templates/` next to this file.

## Process

1. **Detect, don't guess.** Delegate the scan to the `codebase-analyst` subagent if available; otherwise do it yourself. Read:
   - Manifests: `package.json`, `pyproject.toml`, `requirements*.txt`, `go.mod`, `pom.xml`, `build.gradle*`, `*.csproj`, `Cargo.toml`, `composer.json`, `Gemfile`
   - Tooling config: linters/formatters (`.eslintrc*`, `eslint.config.*`, `.prettierrc*`, `ruff.toml`, `.editorconfig`, `checkstyle.xml`, `.golangci.yml`), `tsconfig.json`, CI files (`.github/workflows/*`, `.gitlab-ci.yml`), `Dockerfile`, `Makefile`
   - Existing docs: `README*`, `CONTRIBUTING*`, `AGENTS.md`, `CLAUDE.md`, `docs/`, ADRs
   - 3-5 representative source files per layer and their tests, to infer real conventions
2. **Map the structure.** For each top-level and second-level source folder, write one line: what belongs there. Derive placement rules ("a new HTTP endpoint goes in `src/api/routes/<resource>.ts`, its test in `tests/api/<resource>.test.ts`"). These rules are what `code-review` enforces.
3. **Extract conventions from code, not ideals.** Record what the code actually does (naming, file naming, import style, error handling, logging, DI, state management, test naming, fixtures/mocks). Where code is inconsistent, note it and ask the user which pattern is canonical.
4. **Verify commands.** Run the test and lint commands once to confirm they work. Record the exact commands and the current baseline (e.g. "312 tests, 2 known failures in X").
5. **Greenfield project?** If there is little or no code, ask the user for stack choices (one question at a time, offer options) and propose a structure based on the framework's official recommended layout.
6. **Confirm with the user.** Present a short summary (stack, top placement rules, commands, open inconsistencies) and ask for corrections. Write files only after confirmation, or write then apply corrections.

## Rules

- Keep each file under ~150 lines. Facts and rules, not essays.
- Mark anything uncertain as `[UNVERIFIED]`.
- Never invent a convention the project does not follow; if the project has none, propose one and label it `[PROPOSED]` until the user accepts.
- Re-run this skill (update mode) when the stack or structure changes significantly; show a diff of the changes to the user.
