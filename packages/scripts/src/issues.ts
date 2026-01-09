import { execSync } from 'node:child_process'
import path from 'node:path'

function run(cmd: string, cwd?: string) {
  return execSync(cmd, { stdio: 'inherit', cwd })
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function createIssueWorktree(issueId: string, title: string, base = 'main') {
  const root = path.resolve(process.cwd(), '..', '..')
  run('mkdir -p worktrees', root)
  const slug = slugify(title)
  const worktreePath = path.join(root, 'worktrees', `issue-${issueId}-${slug}`)
  const branchName = `issue/${issueId}-${slug}`
  run(`git fetch origin ${base}`, root)
  run(`git worktree add "${worktreePath}" -b "${branchName}" origin/${base}`, root)
  console.log(`Created worktree at ${worktreePath} for branch ${branchName}`)
  return { worktreePath, branchName }
}

function openDraftPR(branchName: string, title: string, body: string) {
  try {
    run(`gh pr create --title "${title}" --body "${body}" --draft --fill`)
  } catch (e) {
    console.warn('Failed to open draft PR automatically. Ensure gh CLI is authenticated and repository is linked.')
  }
}

const [,, cmd, issueIdArg, titleArg] = process.argv
if (!cmd || !['create','complete'].includes(cmd)) {
  console.log('Usage: ts-node src/issues.ts <create|complete> <issueId> <title>')
  process.exit(1)
}

if (cmd === 'create') {
  if (!issueIdArg || !titleArg) {
    console.log('Provide issueId and title')
    process.exit(1)
  }
  const title = titleArg
  const { branchName } = createIssueWorktree(issueIdArg, title)
  const body = `PRD\n\nContext:\n\nProblem:\n\nGoals/Non-Goals:\n\nRequirements:\n\nAcceptance Criteria:\n\nRisks:\n\nRollback Plan:\n`
  openDraftPR(branchName, `[Issue ${issueIdArg}] ${title}`, body)
}

if (cmd === 'complete') {
  if (!issueIdArg || !titleArg) {
    console.log('Provide issueId and title')
    process.exit(1)
  }
  const root = path.resolve(process.cwd(), '..', '..')
  const slug = slugify(titleArg)
  const branchName = `issue/${issueIdArg}-${slug}`
  // Find PR for branch
  let prNumber = ''
  try {
    prNumber = execSync(`gh pr list --head "${branchName}" --json number --jq '.[0].number'`, { cwd: root }).toString().trim()
  } catch {
    console.error('Failed to find PR for branch. Ensure gh CLI is authenticated.')
    process.exit(1)
  }
  if (!prNumber) {
    console.error('No PR found for branch. Link PR to issue before completing.')
    process.exit(1)
  }
  // Check PR merged status
  const merged = execSync(`gh pr view ${prNumber} --json merged --jq '.merged'`, { cwd: root }).toString().trim()
  if (merged !== 'true') {
    console.error('PR is not merged. Merge the PR before completing the issue.')
    process.exit(1)
  }
  // Validate acceptance criteria present in PR body
  const body = execSync(`gh pr view ${prNumber} --json body --jq '.body'`, { cwd: root }).toString()
  const hasAcceptance = /Acceptance Criteria/i.test(body)
  if (!hasAcceptance) {
    console.error('Acceptance Criteria not found in PR body. Ensure PRD sections are present.')
    process.exit(1)
  }
  // Clean up worktree and branch
  const worktreePath = path.join(root, 'worktrees', `issue-${issueIdArg}-${slug}`)
  try {
    execSync(`git worktree remove "${worktreePath}"`, { cwd: root, stdio: 'inherit' })
  } catch (e) {
    console.warn('Worktree remove failed or already removed.')
  }
  try {
    execSync(`git branch -D "${branchName}"`, { cwd: root, stdio: 'inherit' })
  } catch (e) {
    console.warn('Branch delete failed or already deleted.')
  }
  console.log(`Completed issue ${issueIdArg}. Cleaned worktree and branch.`)
}
