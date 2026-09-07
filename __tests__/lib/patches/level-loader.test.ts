import { dailyPuzzleId, loadPuzzle } from '@/lib/patches/level-loader'

describe('Patches configuration loading', () => {
  test.each(['patches-easy-0001', 'patches-medium-0051', 'patches-hard-0400', 'patches-tutorial-0012'])('loads stable id %s', async id => expect((await loadPuzzle(id)).id).toBe(id))
  test.each(['../secret', 'patches-easy-0000', 'patches-easy-0401', 'patches-tutorial-0013', 'patches-wrong-0001'])('rejects unknown id %s', async id => await expect(loadPuzzle(id)).rejects.toThrow('Unknown puzzle'))
  it('reuses the loaded puzzle object', async () => expect(await loadPuzzle('patches-easy-0001')).toBe(await loadPuzzle('patches-easy-0001')))
  it('maps exact UTC dates without recycling an expired schedule', async () => {
    expect(await dailyPuzzleId('2026-09-07', 'easy')).toBe('patches-easy-0311')
    expect(await dailyPuzzleId('2026-12-05', 'hard')).toBe('patches-hard-0400')
    expect(await dailyPuzzleId('2026-09-06', 'easy')).toBeNull()
    expect(await dailyPuzzleId('2026-12-06', 'easy')).toBeNull()
  })
})
