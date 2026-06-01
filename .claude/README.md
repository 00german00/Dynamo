# Dynamo — Claude Code Agents & Skills

## Agents

### Cognitive Modes

| Agent | Mode | When to use |
|-------|------|-------------|
| think | Founder / product | Deciding WHAT to build |
| eng-plan | Engineering lead | Deciding HOW to build it |
| eng-review | Staff engineer | Pre-merge code review |

### Engineer Specialists

| Agent | Focus |
|-------|-------|
| engineer-simplifier | Defends against unnecessary complexity and premature abstraction |
| engineer-clarity | Clear naming, honest structure, code that reads like prose |
| engineer-dependencies | Guards against package bloat; prefer built-ins |
| engineer-nextjs-conventions | App Router patterns, Server/Client boundaries, file org, TS idioms |
| engineer-frontend | Server-first components, shadcn/Tailwind styling, React performance |
| engineer-data-access | Prisma query patterns, Zod validation, tenant scoping, data integrity |
| engineer-testing | Vitest + RTL coverage strategy for lib, API, and components |

### Reviewers

| Agent | Focus |
|-------|-------|
| reviewer-security | Auth/tenant scoping, input validation, secret exposure, injection |
| reviewer-ui | shadcn/Tailwind token compliance, accessibility, responsive design |
| reviewer-tests | Test coverage, quality, and convention adherence |
| reviewer-performance | Prisma N+1, Next.js caching, bundle size, AI-call latency |

## Skills

| Skill | Command | Description |
|-------|---------|-------------|
| plan | `/plan` | Create a detailed implementation plan after exploring the codebase |
| review | `/review` | Multi-agent code review (security, UI, tests, performance) |
| pull-request-create | `/pull-request-create` | Open a well-structured PR with summary and test plan |
| docs-create | `/docs-create` | Write a new BLUF-style doc after researching the codebase |
| docs-update | `/docs-update` | Patch an existing doc to match current code |
| retrospective | `/retrospective` | Review a session and propose config/doc improvements |
| sync-check | `/sync-check` | Compare project config against claude-kit and propose backports |
| linear-ticket-start | `/linear-ticket-start` | Pick up a Linear ticket, implement, open a draft PR, review |
| linear-ticket-batch | `/linear-ticket-batch` | Select and implement multiple Linear tickets in parallel |
| linear-project-breakdown | `/linear-project-breakdown` | Break a feature into Linear issues with estimates and deps |
| reconcile-linear | `/reconcile-linear` | Mark stale Linear tickets Done after their PRs merge |

## Commands

| Command | Description |
|---------|-------------|
| ship | Automated release workflow: merge base, lint, type check, review, PR |
