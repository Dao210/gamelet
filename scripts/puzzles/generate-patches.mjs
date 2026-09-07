import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createSeededRandom } from '../../lib/puzzle-core/random.ts'
import { cellsOf, prove, canonical, countSolutions } from './patches-toolkit.mjs'

const out = fileURLToPath(new URL('../../lib/patches/levels/', import.meta.url))
if (fs.existsSync(path.join(out, 'catalog.ts')) && !process.argv.includes('--rebuild-unpublished')) throw new Error('Existing catalog protected. Append new IDs; --rebuild-unpublished is for unpublished development only.')
const random = createSeededRandom('gamelet-patches-original-v1')
const pick = list => list[Math.floor(random() * list.length)]
const seen = new Set(), all = { easy: [], medium: [], hard: [] }
const types = "import type { Puzzle } from '../types'\n"
const emit = (file, value, name = 'puzzles') => fs.writeFileSync(path.join(out, file), `${types}\nexport const ${name}: ${Array.isArray(value) ? 'readonly Puzzle[]' : 'Puzzle'} = ${JSON.stringify(value)} satisfies ${Array.isArray(value) ? 'readonly Puzzle[]' : 'Puzzle'}\n`)

function make(size, difficulty) {
  const used = new Set(), regions = []
  while (used.size < size * size) {
    let first = 0
    while (used.has(first)) first++
    const top = Math.floor(first / size), left = first % size, choices = []
    for (let h = 1; h <= Math.min(4, size - top); h++) for (let w = 1; w <= Math.min(4, size - left); w++) {
      if (h * w > (difficulty === 'easy' ? 9 : 12)) continue
      const r = [top, left, top + h - 1, left + w - 1], cells = cellsOf(r, size)
      if (!cells.some(c => used.has(c))) choices.push(r)
    }
    const bigger = choices.filter(r => cellsOf(r, size).length > 1)
    const r = pick(bigger.length ? bigger : choices)
    regions.push(r); cellsOf(r, size).forEach(c => used.add(c))
  }
  if (regions.length < 4 || regions.length > size * 3) return null
  const clues = regions.map(r => {
    const h = r[2] - r[0] + 1, w = r[3] - r[1] + 1
    return { cell: pick(cellsOf(r, size)), area: h * w, shape: random() < .6 ? 'any' : h === w ? 'square' : h > w ? 'tall' : 'wide' }
  })
  const p = { version: 1, rows: size, cols: size, difficulty, clues }
  let proof = prove(p)
  if (!proof) return null
  if (difficulty !== 'easy') {
    for (let attempt = 0; attempt < regions.length * 2; attempt++) {
      const i = Math.floor(random() * clues.length), old = { ...clues[i] }
      if (random() < .7) clues[i].area = null
      else clues[i].shape = 'any'
      const next = prove(p)
      if (next) proof = next
      else clues[i] = old
    }
  }
  if (difficulty === 'easy' && proof.score > 24) return null
  if (difficulty === 'medium' && (proof.score < 18 || proof.score > 65)) return null
  if (difficulty === 'hard' && (proof.score < 66 || !proof.coverCount)) return null
  const key = canonical(p)
  if (seen.has(key)) return null
  const exact = countSolutions(p)
  if (exact.exhausted) return null
  if (exact.count !== 1) throw new Error('Proof/uniqueness disagreement')
  seen.add(key)
  return { ...p, solution: proof.solution, hints: proof.hints, score: proof.score }
}
fs.mkdirSync(out, { recursive: true })
for (const [difficulty, size] of [['easy', 5], ['medium', 6], ['hard', 8]]) {
  let tries = 0
  while (all[difficulty].length < 400) {
    if (++tries > 100000) throw new Error(`Generation budget exceeded for ${difficulty}`)
    const p = make(size, difficulty)
    if (!p) continue
    const id = `patches-${difficulty}-${String(all[difficulty].length + 1).padStart(4, '0')}`
    all[difficulty].push({ id, ...p })
    if (all[difficulty].length % 100 === 0) console.log(difficulty, all[difficulty].length, 'attempts', tries)
  }
  for (let pack = 0; pack < 8; pack++) emit(`${difficulty}-${String(pack + 1).padStart(2, '0')}.ts`, all[difficulty].slice(pack * 50, (pack + 1) * 50))
}
const tutorial = []
for (let i = 0; i < 12; i++) {
  let p
  do { p = make(i < 4 ? 3 : i < 8 ? 4 : 5, 'easy') } while (!p)
  tutorial.push({ id: `patches-tutorial-${String(i + 1).padStart(4, '0')}`, ...p })
}
emit('tutorial.ts', tutorial)
for (const difficulty of ['easy', 'medium', 'hard']) emit(`starter-${difficulty}.ts`, all[difficulty][0], 'starter')
// 1..310 are practice (first 20 per difficulty are curated training).
// 311..400 are reserved for 90 consecutive, explicitly assigned daily puzzles.
const daily = {}
for (let i = 0; i < 90; i++) {
  const date = new Date(Date.UTC(2026, 8, 7 + i)).toISOString().slice(0, 10)
  const month = date.slice(0, 7)
  daily[month] ??= {}
  daily[month][date] = Object.fromEntries(['easy', 'medium', 'hard'].map(d => [d, `patches-${d}-${String(311 + i).padStart(4, '0')}`]))
}
for (const [month, days] of Object.entries(daily)) fs.writeFileSync(path.join(out, `daily-${month}.ts`), `export const schedule = ${JSON.stringify(days, null, 2)} as const\n`)
fs.writeFileSync(path.join(out, 'catalog.ts'), `import type { Difficulty } from '../types'\nexport const PRACTICE_COUNT = 310\nexport const CURATED_COUNT = 20\nexport const TUTORIAL_COUNT = 12\nexport const PACK_SIZE = 50\nexport const TOTAL_PER_DIFFICULTY = 400\nexport const difficulties: readonly Difficulty[] = ['easy', 'medium', 'hard']\nexport function puzzleId(difficulty: Difficulty, number: number) { return \`patches-\${difficulty}-\${String(number).padStart(4, '0')}\` }\n`)
console.log('Generated 1200 original puzzles, 12 tutorials and 90 daily assignments.')
