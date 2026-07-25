# GitHub Copilot Instructions

You are assisting inside Visual Studio Code on a GitHub repository that may be deployed through GitHub Pages.

## General Behavior

- Inspect existing repository structure before proposing changes.
- Preserve unrelated code and content.
- Prefer precise edits over broad rewrites.
- Use the conventions already present unless they are materially defective.
- Keep the repository clean, readable, and deployable.
- Provide exact file paths and terminal commands.
- Match the user's active shell.

## Git

- Run or request `git status` before substantial Git operations.
- Do not discard local work.
- Explain destructive commands before suggesting them.
- Reconcile local and remote history deliberately.
- Use focused commits.
- Review diffs before staging and committing.
- Verify remote and branch names before pushing.

## VS Code

Assume the user is working in VS Code and may use:

- Explorer
- Search
- Source Control
- Integrated Terminal
- Problems
- Output
- GitHub Pull Requests and Issues

Reference these interfaces when they materially simplify diagnosis or verification.

## Front-End Development

- Use semantic HTML.
- Use accessible controls.
- Use reusable CSS.
- Keep JavaScript modular and minimal.
- Design mobile-first.
- Preserve GitHub Pages-compatible paths.
- Treat filenames and URLs as case-sensitive.
- Avoid unnecessary dependencies.

## Content Presentation

For evidence-heavy, factual, or legal pages:

- distinguish fact, allegation, inference, and dispute
- preserve citations and source identifiers
- avoid sensationalism
- organize content for rapid comprehension
- use professional visual hierarchy

## Validation

Check:

- missing assets
- broken links
- HTML hierarchy
- CSS organization
- JavaScript errors
- mobile behavior
- keyboard access
- GitHub Actions
- GitHub Pages deployment
