# Implementation Plan: AWS OIDC for GitHub Actions

**Plan ID**: 01  
**Created**: 2026-01-21  
**Status**: Ready for Implementation  
**Estimated Time**: 2-3 hours  
**Priority**: HIGH  

---

## Overview

Implement AWS OpenID Connect (OIDC) authentication for GitHub Actions to enable secure, credential-free authentication to AWS services. This eliminates the need for long-lived AWS access keys and enables CI workflows to run SST commands that require AWS credentials.

---

## Context & Problem Statement

### Current State
- ❌ GitHub Actions CI workflow (`.github/workflows/pr-checks.yml`) fails when running `npm run typecheck`
- ❌ `npm run typecheck:core` and `npm run typecheck:backend` use `sst shell` which requires AWS credentials
- ❌ No AWS credentials configured in GitHub Actions
- ⚠️ Local development uses AWS SSO (manual login every ~12 hours)

### Desired State
- ✅ GitHub Actions can authenticate to AWS using OIDC (no stored credentials)
- ✅ CI workflows can run `npm run typecheck` successfully
- ✅ Short-lived tokens (15 min - 12 hours) generated per workflow run
- ✅ Clear audit trail in AWS CloudTrail
- ✅ Separate IAM roles for different workflow types (typecheck vs. deploy)

### Why OIDC?
- **Security**: No long-lived credentials to manage or rotate
- **Official**: Recommended by both AWS and GitHub
- **SST Compatible**: Works seamlessly with `sst shell` commands
- **Cost**: Free (within AWS free tier)
- **Audit**: Clear trail of which workflow assumed which role

---

## Prerequisites

### Required Access
- [ ] AWS Console access to account `571512465874`
- [ ] IAM permissions to:
  - Create OIDC Identity Providers
  - Create IAM Roles and Policies
  - View CloudTrail logs (optional, for verification)
- [ ] GitHub repository admin access (to view workflow runs)

### Required Information
- **AWS Account ID**: `571512465874`
- **AWS Region**: `eu-west-2` (based on existing SSO config)
- **GitHub Organization/Owner**: `{TO_BE_DETERMINED}` ← **ACTION REQUIRED**
- **GitHub Repository**: `structa`
- **SST State Bucket Pattern**: `sst-state-structa-*`

### Knowledge Requirements
- Basic understanding of AWS IAM (roles, policies, trust relationships)
- Basic understanding of GitHub Actions (workflows, jobs, permissions)
- Familiarity with AWS CLI (for testing)

---

## Phase 1: AWS IAM Configuration (90-120 minutes)

### Step 1.1: Create OIDC Identity Provider (15 minutes)

#### Via AWS Console (Recommended for First-Time)

1. **Navigate to IAM Console**
   - Go to: https://console.aws.amazon.com/iam/
   - Select: **Identity providers** (left sidebar)
   - Click: **Add provider**

2. **Configure Provider**
   - **Provider type**: OpenID Connect
   - **Provider URL**: `https://token.actions.githubusercontent.com`
     - ⚠️ **CRITICAL**: Must be lowercase, exactly as shown
     - ❌ WRONG: `HTTPS://TOKEN.ACTIONS.GITHUBUSERCONTENT.COM`
     - ✅ CORRECT: `https://token.actions.githubusercontent.com`
   - **Audience**: `sts.amazonaws.com`
   - Click: **Get thumbprint** (auto-populates)
   - Expected thumbprint: `6938fd4d98bab03faadb97b34396831e3780aea1`

3. **Create Provider**
   - Click: **Add provider**
   - **Verify**: Provider appears in list as `token.actions.githubusercontent.com`

4. **Record ARN**
   - Copy the provider ARN (format: `arn:aws:iam::571512465874:oidc-provider/token.actions.githubusercontent.com`)
   - Save to: `specs/plans/01-aws-oidc-github-actions.md` (append to this file)

#### Via AWS CLI (Alternative)

```bash
# Create OIDC provider
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 \
  --profile structa-dev

# Verify creation
aws iam list-open-id-connect-providers --profile structa-dev
```

**Success Criteria**:
- [ ] OIDC provider visible in IAM console
- [ ] Provider URL is exactly `https://token.actions.githubusercontent.com` (lowercase)
- [ ] Audience includes `sts.amazonaws.com`

