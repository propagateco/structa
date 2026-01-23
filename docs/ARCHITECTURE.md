## Overview

Structa is a local-first web application designed for UK homeowners to plan renovations. It combines a 2D floor plan editor with an AI renovation assistant.

The system uses a hybird data architecture:

1. Structured Data via Electric SQL for user profiles and project metadata
2. Document Data via Durable Streams for floor plan geometry and spatial metadata
3. Intelligence Layer with FloorPlanEngine for 2D geometry calculations
4. AI Clerk for contextual Q&A and assistance

## Package Structure

The monorepo follows a clear separation of concerns:

- packages/web - Consumer-facing UI with TanStack Start routing
- packages/core - Business logic with geometry, regulations, materials, and schema
- packages/backend - API services with authentication and AI orchestration

## Related Documentation

- Development Practices: See ../development/
- Testing Philosophy: See ../development/TESTING.md
- Git Workflow: See ../workflow/GIT_WORKFLOW.md
- Tech Stack: See architecture/tech-stack.md
