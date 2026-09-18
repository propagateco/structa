# Feature: Workspace All-Chats View Across Projects

**See:** [GitHub Issue #50](https://github.com/propagateco/structa/issues/50)

Status: needs-triage
**Decisions:** governed by [iss-011-chat-map.md](iss-011-chat-map.md) — read before implementing.

## Description
Build `/app/chat` as a workspace-level index of chat sessions across all projects. Users should be able to discover sessions by project and navigate to project-scoped chat routes.

## Acceptance Criteria
- [ ] `/app/chat` lists chat sessions across the active workspace.
- [ ] Sessions can be filtered by project.
- [ ] Sessions display key metadata (title, project, updated time).
- [ ] Selecting a session deep-links to `/app/projects/:projectId/chat` with the selected session.

## Tasks
- [ ] Create workspace all-chats route and base UI.
- [ ] Query sessions across workspace via TanStackDB/Electric collections.
- [ ] Add project filter controls and grouping.
- [ ] Implement navigation/deep-link behavior to project chat.
- [ ] Add tests for list/filter/navigation behavior.

## Tracer Bullet Reference
Depends on tracer bullets for project chat streaming and session switching.

## Additional Context
Sessions remain project-scoped; this view is a cross-project index.

---

## Labels

`feature`
