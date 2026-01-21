# Monorepo Template

A template to create a monorepo SST v3 project. [Learn more](https://sst.dev/docs/set-up-a-monorepo).

## Get started

1. Use this template to [create your own repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).

2. Clone the new repo.

   ```bash
   git clone <REPO_URL> MY_APP
   cd MY_APP
   ```

3. Rename the files in the project to the name of your app.

   ```bash
   npx replace-in-file '/structa/g' 'MY_APP' '**/*.*' --verbose
   ```

4. Deploy!

   ```bash
   npm install
   npx sst deploy
   ```

5. Optionally, enable [_git push to deploy_](https://sst.dev/docs/console/#autodeploy).

## Development Workflow

This project uses a PR-based workflow with automated quality checks.

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
   This automatically sets up git hooks via the `prepare` script.

2. **Verify setup:**
   ```bash
   # Check that hooks are installed
   ls -la .husky/pre-commit
   ```

### Creating a Feature

1. **Create feature branch from production:**
   ```bash
   git checkout production
   git pull origin production
   git checkout -b feature/my-awesome-feature
   ```

2. **Develop and commit:**
   ```bash
   # Make your changes
   git add .
   git commit -m "feat: add awesome feature"
   ```
   
   Pre-commit hook runs automatically:
   - ⚡ Lint & format staged files (~5-15s)
   - 🔍 TypeScript type check (~10-20s)
   - 🧪 Related tests (~5-10s)
   - **Total: ~20-45 seconds**

3. **Push and open PR:**
   ```bash
   git push origin feature/my-awesome-feature
   ```
   
   Then open a PR on GitHub:
   - Target: `production` branch
   - CI will run automatically
   - Request review from teammate

4. **CI checks (automatic):**
   - Full typecheck
   - Complete linting
   - Full test suite
   - Results commented on PR

5. **Address feedback:**
   - Fix any CI failures
   - Address review comments
   - Push fixes (CI reruns automatically)

6. **Merge:**
   - Get approval from reviewer
   - Ensure CI is green
   - Click "Merge pull request"
   - SST Console deploys to production automatically

### Emergency Hotfixes

For critical production bugs:

1. **Same PR process** - no shortcuts for quality
2. Create branch: `hotfix/critical-bug-name`
3. Make minimal fix, commit, push, PR
4. Request urgent review
5. Merge once approved + CI passes

### Bypassing Pre-commit Hook (Emergency Only)

```bash
git commit --no-verify -m "emergency: fix critical issue"
```

⚠️ **Warning:** This skips local checks. CI will still catch issues, but you'll waste time waiting for CI to fail.

### Checking CI Status

View CI results:
- On PR page, see "Checks" tab
- Green checkmark = passed
- Red X = failed (click for details)

### Troubleshooting

**Pre-commit hook fails:**
- Read the error message carefully
- Fix the issue (type errors, lint errors, failing tests)
- Commit again

**CI fails but pre-commit passed:**
- Usually environment differences
- Check CI logs in GitHub Actions tab
- Reproduce locally: `npm run typecheck && npm run check && npm test`

**Need help:**
- Ask in team chat
- Tag reviewer on PR
- Check AGENTS.md for detailed guidelines

## Usage

This template uses [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces). It has 3 packages to start with and you can add more it.

1. `core/`

   This is for any shared code. It's defined as modules. For example, there's the `Example` module.

   ```ts
   export module Example {
     export function hello() {
       return "Hello, world!";
     }
   }
   ```

   That you can use across other packages using.

   ```ts
   import { Example } from "@aws-monorepo/core/example";

   Example.hello();
   ```

   We also have [Vitest](https://vitest.dev/) configured for testing this package with the `sst shell` CLI.

   ```bash
   npm test
   ```

2. `functions/`

   This is for your Lambda functions and it uses the `core` package as a local dependency.

3. `scripts/`

    This is for any scripts that you can run on your SST app using the `sst shell` CLI and [`tsx`](https://www.npmjs.com/package/tsx). For example, you can run the example script using:

   ```bash
   npm run shell src/example.ts
   ```

### Infrastructure

The `infra/` directory allows you to logically split the infrastructure of your app into separate files. This can be helpful as your app grows.

In the template, we have an `api.ts`, and `storage.ts`. These export the created resources. And are imported in the `sst.config.ts`.

---

**Join our community** [Discord](https://sst.dev/discord) | [YouTube](https://www.youtube.com/c/sst-dev) | [X.com](https://x.com/SST_dev)
