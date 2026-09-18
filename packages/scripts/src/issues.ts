import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

function run(cmd: string, cwd?: string) {
  return execSync(cmd, { stdio: 'inherit', cwd })
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const GH_ISSUE_LINK = /\*\*See:\*\* \[GitHub Issue #(\d+)\]\(([^)]*)\)/

interface GhIssue {
  number: number
  title: string
  body: string | null
  labels: string[]
  url: string
}

function syncIssues() {
  const root = path.resolve(process.cwd(), '..', '..')
  const issuesDir = path.join(root, '.issues')
  fs.mkdirSync(issuesDir, { recursive: true })

  let issues: GhIssue[]
  try {
    const json = execSync(
      `gh issue list --state open --limit 100 --json number,title,body,labels,url --jq '[.[] | {number, title, body, labels: [.labels[].name], url}]'`,
      { cwd: root, encoding: 'utf-8' },
    ).toString()
    issues = JSON.parse(json)
  } catch (e) {
    console.error('Failed to fetch GitHub issues. Ensure gh CLI is authenticated and this repo is linked.')
    process.exit(1)
  }

  const files = fs.readdirSync(issuesDir).filter(f => f.endsWith('.md') && !['index.md', 'TEMPLATE.md'].includes(f))

  // Index existing drafts: by GitHub link when present, else by title. Track the next local number.
  const byGhNumber = new Map<number, string>()
  const byTitle = new Map<string, string>()
  let nextNum = 0
  for (const file of files) {
    const num = file.match(/^iss-(\d+)/)?.[1]
    if (num) nextNum = Math.max(nextNum, parseInt(num, 10))
    const content = fs.readFileSync(path.join(issuesDir, file), 'utf-8')
    const link = content.match(GH_ISSUE_LINK)
    if (link) byGhNumber.set(parseInt(link[1], 10), file)
    const titleLine = content.split('\n').find(line => line.startsWith('# '))
    if (titleLine) byTitle.set(titleLine.slice(2).trim().toLowerCase(), file)
  }
  nextNum += 1

  const summary: string[] = []
  for (const issue of issues) {
    const file = byGhNumber.get(issue.number) ?? byTitle.get(issue.title.toLowerCase())
    if (file) {
      const fullPath = path.join(issuesDir, file)
      let content = fs.readFileSync(fullPath, 'utf-8')
      if (GH_ISSUE_LINK.test(content)) {
        summary.push(`Already linked: ${file} (GitHub #${issue.number})`)
      } else {
        const link = `**See:** [GitHub Issue #${issue.number}](${issue.url})`
        const newline = content.indexOf('\n')
        content = newline === -1
          ? `${content}\n\n${link}\n`
          : `${content.slice(0, newline + 1)}\n${link}\n${content.slice(newline + 1)}`
        fs.writeFileSync(fullPath, content)
        summary.push(`Linked ${file} → GitHub #${issue.number}`)
      }
    } else {
      const filename = `iss-${String(nextNum).padStart(3, '0')}-${slugify(issue.title)}.md`
      const parts = [
        `# ${issue.title}`,
        '',
        `**See:** [GitHub Issue #${issue.number}](${issue.url})`,
        '',
        'Status: needs-triage',
        '',
        issue.body?.trim() ?? '',
      ]
      if (issue.labels.length > 0) {
        parts.push('', '---', '', '## Labels', '', issue.labels.map(label => `\`${label}\``).join(' '))
      }
      fs.writeFileSync(path.join(issuesDir, filename), parts.join('\n') + '\n')
      summary.push(`Created ${filename} (GitHub #${issue.number})`)
      nextNum += 1
    }
  }

  console.log(summary.length ? summary.join('\n') : 'No open GitHub issues found. Nothing to sync.')
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
if (!cmd || !['create','complete','sync'].includes(cmd)) {
  console.log('Usage: ts-node src/issues.ts <create|complete|sync> [issueId] [title]')
  process.exit(1)
}

if (cmd === 'sync') {
  syncIssues()
  process.exit(0)
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
