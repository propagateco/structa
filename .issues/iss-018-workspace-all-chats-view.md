# Workspace all-chats view

Type: wayfinder-grilling
Map: iss-011-chat-map.md
Status: open
Blocked by: iss-016-chat-persistence-schema-electric-sync-design.md

## Question

What is `/app/chat` — the workspace-level index of chat sessions across all projects? Query
shape (all sessions in the user's workspace via Electric), list/filter UX (by project),
metadata shown (title, project, updated time), and deep-link behavior into
`/app/projects/:projectId/chat` with the selected session.

## Context

- iss-007 (#50) is the feature. Sessions stay project-scoped; this is a cross-project index.
  Sidebar already has "New Chat" → `/app`; the all-chats route could sit at `/app/chat`.
- Depends on the persisted sessions + shapes from iss-016 (all sessions across projects need a
  workspace-scoped shape/query).
- Filter controls, grouping, and navigation behavior are the open decisions; list/filter/
  navigation tests are part of the feature.

## Resolution shape

A written decision: route placement, data query, filter model, list item composition, and
deep-link contract. Close and gist to the map. Unblocks iss-007.
