# Issue tracker: Local Markdown

Issues and specs (you may know a spec as a PRD) for this repo live as markdown files in `.issues/`.

## Conventions

- One file per feature: `.issues/iss-NNN-slug.md`, numbered sequentially (`iss-001-…`, `iss-002-…`), following `.issues/TEMPLATE.md`
- Keep `.issues/index.md` current — add a line linking each new issue
- Once an issue is actioned on GitHub, link it near the top of the file: `**See:** [GitHub Issue #NN](…)`
- Triage state is recorded as a `Status:` line near the top of each issue file (see `triage-labels.md` for the role strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## Syncing from GitHub

Import the repo's open GitHub issues into `.issues/` (idempotent — existing drafts already
linked to a GitHub issue are matched by that link and only have the link refreshed; drafts
matched by title get the link added; everything else is created as a new file):

```bash
npm run issues:sync -w @structa/scripts
```

Newly imported files get `Status: needs-triage`; adjust the status after triaging locally.

## When a skill says "publish to the issue tracker"

Create a new file at `.issues/iss-NNN-slug.md` (next free number). `.issues/` is the local drafting area — push the feature to GitHub Issues when it's ready to action.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.issues/iss-NNN-<slug>-map.md` — the Notes / Decisions-so-far / Fog body
- **Child ticket**: `.issues/iss-NNN-<slug>.md`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: iss-NNN, iss-NNN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far.
