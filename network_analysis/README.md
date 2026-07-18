# Network analysis publication workflow

The public dashboard reads `./data/network-analysis.json`, a static artifact created during `npm run build`. GitHub Pages never calls the local API.

1. Start the local service that exposes `http://127.0.0.1:3000/api/network-analysis`.
2. Run `npm run snapshot:capture` in this directory. This writes `data/network-analysis.candidate.json`.
3. Review the candidate against the authoritative case record. Do not publish unreviewed names, claims, relationships, or confidence values.
4. Replace `data/network-analysis.reviewed.json` with the approved candidate.
5. Run `npm run build`. The build validates the approved snapshot and writes `public/data/network-analysis.json`, which Vite copies into `dist/data/` for GitHub Pages.

To capture from another trusted local URL, set `NETWORK_ANALYSIS_API_URL` before running the capture command. The CI build does not call an API and only publishes the reviewed file already in the repository.