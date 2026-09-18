# Migrate artifacts from S3 to R2

Type: task
Map: iss-025-durable-automation-platform-map.md
Status: ready-for-agent

## Summary

Replace the current S3 storage and image pipeline with a provider-neutral ArtifactStore backed by
Cloudflare R2 for documents, images, attachments, and generated outputs.

## Scope

- Define ArtifactStore upload, bind, read, delete, derivative, and cleanup contracts.
- Add R2 bindings and authenticated direct-upload/read flows.
- Preserve checksums, MIME/size validation, private ownership, pending records, and signed reads.
- Dual-write or copy existing objects and backfill canonical Neon metadata.
- Replace image derivatives only after output parity and cache behavior are tested.
- Add orphan cleanup and lifecycle policy.

## Acceptance criteria

- New uploads and downloads use R2 without public object URLs.
- Existing S3 objects migrate with checksum and reference verification.
- Failed metadata writes leave recoverable pending objects that cleanup removes.
- No Cloudflare R2 type leaks into domain or API/MCP contracts.
- S3 removal has a tested rollback window.
