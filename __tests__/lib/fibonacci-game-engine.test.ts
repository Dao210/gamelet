import {
  canMove,
  canMergeValues,
  getMergedFibonacciValue,
  getNextFibonacci,
  move,
  type GameState,
  type Tile
} from '../../lib/fibonacci-game-engine'

const tile = (id: number, value: number, row: number, col: number): Tile => ({
  id,
  value,
  row,
  col
})

const stateWithTiles = (tiles: Tile[]): GameState => ({
  tiles,
  score: 0,
  bestScore: 0,
  won: false,
  over: false,
  canContinue: false
})

describe('fibonacci-game-engine', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('treats 1 + 1 as the special first Fibonacci merge', () => {
    expect(getNextFibonacci(1)).toBe(2)
    expect(getMergedFibonacciValue(1, 1)).toBe(2)
    expect(canMergeValues(1, 1)).toBe(true)
  })

  it('allows adjacent Fibonacci values to merge in either order', () => {
    expect(getMergedFibonacciValue(2, 3)).toBe(5)
    expect(getMergedFibonacciValue(3, 2)).toBe(5)
    expect(getMergedFibonacciValue(8, 13)).toBe(21)
  })

  it('rejects non-adjacent and duplicate non-one values', () => {
    expect(getMergedFibonacciValue(2, 2)).toBeNull()
    expect(getMergedFibonacciValue(2, 5)).toBeNull()
    expect(canMergeValues(5, 13)).toBe(false)
  })

  it('merges two ones when sliding', () => {
    const result = move(
      stateWithTiles([
        tile(1, 1, 0, 0),
        tile(2, 1, 0, 1)
      ]),
      'right'
    )

    expect(result.score).toBe(2)
    expect(result.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 2, row: 0, col: 3 })
      ])
    )
  })

  it('merges adjacent Fibonacci values when sliding', () => {
    const result = move(
      stateWithTiles([
        tile(1, 2, 0, 0),
        tile(2, 3, 0, 1)
      ]),
      'right'
    )

    expect(result.score).toBe(5)
    expect(result.tiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 5, row: 0, col: 3 })
      ])
    )
  })

  it('detects game over only when a full board has no mergeable neighbors', () => {
    expect(
      canMove([
        tile(1, 2, 0, 0), tile(2, 5, 0, 1), tile(3, 2, 0, 2), tile(4, 5, 0, 3),
        tile(5, 5, 1, 0), tile(6, 2, 1, 1), tile(7, 5, 1, 2), tile(8, 2, 1, 3),
        tile(9, 2, 2, 0), tile(10, 5, 2, 1), tile(11, 2, 2, 2), tile(12, 5, 2, 3),
        tile(13, 5, 3, 0), tile(14, 2, 3, 1), tile(15, 5, 3, 2), tile(16, 2, 3, 3)
      ])
    ).toBe(false)

    expect(
      canMove([
        tile(1, 2, 0, 0), tile(2, 3, 0, 1), tile(3, 2, 0, 2), tile(4, 5, 0, 3),
        tile(5, 5, 1, 0), tile(6, 2, 1, 1), tile(7, 5, 1, 2), tile(8, 2, 1, 3),
        tile(9, 2, 2, 0), tile(10, 5, 2, 1), tile(11, 2, 2, 2), tile(12, 5, 2, 3),
        tile(13, 5, 3, 0), tile(14, 2, 3, 1), tile(15, 5, 3, 2), tile(16, 2, 3, 3)
      ])
    ).toBe(true)
  })
})
