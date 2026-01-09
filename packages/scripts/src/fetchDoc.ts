import fs from 'node:fs/promises'
import path from 'node:path'
import TurndownService from 'turndown'
import type { DocPage } from './libs'

async function fetchHtml(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return await res.text()
}

function htmlToMarkdown(html: string) {
  const turndown = new TurndownService({ headingStyle: 'atx' })
  return turndown.turndown(html)
}

async function writeSnapshot(page: DocPage, markdown: string) {
  const destDir = path.join(process.cwd(), 'docs', 'vendor', page.lib)
  await fs.mkdir(destDir, { recursive: true })
  const header = `Source: ${page.url}\nFetched: ${new Date().toISOString()}\n\n`
  const content = header + markdown
  await fs.writeFile(path.join(destDir, page.filename), content, 'utf8')
}

async function updateVersions(page: DocPage) {
  const versionsPath = path.join(process.cwd(), 'docs', 'VERSIONS.json')
  let data = { snapshots: [] as any[] }
  try {
    const raw = await fs.readFile(versionsPath, 'utf8')
    data = JSON.parse(raw)
  } catch {}
  data.snapshots.push({ lib: page.lib, name: page.name, url: page.url, fetched_at: new Date().toISOString() })
  await fs.writeFile(versionsPath, JSON.stringify(data, null, 2), 'utf8')
}

export async function fetchDoc(page: DocPage) {
  const html = await fetchHtml(page.url)
  const md = htmlToMarkdown(html)
  await writeSnapshot(page, md)
  await updateVersions(page)
}
