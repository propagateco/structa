# Structa Chat Workspace Context

The shared language for the production chat workspace that promotes the validated Sessions Rail UX into `/app`.

## Language

**Conversation**:
A durable, user-owned sequence of messages between the user and The Clerk. A conversation is the unit represented by one sidebar session row.
_Avoid_: Thread, chat tab, session (when referring to the durable domain object)

**Session**:
The UI label for a conversation in navigation. It has a renameable display title and may carry project context without becoming project-scoped in the global index.
_Avoid_: Temporary chat, run

**Workspace**:
The user's cross-project working area. Recent chats are workspace-wide by default, with an optional project filter for browsing.
_Avoid_: Project, account

**Project context**:
The project/property context associated with a conversation and supplied to The Clerk when generating a response. It is metadata on a conversation, not the boundary of the global session list; the active browse filter supplies initial context for a new conversation.
_Avoid_: Workspace scope

**Attachment**:
A user-selected file or image associated with a message, uploaded and persisted so it can be rendered and retrieved when the conversation is reopened.
_Avoid_: Upload preview, document (unless the file is specifically a document)
