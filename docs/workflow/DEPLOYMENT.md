# Deployment Guidelines

This document describes deployment rules and restrictions.

## Contents

- [Critical Rules](#critical-rules)
- [Allowed Command](#allowed-command)
- [Forbidden Commands](#forbidden-commands)
- [Why These Rules Exist](#why-these-rules-exist)
- [Related Documentation](#related-documentation)

---

## Critical Rules

**CRITICAL**: Deployment commands must follow these strict rules.

---

## Allowed Command

- ✅ `npx sst deploy` – Deploys to your **personal stage** for testing
  - **If this fails**, note the failure clearly for investigation (service name, error details, what was changed)

---

## Forbidden Commands (NEVER RUN THESE)

- ❌ `npx sst deploy --stage dev` – Deployed by CI only
- ❌ `npx sst deploy --stage production` – Deployed by CI only

---

## Why These Rules Exist

Deployments to `dev` and `production` are triggered by **CI pipelines** after:
- All tests pass
- Linting and type checking passes
- Code review is approved

**Never manually deploy to these stages** – it bypasses the automated safety checks.

---

## Related Documentation

| Topic | Document |
|-------|----------|
| Git workflow (CI triggers deployment) | [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) |
| Quality tools (checked before CI) | [../development/QUALITY_TOOLS.md](../development/QUALITY_TOOLS.md) |
| Debugging deployment issues | [../development/DEBUGGING.md](../development/DEBUGGING.md) |
