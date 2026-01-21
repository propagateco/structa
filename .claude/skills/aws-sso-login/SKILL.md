---
name: aws-sso-login
description: Automate AWS SSO login using browser automation when credentials are stale
triggers:
  - aws sso login
  - aws credentials expired
  - refresh aws credentials
  - sso login
---

# AWS SSO Login Automation Skill

This skill automates the AWS SSO login process when credentials expire. It uses browser automation via the dev-browser agent to handle the device code flow.

## When to Use

Use this skill when:
- AWS SSO credentials have expired
- You see "cached SSO token is expired" errors
- Running `sst shell` or `npm run typecheck:core` fails with credential errors
- Need to refresh AWS session for structa project

## How It Works

1. Runs `aws sso login --sso-session=structa --no-browser --use-device-code`
2. Extracts the device code URL and code
3. Opens browser and navigates to AWS SSO login page
4. Attempts to use saved browser credentials to auto-fill
5. Submits the form and waits for confirmation
6. Verifies login was successful

## Usage

When you see an AWS credential error, invoke this skill:

```
User: "My AWS credentials are expired, can you refresh them?"
Assistant: "I'll help you refresh your AWS SSO credentials using browser automation."
```

## Implementation Steps

### Step 1: Start AWS SSO Login
```bash
# Run the helper script to get device URL
./scripts/aws-sso-login.sh structa
```

This outputs JSON with:
- `device_url`: The full URL to visit (with auto-filled code)
- `device_code`: The code to enter if needed
- `sso_session`: Session name (structa)

### Step 2: Use Dev-Browser Agent

Invoke the dev-browser agent to handle browser automation:

```typescript
// Navigate to the device URL
await browser.navigate(device_url);

// Wait for page to load
await browser.snapshot();

// Check if already logged in or needs credentials
// AWS SSO pages typically have:
// - Email input field
// - Password input field (if not saved)
// - "Sign in" button

// If email field is visible, browser may auto-fill from saved data
// Look for submit button and click it

// Wait for success confirmation
// AWS shows "Success" message when device code is approved
```

### Step 3: Key Selectors

AWS SSO login page elements:
- Email field: Usually auto-fills if saved in browser
- Password field: Usually auto-fills if saved in browser  
- Sign-in button: Look for button with text "Sign in" or "Next"
- Success message: Text contains "Success" or similar confirmation

### Step 4: Error Handling

Common scenarios:
1. **Already logged in**: Page may redirect immediately to success
2. **Credentials saved**: Browser auto-fills, just need to click submit
3. **Credentials not saved**: Would need manual intervention (not automated)
4. **MFA required**: May need to handle 2FA prompt (not automated by default)

### Step 5: Verify Success

After browser automation:
```bash
# Test that credentials work
aws sts get-caller-identity --profile structa-dev

# Or try the command that originally failed
npm run typecheck:core
```

## Example Full Workflow

```bash
# 1. Agent detects expired credentials
npm run typecheck:core
# Error: cached SSO token is expired

# 2. Agent invokes this skill
./scripts/aws-sso-login.sh structa
# Outputs device URL and code

# 3. Agent uses dev-browser to automate login
# - Navigate to device_url
# - Wait for auto-fill
# - Click sign-in
# - Wait for success

# 4. Verify credentials refreshed
aws sts get-caller-identity --profile structa-dev

# 5. Retry original command
npm run typecheck:core
# ✅ Should work now
```

## Browser Profile

**Important**: For this to work with saved credentials, the browser needs:
- Access to saved passwords (Chrome/Chromium profile)
- Or previously logged in session cookies

The dev-browser agent uses Chromium from `/snap/bin/chromium`, which should have access to saved credentials if configured.

## Configuration

SSO session name: `structa` (default)
SSO profiles:
- `structa-dev` - Development profile
- `structa-production` - Production profile

Both use the same SSO session for authentication.

## Notes

- This skill is for **development convenience** - credentials should be refreshed regularly
- If browser automation fails, user can manually visit the URL
- The device code is valid for a limited time (usually 5-10 minutes)
- After successful login, AWS SSO token is valid for several hours

## Security Considerations

- Credentials are stored in browser's secure storage (not in code)
- Device code flow is OAuth2 standard - secure by design
- No passwords are logged or exposed in scripts
- Browser automation runs locally on developer's machine

## Troubleshooting

**Browser doesn't auto-fill credentials:**
- User needs to save credentials in browser first
- Or manually enter them when agent opens browser

**Device code expired:**
- Run the skill again to get a new code
- Codes are single-use and time-limited

**MFA/2FA required:**
- Some SSO setups require additional verification
- Agent may need to pause for user to complete 2FA

**Chromium not found:**
- Ensure chromium is installed: `snap install chromium`
- Or adjust browser path in dev-browser configuration
