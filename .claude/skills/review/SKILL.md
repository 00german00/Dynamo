---
name: review
description: Run a comprehensive multi-agent code review covering security, UI, tests, and performance.
argument-hint: [file-or-branch]
user-invocable: true
---

# Multi-Agent Code Review

Run a comprehensive review of the current changes by spawning specialized review agents in parallel.

## Steps

1. First, determine the scope of the review:
   - If `$ARGUMENTS` is a file path, review that file
   - If `$ARGUMENTS` is a branch name, review `git diff main...$ARGUMENTS`
   - If no arguments, review all uncommitted changes (`git diff` + `git diff --cached` + untracked files)

2. Get the diff to understand what changed:
   ```
   !`git diff --stat HEAD`
   ```

3. Spawn **four review agents in parallel** using the Agent tool, each with `subagent_type` matching the custom agent:
   - **reviewer-security** — Security vulnerabilities, injection risks, data exposure
   - **reviewer-ui** — Theme compliance, accessibility, responsive design, brand consistency
   - **reviewer-tests** — Missing tests, test quality, coverage gaps
   - **reviewer-performance** — API efficiency, bundle size, caching, slow patterns

4. Each agent receives the same scope (files/diff) and reviews independently. Pass a `name:` for each agent so it's addressable, and bake an investigation budget and required output format into each spawn prompt (e.g. "Spend at most N tool calls, then emit the structured report. Do not stop without it."). If a final message lacks the structured report, re-spawn with a firmer lead-in; do not synthesize missing findings by hand.

5. After all agents complete, synthesize their findings into a unified report:

```
# Code Review Summary

## Scope
[what was reviewed]

## Security
[findings from reviewer-security]

## UI / Theme
[findings from reviewer-ui]

## Test Coverage
[findings from reviewer-tests]

## Performance
[findings from reviewer-performance]

## Action Items
- [ ] Critical: ...
- [ ] High: ...
- [ ] Medium: ...
```

6. Present the unified report to the user.