---

### Step 1.2: Create IAM Role for Typecheck (45 minutes)

We'll create a minimal-permission role first for running typechecks in PRs.

#### Step 1.2a: Create Trust Policy

Create a file locally with the trust policy:

**File**: `/tmp/github-actions-typecheck-trust-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::571512465874:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/structa:*"
        }
      }
    }
  ]
}
```

**⚠️ ACTION REQUIRED**: Replace `YOUR_ORG` with your GitHub organization/username.

**Trust Policy Explanation**:
- `StringEquals` on `aud`: Ensures token is intended for AWS STS (not another service)
- `StringLike` on `sub` with `*`: Allows any branch, PR, or environment in the repo
- Pattern `repo:YOUR_ORG/structa:*` means:
  - ✅ Any branch: `repo:YOUR_ORG/structa:ref:refs/heads/main`
  - ✅ Any PR: `repo:YOUR_ORG/structa:pull_request`
  - ✅ Any environment: `repo:YOUR_ORG/structa:environment:prod`
  - ❌ Different repo: `repo:YOUR_ORG/other-repo:*` (rejected)

#### Step 1.2b: Create Permissions Policy

Create a file with minimal permissions for typecheck:

**File**: `/tmp/github-actions-typecheck-permissions.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AccessSSTState",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::sst-state-structa-*",
        "arn:aws:s3:::sst-state-structa-*/*"
      ]
    },
    {
      "Sid": "AccessSSMParameters",
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:GetParametersByPath"
      ],
      "Resource": [
        "arn:aws:ssm:eu-west-2:571512465874:parameter/sst/*"
      ]
    },
    {
      "Sid": "VerifyIdentity",
      "Effect": "Allow",
      "Action": "sts:GetCallerIdentity",
      "Resource": "*"
    }
  ]
}
```

**Permissions Explanation**:
- `s3:GetObject`, `s3:ListBucket`: Read SST state bucket (needed by `sst shell`)
- `ssm:GetParameter*`: Read SST configuration from Parameter Store
- `sts:GetCallerIdentity`: Verify authentication (useful for debugging)

#### Step 1.2c: Create IAM Role via Console

1. **Navigate to IAM Roles**
   - Go to: https://console.aws.amazon.com/iam/
   - Select: **Roles** (left sidebar)
   - Click: **Create role**

2. **Select Trusted Entity**
   - **Trusted entity type**: Web identity
   - **Identity provider**: Select `token.actions.githubusercontent.com` from dropdown
   - **Audience**: `sts.amazonaws.com`
   - Click: **Next**

