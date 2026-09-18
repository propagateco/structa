# 03 — Promote Sessions Rail into `/app`

**What to build:** The canonical `/app` route becomes the production Sessions Rail workspace, replacing the dashboard placeholder while preserving the app shell and existing sidebar ordering.

**Blocked by:** 02 — Production Clerk conversation runs.

**Status:** ready-for-agent

- [ ] `/app` renders the production Sessions Rail and opens the new-conversation state.
- [ ] Sidebar session selection and `/app/chat/:conversationId` navigation use persisted conversations.
- [ ] Existing conversations retain and use their stored project context regardless of the current browse filter.
- [ ] The project switcher acts as an optional global Recent chats filter and supplies initial context for New Chat.
- [ ] The route handles loading, empty, history, running, and error states without mock data.
