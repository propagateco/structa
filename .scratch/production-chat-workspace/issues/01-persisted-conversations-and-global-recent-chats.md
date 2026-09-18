# 01 — Persisted conversations and global Recent chats

**What to build:** A user can see and manage their persisted conversations across projects from the global Recent chats sidebar, create a local New Chat draft, rename and hard-delete conversations, apply the optional project filter, and open a conversation at its deep-link URL.

**Blocked by:** None — can start immediately.

**Status:** in_progress

- [ ] Recent chats are read from authenticated persisted conversation data and ordered by latest activity with cursor pagination.
- [ ] New Chat remains local until the first message, then persists with the selected project context.
- [ ] Renames reconcile optimistically through the backend and live sync.
- [ ] Deletion hard-deletes the conversation and cascaded records.
- [ ] `/app/chat/:conversationId` opens the selected conversation with a recent history window and older-history loading.
