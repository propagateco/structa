# Deployment Guidelines

This document describes deployment rules and restrictions.

## Contents

- [Critical Rules](#critical-rules)
- [Allowed Command](#allowed-command)
- [Forbidden Commands](#forbidden-commands)
- [CI/CD Pipeline](#cicd-pipeline)
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

## CI/CD Pipeline

### Overview

The project uses **GitHub Actions with OIDC** for secure deployments to AWS. This eliminates the need for long-lived AWS credentials stored in GitHub secrets.

### How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Push to dev   │────▶│  GitHub Actions │────▶│   AWS (OIDC)    │
│     branch      │     │  Quality Checks │     │  SST Deploy     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Deploy Workflow (`.github/workflows/deploy.yml`)

**Trigger:** Push to `dev` branch

**Steps:**
1. Checkout code
2. Install dependencies
3. Run quality checks (typecheck, lint, test)
4. Configure AWS credentials via OIDC
5. Deploy with SST

### OIDC Authentication

The pipeline uses AWS IAM OpenID Connect (OIDC) for authentication:

- **Identity Provider:** `token.actions.githubusercontent.com`
- **Role:** `structa-dev-GitHubActionsDeploy`
- **Trust Policy:** `repo:propagateco/structa:*`
- **Permissions:** AdministratorAccess (scoped to dev stage)

### Testing OIDC

Run the verification workflow to test OIDC authentication:
- **Workflow:** `.github/workflows/test-oidc.yml`
- **Trigger:** Manual (`workflow_dispatch`) or changes to `infra/pipeline.ts`

### Infrastructure

The OIDC infrastructure is defined in `infra/pipeline.ts`:
- IAM OIDC Identity Provider for GitHub
- IAM Role with trust policy for the repository

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
