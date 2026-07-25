---
applyTo: "**"
---

# Git Workflow Instructions

Before Git changes:

```bash
git status
git branch -vv
git remote -v
git fetch --all --prune
```

Rules:

- Preserve user work.
- Do not stage unrelated files.
- Use `git diff` before staging.
- Use `git diff --staged` before committing.
- Prefer targeted `git add <file>` over `git add .` when unrelated files exist.
- Use focused commits.
- Explain reset, clean, restore, rebase, and force-push consequences.
- Prefer backup branches and descriptive stashes before risky operations.
- Prefer `git push --force-with-lease` when a force push is unavoidable.
- Verify branch and remote before push.
- Confirm the working tree state after commit and push.
