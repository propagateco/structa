# AWS SSO Login - Agent Usage Example

## Scenario: Credentials Expired

User runs a command that requires AWS credentials:

```bash
$ npm run typecheck:core

> @structa/core@0.0.0 typecheck
> npx sst shell -- tsc --noEmit

✕ cached SSO token is expired, refresh cached SSO token failed
```

## Agent Response Flow

### 1. Detect the Issue
Agent recognizes AWS SSO credential error and invokes the `aws-sso-login` skill.

### 2. Start Login Flow
```bash
$ ./scripts/aws-sso-login.sh structa
```

Output:
```json
{
  "device_url": "https://structa.awsapps.com/start/#/device?user_code=HBRM-BKKB",
  "device_code": "HBRM-BKKB",
  "sso_session": "structa",
  "instructions": "Navigate to the URL and sign in..."
}
```

### 3. Browser Automation (Dev-Browser Agent)

Agent invokes dev-browser with Playwright commands:

```javascript
// Navigate to the device URL
await browser.navigate("https://structa.awsapps.com/start/#/device?user_code=HBRM-BKKB");

// Take snapshot to see current state
const snapshot = await browser.snapshot();

// The page should show either:
// A) Login form (if not logged in)
// B) Success message (if already logged in from cookies)
// C) Device code confirmation (if credentials auto-filled)

// Common flow - click sign-in button
// AWS SSO usually has a button with aria-label or text "Sign in"
await browser.click({
  element: "Sign in button",
  ref: "[data-testid='sign-in-button']" // or whatever selector matches
});

// Wait for success confirmation
await browser.waitFor({ text: "Success" });

// Or wait for redirect to success page
await browser.waitFor({ text: "You may now close this window" });
```

### 4. Verify Success
```bash
# Agent verifies credentials are now valid
$ aws sts get-caller-identity --profile structa-dev

# Output shows successful authentication:
{
    "UserId": "AROA...",
    "Account": "123456789012",
    "Arn": "arn:aws:sts::123456789012:assumed-role/..."
}
```

### 5. Retry Original Command
```bash
$ npm run typecheck:core

> @structa/core@0.0.0 typecheck
> npx sst shell -- tsc --noEmit

✅ No type errors found!
```

## Alternative: Manual Intervention

If browser automation fails or user prefers manual login:

**Agent says:**
```
"I've started the AWS SSO login process. Please visit this URL to complete authentication:

https://structa.awsapps.com/start/#/device?user_code=HBRM-BKKB

Device code: HBRM-BKKB

Once you've signed in, let me know and I'll retry the command."
```

## Browser State Scenarios

### Scenario A: Credentials Saved (Best Case)
1. Browser opens to device URL
2. AWS SSO recognizes browser, auto-fills email
3. Password manager auto-fills password
4. Agent clicks "Sign in"
5. Success! ✅

### Scenario B: Logged In (Even Better)
1. Browser opens to device URL
2. AWS SSO has valid session cookie
3. Immediately shows "Success" message
4. Done! ✅

### Scenario C: No Saved Credentials
1. Browser opens to device URL
2. Login form is empty
3. Agent pauses and asks user to enter credentials
4. User manually logs in
5. Success! ✅

### Scenario D: MFA/2FA Required
1. Browser opens to device URL
2. Credentials auto-fill and submitted
3. AWS prompts for 2FA code
4. Agent pauses and asks user to enter code
5. User completes 2FA
6. Success! ✅

## Success Indicators

Agent knows login succeeded when:
- Browser shows "Success" message
- Or text like "You may now close this window"
- Or `aws sts get-caller-identity` returns valid response
- Or original command (typecheck) now succeeds

## Timeouts

- Device code valid for: ~5-10 minutes
- SSO token valid for: Several hours (8-12 typically)
- If timeout occurs: Re-run the skill for new device code

## Complete Agent Conversation Example

**User:** "Run the typecheck"

**Agent:** *Runs `npm run typecheck`*
```
Error: cached SSO token is expired
```

**Agent:** "Your AWS SSO credentials have expired. I'll refresh them for you using browser automation."

*Agent runs `./scripts/aws-sso-login.sh`*

**Agent:** "Opening browser to authenticate..."

*Agent uses dev-browser to navigate and interact*

**Agent:** "Authentication successful! ✅ Now retrying typecheck..."

*Agent runs `npm run typecheck` again*

**Agent:** "Typecheck completed successfully. No errors found!"

---

## For Developers

You can also run this manually without an agent:

```bash
# 1. Get device URL
./scripts/aws-sso-login.sh structa

# 2. Open browser manually to the URL
# 3. Sign in
# 4. Return to terminal
# 5. Verify:
aws sts get-caller-identity
```

Or use the traditional AWS CLI approach:
```bash
aws sso login --sso-session=structa
# Opens browser automatically
```

The agent approach is useful when:
- You want hands-free automation
- Running in CI/CD with saved credentials
- Scripting repetitive authentication flows
