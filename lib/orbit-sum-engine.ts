export type OrbitValues = [number[], number[], number[]]

export interface OrbitPosition {
  ring: number
  slot: number
}

export interface OrbitLevel {
  id: number
  name: string
  note: string
  targets: [number, number, number]
  initial: OrbitValues
  par: number
}

export const ORBIT_SUM_LEVELS: OrbitLevel[] = [
  { id: 1, name: 'Launch Window', note: 'Start outside. Trade across the rings.', targets: [10, 26, 42], initial: [[1, 6, 3, 8], [5, 2, 11, 4], [9, 10, 7, 12]], par: 3 },
  { id: 2, name: 'Prime Field', note: 'Every satellite is a prime number.', targets: [17, 60, 120], initial: [[2, 13, 5, 19], [11, 3, 31, 7], [23, 29, 17, 37]], par: 3 },
  { id: 3, name: 'Zero Crossing', note: 'Negative mass pulls a sum below zero.', targets: [-7, 28, 65], initial: [[-5, 6, -1, 10], [4, -3, 18, 2], [12, 15, 8, 20]], par: 3 },
  { id: 4, name: 'Signal Weave', note: 'The correct groups are interleaved.', targets: [22, 26, 30], initial: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], par: 6 },
  { id: 5, name: 'Perfect Alignment', note: 'Three different rings. One shared frequency.', targets: [26, 26, 26], initial: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], par: 5 }
]

export function cloneOrbitValues(values: OrbitValues): OrbitValues {
  return values.map((ring) => [...ring]) as OrbitValues
}

export function getOrbitSums(values: OrbitValues): [number, number, number] {
  return values.map((ring) => ring.reduce((sum, value) => sum + value, 0)) as [number, number, number]
}

export function getOrbitDelta(values: OrbitValues, targets: OrbitLevel['targets']) {
  return getOrbitSums(values).reduce((total, sum, index) => total + Math.abs(sum - targets[index]), 0)
}

export function swapOrbitValues(values: OrbitValues, first: OrbitPosition, second: OrbitPosition): OrbitValues {
  const next = cloneOrbitValues(values)
  const held = next[first.ring][first.slot]
  next[first.ring][first.slot] = next[second.ring][second.slot]
  next[second.ring][second.slot] = held
  return next
}

export function isOrbitSolved(values: OrbitValues, targets: OrbitLevel['targets']) {
  return getOrbitSums(values).every((sum, index) => sum === targets[index])
}

export function findBestOrbitSwap(values: OrbitValues, targets: OrbitLevel['targets']) {
  const positions: OrbitPosition[] = values.flatMap((ring, ringIndex) => ring.map((_, slot) => ({ ring: ringIndex, slot })))
  if (isOrbitSolved(values, targets)) return null

  const stateKey = (state: OrbitValues) => state.map((ring) => [...ring].sort((a, b) => a - b).join(',')).join('|')
  const queue: Array<{ values: OrbitValues; firstSwap: { first: OrbitPosition; second: OrbitPosition } | null }> = [
    { values: cloneOrbitValues(values), firstSwap: null }
  ]
  const visited = new Set([stateKey(values)])

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor]
    for (let firstIndex = 0; firstIndex < positions.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < positions.length; secondIndex += 1) {
        const first = positions[firstIndex]
        const second = positions[secondIndex]
        if (first.ring === second.ring) continue
        const next = swapOrbitValues(current.values, first, second)
        const key = stateKey(next)
        if (visited.has(key)) continue
        visited.add(key)
        const firstSwap = current.firstSwap ?? { first, second }
        if (isOrbitSolved(next, targets)) return { ...firstSwap, delta: getOrbitDelta(next, targets) }
        queue.push({ values: next, firstSwap })
      }
    }
  }
  return null
}

export function getOrbitStars(moves: number, par: number, hints = 0) {
  if (hints === 0 && moves <= par) return 3
  if (moves <= par + 3) return 2
  return 1
}
