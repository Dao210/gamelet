import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

// Run after pnpm build. Inspect emitted assets rather than TypeScript size.
const root = '.next/static/chunks'
const assets = fs.readdirSync(root).filter(n => n.endsWith('.js')).map(name => {
  const content = fs.readFileSync(path.join(root, name), 'utf8')
  return { name, content, gzip: gzipSync(content).length }
})
const runtime = assets.filter(a => a.content.includes('gamelet:patches:progress:v1'))
assert.equal(runtime.length, 1, 'Locate the game runtime chunk before reporting its budget')
assert.ok(runtime[0].gzip <= 45 * 1024, 'Patches runtime exceeds 45 KiB gzip')
assert.ok(!runtime[0].content.includes('countSolutions'), 'Build-time solver leaked into runtime')
const packs = assets.filter(a => /id:"patches-(easy|medium|hard)-\d{4}"/.test(a.content))
assert.equal(packs.length, 24, 'Expected 24 lazy question packs')
assert.ok(packs.every(a => a.gzip <= 40 * 1024), 'Question pack exceeds 40 KiB gzip')
assert.ok(packs.every(a => a.name !== runtime[0].name), 'Question pack bundled eagerly')
const starters = []
for (const difficulty of ['easy', 'medium', 'hard']) {
  const { starter } = await import(`../../lib/patches/levels/starter-${difficulty}.ts`)
  const gzip = gzipSync(JSON.stringify(starter)).length
  assert.ok(gzip <= 5 * 1024)
  starters.push({ difficulty, gzip })
}
console.log(JSON.stringify({ runtime: { file: runtime[0].name, gzip: runtime[0].gzip }, lazyPacks: packs.length, largestPackGzip: Math.max(...packs.map(a => a.gzip)), starters }, null, 2))
