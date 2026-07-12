import { createSeededRandom, dateSeed } from '@/lib/puzzle-core/random'
import { parseAdvancedProgress, recordAdvancedProgress } from '@/lib/advanced-puzzles/core'
import { applyProofMove, generateProofLevel, getProvableMoves, isProofSolved, solveProofLevel } from '@/lib/advanced-puzzles/proof-habitat'
import { applyFoldSequence, availableFolds, findFoldSolution, foldPaper, generateFoldLevel, isFoldSolved } from '@/lib/advanced-puzzles/foldspace-atelier'
import { generateRoomPuzzle, isRoomCodeCorrect, roomShareGrid } from '@/lib/advanced-puzzles/room-nineteen'

describe('advanced puzzle core', () => {
  it('uses deterministic shared random streams', () => {
    const first = createSeededRandom('advanced')
    const second = createSeededRandom('advanced')
    expect(Array.from({ length: 8 }, first)).toEqual(Array.from({ length: 8 }, second))
    expect(dateSeed('room', new Date('2026-07-12T08:00:00Z'))).toBe('room:2026-7-12')
  })

  it('validates and monotonically updates advanced progress', () => {
    expect(parseAdvancedProgress('bad')).toEqual({ version: 1, completed: {}, bestScores: {} })
    const first = recordAdvancedProgress(parseAdvancedProgress(null), 'proof-habitat', 3, 500)
    const second = recordAdvancedProgress(first, 'proof-habitat', 2, 400)
    expect(second.completed['proof-habitat']).toBe(3)
    expect(second.bestScores['proof-habitat']).toBe(500)
  })
})

describe('Proof Habitat', () => {
  it('accepts only moves currently forced by a clue', () => {
    const level = generateProofLevel('proof-contract', 4)
    const move = getProvableMoves(level.initial, level.clues)[0]
    expect(move).toBeDefined()
    const board = applyProofMove(level.initial, move)
    expect(board[move.cell]).toBe(level.solution[move.cell])
  })

  it('generates 100 levels with complete no-guess proof paths', () => {
    for (let index = 0; index < 100; index += 1) {
      const level = generateProofLevel(`proof-${index}`, index % 2 ? 5 : 6)
      const proof = solveProofLevel(level)
      expect(proof).not.toBeNull()
      let board = level.initial
      proof!.forEach((move) => { board = applyProofMove(board, move) })
      expect(isProofSolved(board, level)).toBe(true)
      expect(proof).toHaveLength(level.solution.length - 1)
    }
  })
})

describe('Foldspace Atelier', () => {
  it('folds paper immutably and flips the folded face', () => {
    const level = generateFoldLevel('fold-contract', 4, 4, 2)
    const direction = availableFolds(level.initial)[0]
    const next = foldPaper(level.initial, direction)!
    expect(next).not.toBe(level.initial)
    expect(next.stacks.some((stack) => stack.some((layer) => layer.face === 1))).toBe(true)
    expect(level.initial.stacks.every((stack) => stack.every((layer) => layer.face === 0))).toBe(true)
  })

  it('generates 100 levels solvable from their layered state', () => {
    for (let index = 0; index < 100; index += 1) {
      const level = generateFoldLevel(`fold-${index}`, index % 2 ? 8 : 4, index % 3 ? 4 : 8, 3)
      const reference = applyFoldSequence(level.initial, level.solution)
      expect(reference).not.toBeNull()
      expect(isFoldSolved(reference!, level.targets)).toBe(true)
      const path = findFoldSolution(level.initial, level.targets, 6)
      expect(path).not.toBeNull()
      expect(isFoldSolved(applyFoldSequence(level.initial, path!)!, level.targets)).toBe(true)
    }
  })
})

describe('Room Nineteen', () => {
  it('is deterministic and accepts only the generated lock code', () => {
    const first = generateRoomPuzzle('room:test')
    const second = generateRoomPuzzle('room:test')
    expect(first).toEqual(second)
    expect(isRoomCodeCorrect(first.code, first)).toBe(true)
    expect(isRoomCodeCorrect(first.code.map((digit, index) => index === 0 ? (digit + 1) % 10 : digit), first)).toBe(false)
  })

  it('encodes all four digits in independently recoverable clues', () => {
    for (let index = 0; index < 100; index += 1) {
      const puzzle = generateRoomPuzzle(`room-${index}`)
      expect((Number(puzzle.clues[0].encoded) - 3 + 10) % 10).toBe(puzzle.code[0])
      expect(puzzle.clues[1].encoded === '○' ? 0 : puzzle.clues[1].encoded.length).toBe(puzzle.code[1])
      expect(Number(puzzle.clues[2].encoded.split(' ')[0]) - 4).toBe(puzzle.code[2])
      expect(9 - Number(puzzle.clues[3].encoded)).toBe(puzzle.code[3])
      expect(roomShareGrid(puzzle, 1, 0)).not.toContain(puzzle.code.join(''))
    }
  })
})
