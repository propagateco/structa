## Overview

Structa is a collaborative web application designed for UK homeowners to plan renovations. It combines a 2D floor plan editor with an AI renovation assistant.

The system uses a hybrid data architecture:

1. Global business data in Neon, loaded into TanStack DB through Query Collections and authenticated APIs
2. Live conversation and job coordination through Cloudflare Durable Objects
3. Long-running execution, retries, and approval waits through Cloudflare Workflows
4. Files and generated artifacts in R2, with document retrieval through Cloudflare AI Search
5. Intelligence Layer with FloorPlanEngine for 2D geometry calculations
6. AI Clerk for contextual Q&A, capability invocation, and assistance

Neon remains the queryable business authority for users, workspaces, projects, permissions, indexes,
artifacts, approvals, audit records, and materialized results. Cloudflare runtime primitives stay behind
Structa-owned conversation, job, artifact, retrieval, and capability interfaces.

## Package Structure

The monorepo follows a clear separation of concerns:

- packages/web - Consumer-facing UI with TanStack Start routing
- packages/core - Business logic with geometry, regulations, materials, and schema
- packages/backend - API services with authentication and AI orchestration
- packages/web-template/apps/data-service - Cloudflare Worker, Durable Object, and Workflow reference

## Migration

The current Electric Sync and S3 paths are transitional. The phased replacement plan is documented in
[STR-005: Cloudflare Platform Migration](../../../.plan/STR-005-cloudflare-platform-migration.md).

## Related Documentation

- Development Practices: See ../development/
- Testing Philosophy: See ../development/testing.md
- Git Workflow: See ../workflow/git_workflow.md
- Tech Stack: See tech_stack.md
