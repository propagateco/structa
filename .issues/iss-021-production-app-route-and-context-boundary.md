# Production `/app` route and context boundary

Type: wayfinder-grilling
Map: iss-020-production-chat-workspace-map.md
Status: resolved

## Question

How should the canonical `/app` composition expose the global Recent chats list, current project context, conversation deep links, and the retired dashboard placeholder while preserving The Clerk's project-aware prompt context?

## Resolution shape

A written decision covering route/layout composition, sidebar navigation, project-context selection/display, conversation URLs, and the retirement boundary for `/app/prototype-chat`.

## Answer

- **Canonical routes:** `/app` is the new/empty conversation entry point. An existing
  conversation is addressed at `/app/chat/:conversationId`; selecting a Recent chats row navigates
  there, so conversations have shareable/deep-linkable URLs.
- **Main composition:** replace the `/app` dashboard placeholder with Sessions Rail option 1. The
  app shell and current sidebar navigation ordering remain intact; the existing Welcome, New Chat,
  Projects, Documents, Budget, and Property Profile entries are retained while their destinations
  are still being built.
- **Recent chats:** the data is global across projects by default. The existing project switcher
  remains as an optional browse filter; it narrows the visible global list but never mutates the
  stored context of an existing conversation.
- **New Chat:** if a project filter is active, its project becomes the new conversation's initial
  project context. With no filter, the conversation starts unscoped. It remains local-only until
  the first message, per `iss-022`.
- **Existing conversation context:** opening `/app/chat/:conversationId` uses the conversation's
  stored project context regardless of the current browse filter. The filter affects discovery,
  not prompt context.
- **Migration:** `/app/prototype-chat` is removed rather than retained as a permanent demo route;
  the floating variant switcher is removed; Sessions Rail becomes the only production layout.
