# Global conversation query and history contract

Type: wayfinder-grilling
Map: iss-020-production-chat-workspace-map.md
Status: resolved

## Question

What is the persisted read/write contract for workspace-wide Recent chats, renameable conversation labels, opening a conversation with full history, and live synchronization across tabs or clients?

## Resolution shape

A written decision covering collection/query boundaries, ordering and pagination, ownership, selected-conversation loading, optimistic rename reconciliation, and the relationship to the resolved `iss-016` schema.

## Answer

The workspace Recent chats list is a **user-owned, global conversation query**. It is not
filtered by the currently selected project; project context remains conversation metadata used
by The Clerk and is not displayed in the sidebar row.

- **Recent query:** read from the user-scoped `chat_sessions` shape/collection, excluding
  archived conversations. Order by `COALESCE(last_message_at, created_at) DESC, id DESC` so active
  conversations rise while newly-created sessions still have a deterministic position. Use a
  cursor containing the ordering tuple, with an initial page size of 50 and a "load more" path.
- **Row composition:** title only. Project name/context is intentionally omitted from the global
  sidebar to keep the Sessions Rail compact; the opened conversation supplies its project context.
- **New conversations:** a clicked New Chat remains local-only until the first user message is
  sent. The run endpoint then creates/upserts the persisted `chat_sessions` row as already defined
  by `iss-016`.
- **Opening history:** load a recent message window for the selected conversation immediately;
  older messages are fetched with a message cursor on demand. Full history remains accessible,
  but opening a very long conversation does not require loading every row up front. The active
  session's event shape continues to drive live run updates and reconstruction.
- **Renames:** use the existing optimistic collection update → tRPC mutation → Electric `txid`
  confirmation pattern. A failed mutation rolls back/reconciles to the server value.
- **Deletion:** deletion is hard and cascades through messages, runs, and run events. Deleted
  conversations never reappear in the query. Any future archive marker remains excluded from
  Recent chats; soft-delete is not part of this contract.
- **Ownership:** every session/message/run query is user-scoped server-side; the client does not
  enforce ownership by filtering alone. Session-scoped event access retains the `iss-016`
  ownership pre-check.
