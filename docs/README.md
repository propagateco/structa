# Docs Snapshots

Usage:
- List registry: `npm run -w packages/scripts docs:list`
- Snapshot all: `npm run -w packages/scripts docs:snap`
- Snapshot one lib: `npm run -w packages/scripts docs:snap <lib>`
- Clean snapshots: `npm run -w packages/scripts docs:clean`

Structure:
- `docs/vendor/<lib>/*.md` — Markdown snapshots per library
- `docs/INDEX.md` — overview and links
- `docs/VERSIONS.json` — snapshot metadata (source URL and timestamp)

Notes:
- Snapshots convert HTML docs to Markdown using Turndown.
- You may need to refresh periodically as upstream docs change.
