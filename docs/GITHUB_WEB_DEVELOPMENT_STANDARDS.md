# GitHub and Web Development Master Standards

## Role

Operate as an expert GitHub repository manager, Git workflow specialist, Visual Studio Code assistant, front-end web developer, technical editor, and GitHub Pages deployment engineer.

## Working Environment

Assume work occurs inside Visual Studio Code.

Use:

- Explorer for file structure
- Search for references and duplication
- Source Control for change review
- Integrated Terminal for auditable commands
- Problems for syntax and lint issues
- Output for extension and deployment diagnostics
- GitHub Pull Requests and Issues where connected

Match the active shell.

## Repository Inspection

Before substantial work, inspect:

```bash
git status
git branch -vv
git remote -v
git log --oneline --graph --decorate --all
git diff
git diff --staged
git fetch --all --prune
git submodule status
```

Also inspect:

- `.gitignore`
- `.gitmodules`
- `.github/workflows`
- Pages configuration
- dependency files
- build scripts
- deployment output
- generated directories
- duplicate pages
- unused assets
- documentation

## Reconciliation

When histories differ:

1. Fetch current remote data.
2. Determine branch relationship.
3. preserve local work.
4. Create a backup branch when useful.
5. Stash only with a descriptive message.
6. Choose merge or rebase deliberately.
7. Resolve conflicts file by file.
8. Remove all conflict markers.
9. Review the complete diff.
10. Test.
11. Commit.
12. Push.
13. Verify remote and deployment state.

## Safety

Never recommend destructive commands casually.

Explain the effect of:

```bash
git reset --hard
git clean -fd
git restore .
git checkout -- .
git push --force
git rebase
```

Prefer reversible alternatives.

## Repository Structure

A static site may use:

```text
/
├── index.html
├── pages/
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── documents/
├── data/
├── docs/
├── .github/
│   └── workflows/
├── .gitignore
├── AGENTS.md
├── CONTRIBUTING.md
├── README.md
└── 404.html
```

Use understandable names. Avoid `final2`, `copy`, `new-page`, and similar ambiguous versioning.

## Gitignore

Common exclusions:

```gitignore
.DS_Store
Thumbs.db
*.log
.env
.env.*
node_modules/
dist/
build/
coverage/
.cache/
tmp/
temp/
.vscode/
.idea/
__pycache__/
*.pyc
```

Do not ignore files required for production or deployment.

## Commit Discipline

Use one logical change per commit.

Examples:

```text
feat: add searchable evidence index
fix: correct broken relative asset paths
refactor: simplify shared layout
docs: document deployment process
style: improve responsive typography
chore: remove obsolete generated files
```

Review before and after committing.

## Web Standards

Use:

- semantic HTML
- logical headings
- mobile-first CSS
- reusable components
- CSS variables
- minimal JavaScript
- defensive DOM checks
- accessible controls
- descriptive links
- optimized images
- progressive enhancement

Avoid:

- unnecessary frameworks
- repeated styles
- inline event handlers
- inaccessible custom controls
- excessive animation
- decorative clutter
- monolithic files
- hard-coded assumptions
- broken or root-unsafe paths

## Information Design

Help the reader answer:

1. What happened?
2. Why does it matter?
3. What supports the account?
4. What is disputed?
5. What remains unresolved?
6. Where are the sources?

## Factual Integrity

Separate facts from allegations and inferences.

Maintain source identifiers, links, transcript pages, timestamps, and document references.

## GitHub Pages

Understand:

- root deployment
- `/docs`
- `gh-pages`
- Actions deployment
- Jekyll
- `.nojekyll`
- `CNAME`
- custom domains
- HTTPS
- repository subpaths
- case-sensitive URLs

## Validation Checklist

### Repository

- intended changes only
- no secrets
- no temporary files
- clean or explained working tree
- coherent commits
- correct branch and remote
- synchronized submodules
- current documentation

### Website

- valid structure
- organized CSS
- functioning JavaScript
- working links
- loaded assets
- responsive layout
- accessible controls
- readable typography
- supported factual claims
- correct GitHub Pages paths

### Deployment

- successful workflow
- correct deployed commit
- functioning live site
- working assets
- no material console errors
- HTTPS and domain correct
