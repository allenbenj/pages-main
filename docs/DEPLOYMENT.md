# GitHub Pages Deployment

## Deployment Models

GitHub Pages may publish from:

- the root of a branch
- the `/docs` directory
- a `gh-pages` branch
- a GitHub Actions workflow
- a Jekyll build
- another static-site generator

## Predeployment Review

Check:

```bash
git status
git branch -vv
git remote -v
```

Review:

- entry file
- asset paths
- case-sensitive names
- `.nojekyll`
- `CNAME`
- workflow files
- build output
- repository subpath
- custom domain
- HTTPS settings

## Path Safety

A project site commonly uses:

```text
https://username.github.io/repository-name/
```

Root-relative links such as:

```html
<link rel="stylesheet" href="/assets/css/main.css">
```

may point to the account root instead of the repository site.

Use correct relative paths or a configured base path.

## Deployment Verification

After publishing, verify:

- homepage
- navigation
- CSS
- JavaScript
- images
- documents
- internal anchors
- external links
- mobile layout
- console errors
- HTTPS
- custom domain
- 404 behavior
- actual deployed commit

A successful Git push does not prove the site deployed correctly.
