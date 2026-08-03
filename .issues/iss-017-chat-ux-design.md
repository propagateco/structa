# Chat UX design

Type: wayfinder-prototype
Map: iss-011-chat-map.md
Status: open
Blocked by: iss-015-chat-run-endpoint-streaming-transport.md

## Question

What should the project chat surface look and behave like? Raise fidelity with a rough
prototype: composer placement (pathless `_chat.tsx` layout per iss-004), sessions sidebar with
create/switch (iss-009), active-session state driving displayed output, message rendering
(react-markdown), run-state indicators + retry (iss-006), and wiring the existing `nav-chats.tsx`.

## Context

- iss-004 acceptance: chat input lives in a pathless `_chat.tsx` layout, not per-child route;
  route is `/app/projects/:projectId/chat`.
- iss-009 (multi-session TB): sessions sidebar/panel, create-new-session, switching, active
  session controls output. In-memory sessions acceptable for the TB.
- iss-006 adds run-state indicators (`running`/`complete`/`error`) and retry UX.
- Existing pieces: `nav-chats.tsx` (generic chat list sidebar, unwired), sidebar "New Chat" →
  `/app` item, mock `ProjectSwitcher`, `react-markdown` for assistant output, `sonner` for
  toasts, `vaul` for overlays.
- The endpoint contract (iss-015) must exist to prototype against; blocked by it.

## Resolution shape

A prototype (via /prototype skill) + written decisions on layout, sessions state model, and
message rendering. Link the prototype as an asset; close; gist to the map.
Feeds iss-018 (all-chats) and unblocks iss-004/iss-009.
