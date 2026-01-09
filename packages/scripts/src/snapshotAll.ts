import { registry } from './libs.ts'
import { fetchDoc } from './fetchDoc.ts'

async function main() {
  const libFilter = process.argv[2]
  const pages = libFilter ? registry.filter(r => r.lib === libFilter) : registry
  for (const page of pages) {
    try {
      console.log(`Fetching: ${page.lib} ${page.name}`)
      await fetchDoc(page)
    } catch (e) {
      console.error(e)
    }
  }
  console.log('Done.')
}

main()
