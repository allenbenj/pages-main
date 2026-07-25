---
applyTo: "**/*.{html,css,js,json,yml,yaml,md}"
---

# GitHub Pages Instructions

Check:

- Pages source branch or workflow
- repository root versus `/docs`
- `gh-pages` branch usage
- GitHub Actions deployment
- `.nojekyll`
- `CNAME`
- repository subpath behavior
- relative asset paths
- filename capitalization
- custom-domain HTTPS
- deployment workflow permissions

Do not assume `/assets/...` works for a project site hosted at:

```text
https://username.github.io/repository-name/
```

Prefer correct relative paths or a configured base URL.

After deployment, verify the live site, not merely the push or workflow result.
