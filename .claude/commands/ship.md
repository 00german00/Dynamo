# Ship: Automated Release Workflow

You are running an automated ship workflow. The user said `/ship` — that means
DO IT. Run straight through and output the PR URL at the end.

## Only stop for:
- On the base branch (abort)
- Merge conflicts that can't be auto-resolved
- Test failures
- Critical review findings that need human judgment

## Never stop for:
- Uncommitted changes (always include them)
- Commit message text (auto-generate from diff)
- CHANGELOG content (auto-generate)

---

## Step 1: Pre-flight

```bash
BRANCH=$(git branch --show-current)
echo "BRANCH: $BRANCH"
```

If on main/master, abort: "Ship from a feature branch, not the base branch."

```bash
BASE=$(gh pr view --json baseRefName -q .baseRefName 2>/dev/null \
  || gh repo view --json defaultBranchRef -q .defaultBranchRef.name 2>/dev/null \
  || echo "dev")
echo "BASE: $BASE"
git status
git diff $BASE...HEAD --stat
git log $BASE..HEAD --oneline
```

## Step 2: Merge base branch

Fetch and merge the base branch so tests run against the merged state:

```bash
git fetch origin $BASE && git merge origin/$BASE --no-edit
```

If merge conflicts: try to auto-resolve trivial ones (VERSION, CHANGELOG
ordering, lockfile). If complex or ambiguous, stop and show them.

## Step 3: Run tests

No test framework is wired yet (no `test` script, no Vitest). If one has since
been added, run it (`npm test`) and stop on failure. Otherwise note "Tests: none
configured" and continue — do not fabricate a passing result.

## Step 4: Lint & type check

```bash
npm run lint
npx tsc --noEmit
```

Auto-fix mechanical lint issues (`npx eslint . --fix`). Stage and commit any
auto-fixes. There is no Prettier in this project — do not run a format step.
A `tsc --noEmit` error blocks the ship; fix it before continuing.

## Step 5: Quick review

Run a lightweight review of the diff — look for critical issues only:
- Unsanitized HTML rendering (`dangerouslySetInnerHTML`) of scraped/AI/user content
- Unvalidated request bodies in Route Handlers (no Zod parse at the boundary)
- Secrets or AI provider keys exposed via `NEXT_PUBLIC_*` env vars or imported into a `"use client"` module
- Prisma queries not scoped to the current Company/tenant
- Missing access-control checks on protected endpoints or portal views
- `any` / `as` / `@ts-ignore` masking real type errors

Auto-fix mechanical issues (unused imports, formatting). If critical issues
need human judgment, stop and ask.

## Step 6: Version bump (if applicable)

Check if the repo uses version files:

```bash
ls VERSION CHANGELOG.md version.txt package.json 2>/dev/null
```

If a VERSION file exists, bump the patch version. If package.json has a
version field, bump it with the appropriate tool. If CHANGELOG.md exists,
prepend a new entry summarizing the changes from the diff.

## Step 7: Commit and push

Stage all changes (including any auto-fixes and version bumps):

```bash
git add -A
```

Generate a commit message from the diff. Format: conventional commits
(`feat:`, `fix:`, `refactor:`, `chore:`). Keep the subject line under 72 chars.

```bash
git commit -m "<generated message>"
git push origin HEAD
```

## Step 8: Create or update PR

```bash
# Check if PR already exists
gh pr view --json url -q .url 2>/dev/null
```

If no PR exists, create one:
```bash
gh pr create --base $BASE --fill
```

If a PR already exists, it's already updated by the push.

Output the PR URL.

## Done

Print a summary:
```
Shipped: <branch> → <base>
PR: <url>
Changes: <N files changed, +X/-Y lines>
Tests: <passed/skipped/failed>
Lint: <clean/auto-fixed N issues>
Type check: <passed/failed>
Auto-fixes: <N applied>
```
