# Dynamo

## Workflows & Agents

- Default multi-agent workflows: see [`default-workflows.md`](default-workflows.md)
- Agent and skill index: see [`.claude/README.md`](.claude/README.md)

## Coding Practices

All code follows [`.claude/rules/coding_practices.md`](.claude/rules/coding_practices.md).
Operational runbooks (if any) follow [`.claude/rules/runbooks.md`](.claude/rules/runbooks.md).

## Project Context

Dynamo turns a URL into a personalized buyer portal: it scrapes a page, has an
AI assemble content blocks, and serves a live portal that tracks viewer signal
and intent. It is multi-tenant (Company → Users → Portals → Blocks), with an
asset library, persona-based block filtering, portal access control, and
per-visitor event tracking.

## Stack Summary

| Layer | Choice |
|-------|--------|
| Language | TypeScript 5 (strict) |
| Framework | Next.js 16 (App Router, React Server Components), React 19 |
| UI | shadcn/ui (new-york) over Radix UI, Tailwind CSS v4, lucide-react |
| Data | Prisma 6 + SQLite (`dev.db`) |
| Validation | Zod v4 (`src/lib/schema.ts`) |
| AI | Vercel AI SDK v6 (`generateObject`); providers: Anthropic, Azure, Google, OpenAI |
| Scraping | cheerio |
| Package manager | npm |
| Lint | ESLint 9 (`eslint-config-next`) — no Prettier |
| Tests | Vitest + React Testing Library (planned — not yet installed) |
| Auth | None wired yet — demo user `demo@dynamo.app`, demo company `cldemocompany0000000000000`; `next-auth` installed but unused |

## Dev Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (port 3010) |
| Build | `npm run build` |
| Start (prod) | `npm start` |
| Lint | `npm run lint` |
| Lint (autofix) | `npx eslint . --fix` |
| Type check | `npx tsc --noEmit` |
| Prisma migrate (dev) | `npx prisma migrate dev` |
| Prisma studio | `npx prisma studio` |
| Tests | _not configured yet_ |

## Naming & File Organization

- Path alias `@/*` → `src/*`; import via the alias, not deep relative paths.
- Routes and Route Handlers under `src/app/` (`page.tsx`, `layout.tsx`, `route.ts`).
  Dynamic segments use `[param]`, route groups use `(group)`.
- Shared components in `src/components/`; shadcn primitives in `src/components/ui`;
  block components in `src/components/blocks/`.
- Domain logic and helpers in `src/lib/` (AI tasks in `src/lib/ai/tasks/`,
  intent scoring in `src/lib/intent.ts`).
- Zod schemas + mock data in `src/lib/schema.ts`; Prisma schema in `prisma/schema.prisma`.
- Components PascalCase; functions/variables camelCase; booleans as questions
  (`isOpen`, `hasAccess`). Server Components by default; `"use client"` only on
  the smallest interactive leaf.

## Environment Variables

Server-only (never `NEXT_PUBLIC_`):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Prisma/SQLite connection |
| `ANTHROPIC_API_KEY` | Anthropic provider |
| `OPENAI_API_KEY` | OpenAI provider |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google provider |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI |
| `AZURE_OPENAI_API_VERSION` | Azure OpenAI |
| `AZURE_OPENAI_RESOURCE_NAME` | Azure OpenAI |

AI provider/model selection is configured per task in `src/lib/ai/config.ts`
(+ `registry.ts`).

## Implementation Order

_To be filled in by the maintainer._

## Common Pitfalls

_To be filled in by the maintainer._
