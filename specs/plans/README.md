# Implementation Plans

This directory contains detailed, step-by-step implementation plans for the Structa project.

## Available Plans

### [01 - AWS OIDC for GitHub Actions](./01-aws-oidc-github-actions.md)
**Status**: Ready for Implementation  
**Time**: 2-3 hours  
**Priority**: HIGH  

Implement AWS OpenID Connect (OIDC) authentication for GitHub Actions, eliminating long-lived credentials and enabling CI workflows to run SST commands securely.

**Key Features**:
- No stored AWS credentials in GitHub Secrets
- Short-lived tokens (15 min - 12 hours)
- Full audit trail in CloudTrail
- SST shell compatibility

**Phases**:
1. AWS IAM Configuration (90-120 min)
2. GitHub Actions Integration (30-45 min)
3. Testing & Verification (30-45 min)
4. Documentation & Cleanup (15-30 min)

---

### [02 - Conditional Typecheck in Pre-commit Hook](./02-pre-commit-conditional-typecheck.md)
**Status**: Ready for Implementation  
**Time**: 1-2 hours  
**Priority**: MEDIUM  
**Dependencies**: Soft dependency on Plan 01

Implement conditional typecheck logic in pre-commit hooks that gracefully handles AWS SSO credential expiration with automatic fallback to local typecheck.

**Key Features**:
- Try full typecheck first (with AWS)
- Automatic fallback to local typecheck if AWS expired
- Never blocks commits due to credentials
- Clear messaging about which typecheck ran
- CI acts as safety net

**Phases**:
1. Add Local Typecheck Scripts (15-20 min)
2. Update Pre-commit Hook (30-45 min)
3. Documentation Updates (15-20 min)
4. Commit and Test Integration (15-20 min)

---

## Implementation Order

**Recommended sequence**:

1. **Start with Plan 01** (AWS OIDC)
   - Enables CI to run typecheck successfully
   - Critical for PR workflow
   - Can be tested independently

2. **Then implement Plan 02** (Pre-commit Hook)
   - Improves local development experience
   - Depends on understanding AWS credential lifecycle
   - Complements CI with early error detection

**Alternative**: Plans can be implemented independently if needed.

---

## Success Criteria

### After Plan 01
- ✅ GitHub Actions can authenticate to AWS via OIDC
- ✅ CI workflows run `npm run typecheck` successfully
- ✅ No AWS credentials stored in GitHub Secrets
- ✅ CloudTrail shows role assumptions

### After Plan 02
- ✅ Pre-commit hooks never block due to expired AWS credentials
- ✅ Developers get full typecheck when AWS available
- ✅ Automatic fallback to local typecheck when AWS expired
- ✅ Clear messaging about which typecheck ran

---

## Plan Format

Each plan follows this structure:

1. **Overview** - High-level summary and context
2. **Context & Problem Statement** - Current vs. desired state
3. **Prerequisites** - Required access, knowledge, and dependencies
4. **Implementation Phases** - Detailed step-by-step instructions
5. **Testing & Verification** - How to confirm it works
6. **Documentation Updates** - What docs to update
7. **Rollback Plan** - How to undo if needed
8. **Troubleshooting** - Common issues and solutions
9. **Success Metrics** - How to measure success
10. **References** - Links to official docs and resources

---

## Notes for Implementers

### General Guidelines
- ✅ Read the entire plan before starting
- ✅ Follow phases in order (they're designed sequentially)
- ✅ Test each phase before moving to the next
- ✅ Document any deviations or issues encountered
- ✅ Update the plan with actual values used

### Time Estimates
- Time estimates are for a single developer
- Include buffer for unexpected issues
- AWS IAM configuration tends to take longer than expected
- Testing phases are critical - don't skip them

### When to Ask for Help
- ❌ OIDC provider setup fails (AWS IAM permissions issue)
- ❌ Trust policy validation errors (syntax or conditions)
- ❌ Hook logic not working as expected (bash scripting issues)
- ℹ️ Most issues have troubleshooting sections in the plans

### Communication
- Update team before starting (especially Plan 01)
- Create tracking issues for each plan
- Link PRs to the plan document
- Document lessons learned

---

## Related Documentation

- **AGENTS.md** - Agent guidelines and development workflow
- **README.md** - Project overview and setup instructions
- **.github/workflows/** - GitHub Actions workflow definitions
- **.husky/** - Git hooks configuration

---

## Questions?

If you have questions while implementing these plans:

1. Check the **Troubleshooting** section in the plan
2. Review **Related Documentation** links
3. Check official AWS/GitHub documentation
4. Ask in team chat (if applicable)
5. Create an issue in the repository

---

**Plans Created**: 2026-01-21  
**Last Updated**: 2026-01-21  
**Total Plans**: 2
