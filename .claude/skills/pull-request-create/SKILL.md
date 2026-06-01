---
name: pull-request-create
description: Create a well-structured pull request with summary, test plan, and review checklist.
argument-hint: [base-branch]
user-invocable: true
---
# Pull Request Creation

Create a comprehensive pull request for the current branch.

## Steps

1. Gather context about the current state:

   ```
   !`git branch --show-current`
   !`git log --oneline dev..HEAD 2>/dev/null || git log --oneline -10`
   !`git diff --stat dev..HEAD 2>/dev/null || git diff --stat`
   ```
2. Analyze ALL commits on this branch (not just the latest) to understand the full scope of changes.
3. Determine the base branch:

   - Use `$ARGUMENTS` if provided
   - Otherwise default to `dev`
4. Draft the PR with this structure:

   - **Title**: Under 70 characters, imperative mood, describes the "what"
   - **Summary**: 1-3 bullet points explaining the changes
   - **Details**: Longer description if the change is complex
   - **Test plan**: How to verify the changes work
   - **Review checklist**: Areas reviewers should focus on
5. Before creating, show the draft to the user for approval.
6. Create the PR using `gh pr create`:

```bash
gh pr create --title "title" --body "$(cat <<'EOF'
## Summary
- bullet points

## Details
description

## Test Plan
- [ ] verification steps

## Review Checklist
- [ ] areas to review

---
Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

7. Return the PR URL to the user.

## Conventions

- Push to remote first if needed (`git push -u origin <branch>`)
- Never force-push without explicit user approval
- If the branch name contains an issue tracker ID (e.g., `scr-23`, `PROJ-456`), extract it and add `Closes [ID]` to the PR body — this auto-closes the issue on merge
- Write the closing keyword as plain text on its own line — `Closes TEAM-NNN`. Do NOT wrap it in bold, a markdown link, or a heading. The tracker's parser only detects the plain form; decorated formats link the PR as a reference but do not trigger the merge-to-Done automation
