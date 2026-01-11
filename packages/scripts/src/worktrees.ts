import { execSync } from 'node:child_process'
import path from 'node:path'

function run(cmd: string, cwd?: string) {
  return execSync(cmd, { stdio: 'inherit', cwd })
}

function ensureWorktreesDir(root: string) {
  run('mkdir -p worktrees', root)
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function create(issueId: string, slug: string, base = 'main') {
  const root = path.resolve(process.cwd(), '..', '..') // go to repo root from packages/scripts
  ensureWorktreesDir(root)
  const worktreePath = path.join(root, 'worktrees', `issue-${issueId}-${slug}`)
  const branchName = `issue/${issueId}-${slug}`
  run(`git fetch origin ${base}`, root)
  run(`git worktree add "${worktreePath}" -b "${branchName}" origin/${base}`, root)
  console.log(`Created worktree at ${worktreePath} for branch ${branchName}`)
}

function remove(issueId: string, slug: string) {
  const root = path.resolve(process.cwd(), '..', '..')
  const worktreePath = path.join(root, 'worktrees', `issue-${issueId}-${slug}`)
  const branchName = `issue/${issueId}-${slug}`
  run(`git worktree remove "${worktreePath}"`, root)
  run(`git branch -D "${branchName}"`, root)
  console.log(`Removed worktree and branch ${branchName}`)
}

function list() {
  const root = path.resolve(process.cwd(), '..', '..')
  run('git worktree list', root)
}

const [,, cmd, issueIdArg, slugArg] = process.argv
if (!cmd || !['create','delete','list'].includes(cmd)) {
  console.log('Usage: ts-node src/worktrees.ts <create|delete|list> [issueId] [slug]')
  process.exit(1)
}

if (cmd === 'list') {
  list()
} else {
  if (!issueIdArg || !slugArg) {
    console.log('Provide issueId and slug')
    process.exit(1)
  }
  const issueId = issueIdArg
  const slug = slugify(slugArg)
  if (cmd === 'create') create(issueId, slug)
  else if (cmd === 'delete') remove(issueId, slug)
}
