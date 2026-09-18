# 04 — Persisted attachments

**What to build:** A user can attach approved images and common documents to a message, upload them directly to private storage, see previews, send them to The Clerk by attachment reference, retrieve them later, and recover cleanly from failed sends.

**Blocked by:** 02 — Production Clerk conversation runs.

**Status:** ready-for-agent

- [ ] Up to 10 files per message and 25 MB per file are validated by the backend with an explicit MIME allowlist.
- [ ] Browser uploads use authenticated presigned S3 PUT URLs and private object keys.
- [ ] Messages persist attachment metadata and stable IDs rather than public URLs or inline bytes.
- [ ] Reads use ownership-checked short-lived signed GET URLs.
- [ ] Failed sends retain removable draft attachments; scheduled cleanup reclaims abandoned pending objects.
