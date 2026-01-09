import { registry } from './libs.ts'

for (const r of registry) {
  console.log(`${r.lib}: ${r.name} -> ${r.url} (${r.filename})`)
}
