# Persisted attachment lifecycle

Type: wayfinder-grilling
Map: iss-020-production-chat-workspace-map.md
Status: resolved
Blocked by: iss-023

## Question

What is the production lifecycle for selecting, uploading, authorizing, storing, attaching, rendering, and retrieving files/images across conversation history and retries?

## Resolution shape

A written decision covering supported types and limits, storage ownership and keying, upload protocol, message payload references, authorization, failure/retry behavior, cleanup, and compatibility with the resolved chat message schema.

## Answer

Production attachments use the existing private S3 storage and presigned-upload pattern.

- **Supported input:** images plus common documents (PDF, plain text, Markdown, CSV, JSON/XML,
  and common office documents where the MIME can be validated). The backend enforces a maximum of
  10 files per message and 25 MB per file, alongside an explicit MIME allowlist.
- **Upload:** the browser asks the authenticated backend for a presigned S3 PUT URL after local
  type/size checks, then uploads bytes directly to S3. Binary data does not pass through the web
  or chat backend. The backend creates an attachment record with a stable id, owner,
  conversation/session association, filename, MIME, byte size, checksum, storage key, and pending
  status.
- **Message reference:** chat messages store attachment ids/metadata references, not public URLs,
  data URLs, or embedded bytes. The run endpoint accepts attachment ids, verifies ownership and
  conversation membership, and resolves authorized metadata/content for The Clerk's model
  pipeline.
- **Read authorization:** attachment objects remain private. The backend verifies that the caller
  owns the conversation/attachment and returns short-lived signed GET URLs for rendering or
  download.
- **Draft failure:** a successful upload remains a visible, removable unsubmitted draft when
  message sending fails. A pending attachment is bound to the message on successful send; a
  scheduled cleanup job removes pending records and S3 objects after the retention window.
- **Retries:** retry reuses the persisted attachment references for the same user message; it does
  not duplicate the uploaded objects.
- **Security:** ownership checks happen on presign, bind/send, and read-url operations. Client
  MIME checks are UX only; backend validation is authoritative.
