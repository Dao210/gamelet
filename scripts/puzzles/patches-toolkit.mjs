// Build-time only. Never imported by the browser game.
export function cellsOf(r, cols) {
  const cells = []
  for (let y = r[0]; y <= r[2]; y++) for (let x = r[1]; x <= r[3]; x++) cells.push(y * cols + x)
  return cells
}
export function candidates(p) {
  const clueCells = new Set(p.clues.map(c => c.cell))
  return p.clues.map(c => {
    const choices = [], y = Math.floor(c.cell / p.cols), x = c.cell % p.cols
    for (let top = 0; top <= y; top++) for (let left = 0; left <= x; left++) {
      for (let bottom = y; bottom < p.rows; bottom++) for (let right = x; right < p.cols; right++) {
        const h = bottom - top + 1, w = right - left + 1
        if (c.area !== null && c.area !== h * w) continue
        if ((c.shape === 'square' && h !== w) || (c.shape === 'wide' && w <= h) || (c.shape === 'tall' && h <= w)) continue
        const rect = [top, left, bottom, right], cells = cellsOf(rect, p.cols)
        if (cells.some(cell => cell !== c.cell && clueCells.has(cell))) continue
        choices.push({ rect, cells, mask: cells.reduce((mask, cell) => mask | (1n << BigInt(cell)), 0n) })
      }
    }
    return choices
  })
}
export function countSolutions(p, nodeLimit = 100000) {
  const initial = candidates(p), full = (1n << BigInt(p.rows * p.cols)) - 1n
  let count = 0, nodes = 0, exhausted = false
  const search = (lists, used) => {
    if (++nodes > nodeLimit) { exhausted = true; return }
    if (count >= 2 || exhausted) return
    if (!lists.length) { if (used === full) count++; return }
    const active = lists.map(options => options.filter(c => !(c.mask & used))).sort((a, b) => a.length - b.length)
    if (!active[0].length) return
    let branches = active[0].map(choice => ({ index: 0, choice }))
    for (let cell = 0; cell < p.rows * p.cols; cell++) {
      if (used & (1n << BigInt(cell))) continue
      const covering = []
      active.forEach((list, index) => list.forEach(choice => { if (choice.cells.includes(cell)) covering.push({ index, choice }) }))
      if (!covering.length) return
      if (covering.length < branches.length) branches = covering
    }
    for (const { index, choice } of branches) { search(active.filter((_, i) => i !== index), used | choice.mask); if (count >= 2 || exhausted) break }
  }
  search(initial, 0n)
  return { count, nodes, exhausted }
}
export function prove(p) {
  const lists = candidates(p), solved = new Set(), hints = [], solution = Array(p.clues.length)
  const full = (1n << BigInt(p.rows * p.cols)) - 1n
  let used = 0n, coverCount = 0
  const initialExtras = lists.reduce((sum, list) => sum + Math.max(0, list.length - 1), 0)
  while (solved.size < lists.length) {
    const available = lists.map((list, i) => solved.has(i) ? [] : list.filter(c => !(c.mask & used)))
    if (available.some((list, i) => !solved.has(i) && !list.length)) return null
    let clue = available.findIndex((list, i) => !solved.has(i) && list.length === 1)
    let choice = clue >= 0 ? available[clue][0] : null
    let cell
    if (!choice) {
      for (let n = 0; n < p.rows * p.cols; n++) {
        if (used & (1n << BigInt(n))) continue
        const covering = []
        available.forEach((list, i) => list.forEach(c => { if (c.cells.includes(n)) covering.push([i, c]) }))
        if (!covering.length) return null
        if (covering.length === 1) { [clue, choice] = covering[0]; cell = n; break }
      }
    }
    if (!choice) return null
    const rule = cell === undefined ? 'single' : 'cover'
    if (rule === 'cover') coverCount++
    hints.push({ clue, rule, ...(cell === undefined ? {} : { cell }) })
    solution[clue] = choice.rect
    used |= choice.mask
    solved.add(clue)
  }
  if (used !== full) return null
  return { hints, solution, score: initialExtras + coverCount * 8 + p.clues.filter(c => c.area === null).length * 4, coverCount }
}
export function canonical(p) {
  const size = p.rows
  const representations = []
  for (let flip = 0; flip < 2; flip++) for (let turns = 0; turns < 4; turns++) {
    representations.push(JSON.stringify(p.clues.map(c => {
      let y = Math.floor(c.cell / size), x = c.cell % size
      if (flip) x = size - 1 - x
      for (let t = 0; t < turns; t++) [y, x] = [x, size - 1 - y]
      const shape = turns % 2 && ['wide', 'tall'].includes(c.shape) ? (c.shape === 'wide' ? 'tall' : 'wide') : c.shape
      return [y * size + x, c.area, shape]
    }).sort((a, b) => a[0] - b[0])))
  }
  return `${size}:${representations.sort()[0]}`
}
// Intentionally different search: fill first uncovered cell and count clues in
// each possible rectangle, without the production candidate enumerator/bitsets.
export function bruteCount(p) {
  let total = 0
  const used = new Set(), usedClues = new Set()
  function walk() {
    if (total >= 2) return
    let cell = 0
    while (used.has(cell)) cell++
    if (cell === p.rows * p.cols) { total++; return }
    const top = Math.floor(cell / p.cols), left = cell % p.cols
    for (let b = top; b < p.rows; b++) for (let r = left; r < p.cols; r++) {
      const rect = [top, left, b, r], cells = cellsOf(rect, p.cols)
      if (cells.some(c => used.has(c))) continue
      const clues = p.clues.map((c, i) => ({ ...c, i })).filter(c => cells.includes(c.cell))
      if (clues.length !== 1 || usedClues.has(clues[0].i)) continue
      const c = clues[0], h = b - top + 1, w = r - left + 1
      if ((c.area !== null && c.area !== cells.length) || (c.shape === 'square' && h !== w) || (c.shape === 'wide' && w <= h) || (c.shape === 'tall' && h <= w)) continue
      cells.forEach(c => used.add(c)); usedClues.add(c.i)
      walk()
      cells.forEach(c => used.delete(c)); usedClues.delete(c.i)
    }
  }
  walk()
  return total
}
