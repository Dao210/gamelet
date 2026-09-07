import assert from 'node:assert/strict'
import { gzipSync } from 'node:zlib'
import { performance } from 'node:perf_hooks'
import { countSolutions, bruteCount, canonical, prove } from './patches-toolkit.mjs'
import { isComplete, placementError } from '../../lib/patches/engine.ts'

const start = performance.now(), all = new Map(), seen = new Set(), packs = []
const byDifficulty = {}
for (const difficulty of ['easy', 'medium', 'hard']) {
  byDifficulty[difficulty] = []
  for (let pack = 1; pack <= 8; pack++) {
    const name = `${difficulty}-${String(pack).padStart(2, '0')}`
    const { puzzles } = await import(`../../lib/patches/levels/${name}.ts`)
    assert.equal(puzzles.length, 50)
    const bytes = gzipSync(JSON.stringify(puzzles)).length
    assert.ok(bytes <= 40 * 1024, `${name} exceeds pack budget`)
    packs.push({ name, gzipBytes: bytes })
    for (const [index, p] of puzzles.entries()) {
      assert.equal(p.id, `patches-${difficulty}-${String((pack - 1) * 50 + index + 1).padStart(4, '0')}`)
      assert.equal(p.rows, { easy: 5, medium: 6, hard: 8 }[difficulty])
      assert.equal(p.cols, p.rows)
      assert.equal(p.difficulty, difficulty)
      byDifficulty[difficulty].push(p)
    }
  }
  const { starter } = await import(`../../lib/patches/levels/starter-${difficulty}.ts`)
  assert.deepEqual(starter, byDifficulty[difficulty][0])
  assert.ok(gzipSync(JSON.stringify(starter)).length <= 5 * 1024)
}
const { puzzles: tutorials } = await import('../../lib/patches/levels/tutorial.ts')
assert.equal(tutorials.length, 12)
for (const p of [...Object.values(byDifficulty).flat(), ...tutorials]) {
  assert.equal(p.version, 1)
  assert.ok(!all.has(p.id), `duplicate id ${p.id}`)
  assert.ok(!seen.has(canonical(p)), `symmetric duplicate ${p.id}`)
  seen.add(canonical(p)); all.set(p.id, p)
  assert.equal(new Set(p.clues.map(c => c.cell)).size, p.clues.length)
  for (const c of p.clues) {
    assert.ok(Number.isInteger(c.cell) && c.cell >= 0 && c.cell < p.rows * p.cols)
    assert.ok(c.area === null || Number.isInteger(c.area) && c.area > 0 && c.area <= p.rows * p.cols)
    assert.ok(['any', 'square', 'wide', 'tall'].includes(c.shape))
  }
  assert.ok(isComplete(p, p.solution), `invalid answer ${p.id}`)
  const exact = countSolutions(p)
  assert.ok(!exact.exhausted, `solver exhausted ${p.id}`)
  assert.equal(exact.count, 1, `non-unique ${p.id}`)
  const proof = prove(p)
  assert.ok(proof, `guess required ${p.id}`)
  assert.deepEqual(proof.solution, p.solution, `answer mismatch ${p.id}`)
  assert.deepEqual(proof.hints, p.hints, `hint mismatch ${p.id}`)
  assert.equal(proof.score, p.score)
  if (!p.id.includes('tutorial')) {
    assert.ok(p.difficulty !== 'easy' || p.score <= 24)
    assert.ok(p.difficulty !== 'medium' || p.score >= 18 && p.score <= 65)
    assert.ok(p.difficulty !== 'hard' || p.score >= 66 && proof.coverCount > 0)
  }
}
// Exhaust all nonempty clue-cell subsets of a 2x2 board, with varying area and
// shape constraints. A separate first-empty-cell solver is the oracle.
let crossChecks = 0
for (let mask = 1; mask < 16; mask++) for (let variant = 0; variant < 16; variant++) {
  const p = { rows: 2, cols: 2, clues: [0, 1, 2, 3].filter(c => mask & (1 << c)).map(cell => ({ cell, area: variant < 8 ? null : (variant + cell) % 4 + 1, shape: ['any', 'square', 'wide', 'tall'][(variant + cell) % 4] })) }
  assert.equal(countSolutions(p).count, bruteCount(p)); crossChecks++
}
for (const p of tutorials) { assert.equal(countSolutions(p).count, bruteCount(p)); crossChecks++ }
const multiple = { rows: 2, cols: 2, clues: [{ cell: 0, area: 2, shape: 'any' }, { cell: 3, area: 2, shape: 'any' }] }
assert.equal(countSolutions(multiple).count, 2)
assert.equal(countSolutions(multiple, 1).exhausted, true)
assert.equal(bruteCount(multiple), 2)
const days = {}
for (const month of ['09', '10', '11', '12']) Object.assign(days, (await import(`../../lib/patches/levels/daily-2026-${month}.ts`)).schedule)
assert.equal(Object.keys(days).length, 90)
const scheduled = new Set()
for (let i = 0; i < 90; i++) {
  const day = new Date(Date.UTC(2026, 8, 7 + i)).toISOString().slice(0, 10)
  assert.ok(days[day], `missing ${day}`)
  for (const difficulty of ['easy', 'medium', 'hard']) {
    const id = days[day][difficulty]
    assert.ok(all.has(id)); assert.ok(!scheduled.has(id)); scheduled.add(id)
    assert.equal(id, `patches-${difficulty}-${String(311 + i).padStart(4, '0')}`)
  }
}
const samples = []
const hard = byDifficulty.hard[0]
for (let n = 0; n < 1000; n++) placementError(hard, hard.solution[0])
for (let n = 0; n < 10000; n++) {
  const index = n % hard.solution.length, others = hard.solution.filter((_, i) => i !== index)
  const before = performance.now()
  placementError(hard, hard.solution[index], others)
  samples.push(performance.now() - before)
}
samples.sort((a, b) => a - b)
assert.ok(samples[9500] < 2, 'rule validation exceeds 2ms p95')
console.log(JSON.stringify({ puzzles: all.size, uniqueSolutions: all.size, logicalProofs: all.size, symmetryDistinct: seen.size, independentSolverCrossChecks: crossChecks + 1, dailyDays: 90, reservedDailyPuzzles: scheduled.size, practicePuzzles: 930, learningSteps: 72, largestPackGzipBytes: Math.max(...packs.map(p => p.gzipBytes)), ruleP95Ms: samples[9500], durationSeconds: Number(((performance.now() - start) / 1000).toFixed(2)) }, null, 2))
