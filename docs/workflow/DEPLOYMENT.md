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

### Multi-Account Architecture

Dev and production environments are deployed to separate AWS accounts:

| Stage | AWS Account | Branch | Role |
|-------|-------------|--------|------|
| `dev` | Dev Account | `dev` | `structa-dev-GitHubActionsDeploy` |
| `production` | Production Account | `production` | `structa-production-GitHubActionsDeploy` |

### How It Works

```
┌─────────────────────┐     ┌─────────────────┐     ┌─────────────────────┐
│  Push to dev or     │────▶│  GitHub Actions │────▶│  AWS (OIDC)         │
│  production branch  │     │  Quality Checks │     │  SST Deploy         │
└─────────────────────┘     └─────────────────┘     └─────────────────────┘
```

### Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `dev` branch → Deploys to dev AWS account
- Push to `production` branch → Deploys to production AWS account
- Manual trigger via `workflow_dispatch`

**Steps:**
1. Checkout code
2. Install dependencies
3. Run quality checks (typecheck, lint, test)
4. Configure AWS credentials via OIDC (account selected by branch)
5. Deploy with SST

### OIDC Authentication

The pipeline uses AWS IAM OpenID Connect (OIDC) for authentication:

- **Identity Provider:** `token.actions.githubusercontent.com`
- **Trust Policy:** `repo:propagateco/structa:*`
- **Permissions:** AdministratorAccess

Each AWS account has its own OIDC provider and IAM role, created automatically when deploying to that stage.

### GitHub Variables

The following repository variables must be configured (Settings → Secrets and variables → Actions → Variables):

| Variable | Description |
|----------|-------------|
| `AWS_ACCOUNT_DEV` | Dev AWS account ID |
| `AWS_ACCOUNT_PRODUCTION` | Production AWS account ID |

### GitHub Secrets

The following repository secrets must be configured (Settings → Secrets and variables → Actions → Secrets):

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with "Edit zone DNS" permission |
| `CLOUDFLARE_DEFAULT_ACCOUNT_ID` | Cloudflare account ID |

### Testing OIDC

Run the verification workflow to test OIDC authentication:
- **Workflow:** `.github/workflows/test-oidc.yml`
- **Trigger:** Manual (`workflow_dispatch`)
- **Options:** Select `dev` or `production` stage

### Infrastructure

The OIDC infrastructure is defined in `infra/github.ts`:
- IAM OIDC Identity Provider for GitHub (created in permanent stages only)
- IAM Role with trust policy for the repository

Only permanent stages (`dev`, `production`) create OIDC resources. Personal stages do not need CI deploy roles.

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