3. **Skip Permissions** (for now)
   - Click: **Next** (we'll add inline policy later)

4. **Name and Create**
   - **Role name**: `GitHubActionsSST-Typecheck`
   - **Description**: `GitHub Actions OIDC role for running SST typecheck in CI`
   - Click: **Create role**

5. **Add Trust Policy**
   - Click on newly created role: `GitHubActionsSST-Typecheck`
   - Go to: **Trust relationships** tab
   - Click: **Edit trust policy**
   - Paste contents of `/tmp/github-actions-typecheck-trust-policy.json`
   - Click: **Update policy**

6. **Add Permissions Policy**
   - Still in the role, go to: **Permissions** tab
   - Click: **Add permissions** → **Create inline policy**
   - Click: **JSON** tab
   - Paste contents of `/tmp/github-actions-typecheck-permissions.json`
   - Click: **Next**
   - **Policy name**: `SSTTypecheckAccess`
   - Click: **Create policy**

7. **Record Role ARN**
   - Copy the role ARN (shown at top of role page)
   - Format: `arn:aws:iam::571512465874:role/GitHubActionsSST-Typecheck`
   - Save to: `specs/plans/01-aws-oidc-github-actions.md` (append to this file)

#### Step 1.2d: Create IAM Role via AWS CLI (Alternative)

```bash
# Set your GitHub org/username
GITHUB_ORG="YOUR_ORG"  # ← CHANGE THIS

# Create trust policy file
cat > /tmp/github-actions-typecheck-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::571512465874:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_ORG}/structa:*"
        }
      }
    }
  ]
}
EOF

# Create IAM role
aws iam create-role \
  --role-name GitHubActionsSST-Typecheck \
  --assume-role-policy-document file:///tmp/github-actions-typecheck-trust-policy.json \
  --description "GitHub Actions OIDC role for running SST typecheck in CI" \
  --profile structa-dev

# Create permissions policy file
cat > /tmp/github-actions-typecheck-permissions.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AccessSSTState",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::sst-state-structa-*",
        "arn:aws:s3:::sst-state-structa-*/*"
      ]
    },
    {
      "Sid": "AccessSSMParameters",
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:GetParametersByPath"
      ],
      "Resource": [
        "arn:aws:ssm:eu-west-2:571512465874:parameter/sst/*"
      ]
    },
    {
      "Sid": "VerifyIdentity",
      "Effect": "Allow",
      "Action": "sts:GetCallerIdentity",
      "Resource": "*"
    }
  ]
}
EOF

# Attach inline policy to role
aws iam put-role-policy \
  --role-name GitHubActionsSST-Typecheck \
  --policy-name SSTTypecheckAccess \
  --policy-document file:///tmp/github-actions-typecheck-permissions.json \
  --profile structa-dev

# Get role ARN
aws iam get-role \
  --role-name GitHubActionsSST-Typecheck \
  --query 'Role.Arn' \
  --output text \
  --profile structa-dev
```

**Success Criteria**:
- [ ] Role `GitHubActionsSST-Typecheck` exists in IAM
- [ ] Trust policy allows `token.actions.githubusercontent.com` OIDC provider
- [ ] Trust policy `sub` condition includes `repo:YOUR_ORG/structa:*`
- [ ] Permissions policy `SSTTypecheckAccess` attached to role
- [ ] Role ARN recorded

---

### Step 1.3: Test IAM Role Assumption (30 minutes)

Before integrating with GitHub Actions, test that the role can be assumed.

#### Step 1.3a: Test with AWS CLI (Manual Token)

This tests the IAM configuration without GitHub Actions.

```bash
# Install jq if not already installed
# sudo apt-get install jq  # Ubuntu/Debian
# brew install jq          # macOS

# Get OIDC provider ARN
OIDC_PROVIDER_ARN="arn:aws:iam::571512465874:oidc-provider/token.actions.githubusercontent.com"

# Get role ARN (from Step 1.2)
ROLE_ARN="arn:aws:iam::571512465874:role/GitHubActionsSST-Typecheck"

# Describe OIDC provider (verify it exists)
aws iam get-open-id-connect-provider \
  --open-id-connect-provider-arn "$OIDC_PROVIDER_ARN" \
  --profile structa-dev

# Get role details (verify trust policy)
aws iam get-role \
  --role-name GitHubActionsSST-Typecheck \
  --profile structa-dev | jq '.Role.AssumeRolePolicyDocument'

# List attached policies
aws iam list-role-policies \
  --role-name GitHubActionsSST-Typecheck \
  --profile structa-dev
```

**Expected Output**:
- OIDC provider details show `ClientIDList: ["sts.amazonaws.com"]`
- Trust policy shows `Federated` principal with OIDC provider ARN
- Role policies include `SSTTypecheckAccess`

**Success Criteria**:
- [ ] OIDC provider exists and is correctly configured
- [ ] Role trust policy references correct OIDC provider
- [ ] Role has `SSTTypecheckAccess` inline policy

---

## Phase 2: GitHub Actions Integration (30-45 minutes)

### Step 2.1: Update Workflow Permissions (5 minutes)

Edit `.github/workflows/pr-checks.yml` to add OIDC permissions.

**File**: `.github/workflows/pr-checks.yml`

**Before** (current):
```yaml
name: PR Quality Checks

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
  workflow_dispatch:

jobs:
  quality-checks:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    # ... rest of workflow
```

**After** (with OIDC permissions):
```yaml
name: PR Quality Checks

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
  workflow_dispatch:

# ← ADD THESE PERMISSIONS
permissions:
  id-token: write   # Required for requesting OIDC JWT
  contents: read    # Required for actions/checkout

jobs:
  quality-checks:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    # ... rest of workflow
```

**What changed**:
- Added `permissions` block at workflow level (applies to all jobs)
- `id-token: write`: Allows workflow to request OIDC token from GitHub
- `contents: read`: Maintains existing checkout permissions

**Success Criteria**:
- [ ] `permissions` block added to workflow file
- [ ] `id-token: write` permission included
- [ ] File saved and changes ready to commit

---

### Step 2.2: Add AWS Authentication Step (15 minutes)

Add the `configure-aws-credentials` action to the workflow.

**File**: `.github/workflows/pr-checks.yml`

**Insert after "Install dependencies" step**:

```yaml
- name: Install dependencies
  run: npm ci

# ← ADD THIS BLOCK
- name: Configure AWS credentials via OIDC
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::571512465874:role/GitHubActionsSST-Typecheck
    aws-region: eu-west-2
    role-session-name: GHA-typecheck-${{ github.run_id }}

- name: Verify AWS identity
  run: |
    echo "✅ AWS Authentication successful"
    echo "AWS Account: $(aws sts get-caller-identity --query Account --output text)"
    echo "Assumed Role: $(aws sts get-caller-identity --query Arn --output text)"

# Continue with existing steps
- name: TypeScript type check
  run: npm run typecheck
```

**Parameters Explained**:
- `role-to-assume`: IAM role ARN created in Phase 1
- `aws-region`: Region where SST state bucket lives
- `role-session-name`: Unique identifier for CloudTrail logs (includes run ID)

**Verification Step**:
- Added "Verify AWS identity" step to confirm authentication worked
- Prints AWS account and assumed role ARN
- Useful for debugging

**Success Criteria**:
- [ ] `configure-aws-credentials` step added
- [ ] Role ARN matches role created in Phase 1
- [ ] Verification step included
- [ ] File saved and changes ready to commit

---

### Step 2.3: Complete Updated Workflow (Reference)

Here's the complete updated `.github/workflows/pr-checks.yml`:

```yaml
name: PR Quality Checks

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
  workflow_dispatch:

# Required for OIDC authentication
permissions:
  id-token: write   # Required for requesting OIDC JWT
  contents: read    # Required for actions/checkout

jobs:
  quality-checks:
    # Skip draft PRs
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      # AWS OIDC Authentication
      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::571512465874:role/GitHubActionsSST-Typecheck
          aws-region: eu-west-2
          role-session-name: GHA-typecheck-${{ github.run_id }}

      - name: Verify AWS identity
        run: |
          echo "✅ AWS Authentication successful"
          echo "AWS Account: $(aws sts get-caller-identity --query Account --output text)"
          echo "Assumed Role: $(aws sts get-caller-identity --query Arn --output text)"

      # Now typecheck works with AWS credentials
      - name: TypeScript type check
        run: npm run typecheck

      - name: Lint check
        run: npm run check

      - name: Run tests
        run: npm test

      - name: Security audit
        run: npm audit --production
        continue-on-error: true
```

---

## Phase 3: Testing & Verification (30-45 minutes)

### Step 3.1: Create Test PR (10 minutes)

1. **Create feature branch**:
   ```bash
   git checkout -b test/aws-oidc-integration
   ```

2. **Commit workflow changes**:
   ```bash
   git add .github/workflows/pr-checks.yml
   git commit -m "feat: add AWS OIDC authentication for GitHub Actions

   - Add OIDC permissions to workflow
   - Configure aws-actions/configure-aws-credentials@v4
   - Add AWS identity verification step
   - Enables typecheck to run with SST shell commands

   Closes #<issue-number>"
   ```

3. **Push branch**:
   ```bash
   git push -u origin test/aws-oidc-integration
   ```

4. **Create PR**:
   ```bash
   gh pr create \
     --title "feat: Add AWS OIDC authentication for GitHub Actions" \
     --body "## Summary

   This PR implements AWS OpenID Connect (OIDC) authentication for GitHub Actions, eliminating the need for long-lived AWS credentials.

   ## Changes
   - Added \`permissions\` block to enable OIDC token requests
   - Added \`configure-aws-credentials\` action for AWS authentication
   - Added AWS identity verification step
   - Typecheck now runs successfully with SST shell commands

   ## Testing
   - [ ] Workflow runs successfully
   - [ ] AWS authentication step passes
   - [ ] Typecheck completes without errors
   - [ ] CloudTrail logs show role assumption

   ## Related
   - Implements spec: specs/plans/01-aws-oidc-github-actions.md"
   ```

**Success Criteria**:
- [ ] Test branch created
- [ ] Changes committed
- [ ] PR created and visible on GitHub

---

### Step 3.2: Monitor Workflow Execution (15 minutes)

1. **Watch workflow run**:
   ```bash
   gh pr checks --watch
   ```

2. **Or view in browser**:
   - Go to PR page
   - Click "Checks" tab
   - Watch "PR Quality Checks" workflow

3. **Look for**:
   - ✅ "Configure AWS credentials via OIDC" step succeeds
   - ✅ "Verify AWS identity" step shows correct account and role
   - ✅ "TypeScript type check" step completes (no "cached SSO token is expired" error)

**Expected Output** (in "Verify AWS identity" step):
```
✅ AWS Authentication successful
AWS Account: 571512465874
Assumed Role: arn:aws:sts::571512465874:assumed-role/GitHubActionsSST-Typecheck/GHA-typecheck-1234567890
```

**Success Criteria**:
- [ ] Workflow starts automatically
- [ ] AWS authentication step succeeds
- [ ] Verification step shows correct account/role
- [ ] Typecheck completes successfully
- [ ] All CI checks pass

---

### Step 3.3: Verify in AWS CloudTrail (10 minutes)

Confirm that the role assumption appears in AWS CloudTrail logs.

1. **Navigate to CloudTrail**:
   - Go to: https://console.aws.amazon.com/cloudtrail/
   - Select region: `eu-west-2`
   - Click: **Event history**

2. **Filter events**:
   - **Event name**: `AssumeRoleWithWebIdentity`
   - **Time range**: Last 1 hour
   - Click: **Apply**

3. **Find your event**:
   - Look for event with:
     - **User name**: `token.actions.githubusercontent.com`
     - **Resource name**: `GitHubActionsSST-Typecheck`
     - **Event time**: Matches your workflow run time

4. **Inspect event details**:
   - Click on event
   - View JSON
   - Verify:
     - `userIdentity.principalId` contains your GitHub repo path
     - `requestParameters.roleSessionName` is `GHA-typecheck-<run_id>`
     - `responseElements.assumedRoleUser.arn` shows the role ARN

**Example CloudTrail Event**:
```json
{
  "eventName": "AssumeRoleWithWebIdentity",
  "userIdentity": {
    "type": "WebIdentityUser",
    "principalId": "arn:aws:sts::571512465874:assumed-role/GitHubActionsSST-Typecheck/GHA-typecheck-1234567890",
    "userName": "token.actions.githubusercontent.com"
  },
  "requestParameters": {
    "roleArn": "arn:aws:iam::571512465874:role/GitHubActionsSST-Typecheck",
    "roleSessionName": "GHA-typecheck-1234567890",
    "webIdentityToken": "<REDACTED>"
  },
  "responseElements": {
    "assumedRoleUser": {
      "assumedRoleId": "AROA...:GHA-typecheck-1234567890",
      "arn": "arn:aws:sts::571512465874:assumed-role/GitHubActionsSST-Typecheck/GHA-typecheck-1234567890"
    }
  }
}
```

**Success Criteria**:
- [ ] `AssumeRoleWithWebIdentity` event appears in CloudTrail
- [ ] Event shows correct role name
- [ ] Session name includes workflow run ID
- [ ] Event time matches workflow execution time

---

### Step 3.4: Test Error Scenarios (Optional, 10 minutes)

Verify that trust policy conditions work correctly.

#### Test 1: Wrong Repository (Should Fail)

Create a workflow in a different repository (if you have one) and try to assume the role. It should fail with "Not authorized to perform sts:AssumeRoleWithWebIdentity".

**Expected**: ❌ Workflow fails at AWS authentication step

#### Test 2: Missing Permissions (Should Fail)

Temporarily remove `id-token: write` from workflow and push changes.

**Expected**: ❌ Workflow fails with "Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable"

**Restore**: Add `id-token: write` back before continuing.

**Success Criteria**:
- [ ] Understood how trust policy protects against unauthorized access
- [ ] Confirmed permissions requirement

---

## Phase 4: Documentation & Cleanup (15-30 minutes)

### Step 4.1: Update AGENTS.md (15 minutes)

Add documentation about OIDC configuration to `AGENTS.md`.

**File**: `AGENTS.md`

**Insert new section in "7. Git Workflow & Quality Gates"**:

```markdown
### 7.5 AWS OIDC Authentication in CI

GitHub Actions authenticates to AWS using OpenID Connect (OIDC), eliminating the need for long-lived credentials.

#### How It Works

1. Workflow declares `permissions: { id-token: write }`
2. `configure-aws-credentials` action requests JWT from GitHub's OIDC provider
3. AWS validates JWT against IAM trust policy
4. AWS issues short-lived credentials (valid for 1 hour by default)
5. SST commands use these credentials automatically

#### IAM Roles

| Role Name | Purpose | Trust Policy Condition | Permissions |
|-----------|---------|----------------------|-------------|
| `GitHubActionsSST-Typecheck` | PR type checking | `repo:ORG/structa:*` | Read-only (S3, SSM) |

#### Troubleshooting

**Error: "Not authorized to perform sts:AssumeRoleWithWebIdentity"**
- Cause: Missing `permissions: { id-token: write }` in workflow
- Fix: Add permissions block to workflow YAML

**Error: "cached SSO token is expired"**
- Cause: AWS authentication failed, falling back to local credentials
- Fix: Verify `configure-aws-credentials` step ran successfully

**Verify Authentication**:
```bash
# In GitHub Actions workflow, after configure-aws-credentials:
- name: Debug AWS credentials
  run: |
    aws sts get-caller-identity
    echo "AWS_ACCESS_KEY_ID is set: ${AWS_ACCESS_KEY_ID:+yes}"
    echo "AWS_SECRET_ACCESS_KEY is set: ${AWS_SECRET_ACCESS_KEY:+yes}"
    echo "AWS_SESSION_TOKEN is set: ${AWS_SESSION_TOKEN:+yes}"
```

#### CloudTrail Audit

All role assumptions are logged in CloudTrail:
- **Event name**: `AssumeRoleWithWebIdentity`
- **User name**: `token.actions.githubusercontent.com`
- **Session name**: `GHA-typecheck-<run_id>`

#### Security Considerations

- **Short-lived tokens**: Credentials expire after 1 hour (configurable)
- **No credential rotation**: Tokens are generated per workflow run
- **Granular permissions**: Role has minimal required permissions
- **Trust policy restrictions**: Only `structa` repository can assume role
```

**Success Criteria**:
- [ ] AGENTS.md updated with OIDC documentation
- [ ] Troubleshooting section added
- [ ] CloudTrail audit information included
- [ ] Changes committed

---

### Step 4.2: Record Implementation Details (10 minutes)

Append actual values to this plan file for future reference.

**File**: `specs/plans/01-aws-oidc-github-actions.md` (this file)

**Append to bottom**:

```markdown
---

## Implementation Record

**Implemented Date**: YYYY-MM-DD  
**Implemented By**: {Your Name}  

### Actual Values Used

- **GitHub Organization**: `{ACTUAL_ORG}`
- **OIDC Provider ARN**: `arn:aws:iam::571512465874:oidc-provider/token.actions.githubusercontent.com`
- **IAM Role ARN**: `arn:aws:iam::571512465874:role/GitHubActionsSST-Typecheck`
- **IAM Role Name**: `GitHubActionsSST-Typecheck`
- **Inline Policy Name**: `SSTTypecheckAccess`

### Trust Policy (Final)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::571512465874:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:{ACTUAL_ORG}/structa:*"
        }
      }
    }
  ]
}
```

### Test Results

- **Test PR**: #{PR_NUMBER}
- **Workflow Run**: {WORKFLOW_RUN_URL}
- **CloudTrail Event ID**: {EVENT_ID}
- **Verification Status**: ✅ PASSED

### Issues Encountered

{Document any issues and how they were resolved}
```

**Success Criteria**:
- [ ] Implementation details recorded
- [ ] Actual ARNs documented
- [ ] Test results recorded
- [ ] File saved

---

### Step 4.3: Merge PR (5 minutes)

Once all tests pass:

1. **Request review** (if required):
   ```bash
   gh pr review --approve
   ```

2. **Merge PR**:
   ```bash
   gh pr merge --squash --delete-branch
   ```

3. **Verify on main branch**:
   - Check that subsequent PRs now have working typecheck

**Success Criteria**:
- [ ] PR approved (if review required)
- [ ] PR merged to main/production branch
- [ ] Test branch deleted
- [ ] Future PRs can run typecheck successfully

---

## Rollback Plan

If OIDC implementation fails and needs to be reverted:

### Revert GitHub Actions Changes

```bash
# Revert the commit
git revert <commit-hash>
git push origin main

# Or remove the changes manually
git checkout main
git pull
# Edit .github/workflows/pr-checks.yml to remove:
#   - permissions block
#   - configure-aws-credentials step
#   - verify identity step
git add .github/workflows/pr-checks.yml
git commit -m "revert: remove OIDC authentication (rollback)"
git push origin main
```

### AWS Resources

**Do NOT delete** AWS resources immediately:
- IAM OIDC provider can remain (no cost)
- IAM role can remain (no cost)
- May be useful for future retry

If you must delete:
```bash
# Delete role policy
aws iam delete-role-policy \
  --role-name GitHubActionsSST-Typecheck \
  --policy-name SSTTypecheckAccess \
  --profile structa-dev

# Delete role
aws iam delete-role \
  --role-name GitHubActionsSST-Typecheck \
  --profile structa-dev

# Delete OIDC provider (only if no other roles use it)
aws iam delete-open-id-connect-provider \
  --open-id-connect-provider-arn "arn:aws:iam::571512465874:oidc-provider/token.actions.githubusercontent.com" \
  --profile structa-dev
```

---

## Common Issues & Troubleshooting

### Issue 1: "Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable"

**Symptom**:
```
Error: Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable
```

**Cause**: Missing `permissions: { id-token: write }` in workflow

**Fix**:
```yaml
# Add to workflow file (top level, before jobs:)
permissions:
  id-token: write
  contents: read
```

---

### Issue 2: "Not authorized to perform sts:AssumeRoleWithWebIdentity"

**Symptom**:
```
Error: Not authorized to perform sts:AssumeRoleWithWebIdentity
```

**Possible Causes**:

1. **Wrong trust policy condition**
   - Fix: Verify `sub` condition in trust policy matches `repo:YOUR_ORG/structa:*`

2. **Wrong audience**
   - Fix: Verify trust policy has `"token.actions.githubusercontent.com:aud": "sts.amazonaws.com"`

3. **OIDC provider URL case sensitivity**
   - Fix: Ensure provider URL is lowercase: `https://token.actions.githubusercontent.com`

4. **Role doesn't exist**
   - Fix: Verify role ARN in workflow matches role created in AWS

**Debug**:
```yaml
- name: Debug OIDC token
  run: |
    # Get token from GitHub
    TOKEN=$(curl -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \
      "$ACTIONS_ID_TOKEN_REQUEST_URL&audience=sts.amazonaws.com" | jq -r .value)
    
    # Decode JWT (requires base64url decoding)
    echo $TOKEN | cut -d. -f2 | base64 -d 2>/dev/null | jq .
  env:
    ACTIONS_ID_TOKEN_REQUEST_TOKEN: ${{ secrets.ACTIONS_ID_TOKEN_REQUEST_TOKEN }}
    ACTIONS_ID_TOKEN_REQUEST_URL: ${{ secrets.ACTIONS_ID_TOKEN_REQUEST_URL }}
```

---

### Issue 3: "Access Denied" when accessing S3 bucket

**Symptom**:
```
An error occurred (AccessDenied) when calling the GetObject operation
```

**Cause**: IAM role lacks S3 permissions

**Fix**: Verify permissions policy includes:
```json
{
  "Action": [
    "s3:GetObject",
    "s3:ListBucket"
  ],
  "Resource": [
    "arn:aws:s3:::sst-state-structa-*",
    "arn:aws:s3:::sst-state-structa-*/*"
  ]
}
```

**Debug**:
```bash
# Check actual SST state bucket name
aws s3 ls --profile structa-dev | grep sst-state-structa

# Update permissions policy with exact bucket name if needed
```

---

### Issue 4: Token expires during workflow

**Symptom**: Workflow fails after ~1 hour with authentication error

**Cause**: Default token lifetime is 1 hour

**Fix**: Increase token duration:
```yaml
- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::571512465874:role/GitHubActionsSST-Typecheck
    aws-region: eu-west-2
    role-duration-seconds: 3600  # 1 hour (default)
    # Can increase up to 43200 (12 hours)
```

**Note**: IAM role must have `MaxSessionDuration` configured appropriately.

---

## Success Metrics

After implementation, you should observe:

### Technical Metrics
- ✅ GitHub Actions workflows complete successfully
- ✅ Typecheck runs without "cached SSO token is expired" errors
- ✅ Average workflow duration: ~2-5 minutes (no significant slowdown)
- ✅ AWS authentication step: ~2-3 seconds

### Security Metrics
- ✅ No long-lived AWS credentials stored in GitHub Secrets
- ✅ CloudTrail shows role assumptions with unique session names
- ✅ Role permissions follow least-privilege principle

### Developer Experience
- ✅ PRs can be opened without manual AWS credential intervention
- ✅ CI failures are due to code issues, not authentication issues
- ✅ Clear error messages when authentication fails

---

## Next Steps

After successfully implementing OIDC for typecheck:

1. **Create deployment role** (see `specs/plans/03-aws-oidc-deploy-roles.md`)
   - Separate role for deploying to `dev` and `production` stages
   - More permissive permissions (full SST deploy capabilities)
   - Stricter trust policy (specific branches only)

2. **Implement pre-commit hooks** (see `specs/plans/02-pre-commit-conditional-typecheck.md`)
   - Local typecheck with AWS fallback
   - Runs before commit to catch issues early

3. **Set up monitoring**
   - CloudWatch alarms for failed role assumptions
   - CloudWatch dashboard for CI workflow metrics

---

## References

### Official Documentation
- [GitHub: Configuring OIDC in AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [AWS: IAM OIDC Identity Providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html)
- [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials)
- [SST: IAM Credentials](https://sst.dev/docs/iam-credentials)

### Research
- Deep research report: `specs/research/aws-oidc-deep-dive.md` (if saved separately)
- AWS Security Blog: [Use IAM roles to connect GitHub Actions](https://aws.amazon.com/blogs/security/use-iam-roles-to-connect-github-actions-to-actions-in-aws/)

### Internal Documentation
- AGENTS.md Section 7.5: AWS OIDC Authentication in CI
- AGENTS.md Section 9: AWS SSO Authentication (local development)

---

## Appendix: Quick Reference Commands

### Check OIDC Provider Exists
```bash
aws iam list-open-id-connect-providers --profile structa-dev
```

### Get Role Details
```bash
aws iam get-role --role-name GitHubActionsSST-Typecheck --profile structa-dev
```

### View Trust Policy
```bash
aws iam get-role --role-name GitHubActionsSST-Typecheck --profile structa-dev \
  | jq '.Role.AssumeRolePolicyDocument'
```

### List Role Policies
```bash
aws iam list-role-policies --role-name GitHubActionsSST-Typecheck --profile structa-dev
```

### View Inline Policy
```bash
aws iam get-role-policy \
  --role-name GitHubActionsSST-Typecheck \
  --policy-name SSTTypecheckAccess \
  --profile structa-dev \
  | jq '.PolicyDocument'
```

### Test Role Assumption (if you have a valid JWT)
```bash
aws sts assume-role-with-web-identity \
  --role-arn arn:aws:iam::571512465874:role/GitHubActionsSST-Typecheck \
  --role-session-name test-session \
  --web-identity-token <JWT_TOKEN>
```

### View CloudTrail Events
```bash
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=AssumeRoleWithWebIdentity \
  --max-results 10 \
  --profile structa-dev \
  --region eu-west-2
```

---

**Plan Status**: Ready for Implementation  
**Estimated Complexity**: Medium (AWS IAM configuration requires care)  
**Risk Level**: Low (can be rolled back without impact)  
**Dependencies**: None (standalone implementation)
