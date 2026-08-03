# Session title auto-generation + edit

Type: wayfinder-grilling
Map: iss-011-chat-map.md
Status: open
Blocked by: iss-016-chat-persistence-schema-electric-sync-design.md

## Question

How are session titles generated and edited? The auto-title heuristic (from the first user
message), when generation happens (on first message vs on demand), the inline edit UX, and
how renames propagate through Electric to both the project sidebar and the all-chats index.

## Context

- iss-005 (#52) is the feature: inline title edit, persistence + sync, updated titles render in
  project chat sidebar and workspace all-chats index.
- iss-008's acceptance criteria already includes "session titles are auto-generated (from
  first message heuristic) and stored" — so the heuristic choice is shared with iss-016; this
  ticket owns the *edit* UX and the rename propagation decisions.
- Depends on the persisted sessions schema + sync design from iss-016 (title column, update
  mutation, optimistic update with `txid` — extend `usersCollection`'s `onUpdate` pattern).

## Resolution shape

A written decision: heuristic + timing, inline-edit interaction (input/validation/save),
optimistic update + reconciliation approach, and where renamed titles render. Close and gist
to the map. Unblocks iss-005.
