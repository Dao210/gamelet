import {
  ORBIT_SUM_LEVELS,
  findBestOrbitSwap,
  getOrbitDelta,
  getOrbitStars,
  getOrbitSums,
  isOrbitSolved,
  swapOrbitValues
} from '@/lib/orbit-sum-engine'

describe('orbit sum engine', () => {
  const level = ORBIT_SUM_LEVELS[0]

  it('calculates each ring independently', () => {
    expect(getOrbitSums(level.initial)).toEqual([18, 22, 38])
  })

  it('swaps satellites immutably', () => {
    const next = swapOrbitValues(level.initial, { ring: 0, slot: 1 }, { ring: 1, slot: 1 })
    expect(next[0][1]).toBe(2)
    expect(next[1][1]).toBe(6)
    expect(level.initial[0][1]).toBe(6)
  })

  it('finds a swap on a valid path toward the solution', () => {
    const hint = findBestOrbitSwap(level.initial, level.targets)
    expect(hint).not.toBeNull()
    const next = swapOrbitValues(level.initial, hint!.first, hint!.second)
    expect(getOrbitDelta(next, level.targets)).toBeLessThanOrEqual(getOrbitDelta(level.initial, level.targets))
  })

  it('recognizes solved rings and awards stars', () => {
    expect(isOrbitSolved([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], level.targets)).toBe(true)
    expect(getOrbitStars(level.par, level.par)).toBe(3)
    expect(getOrbitStars(level.par, level.par, 1)).toBe(2)
  })

  it.each(ORBIT_SUM_LEVELS)('keeps level $id solvable through improving transfers', (candidate) => {
    let values = candidate.initial
    for (let step = 0; step < 12 && !isOrbitSolved(values, candidate.targets); step += 1) {
      const hint = findBestOrbitSwap(values, candidate.targets)
      expect(hint).not.toBeNull()
      values = swapOrbitValues(values, hint!.first, hint!.second)
    }
    expect(isOrbitSolved(values, candidate.targets)).toBe(true)
  })
})
